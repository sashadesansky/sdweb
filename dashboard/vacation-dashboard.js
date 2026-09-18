/*
  Vacation Destination Explorer
  ----------------------------------------------------------------------
  - Weather is genuinely live for ANY destination worldwide, via the
    free, no-API-key Open-Meteo geocoding + forecast APIs (CORS-friendly,
    safe to call directly from a static site's client-side JS).
  - Coffee / restaurants / desserts / events / fun facts come from a
    hand-curated sample dataset (vacation-data.js) covering a set of
    popular destinations — there's no free, no-API-key business-listings
    service safe to call from a static site for arbitrary cities, so
    this is intentionally a demo dataset rather than a live feed.
  - Defaults to Arlington, Virginia until the visitor searches.
  - "Refresh" reshuffles the picks shown for the current destination
    across every widget except weather.
*/

(function () {
  "use strict";

  const DESTINATIONS = window.VACATION_DESTINATIONS || [];
  const DEFAULT_NAME = "Arlington, Virginia";
  const PICKS_SHOWN = 3;

  const WEATHER_CODES = {
    0: { desc: "Clear sky", icon: "☀️" },
    1: { desc: "Mostly clear", icon: "🌤️" },
    2: { desc: "Partly cloudy", icon: "⛅" },
    3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" },
    48: { desc: "Fog", icon: "🌫️" },
    51: { desc: "Light drizzle", icon: "🌦️" },
    53: { desc: "Drizzle", icon: "🌦️" },
    55: { desc: "Dense drizzle", icon: "🌦️" },
    56: { desc: "Freezing drizzle", icon: "🌧️" },
    57: { desc: "Freezing drizzle", icon: "🌧️" },
    61: { desc: "Light rain", icon: "🌧️" },
    63: { desc: "Rain", icon: "🌧️" },
    65: { desc: "Heavy rain", icon: "🌧️" },
    66: { desc: "Freezing rain", icon: "🌨️" },
    67: { desc: "Freezing rain", icon: "🌨️" },
    71: { desc: "Light snow", icon: "❄️" },
    73: { desc: "Snow", icon: "❄️" },
    75: { desc: "Heavy snow", icon: "❄️" },
    77: { desc: "Snow grains", icon: "❄️" },
    80: { desc: "Rain showers", icon: "🌦️" },
    81: { desc: "Rain showers", icon: "🌦️" },
    82: { desc: "Heavy showers", icon: "🌦️" },
    85: { desc: "Snow showers", icon: "🌨️" },
    86: { desc: "Snow showers", icon: "🌨️" },
    95: { desc: "Thunderstorm", icon: "⛈️" },
    96: { desc: "Thunderstorm, hail", icon: "⛈️" },
    99: { desc: "Thunderstorm, hail", icon: "⛈️" }
  };

  const $ = (id) => document.getElementById(id);

  function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .trim()
      .replace(/[.,]/g, "")
      .replace(/\s+/g, " ");
  }

  function findDestination(rawInput) {
    const q = normalize(rawInput);
    if (!q) return null;
    for (const dest of DESTINATIONS) {
      if (normalize(dest.name) === q) return dest;
      if ((dest.aliases || []).some((a) => normalize(a) === q)) return dest;
    }
    // Loose fallback: substring match against name/aliases
    for (const dest of DESTINATIONS) {
      const candidates = [dest.name, ...(dest.aliases || [])].map(normalize);
      if (candidates.some((c) => c.includes(q) || q.includes(c))) return dest;
    }
    return null;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickN(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
  }

  // ---- State --------------------------------------------------------------
  let currentDestination = DESTINATIONS.find((d) => d.name === DEFAULT_NAME) || DESTINATIONS[0];
  let currentQueryForWeather = DEFAULT_NAME;

  // ---- Rendering: curated widgets ------------------------------------------
  function renderList(containerId, items, formatter) {
    const el = $(containerId);
    if (!items || items.length === 0) {
      el.innerHTML = `<li class="vd-empty">No sample picks yet for this destination.</li>`;
      return;
    }
    el.innerHTML = items.map(formatter).join("");
  }

  function renderGreetings(greetings) {
    const el = $("vd-greetings-body");
    if (!greetings) {
      el.innerHTML = `<p class="vd-empty">We don't have curated sample picks for this destination yet.</p>`;
      return;
    }
    el.innerHTML = `
      <p class="vd-greetings-language">${escapeHTML(greetings.language)}</p>
      <ul class="vd-list vd-greetings-list">
        <li><strong>Hello</strong><span>${escapeHTML(greetings.hello)}</span></li>
        <li><strong>Thank you</strong><span>${escapeHTML(greetings.thankYou)}</span></li>
        <li><strong>Nice to meet you</strong><span>${escapeHTML(greetings.niceToMeetYou)}</span></li>
      </ul>
    `;
  }

  function renderCuratedWidgets(dest) {
    if (!dest) {
      const noneMsg = [`<li class="vd-empty">We don't have curated sample picks for this destination yet.</li>`];
      ["vd-coffee-list", "vd-restaurants-list", "vd-desserts-list", "vd-events-list", "vd-funfacts-list"].forEach(
        (id) => {
          $(id).innerHTML = noneMsg.join("");
        }
      );
      renderGreetings(null);
      return;
    }

    renderList(
      "vd-coffee-list",
      pickN(dest.coffee, PICKS_SHOWN),
      (c) => `<li><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.blurb)}</span></li>`
    );
    renderList(
      "vd-restaurants-list",
      pickN(dest.restaurants, PICKS_SHOWN),
      (r) => `<li><strong>${escapeHTML(r.name)}</strong><span>${escapeHTML(r.blurb)}</span></li>`
    );
    renderList(
      "vd-desserts-list",
      pickN(dest.desserts, PICKS_SHOWN),
      (d) => `<li><strong>${escapeHTML(d.name)}</strong><span>${escapeHTML(d.blurb)}</span></li>`
    );
    renderList(
      "vd-events-list",
      pickN(dest.events, PICKS_SHOWN),
      (e) =>
        `<li><strong>${escapeHTML(e.name)}</strong><span class="vd-timing">${escapeHTML(e.timing)}</span><span>${escapeHTML(e.blurb)}</span></li>`
    );
    renderList(
      "vd-funfacts-list",
      pickN(dest.funFacts, PICKS_SHOWN),
      (f) => `<li>${escapeHTML(f.text)}</li>`
    );
    renderGreetings(dest.greetings);
  }

  // ---- Rendering: weather ---------------------------------------------------
  function setWeatherState(html) {
    $("vd-weather-body").innerHTML = html;
  }

  function renderWeatherLoading() {
    setWeatherState(`<p class="vd-weather-status">Loading live forecast…</p>`);
  }

  function renderWeatherError(message) {
    setWeatherState(`<p class="vd-weather-status vd-weather-error">${escapeHTML(message)}</p>`);
  }

  function renderWeatherDays(place, daily) {
    const days = daily.time.map((dateStr, i) => {
      const date = new Date(dateStr + "T00:00:00");
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const code = daily.weather_code ? daily.weather_code[i] : daily.weathercode[i];
      const info = WEATHER_CODES[code] || { desc: "—", icon: "🌡️" };
      const hi = Math.round(daily.temperature_2m_max[i]);
      const lo = Math.round(daily.temperature_2m_min[i]);
      return `
        <div class="vd-day">
          <div class="vd-day-name">${escapeHTML(weekday)}</div>
          <div class="vd-day-icon">${info.icon}</div>
          <div class="vd-day-desc">${escapeHTML(info.desc)}</div>
          <div class="vd-day-temps"><strong>${hi}°</strong> / ${lo}°</div>
        </div>
      `;
    });
    setWeatherState(
      `<p class="vd-weather-place">${escapeHTML(place)}</p><div class="vd-weather-days">${days.join("")}</div>`
    );
  }

  async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Request failed");
      return await res.json();
    } finally {
      clearTimeout(id);
    }
  }

  async function loadWeather(query) {
    renderWeatherLoading();
    try {
      const geo = await fetchWithTimeout(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
        8000
      );
      const place = geo && geo.results && geo.results[0];
      if (!place) {
        renderWeatherError(`Couldn't find "${query}" — check the spelling and try again.`);
        return;
      }
      const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
      const forecast = await fetchWithTimeout(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=5`,
        8000
      );
      if (!forecast || !forecast.daily) {
        renderWeatherError("Couldn't load the forecast right now — please try again in a moment.");
        return;
      }
      renderWeatherDays(label, forecast.daily);
    } catch (err) {
      renderWeatherError("Couldn't load the forecast right now — please try again in a moment.");
    }
  }

  // ---- Search / refresh wiring ----------------------------------------------
  function setHeading(dest, rawInput) {
    const heading = $("vd-destination-heading");
    const note = $("vd-fallback-note");
    if (dest) {
      heading.textContent = `Exploring: ${dest.name}`;
      note.hidden = true;
    } else {
      heading.textContent = `Exploring: ${rawInput}`;
      note.hidden = false;
      note.textContent = `We don't have curated sample picks for "${rawInput}" yet — showing live weather only for now. Try a destination like Austin, Boston, or Paris to see the full demo.`;
    }
  }

  function exploreDestination(rawInput) {
    const dest = findDestination(rawInput);
    currentDestination = dest;
    currentQueryForWeather = rawInput;
    setHeading(dest, rawInput);
    renderCuratedWidgets(dest);
    loadWeather(rawInput);
  }

  const form = $("vd-search-form");
  const input = $("vd-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    exploreDestination(value);
  });

  $("vd-refresh-btn").addEventListener("click", () => {
    renderCuratedWidgets(currentDestination);
  });

  // ---- Initial load: Arlington, VA -----------------------------------------
  setHeading(currentDestination, DEFAULT_NAME);
  renderCuratedWidgets(currentDestination);
  loadWeather(currentQueryForWeather);
})();
