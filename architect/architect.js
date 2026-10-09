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
    var bs = D.baseStack;
    var ds = dm.stack || {};
    var controls = bs.controls.concat(ds.controls || []);
    if (reg) controls.push(D.regulatedControl);
    return {
      title: "Starter design: " + (idea.length > 70 ? idea.slice(0, 67) + "..." : idea),
      summary: "A small team of agents handles the repeatable work. People approve anything risky, and shared infrastructure keeps the whole run observable.",
      trigger: dm.trigger,
      orchestrator: { name: dm.orch[0], desc: dm.orch[1], tech: dm.orch[2] },
      workers: dm.workers.map(function (w) { return { name: w[0], desc: w[1], tech: w[2] }; }),
      humans: humans,
      output: { name: dm.output[0], desc: dm.output[1] },
      platform: D.platform,
      stack: {
        entry: (ds.entry || []).concat(bs.entry),
        orchestration: bs.orchestration,
        review: ds.review || [],
        tools: ds.tools || [],
        data: bs.data.concat(ds.data || []),
        isolation: bs.isolation,
        controls: controls
      },
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
    if (label) n.appendChild(el("div", "ar-tag", label));
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

  function layer(label, hint, nodes) {
    var l = el("div", "ar-layer");
    l.appendChild(el("div", "ar-layer-label", label));
    if (hint) l.appendChild(el("div", "ar-layer-hint", hint));
    var g = el("div", "ar-layer-grid");
    nodes.forEach(function (n) { g.appendChild(n); });
    l.appendChild(g);
    return l;
  }
  function sysNodes(list) {
    return list.map(function (n) { return node("sys", "", n[0], "", n[1]); });
  }

  function techView(d) {
    var st = d.stack;
    var v = el("div", "ar-panel");
    v.id = "ar-panel-tech";

    v.appendChild(layer("Entry and access", "How work arrives and who is allowed in", sysNodes(st.entry)));
    v.appendChild(arrow());

    var orch = [node("agent", "", d.orchestrator.name, d.orchestrator.desc, d.orchestrator.tech)]
      .concat(sysNodes(st.orchestration));
    v.appendChild(layer("Orchestration", "Plans the work, runs the workflow, and queues tasks", orch));
    v.appendChild(arrow());

    var workers = d.workers.map(function (w) { return node("agent", "", w.name, w.desc, w.tech); });
    v.appendChild(layer("Agent workers (stateless)", "Each one has its own prompt, tools, and limited context", workers));
    v.appendChild(arrow());

    var decides = d.humans.map(function (h) { return h.name; }).join("; ");
    var review = st.review.map(function (r) {
      return node("human", "Human review gate", r[0], "Risky actions pause here: " + decides, r[1]);
    });
    v.appendChild(layer("Human in the loop", "Approved actions continue; rejected work returns to the orchestrator", review));
    v.appendChild(arrow());

    v.appendChild(layer("Tools and integrations", "Where agents act on real systems, after any approval", sysNodes(st.tools)));

    var support = el("div", "ar-support");
    support.appendChild(el("div", "ar-support-label", "Supporting infrastructure (used by every layer above)"));
    support.appendChild(layer("State and data", "Shared memory, so agents hand off small summaries, not transcripts", sysNodes(st.data)));
    support.appendChild(layer("Isolation", "Agents run code in sealed containers", sysNodes(st.isolation)));
    support.appendChild(layer("Controls across every layer", "Keeps runs safe, observable, and affordable", sysNodes(st.controls)));
    v.appendChild(support);
    return v;
  }

  function toggle() {
    var t = el("div", "ar-toggle");
    t.setAttribute("role", "group");
    t.setAttribute("aria-label", "Diagram view");
    var views = [["ar-panel-workflow", "Team workflow"], ["ar-panel-tech", "Technical architecture"]];
    var btns = views.map(function (v, i) {
      var b = el("button", "button-outline ar-toggle-btn", v[1]);
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        btns.forEach(function (x, j) { x.setAttribute("aria-pressed", j === i ? "true" : "false"); });
        views.forEach(function (w, j) { document.getElementById(w[0]).hidden = j !== i; });
      });
      t.appendChild(b);
      return b;
    });
    return t;
  }

  function render(d) {
    out.textContent = "";
    var left = el("div", "ar-diagram");
    var right = el("aside", "ar-side");

    left.appendChild(el("h2", "ar-design-title", d.title));
    left.appendChild(el("p", "ar-lede", d.summary));
    left.appendChild(toggle());
    left.appendChild(legend());

    var wf = el("div", "ar-panel");
    wf.id = "ar-panel-workflow";
    wf.appendChild(node("sys", "Trigger", d.trigger));
    wf.appendChild(arrow());
    wf.appendChild(node("agent", "Orchestrator agent", d.orchestrator.name, d.orchestrator.desc, d.orchestrator.tech));
    wf.appendChild(arrow());
    var wg = el("div", "ar-workers");
    d.workers.forEach(function (w) { wg.appendChild(node("agent", "Worker agent", w.name, w.desc, w.tech)); });
    wf.appendChild(wg);
    wf.appendChild(arrow());
    var hg = el("div", "ar-humans");
    d.humans.forEach(function (h) { hg.appendChild(node("human", "Human in the loop", h.name, h.desc)); });
    wf.appendChild(hg);
    wf.appendChild(el("div", "ar-loop", "Approved work moves on. Rejected work goes back to the orchestrator with feedback."));
    wf.appendChild(arrow());
    wf.appendChild(node("sys", "Output", d.output.name, d.output.desc));
    var pf = el("div", "ar-platform");
    pf.appendChild(el("div", "ar-tag", "Shared platform underneath"));
    pf.appendChild(chips(d.platform));
    wf.appendChild(pf);

    var tv = techView(d);
    tv.hidden = true;
    left.appendChild(wf);
    left.appendChild(tv);

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
