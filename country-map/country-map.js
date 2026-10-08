/*
  Country Comparison Map
  ----------------------------------------------------------------------
  Lets a visitor pick every country/territory they've traveled to, then
  renders a world map comparing that list against Sasha's own (hardcoded
  in country-map-data.js). Most places are drawn as filled country shapes
  from a public, simplified world-countries dataset (see world-geojson.js);
  a handful of smaller territories without their own shape in that dataset
  are instead shown as a colored pin at their approximate location.
*/

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  const COLORS = {
    sasha: "#e0529c",
    user: "#4fb3e8",
    both: "#9b59c9",
    neither: "#d6d0de"
  };

  const STATUS_LABEL = {
    sasha: "Sasha only",
    user: "You only",
    both: "Both of us",
    neither: "Neither"
  };

  const DEFAULT_SELECTION = ["France", "Italy", "Mexico", "Australia", "Brazil"];

  // ---- Catalog: every polygon country + every pin-only territory -----------
  const PIN_LOOKUP = {};
  (window.PIN_TERRITORIES || []).forEach((t) => {
    PIN_LOOKUP[t.name] = t;
  });

  const polygonNames = (window.WORLD_GEOJSON.features || []).map((f) => f.properties.name);
  const pinNames = (window.PIN_TERRITORIES || []).map((t) => t.name);
  const CATALOG = Array.from(new Set([...polygonNames, ...pinNames])).sort((a, b) => a.localeCompare(b));

  const SASHA_SET = new Set(window.SASHA_COUNTRIES || []);

  // ---- Equirectangular projection (with a simple antimeridian split) --------
  const MAP_W = 960;
  const MAP_H = 480;

  function project(lon, lat) {
    return [((lon + 180) / 360) * MAP_W, ((90 - lat) / 180) * MAP_H];
  }

  function ringToPath(ring) {
    let d = "";
    let prevLon = null;
    ring.forEach((point, i) => {
      const [lon, lat] = point;
      const [x, y] = project(lon, lat);
      if (i === 0 || (prevLon !== null && Math.abs(lon - prevLon) > 180)) {
        d += `M${x.toFixed(1)},${y.toFixed(1)} `;
      } else {
        d += `L${x.toFixed(1)},${y.toFixed(1)} `;
      }
      prevLon = lon;
    });
    return d + "Z ";
  }

  function polygonToPath(rings) {
    return rings.map(ringToPath).join("");
  }

  function geometryToPath(geometry) {
    if (geometry.type === "Polygon") return polygonToPath(geometry.coordinates);
    if (geometry.type === "MultiPolygon") return geometry.coordinates.map(polygonToPath).join("");
    return "";
  }

  // Precompute each feature's path once — it never changes, only its fill does.
  const COUNTRY_PATHS = (window.WORLD_GEOJSON.features || []).map((f) => ({
    name: f.properties.name,
    d: geometryToPath(f.geometry)
  }));

  // ---- Rendering: checklist ---------------------------------------------------
  function renderChecklist() {
    $("cm2-checklist").innerHTML = CATALOG.map(
      (name) => `
      <label class="cm2-check-item" data-name="${escapeHTML(name.toLowerCase())}">
        <input type="checkbox" value="${escapeHTML(name)}">
        ${escapeHTML(name)}
      </label>`
    ).join("");
  }

  function updateSelectedCount() {
    const count = document.querySelectorAll('#cm2-checklist input[type="checkbox"]:checked').length;
    $("cm2-selected-count").textContent = `${count} selected`;
  }

  function filterChecklist(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll(".cm2-check-item").forEach((item) => {
      item.hidden = q.length > 0 && !item.dataset.name.includes(q);
    });
  }

  function applyDefaultSelection() {
    document.querySelectorAll('#cm2-checklist input[type="checkbox"]').forEach((cb) => {
      cb.checked = DEFAULT_SELECTION.includes(cb.value);
    });
    updateSelectedCount();
  }

  // ---- Rendering: map, legend, stats, breakdown ----------------------------------
  function statusFor(name, userSet) {
    const inSasha = SASHA_SET.has(name);
    const inUser = userSet.has(name);
    if (inSasha && inUser) return "both";
    if (inSasha) return "sasha";
    if (inUser) return "user";
    return "neither";
  }

  function renderMap(userSet) {
    const countryShapes = COUNTRY_PATHS.map((c) => {
      const status = statusFor(c.name, userSet);
      return `<path d="${c.d}" fill="${COLORS[status]}" class="cm2-country" fill-rule="evenodd"><title>${escapeHTML(c.name)} — ${escapeHTML(STATUS_LABEL[status])}</title></path>`;
    }).join("");

    const pins = (window.PIN_TERRITORIES || [])
      .map((t) => {
        const status = statusFor(t.name, userSet);
        const [x, y] = project(t.lon, t.lat);
        return `
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${COLORS[status]}" stroke="var(--color-canvas)" stroke-width="1.5" class="cm2-pin">
            <title>${escapeHTML(t.name)} — ${escapeHTML(STATUS_LABEL[status])} (shown as a pin, not a country shape)</title>
          </circle>`;
      })
      .join("");

    $("cm2-map").innerHTML = `
      <svg viewBox="0 0 ${MAP_W} ${MAP_H}" class="cm2-map-svg" role="img" aria-label="World map comparing your travel history to Sasha's">
        <rect x="0" y="0" width="${MAP_W}" height="${MAP_H}" class="cm2-ocean" />
        ${countryShapes}
        ${pins}
      </svg>
    `;
  }

  function renderStats(userSet) {
    let both = 0;
    let sashaOnly = 0;
    let userOnly = 0;
    CATALOG.forEach((name) => {
      const s = statusFor(name, userSet);
      if (s === "both") both++;
      else if (s === "sasha") sashaOnly++;
      else if (s === "user") userOnly++;
    });

    const tiles = [
      { label: "Both of us have been", value: both },
      { label: "Only you've been", value: userOnly },
      { label: "Only Sasha's been", value: sashaOnly },
      { label: "Your world coverage", value: `${Math.round(((both + userOnly) / CATALOG.length) * 100)}%` }
    ];

    $("cm2-stats").innerHTML = tiles
      .map(
        (t) => `
        <div class="cm2-stat-tile">
          <div class="cm2-stat-value">${escapeHTML(String(t.value))}</div>
          <div class="cm2-stat-label">${escapeHTML(t.label)}</div>
        </div>`
      )
      .join("");
  }

  function renderBreakdown(userSet) {
    const groups = { both: [], user: [], sasha: [] };
    CATALOG.forEach((name) => {
      const s = statusFor(name, userSet);
      if (groups[s]) groups[s].push(name);
    });

    const columns = [
      { key: "both", title: "Both of us", color: COLORS.both },
      { key: "user", title: "Only you", color: COLORS.user },
      { key: "sasha", title: "Only Sasha", color: COLORS.sasha }
    ];

    $("cm2-breakdown").innerHTML = columns
      .map((col) => {
        const items = groups[col.key];
        const list = items.length
          ? items.map((n) => `<li>${escapeHTML(n)}</li>`).join("")
          : `<li class="cm2-empty">None yet</li>`;
        return `
        <div class="cm2-breakdown-col">
          <h4><span class="cm2-swatch" style="background:${col.color}"></span>${escapeHTML(col.title)} (${items.length})</h4>
          <ul>${list}</ul>
        </div>`;
      })
      .join("");
  }

  function compareAndRender() {
    const userSet = new Set(
      Array.from(document.querySelectorAll('#cm2-checklist input[type="checkbox"]:checked')).map((cb) => cb.value)
    );
    renderMap(userSet);
    renderStats(userSet);
    renderBreakdown(userSet);
  }

  // ---- Wiring ------------------------------------------------------------------
  renderChecklist();
  applyDefaultSelection();

  $("cm2-search").addEventListener("input", (e) => filterChecklist(e.target.value));

  $("cm2-checklist").addEventListener("change", updateSelectedCount);

  $("cm2-clear").addEventListener("click", () => {
    document.querySelectorAll('#cm2-checklist input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
    updateSelectedCount();
  });

  $("cm2-form").addEventListener("submit", (e) => {
    e.preventDefault();
    compareAndRender();
  });

  // ---- Initial load: the sample default selection ------------------------------
  compareAndRender();
})();
