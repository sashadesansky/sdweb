/*
  Agentic Architecture Generator — page logic.
  Reads patterns from window.ARCHITECT_DATA (architect-data.js) and builds
  the design entirely in the visitor's browser. No network calls, no API,
  no cost per use.
  All text is inserted with textContent, never as HTML, so visitor input
  can never inject markup into the page.
*/

(function () {
  "use strict";

  var D = window.ARCHITECT_DATA;
  if (!D) {
    console.error("ARCHITECT_DATA not found — check that architect-data.js loaded first.");
    return;
  }

  var form = document.getElementById("ar-form");
  var box = document.getElementById("ar-idea");
  var btn = document.getElementById("ar-go");
  var err = document.getElementById("ar-err");
  var out = document.getElementById("ar-output");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function pairs(a) { return a.map(function (p) { return { title: p[0], detail: p[1] }; }); }

  // ---- Template mode: build a design from the patterns ---------------------
  function localDesign(idea) {
    var t = idea.toLowerCase();
    var dm = D.generic;
    for (var i = 0; i < D.domains.length; i++) {
      if (D.domains[i].match.test(t)) { dm = D.domains[i]; break; }
    }
    var reg = D.regulated.test(t);
    var humans = dm.humans.map(function (h) { return { name: h[0], desc: h[1] }; });
    if (reg) {
      humans.push({
        name: "Compliance reviewer signs off",
        desc: "Sensitive or regulated data means a qualified person approves before anything goes out"
      });
    }
    var watch = dm.watch.concat(D.baseWatch);
    if (reg) {
      watch.unshift(["Regulated data", "Check privacy, retention, and licensing rules before agents touch sensitive records. This is not legal advice"]);
    }
    return {
      title: "Starter design: " + (idea.length > 70 ? idea.slice(0, 67) + "..." : idea),
      summary: "A small team of agents handles the repeatable work. People approve anything risky, and shared infrastructure keeps the whole run observable.",
      trigger: dm.trigger,
      orchestrator: { name: dm.orch[0], desc: dm.orch[1], tech: dm.orch[2] },
      workers: dm.workers.map(function (w) { return { name: w[0], desc: w[1], tech: w[2] }; }),
      humans: humans,
      output: { name: dm.output[0], desc: dm.output[1] },
      platform: D.platform,
      driver: dm.driver,
      costs: pairs(dm.costs.concat(D.baseCosts)),
      watchouts: pairs(watch)
    };
  }

  function generate(idea) {
    return Promise.resolve(localDesign(idea));
  }

  // ---- Rendering ------------------------------------------------------------------
  function chips(arr) {
    var w = el("div", "ar-chips");
    (arr || []).forEach(function (t) { w.appendChild(el("span", "ar-chip", t)); });
    return w;
  }
  function node(kind, label, name, desc, tech) {
    var n = el("div", "ar-node ar-node-" + kind);
    n.appendChild(el("div", "ar-tag", label));
    n.appendChild(el("div", "ar-name", name));
    if (desc) n.appendChild(el("div", "ar-desc", desc));
    if (tech && tech.length) n.appendChild(chips(tech));
    return n;
  }
  function arrow() {
    var a = el("div", "ar-arrow", "↓");
    a.setAttribute("aria-hidden", "true");
    return a;
  }
  function legend() {
    var l = el("div", "ar-legend");
    [["agent", "Agent"], ["human", "Human in the loop"], ["sys", "System or output"]].forEach(function (p) {
      var s = el("span", "ar-legend-item");
      s.appendChild(el("span", "ar-swatch ar-swatch-" + p[0]));
      s.appendChild(document.createTextNode(p[1]));
      l.appendChild(s);
    });
    return l;
  }
  function items(list) {
    var w = el("div", "ar-items");
    list.forEach(function (it) {
      w.appendChild(el("div", "ar-item-title", it.title));
      w.appendChild(el("div", "ar-item-detail", it.detail));
    });
    return w;
  }

  function render(d) {
    out.textContent = "";
    var left = el("div", "ar-diagram");
    var right = el("aside", "ar-side");

    left.appendChild(el("h2", "ar-design-title", d.title));
    left.appendChild(el("p", "ar-lede", d.summary));
    left.appendChild(legend());
    left.appendChild(node("sys", "Trigger", d.trigger));
    left.appendChild(arrow());
    left.appendChild(node("agent", "Orchestrator agent", d.orchestrator.name, d.orchestrator.desc, d.orchestrator.tech));
    left.appendChild(arrow());
    var wg = el("div", "ar-workers");
    d.workers.forEach(function (w) { wg.appendChild(node("agent", "Worker agent", w.name, w.desc, w.tech)); });
    left.appendChild(wg);
    left.appendChild(arrow());
    var hg = el("div", "ar-humans");
    d.humans.forEach(function (h) { hg.appendChild(node("human", "Human in the loop", h.name, h.desc)); });
    left.appendChild(hg);
    left.appendChild(el("div", "ar-loop", "Approved work moves on. Rejected work goes back to the orchestrator with feedback."));
    left.appendChild(arrow());
    left.appendChild(node("sys", "Output", d.output.name, d.output.desc));
    var pf = el("div", "ar-platform");
    pf.appendChild(el("div", "ar-tag", "Shared platform underneath"));
    pf.appendChild(chips(d.platform));
    left.appendChild(pf);

    right.appendChild(el("h3", "ar-side-heading", "Hidden costs"));
    if (d.driver) right.appendChild(el("div", "ar-driver", "Likely biggest cost driver: " + d.driver));
    right.appendChild(items(d.costs));
    right.appendChild(el("h3", "ar-side-heading ar-side-heading-2", "Watch-outs"));
    right.appendChild(items(d.watchouts));
    right.appendChild(el("p", "ar-note", "Starter design built from common patterns, not generated for your exact idea. Everything runs in your browser; nothing you type is sent anywhere."));

    out.appendChild(left);
    out.appendChild(right);
  }

  // ---- Wiring --------------------------------------------------------------------------
  var exWrap = document.getElementById("ar-examples");
  D.examples.forEach(function (ex) {
    var b = el("button", "button-outline ar-example", ex);
    b.type = "button";
    b.addEventListener("click", function () {
      box.value = ex;
      err.textContent = "";
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
    exWrap.appendChild(b);
  });

  box.addEventListener("input", function () { err.textContent = ""; });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var idea = box.value.replace(/\s+/g, " ").trim();
    if (idea.length < 8) {
      err.textContent = "Describe your idea in a sentence first.";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Generating...";
    generate(idea).then(render).then(function () {
      btn.disabled = false;
      btn.textContent = "Generate Architecture";
      out.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
