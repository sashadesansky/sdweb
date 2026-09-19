/*
  Tech Roadmap & Business Case Generator
  ----------------------------------------------------------------------
  Takes current-state inputs (system inventory, architecture complexity,
  org layout, known constraints) and applies deterministic heuristics on
  top of the curated benchmark dataset (roadmap-data.js) to produce:
    - a phased, benchmarked transformation roadmap
    - a cost-vs-value-realized tradeoff chart with a breakeven estimate
    - executive-level takeaway bullets on timeline, investment, and value

  This is a decision-support sketch, not a live AI/data feed — see the
  disclaimer on the page and the notes in roadmap-data.js.
*/

(function () {
  "use strict";

  const DATA = window.ROADMAP_BENCHMARKS;
  const $ = (id) => document.getElementById(id);

  function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function formatCompact(n) {
    const abs = Math.abs(n);
    if (abs >= 1000000) return (n / 1000000).toFixed(abs >= 10000000 ? 0 : 1) + "M";
    if (abs >= 1000) return Math.round(n / 1000) + "K";
    return String(Math.round(n));
  }

  function formatUSD(n) {
    return "$" + formatCompact(n);
  }

  function formatUSDFull(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  // ---- Tiering helpers ------------------------------------------------------
  function sizeTierFor(systemCount) {
    if (systemCount < 20) return { label: "Small (<20 systems)", durationMult: 0.85 };
    if (systemCount <= 75) return { label: "Medium (20–75 systems)", durationMult: 1.0 };
    if (systemCount <= 200) return { label: "Large (76–200 systems)", durationMult: 1.2 };
    return { label: "Very large (200+ systems)", durationMult: 1.4 };
  }

  function orgTierFor(employeesImpacted) {
    if (employeesImpacted < 500) return { label: "<500 employees impacted", durationMult: 1.0, investMult: 1.0 };
    if (employeesImpacted <= 5000) return { label: "500–5,000 employees impacted", durationMult: 1.03, investMult: 1.08 };
    if (employeesImpacted <= 20000) return { label: "5,000–20,000 employees impacted", durationMult: 1.08, investMult: 1.18 };
    return { label: "20,000+ employees impacted", durationMult: 1.15, investMult: 1.30 };
  }

  function combineConstraints(selectedIds) {
    let durationMult = 1;
    let investMult = 1;
    const notes = [];
    const labels = [];
    selectedIds.forEach((id) => {
      const c = DATA.constraints.find((x) => x.id === id);
      if (!c) return;
      durationMult *= c.durationMult;
      investMult *= c.investMult;
      notes.push(c.note);
      labels.push(c.label);
    });
    return {
      durationMult: Math.min(durationMult, 1.6),
      investMult: Math.min(investMult, 1.6),
      notes,
      labels
    };
  }

  // ---- Core computation -------------------------------------------------------
  function computeRoadmap(inputs) {
    const archetype = DATA.archetypes.find((a) => a.id === inputs.archetypeId) || DATA.archetypes[0];
    const complexity = DATA.complexityLevels.find((c) => c.id === inputs.complexityId) || DATA.complexityLevels[1];
    const sizeTier = sizeTierFor(inputs.systemCount);
    const orgTier = orgTierFor(inputs.employeesImpacted);
    const constraintEffect = combineConstraints(inputs.constraintIds);

    const baseDurationAvg = (archetype.baseDurationMonths[0] + archetype.baseDurationMonths[1]) / 2;
    const totalDurationMonths = Math.round(
      clamp(
        baseDurationAvg * sizeTier.durationMult * complexity.durationMult * orgTier.durationMult * constraintEffect.durationMult,
        6,
        48
      )
    );

    const costPerSystemAvg = (archetype.costPerSystem[0] + archetype.costPerSystem[1]) / 2;
    const totalInvestment =
      Math.round(
        (clamp(
          (archetype.baseInvestment + costPerSystemAvg * inputs.systemCount) *
            complexity.investMult *
            orgTier.investMult *
            constraintEffect.investMult,
          50000,
          250000000
        )) / 1000
      ) * 1000;

    const estimatedAnnualRunCost =
      inputs.annualRunCost && inputs.annualRunCost > 0
        ? inputs.annualRunCost
        : archetype.defaultRunCostPerSystem * inputs.systemCount;
    const annualValuePctAvg = (archetype.annualValuePct[0] + archetype.annualValuePct[1]) / 2;
    const estimatedAnnualValue = estimatedAnnualRunCost * annualValuePctAvg * archetype.realizationFactor;

    let cumMonths = 0;
    let cumInvestment = 0;
    let cumValue = 0;
    let prevRamp = 0;
    const phases = archetype.phases.map((p) => {
      const durationMonths = p.pct * totalDurationMonths;
      const startMonth = cumMonths;
      cumMonths += durationMonths;
      const endMonth = cumMonths;

      const investmentAmount = p.investPct * totalInvestment;
      cumInvestment += investmentAmount;

      const avgRampDuringPhase = (prevRamp + p.valueRampTo) / 2;
      const valueDuringPhase = avgRampDuringPhase * estimatedAnnualValue * (durationMonths / 12);
      cumValue += valueDuringPhase;
      prevRamp = p.valueRampTo;

      return Object.assign({}, p, {
        startMonth,
        endMonth,
        durationMonths,
        investmentAmount,
        cumInvestment,
        cumValue
      });
    });

    // Payback month: find where cumulative value crosses cumulative investment.
    let paybackMonth = null;
    let prevPoint = { month: 0, invest: 0, value: 0 };
    for (const ph of phases) {
      const point = { month: ph.endMonth, invest: ph.cumInvestment, value: ph.cumValue };
      if (prevPoint.value < prevPoint.invest && point.value >= point.invest) {
        const investDelta = point.invest - prevPoint.invest;
        const valueDelta = point.value - prevPoint.value;
        const denom = valueDelta - investDelta;
        const t = denom !== 0 ? (prevPoint.invest - prevPoint.value) / denom : 0;
        paybackMonth = prevPoint.month + t * (point.month - prevPoint.month);
        break;
      }
      prevPoint = point;
    }

    // If value hasn't caught up by the end of the roadmap, extend at the
    // steady-state (100% ramp) run-rate to find/estimate a payback point.
    const extensionPoints = [];
    if (paybackMonth === null) {
      const lastPoint = prevPoint;
      const monthlyValueRate = estimatedAnnualValue / 12;
      let month = lastPoint.month;
      let value = lastPoint.value;
      const investFinal = lastPoint.invest;
      let extra = 0;
      const maxExtraMonths = 36;
      while (value < investFinal && extra < maxExtraMonths) {
        month += 1;
        value += monthlyValueRate;
        extra += 1;
        extensionPoints.push({ month, invest: investFinal, value });
      }
      if (value >= investFinal) {
        const prevExt = extensionPoints.length > 1 ? extensionPoints[extensionPoints.length - 2] : lastPoint;
        const denom = value - prevExt.value;
        const t = denom !== 0 ? (investFinal - prevExt.value) / denom : 0;
        paybackMonth = prevExt.month + t * (month - prevExt.month);
      }
    }

    return {
      inputs,
      archetype,
      complexity,
      sizeTier,
      orgTier,
      constraintEffect,
      totalDurationMonths,
      totalInvestment,
      estimatedAnnualRunCost,
      estimatedAnnualValue,
      phases,
      paybackMonth,
      extensionPoints
    };
  }

  // ---- Rendering: stat tiles --------------------------------------------------
  function renderStatTiles(result) {
    const tiles = [
      { label: "Total timeline", value: result.totalDurationMonths + " months" },
      { label: "Total investment", value: formatUSD(result.totalInvestment) },
      { label: "Projected annual value at run-rate", value: formatUSD(result.estimatedAnnualValue) + "/yr" },
      {
        label: "Estimated payback period",
        value: result.paybackMonth != null ? Math.round(result.paybackMonth) + " months" : "Beyond 5-yr horizon"
      }
    ];
    $("rm-stats").innerHTML = tiles
      .map(
        (t) => `
        <div class="rm-stat-tile">
          <div class="rm-stat-value">${escapeHTML(t.value)}</div>
          <div class="rm-stat-label">${escapeHTML(t.label)}</div>
        </div>`
      )
      .join("");
  }

  // ---- Rendering: constraints-applied note -------------------------------------
  function renderConstraintsApplied(result) {
    const el = $("rm-constraints-applied");
    if (!result.constraintEffect.labels.length) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = `Applied constraints: ${result.constraintEffect.labels.join(", ")} — reflected as a ${result.constraintEffect.durationMult.toFixed(2)}x schedule and ${result.constraintEffect.investMult.toFixed(2)}x cost adjustment versus an unconstrained baseline.`;
  }

  // ---- Rendering: executive bullets --------------------------------------------
  function renderExecBullets(result) {
    const { archetype, phases, totalDurationMonths, totalInvestment, estimatedAnnualValue, paybackMonth, sizeTier, complexity, inputs, constraintEffect } = result;
    const lastPhase = phases[phases.length - 1];
    const midPhase = phases[Math.min(2, phases.length - 1)];
    const earlyPhase = phases[Math.min(1, phases.length - 1)];

    const bullets = [];
    bullets.push(
      `This ${archetype.name} initiative is projected to span <strong>${totalDurationMonths} months</strong> across ${phases.length} phases (${sizeTier.label}, ${complexity.label.split(" — ")[0]} architecture complexity), benchmarked against publicly reported patterns for similarly scoped transformations.`
    );
    bullets.push(
      `Estimated total investment: <strong>${formatUSD(totalInvestment)}</strong> (${formatUSDFull(totalInvestment)}), sized against ${inputs.systemCount} in-scope systems and ${inputs.employeesImpacted.toLocaleString()} employees impacted across ${inputs.businessUnits} business unit${inputs.businessUnits === 1 ? "" : "s"}.`
    );
    bullets.push(
      `By month ${Math.round(earlyPhase.endMonth)} (${earlyPhase.name} complete): ${earlyPhase.takeaway} Cumulative investment reaches ${formatUSD(earlyPhase.cumInvestment)}, unlocking ~${Math.round(earlyPhase.valueRampTo * 100)}% of the projected annual value run-rate.`
    );
    bullets.push(
      `By month ${Math.round(midPhase.endMonth)} (${midPhase.name} complete): ${midPhase.takeaway} ~${Math.round(midPhase.valueRampTo * 100)}% of the projected annual value run-rate is unlocked by this milestone.`
    );
    bullets.push(
      `By month ${totalDurationMonths} (program complete): ${lastPhase.takeaway} The full projected annual value run-rate of <strong>${formatUSD(estimatedAnnualValue)}/year</strong> is expected to be realized.`
    );
    bullets.push(
      paybackMonth != null
        ? `Based on the benchmarked value ramp, cumulative value is projected to exceed cumulative investment by <strong>month ${Math.round(paybackMonth)}</strong> — a ${Math.round(paybackMonth)}-month payback period.`
        : `Based on the benchmarked value ramp, cumulative value is not projected to exceed cumulative investment within a 5-year horizon at this scope — consider re-phasing, narrowing scope, or revisiting the investment level.`
    );
    if (constraintEffect.labels.length) {
      bullets.push(
        `Given ${constraintEffect.labels.join(", ").toLowerCase()}, this roadmap reflects a ${constraintEffect.durationMult.toFixed(2)}x schedule and ${constraintEffect.investMult.toFixed(2)}x cost adjustment versus an unconstrained baseline.`
      );
    }

    $("rm-exec-bullets").innerHTML = bullets.map((b) => `<li>${b}</li>`).join("");
  }

  // ---- Rendering: phase timeline ------------------------------------------------
  function renderTimeline(result) {
    const { phases, totalDurationMonths } = result;
    $("rm-timeline").innerHTML = phases
      .map((ph, i) => {
        const widthPct = Math.max(4, (ph.durationMonths / totalDurationMonths) * 100);
        return `
        <div class="rm-phase">
          <div class="rm-phase-index">${i + 1}</div>
          <div class="rm-phase-body">
            <div class="rm-phase-head">
              <h4>${escapeHTML(ph.name)}</h4>
              <span class="rm-phase-months">Months ${Math.round(ph.startMonth)}–${Math.round(ph.endMonth)}</span>
            </div>
            <div class="rm-phase-bar-track">
              <div class="rm-phase-bar rm-phase-shade-${i + 1}" style="width:${widthPct}%"></div>
            </div>
            <p class="rm-phase-takeaway">${escapeHTML(ph.takeaway)}</p>
            <div class="rm-phase-metrics">
              <span><strong>${formatUSD(ph.investmentAmount)}</strong> invested this phase</span>
              <span><strong>~${Math.round(ph.valueRampTo * 100)}%</strong> of annual value run-rate unlocked by end</span>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  // ---- Rendering: cost/value tradeoff chart (SVG) --------------------------------
  function renderTradeoffChart(result) {
    const { phases, totalInvestment, paybackMonth, extensionPoints } = result;

    const investPoints = [{ month: 0, val: 0 }].concat(
      phases.map((ph) => ({ month: ph.endMonth, val: ph.cumInvestment }))
    );
    const valuePoints = [{ month: 0, val: 0 }].concat(phases.map((ph) => ({ month: ph.endMonth, val: ph.cumValue })));

    if (extensionPoints.length) {
      const lastMonth = extensionPoints[extensionPoints.length - 1].month;
      investPoints.push({ month: lastMonth, val: totalInvestment });
      extensionPoints.forEach((e) => valuePoints.push({ month: e.month, val: e.value }));
    }

    const xMax = Math.max(investPoints[investPoints.length - 1].month, valuePoints[valuePoints.length - 1].month) || 1;
    const yMaxRaw = Math.max(
      totalInvestment,
      valuePoints[valuePoints.length - 1].val,
      1
    );
    const yMax = yMaxRaw * 1.15;

    const W = 800;
    const H = 360;
    const marginLeft = 64;
    const marginRight = 150; // room for end-of-line labels and the breakeven annotation
    const marginTop = 24;
    const marginBottom = 40;
    const plotW = W - marginLeft - marginRight;
    const plotH = H - marginTop - marginBottom;

    const xScale = (m) => marginLeft + (m / xMax) * plotW;
    const yScale = (v) => marginTop + plotH - (v / yMax) * plotH;

    function pathFor(points) {
      return points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.month).toFixed(1)},${yScale(p.val).toFixed(1)}`).join(" ");
    }

    const investColor = "#057dbc";
    const valueColor = "#c9820a";

    // Y-axis ticks at clean round numbers (0/25/50/75/100% of yMax).
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);

    // X-axis ticks at each phase boundary.
    const xTicks = [0].concat(phases.map((ph) => ph.endMonth));

    const investMarkers = investPoints
      .filter((p, i) => i < phases.length + 1) // don't mark the flat extension tail
      .map(
        (p) =>
          `<circle cx="${xScale(p.month).toFixed(1)}" cy="${yScale(p.val).toFixed(1)}" r="5" fill="${investColor}" stroke="var(--color-canvas)" stroke-width="2"><title>Cumulative investment at month ${Math.round(p.month)}: ${formatUSDFull(p.val)}</title></circle>`
      )
      .join("");

    const valueMarkers = valuePoints
      .filter((p) => p.month <= phases[phases.length - 1].endMonth + 0.01)
      .map(
        (p) =>
          `<circle cx="${xScale(p.month).toFixed(1)}" cy="${yScale(p.val).toFixed(1)}" r="5" fill="${valueColor}" stroke="var(--color-canvas)" stroke-width="2"><title>Cumulative value realized at month ${Math.round(p.month)}: ${formatUSDFull(p.val)}</title></circle>`
      )
      .join("");

    const lastInvest = investPoints[investPoints.length - 1];
    const lastValue = valuePoints[valuePoints.length - 1];
    let investLabelY = yScale(lastInvest.val);
    let valueLabelY = yScale(lastValue.val);
    if (Math.abs(investLabelY - valueLabelY) < 22) {
      if (investLabelY < valueLabelY) {
        investLabelY -= 11;
        valueLabelY += 11;
      } else {
        investLabelY += 11;
        valueLabelY -= 11;
      }
    }

    let breakevenMarkup = "";
    if (paybackMonth != null && paybackMonth <= xMax) {
      const bx = xScale(paybackMonth);
      breakevenMarkup = `
        <line x1="${bx.toFixed(1)}" y1="${marginTop}" x2="${bx.toFixed(1)}" y2="${marginTop + plotH}" stroke="var(--color-body)" stroke-width="1" stroke-dasharray="4,4" />
        <text x="${bx.toFixed(1)}" y="${marginTop - 8}" class="rm-chart-breakeven-label" text-anchor="middle">Breakeven: month ${Math.round(paybackMonth)}</text>
      `;
    }

    const gridlines = yTicks
      .map((t) => {
        const y = yScale(t);
        return `<line x1="${marginLeft}" y1="${y.toFixed(1)}" x2="${W - marginRight}" y2="${y.toFixed(1)}" class="rm-chart-grid" />
                <text x="${marginLeft - 10}" y="${(y + 4).toFixed(1)}" class="rm-chart-axis-label" text-anchor="end">${formatUSD(t)}</text>`;
      })
      .join("");

    // Skip a tick's text label when it would render too close to the next
    // kept one (e.g. two short final phases a month apart) — the gridline
    // stays, just not both overlapping numbers. Walk right-to-left so the
    // later, more meaningful milestone (program end) always wins a spot.
    let nextKeptX = Infinity;
    const xAxisLabels = xTicks
      .slice()
      .reverse()
      .map((m) => {
        const x = xScale(m);
        if (nextKeptX - x < 26 && m !== 0) return "";
        nextKeptX = x;
        return `<text x="${x.toFixed(1)}" y="${H - marginBottom + 20}" class="rm-chart-axis-label" text-anchor="middle">M${Math.round(m)}</text>`;
      })
      .reverse()
      .join("");

    $("rm-chart").innerHTML = `
      <div class="rm-chart-legend">
        <span class="rm-legend-item"><span class="rm-legend-swatch" style="background:${investColor}"></span>Cumulative investment</span>
        <span class="rm-legend-item"><span class="rm-legend-swatch" style="background:${valueColor}"></span>Cumulative value realized</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" class="rm-chart-svg" role="img" aria-label="Cumulative investment versus cumulative value realized over the roadmap timeline">
        ${gridlines}
        <line x1="${marginLeft}" y1="${marginTop + plotH}" x2="${W - marginRight}" y2="${marginTop + plotH}" class="rm-chart-axis" />
        ${xAxisLabels}
        ${breakevenMarkup}
        <path d="${pathFor(investPoints)}" fill="none" stroke="${investColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        <path d="${pathFor(valuePoints)}" fill="none" stroke="${valueColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        ${investMarkers}
        ${valueMarkers}
        <circle cx="${(xScale(lastInvest.month) + 4).toFixed(1)}" cy="${investLabelY.toFixed(1)}" r="3" fill="${investColor}" />
        <text x="${xScale(lastInvest.month) + 12}" y="${investLabelY + 4}" class="rm-chart-end-label">Investment: ${formatUSD(lastInvest.val)}</text>
        <circle cx="${(xScale(lastValue.month) + 4).toFixed(1)}" cy="${valueLabelY.toFixed(1)}" r="3" fill="${valueColor}" />
        <text x="${xScale(lastValue.month) + 12}" y="${valueLabelY + 4}" class="rm-chart-end-label">Value: ${formatUSD(lastValue.val)}</text>
      </svg>
    `;
  }

  // ---- Rendering: phase data table (accessible fallback) --------------------------
  function renderPhaseTable(result) {
    const rows = result.phases
      .map(
        (ph) => `
        <tr>
          <td>${escapeHTML(ph.name)}</td>
          <td>${Math.round(ph.startMonth)}–${Math.round(ph.endMonth)}</td>
          <td>${formatUSDFull(ph.investmentAmount)}</td>
          <td>${formatUSDFull(ph.cumInvestment)}</td>
          <td>${Math.round(ph.valueRampTo * 100)}%</td>
          <td>${formatUSDFull(ph.cumValue)}</td>
        </tr>`
      )
      .join("");
    $("rm-phase-table").innerHTML = `
      <thead>
        <tr>
          <th>Phase</th>
          <th>Months</th>
          <th>Investment (phase)</th>
          <th>Cumulative investment</th>
          <th>Value run-rate unlocked</th>
          <th>Cumulative value realized</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    `;
  }

  // ---- Rendering: benchmark reference --------------------------------------------
  function renderBenchmarkNotes(archetype) {
    $("rm-benchmark-notes").innerHTML = archetype.benchmarkNotes.map((n) => `<li>${escapeHTML(n)}</li>`).join("");
  }

  // ---- Orchestration ------------------------------------------------------------
  function generateAndRender(inputs) {
    const result = computeRoadmap(inputs);
    renderStatTiles(result);
    renderConstraintsApplied(result);
    renderExecBullets(result);
    renderTimeline(result);
    renderTradeoffChart(result);
    renderPhaseTable(result);
    renderBenchmarkNotes(result.archetype);
  }

  function readInputs() {
    const constraintIds = Array.from(document.querySelectorAll('#rm-constraints input[type="checkbox"]:checked')).map(
      (el) => el.value
    );
    const systemCount = clamp(parseInt($("rm-systems").value, 10) || 45, 1, 2000);
    const employeesImpacted = clamp(parseInt($("rm-employees").value, 10) || 3000, 1, 500000);
    const businessUnits = clamp(parseInt($("rm-units").value, 10) || 6, 1, 200);
    const annualRunCostRaw = parseFloat($("rm-runcost").value);
    return {
      archetypeId: $("rm-archetype").value,
      complexityId: $("rm-complexity").value,
      systemCount,
      employeesImpacted,
      businessUnits,
      annualRunCost: Number.isFinite(annualRunCostRaw) && annualRunCostRaw > 0 ? annualRunCostRaw : null,
      constraintIds
    };
  }

  // ---- Form setup -----------------------------------------------------------------
  function populateForm() {
    $("rm-archetype").innerHTML = DATA.archetypes
      .map((a) => `<option value="${escapeHTML(a.id)}">${escapeHTML(a.name)}</option>`)
      .join("");
    $("rm-complexity").innerHTML = DATA.complexityLevels
      .map((c) => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.label)}</option>`)
      .join("");
    $("rm-complexity").value = "medium";
    $("rm-constraints").innerHTML = DATA.constraints
      .map(
        (c) => `
        <label class="rm-constraint-checkbox">
          <input type="checkbox" value="${escapeHTML(c.id)}">
          ${escapeHTML(c.label)}
        </label>`
      )
      .join("");
  }

  populateForm();

  $("rm-form").addEventListener("submit", (e) => {
    e.preventDefault();
    generateAndRender(readInputs());
  });

  $("rm-table-toggle").addEventListener("click", () => {
    const wrap = $("rm-phase-table-wrap");
    wrap.hidden = !wrap.hidden;
    $("rm-table-toggle").textContent = wrap.hidden ? "View as table" : "Hide table";
  });

  // ---- Initial load: a representative sample scenario ------------------------------
  generateAndRender(readInputs());
})();
