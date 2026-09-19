/*
  AI Use Case → Federal Compliance Mapper
  ----------------------------------------------------------------------
  Takes a structured description of a proposed AI use case and maps it
  against the NIST AI RMF 1.0 and OMB M-24-10, using the reference data
  in compliance-data.js. This is a deterministic rules engine over public
  guidance text — not a live feed, and not legal advice. See the
  disclaimer on the page.
*/

(function () {
  "use strict";

  const DATA = window.COMPLIANCE_DATA;
  const $ = (id) => document.getElementById(id);

  function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ---- Tri-state combination (false=0, maybe=1, true=2; take the max) --------
  function toRank(val) {
    if (val === true || val === "yes") return 2;
    if (val === "maybe" || val === "unsure") return 1;
    return 0;
  }

  function combine(purposeVal, questionVal) {
    return Math.max(toRank(purposeVal), toRank(questionVal));
  }

  function rankLabel(rank) {
    if (rank === 2) return "Yes";
    if (rank === 1) return "Likely / needs determination";
    return "No";
  }

  function rankStatus(rank) {
    if (rank === 2) return "critical";
    if (rank === 1) return "warning";
    return "good";
  }

  // ---- Core computation ---------------------------------------------------------
  function computeResult(inputs) {
    const purpose = DATA.purposes.find((p) => p.id === inputs.purposeId) || DATA.purposes[DATA.purposes.length - 1];

    const rightsRank = combine(purpose.rightsImpacting, inputs.principalBasis);
    const safetyRank = combine(purpose.safetyImpacting, inputs.safetyRisk);

    const flags = {
      rightsImpacting: rightsRank >= 1,
      safetyImpacting: safetyRank >= 1,
      pii: inputs.pii === "yes",
      cloudHosted: inputs.cloud === "yes",
      thirdPartyModel: inputs.thirdParty === "yes",
      generativeAI: inputs.generative === "yes",
      publicFacing: inputs.publicFacing === "yes"
    };

    return { inputs, purpose, rightsRank, safetyRank, flags };
  }

  // ---- Rendering: classification verdicts ----------------------------------------
  function renderVerdicts(result) {
    const { rightsRank, safetyRank } = result;
    const cards = [
      { label: "Rights-Impacting AI", rank: rightsRank },
      { label: "Safety-Impacting AI", rank: safetyRank }
    ];
    $("cm-verdicts").innerHTML = cards
      .map(
        (c) => `
        <div class="cm-verdict-card cm-status-${rankStatus(c.rank)}">
          <div class="cm-verdict-icon">${c.rank === 2 ? "●" : c.rank === 1 ? "▲" : "○"}</div>
          <div>
            <div class="cm-verdict-label">${escapeHTML(c.label)}</div>
            <div class="cm-verdict-value">${escapeHTML(rankLabel(c.rank))}</div>
          </div>
        </div>`
      )
      .join("");

    $("cm-purpose-note").textContent = result.purpose.note || "";
  }

  // ---- Rendering: compliance summary bullets --------------------------------------
  function renderSummaryBullets(result) {
    const { rightsRank, safetyRank, flags, purpose, inputs } = result;
    const bullets = [];

    bullets.push(
      `"${escapeHTML(inputs.name || "This use case")}" is classified as <strong>${escapeHTML(rankLabel(rightsRank))}</strong> for rights-impacting and <strong>${escapeHTML(rankLabel(safetyRank))}</strong> for safety-impacting, based on its purpose (${escapeHTML(purpose.label)}) and your answers to the direct M-24-10 test questions.`
    );

    if (flags.rightsImpacting || flags.safetyImpacting) {
      bullets.push(
        `Because this use case is rights- and/or safety-impacting (or needs further determination), OMB M-24-10's minimum risk management practices apply, and it requires Chief AI Officer review before deployment — see the sections below.`
      );
    } else {
      bullets.push(
        `Based on the inputs given, this use case does not currently trigger the M-24-10 minimum practices for rights- or safety-impacting AI — though the baseline NIST AI RMF governance practices below still apply, and this determination should be revisited if the use case's scope changes.`
      );
    }

    if (flags.pii) {
      bullets.push(`This system processes PII, so a Privacy Impact Assessment applies, and a System of Records Notice may apply — confirm the latter with your agency's Privacy Office.`);
    }
    if (flags.cloudHosted) {
      bullets.push(`As a cloud-hosted system, it will generally need a FedRAMP-authorized offering and an Authority to Operate before handling production agency data.`);
    }
    if (flags.thirdPartyModel) {
      bullets.push(`Because it's built on a third-party or vendor AI model, extra emphasis applies to the NIST AI RMF's third-party risk categories (GOVERN 6, MAP 4, MANAGE 3) — understand what the vendor has (and hasn't) evaluated.`);
    }
    if (rightsRank === 1 || safetyRank === 1) {
      bullets.push(`Since at least one classification came back "needs determination," the recommended next step is an early conversation with your agency's CAIO office to confirm the determination before further build-out.`);
    }

    $("cm-summary-bullets").innerHTML = bullets.map((b) => `<li>${b}</li>`).join("");
  }

  // ---- Rendering: NIST AI RMF grid -------------------------------------------------
  function renderNistGrid(result) {
    const { flags } = result;
    $("cm-nist-grid").innerHTML = DATA.nistFunctions
      .map((fn) => {
        const cats = fn.categories
          .map((cat) => {
            const emphasized = cat.emphasizeWhen.some((f) => flags[f]);
            return `
            <div class="cm-nist-cat${emphasized ? " cm-nist-cat-emphasized" : ""}">
              <div class="cm-nist-cat-head">
                <span class="cm-nist-code">${escapeHTML(cat.code)}</span>
                ${emphasized ? '<span class="cm-emphasis-badge">Emphasized for this use case</span>' : ""}
              </div>
              <div class="cm-nist-cat-title">${escapeHTML(cat.title)}</div>
              <p class="cm-nist-cat-desc">${escapeHTML(cat.description)}</p>
            </div>`;
          })
          .join("");
        return `
        <div class="cm-nist-function">
          <h4>${escapeHTML(fn.name)}</h4>
          <p class="cm-nist-function-summary">${escapeHTML(fn.summary)}</p>
          <div class="cm-nist-cat-list">${cats}</div>
        </div>`;
      })
      .join("");
  }

  // ---- Rendering: minimum practices ------------------------------------------------
  function renderPractices(result) {
    const { flags } = result;
    const el = $("cm-practices");
    if (!flags.rightsImpacting && !flags.safetyImpacting) {
      el.innerHTML = `<p class="cm-note">Based on your answers, this use case doesn't currently trigger M-24-10's minimum practices for rights- or safety-impacting AI. Revisit this if the use case's purpose or scope changes.</p>`;
      return;
    }
    const shared = DATA.minimumPractices.shared
      .map((p) => `<li><strong>${escapeHTML(p.title)}</strong><span>${escapeHTML(p.detail)}</span></li>`)
      .join("");
    const rightsOnly = flags.rightsImpacting
      ? DATA.minimumPractices.rightsOnly
          .map((p) => `<li><strong>${escapeHTML(p.title)}</strong><span>${escapeHTML(p.detail)}</span></li>`)
          .join("")
      : "";
    el.innerHTML = `
      <p class="cm-section-intro">Applies to both rights- and safety-impacting AI:</p>
      <ul class="cm-practices-list">${shared}</ul>
      ${
        rightsOnly
          ? `<p class="cm-section-intro">Additional practices specific to rights-impacting AI:</p><ul class="cm-practices-list">${rightsOnly}</ul>`
          : ""
      }
      <p class="cm-note">These minimum practices took effect no later than December 1, 2024 for covered AI already in use. Absent a documented CAIO waiver or an OMB-approved extension, an agency must stop using rights- or safety-impacting AI that doesn't meet them.</p>
    `;
  }

  // ---- Rendering: agency approvals --------------------------------------------------
  function renderApprovals(result) {
    const { flags } = result;
    const applicable = DATA.approvals.filter(
      (a) => a.appliesWhenAny.includes("always") || a.appliesWhenAny.some((f) => flags[f])
    );
    $("cm-approvals").innerHTML = applicable
      .map(
        (a) => `
        <li>
          <div class="cm-approval-name">${escapeHTML(a.name)}</div>
          <p>${escapeHTML(a.description)}</p>
          <span class="cm-citation">${escapeHTML(a.citation)}</span>
        </li>`
      )
      .join("");
  }

  // ---- Orchestration ----------------------------------------------------------------
  function generateAndRender(inputs) {
    const result = computeResult(inputs);
    renderVerdicts(result);
    renderSummaryBullets(result);
    renderNistGrid(result);
    renderPractices(result);
    renderApprovals(result);
  }

  function readInputs() {
    return {
      name: $("cm-name").value.trim(),
      description: $("cm-description").value.trim(),
      purposeId: $("cm-purpose").value,
      principalBasis: $("cm-principal-basis").value,
      safetyRisk: $("cm-safety-risk").value,
      pii: $("cm-pii").value,
      cloud: $("cm-cloud").value,
      thirdParty: $("cm-thirdparty").value,
      generative: $("cm-generative").value,
      publicFacing: $("cm-public-facing").value
    };
  }

  function populateForm() {
    $("cm-purpose").innerHTML = DATA.purposes.map((p) => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.label)}</option>`).join("");
    $("cm-purpose").value = "benefits-eligibility";
  }

  populateForm();

  $("cm-form").addEventListener("submit", (e) => {
    e.preventDefault();
    generateAndRender(readInputs());
  });

  // ---- Initial load: a representative sample scenario ------------------------------
  generateAndRender(readInputs());
})();
