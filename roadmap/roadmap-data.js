/*
  Benchmark dataset for the Tech Roadmap & Business Case Generator.

  This dataset is hand-curated from patterns commonly reported in public
  industry research and case studies (analyst reports, vendor case studies,
  and public M&A/IT research) — it is NOT a live feed. The generator applies
  deterministic heuristics on top of these benchmark ranges based on your
  inputs; treat the output as a decision-support sketch, not a certified
  estimate. See roadmap-generator.js for how these numbers are combined.

  Every dollar figure is a *range* grounded in the kind of numbers publicly
  reported for similarly scoped transformations, generalized rather than
  attributed to one specific report.
*/

window.ROADMAP_BENCHMARKS = {
  archetypes: [
    {
      id: "legacy-modernization",
      name: "Legacy System Modernization",
      description: "Re-platforming or rebuilding aging core systems that are costly to run and risky to change.",
      baseDurationMonths: [12, 24],
      baseInvestment: 0,
      costPerSystem: [80000, 200000],
      defaultRunCostPerSystem: 150000,
      annualValuePct: [0.25, 0.35],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "Comparable legacy modernization programs typically span 12–24 months depending on system complexity and scope, per publicly reported case studies.",
        "Cloud-native, rehost-first modernization approaches commonly report 30–40% reductions in IT infrastructure costs, with break-even reported as fast as 18–24 months for lower-cost rehosting — comprehensive rebuilds carry a larger upfront investment and typically see a longer payback.",
        "Enterprises running 10–15 unmodernized legacy applications commonly report $400K–$800K in direct annual maintenance costs alone — before counting the hidden cost of slow delivery."
      ],
      phases: [
        { key: "assess", name: "Assess & Align", pct: 0.15, investPct: 0.10, valueRampTo: 0.05, takeaway: "Current-state system inventory validated, target architecture and modernization approach selected per system, and the business case finalized." },
        { key: "foundation", name: "Foundation & Pilot", pct: 0.20, investPct: 0.25, valueRampTo: 0.15, takeaway: "Core platform and tooling stood up; a first wave of low-risk systems modernized as a pilot to prove the pattern." },
        { key: "core", name: "Core Migration Waves", pct: 0.35, investPct: 0.40, valueRampTo: 0.60, takeaway: "The majority of in-scope systems modernized in planned waves; legacy run-cost begins declining as systems come off old infrastructure." },
        { key: "stabilize", name: "Stabilize & Decommission", pct: 0.20, investPct: 0.18, valueRampTo: 0.90, takeaway: "Modernized systems stabilized in production; legacy systems formally decommissioned, eliminating dual-running costs." },
        { key: "scale", name: "Scale & Sustain", pct: 0.10, investPct: 0.07, valueRampTo: 1.00, takeaway: "Modernized platform patterns embedded as the new standard; remaining edge-case systems addressed." }
      ]
    },
    {
      id: "cloud-migration",
      name: "Cloud Migration & Infrastructure Modernization",
      description: "Migrating workloads and infrastructure off legacy data centers and on to cloud platforms.",
      baseDurationMonths: [9, 15],
      baseInvestment: 0,
      costPerSystem: [8000, 25000],
      defaultRunCostPerSystem: 45000,
      annualValuePct: [0.20, 0.30],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "Complex migration waves are commonly planned at 8–12 months per wave, covering discovery, pilot, migration, and hypercare; large-scale programs (100+ hosts) commonly span 18+ months.",
        "Organizations commonly report 20–30% reductions in infrastructure and operations costs post-migration, rising toward 35% when paired with ongoing cost optimization (FinOps) practices.",
        "Most cloud migrations are commonly reported to break even within 12–24 months once one-time migration costs are weighed against ongoing run-rate savings."
      ],
      phases: [
        { key: "assess", name: "Assess & Plan", pct: 0.12, investPct: 0.08, valueRampTo: 0.05, takeaway: "Workload discovery and dependency mapping complete; a migration strategy (rehost, replatform, refactor, etc.) assigned per system." },
        { key: "foundation", name: "Landing Zone & Pilot Migration", pct: 0.18, investPct: 0.22, valueRampTo: 0.15, takeaway: "Cloud landing zone, security, and governance guardrails built; first low-risk workloads migrated to validate the pattern." },
        { key: "core", name: "Core Migration Waves", pct: 0.38, investPct: 0.42, valueRampTo: 0.65, takeaway: "The majority of workloads migrated in planned waves; infrastructure savings begin accruing as legacy data centers are decommissioned." },
        { key: "stabilize", name: "Optimize & Decommission", pct: 0.20, investPct: 0.20, valueRampTo: 0.92, takeaway: "Cloud environment right-sized and cost-optimized; legacy data center footprint retired." },
        { key: "scale", name: "Scale & Sustain", pct: 0.12, investPct: 0.08, valueRampTo: 1.00, takeaway: "Cloud operating model and cost governance (FinOps) embedded as business as usual." }
      ]
    },
    {
      id: "data-platform",
      name: "Enterprise Data Platform Modernization",
      description: "Replacing fragmented legacy data warehouses/marts with a modern, governed data platform.",
      baseDurationMonths: [14, 22],
      baseInvestment: 400000,
      costPerSystem: [15000, 35000],
      defaultRunCostPerSystem: 120000,
      annualValuePct: [0.30, 0.40],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "A properly re-architected data platform is commonly targeted at 18–24 months; AI-assisted delivery approaches have been reported to compress moderately complex efforts toward 6–12 months.",
        "Independent analyses commonly report 30–40% total-cost-of-ownership reduction from data platform modernization, with positive ROI typically achieved inside 18–24 months for well-executed programs.",
        "A payback period under 24 months is commonly considered approvable in industry benchmarks; periods beyond 36 months typically require a stronger strategic case."
      ],
      phases: [
        { key: "assess", name: "Assess & Design", pct: 0.15, investPct: 0.12, valueRampTo: 0.05, takeaway: "Data source inventory, quality assessment, and target platform architecture finalized." },
        { key: "foundation", name: "Platform Foundation", pct: 0.20, investPct: 0.28, valueRampTo: 0.15, takeaway: "Core data platform stood up; governance, security, and the first priority data domains onboarded." },
        { key: "core", name: "Domain Onboarding Waves", pct: 0.35, investPct: 0.35, valueRampTo: 0.60, takeaway: "Remaining priority data domains and sources onboarded in waves; self-service analytics and reporting enabled." },
        { key: "stabilize", name: "Stabilize & Retire Legacy", pct: 0.18, investPct: 0.17, valueRampTo: 0.88, takeaway: "Platform stabilized at scale; legacy data warehouses and marts retired." },
        { key: "scale", name: "Scale & Sustain", pct: 0.12, investPct: 0.08, valueRampTo: 1.00, takeaway: "Data platform embedded as the enterprise standard, with a continuous data quality and governance operating model in place." }
      ]
    },
    {
      id: "erp-replacement",
      name: "ERP / Core Systems Replacement",
      description: "Replacing fragmented core business systems (ERP, finance, HR) with a unified platform.",
      baseDurationMonths: [14, 20],
      baseInvestment: 700000,
      costPerSystem: [30000, 60000],
      defaultRunCostPerSystem: 180000,
      annualValuePct: [0.12, 0.18],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "Enterprise ERP programs spanning multiple legal entities or global sites commonly run 12–24 months, with average reported durations around 17 months against a commonly planned 12.",
        "Large enterprise ERP implementations on major platforms commonly run $750K–$2M+, with total cost often reaching 1.5–2x first-year software cost (and beyond 3x for heavily customized deployments).",
        "A dedicated program office (project manager, workstream leads, change manager) is commonly reported as standard for programs at this scale."
      ],
      phases: [
        { key: "assess", name: "Assess & Design", pct: 0.15, investPct: 0.10, valueRampTo: 0.03, takeaway: "Current-state process and system assessment complete; future-state process design and ERP configuration approach finalized." },
        { key: "foundation", name: "Build & Configure", pct: 0.22, investPct: 0.28, valueRampTo: 0.10, takeaway: "Core ERP modules configured and integrated; data migration approach validated." },
        { key: "core", name: "Pilot & Core Rollout", pct: 0.33, investPct: 0.38, valueRampTo: 0.55, takeaway: "ERP piloted with a first business unit or site, then rolled out across the majority of scope; legacy system retirements begin." },
        { key: "stabilize", name: "Stabilize & Hypercare", pct: 0.18, investPct: 0.16, valueRampTo: 0.85, takeaway: "Post-go-live hypercare stabilizes operations; remaining legacy core systems decommissioned." },
        { key: "scale", name: "Scale & Sustain", pct: 0.12, investPct: 0.08, valueRampTo: 1.00, takeaway: "Standardized processes and reporting embedded across the full organization." }
      ]
    },
    {
      id: "mna-integration",
      name: "M&A Systems & Organization Integration",
      description: "Integrating systems, data, and org structure across two organizations after a merger or acquisition.",
      baseDurationMonths: [12, 18],
      baseInvestment: 300000,
      costPerSystem: [20000, 40000],
      defaultRunCostPerSystem: 165000,
      annualValuePct: [0.15, 0.25],
      realizationFactor: 0.85,
      benchmarkNotes: [
        "IT-related synergies (ERP, CRM, infrastructure consolidation) are commonly reported to realize at roughly 65% of target over a 9–24 month window — this generator applies a similar realization discount by default.",
        "Integration costs are commonly reported at 100–150% of the targeted synergy run-rate, meaning the investment case should be sized against realistic, discounted synergy targets rather than headline figures.",
        "Public research commonly attributes 30–50% of lost deal value to slow or ineffective IT integration, underscoring the importance of a disciplined, benchmarked roadmap."
      ],
      phases: [
        { key: "assess", name: "Day-1 Readiness", pct: 0.12, investPct: 0.12, valueRampTo: 0.05, takeaway: "Critical systems, security, and org structure ready for legal Day 1; interim operating model defined." },
        { key: "foundation", name: "Integration Planning & Quick Wins", pct: 0.18, investPct: 0.18, valueRampTo: 0.18, takeaway: "Detailed integration plan finalized; early quick-win synergies (redundant licenses, vendor consolidation) captured." },
        { key: "core", name: "Core Systems & Org Integration", pct: 0.35, investPct: 0.38, valueRampTo: 0.60, takeaway: "Core systems (ERP, CRM, infrastructure) and organization structure consolidated across the combined entity." },
        { key: "stabilize", name: "Stabilize & Decommission Legacy", pct: 0.22, investPct: 0.22, valueRampTo: 0.88, takeaway: "Combined operations stabilized; redundant legacy systems from both entities retired." },
        { key: "scale", name: "Realize & Sustain Synergies", pct: 0.13, investPct: 0.10, valueRampTo: 1.00, takeaway: "Full run-rate synergies tracked and embedded into the combined organization's operating model." }
      ]
    },
    {
      id: "ai-automation",
      name: "AI & Automation Transformation",
      description: "Rolling out AI-enabled automation across a targeted set of business processes.",
      baseDurationMonths: [9, 15],
      baseInvestment: 150000,
      costPerSystem: [30000, 80000],
      defaultRunCostPerSystem: 120000,
      annualValuePct: [0.25, 0.40],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "Most organizations report completing an initial AI pilot within 3–6 months; enterprise-wide, function-level rollout commonly adds another 6–12 months, driven mostly by adoption, integration hardening, and governance.",
        "Enterprises commonly report first-year productivity gains in the 20–40% range for automated processes, with some leading adopters reporting 35–50% operational cost reduction.",
        "Programs investing in a cohesive, governed AI strategy are commonly reported to see 3–5x better returns than fragmented, ad hoc initiatives."
      ],
      phases: [
        { key: "assess", name: "Assess & Prioritize Use Cases", pct: 0.15, investPct: 0.12, valueRampTo: 0.05, takeaway: "Process and use-case inventory scored and prioritized by value and feasibility; governance and data readiness assessed." },
        { key: "foundation", name: "Pilot Wave", pct: 0.20, investPct: 0.22, valueRampTo: 0.20, takeaway: "First priority use cases piloted and validated with measurable results." },
        { key: "core", name: "Scale Wave", pct: 0.35, investPct: 0.38, valueRampTo: 0.65, takeaway: "Validated use cases scaled across the target processes and functions; adoption and change management drive uptake." },
        { key: "stabilize", name: "Stabilize & Govern", pct: 0.18, investPct: 0.18, valueRampTo: 0.90, takeaway: "Automation stabilized in production with monitoring, guardrails, and governance in place." },
        { key: "scale", name: "Scale & Sustain", pct: 0.12, investPct: 0.10, valueRampTo: 1.00, takeaway: "AI-enabled operating model embedded, with a continuous use-case pipeline established." }
      ]
    },
    {
      id: "app-rationalization",
      name: "Enterprise Application Rationalization",
      description: "Consolidating and decommissioning redundant, overlapping applications across the portfolio.",
      baseDurationMonths: [9, 15],
      baseInvestment: 0,
      costPerSystem: [15000, 45000],
      defaultRunCostPerSystem: 105000,
      annualValuePct: [0.20, 0.30],
      realizationFactor: 1.0,
      benchmarkNotes: [
        "Portfolio rationalization programs are commonly scoped at 9–15 months — shorter than full modernization efforts since scope centers on consolidation and decommissioning rather than rebuilding.",
        "A 20–30% reduction in total application portfolio run-cost is a commonly cited outcome range for well-executed rationalization programs.",
        "Programs commonly prioritize 'quick win' decommissions in the first 90 days to build funding momentum for later, more complex consolidations."
      ],
      phases: [
        { key: "assess", name: "Inventory & Assess", pct: 0.18, investPct: 0.12, valueRampTo: 0.08, takeaway: "Full application portfolio inventoried; redundancy, usage, and business criticality assessed." },
        { key: "foundation", name: "Quick-Win Decommissions", pct: 0.17, investPct: 0.15, valueRampTo: 0.25, takeaway: "Low-risk, clearly redundant applications retired first to build funding momentum." },
        { key: "core", name: "Core Consolidation Waves", pct: 0.32, investPct: 0.38, valueRampTo: 0.65, takeaway: "Remaining overlapping applications consolidated onto standard platforms in planned waves." },
        { key: "stabilize", name: "Stabilize & Finalize Retirements", pct: 0.21, investPct: 0.23, valueRampTo: 0.90, takeaway: "Consolidated platforms stabilized; final legacy application retirements completed." },
        { key: "scale", name: "Scale & Sustain", pct: 0.12, investPct: 0.12, valueRampTo: 1.00, takeaway: "Portfolio governance embedded to prevent redundant application sprawl from re-emerging." }
      ]
    }
  ],

  complexityLevels: [
    { id: "low", label: "Low — mostly standalone systems, few integrations", durationMult: 0.85, investMult: 0.85 },
    { id: "medium", label: "Medium — typical enterprise integration footprint", durationMult: 1.0, investMult: 1.0 },
    { id: "high", label: "High — deeply interconnected, many custom integrations", durationMult: 1.2, investMult: 1.15 },
    { id: "veryHigh", label: "Very high — tangled, poorly documented architecture", durationMult: 1.4, investMult: 1.35 }
  ],

  constraints: [
    { id: "budget", label: "Budget-constrained", durationMult: 1.15, investMult: 0.85, note: "Budget constraints typically stretch delivery timelines as funding is phased." },
    { id: "compliance", label: "Regulatory / compliance-heavy", durationMult: 1.10, investMult: 1.08, note: "Regulatory and compliance requirements add validation and audit cycles." },
    { id: "talent", label: "Legacy talent shortage", durationMult: 1.10, investMult: 1.0, note: "Legacy talent shortages slow specialized migration work." },
    { id: "interdependency", label: "High system interdependency", durationMult: 1.15, investMult: 1.10, note: "High system interdependency increases integration testing scope." },
    { id: "aggressive", label: "Aggressive timeline expectations", durationMult: 0.85, investMult: 1.20, note: "Compressed timelines require parallel workstreams, raising cost." },
    { id: "dataquality", label: "Known data quality issues", durationMult: 1.10, investMult: 1.05, note: "Data quality remediation adds effort before migration can proceed." },
    { id: "uptime", label: "24/7 uptime requirement", durationMult: 1.05, investMult: 1.10, note: "24/7 uptime requirements add redundancy and cutover planning cost." },
    { id: "distributed", label: "Distributed / global teams", durationMult: 1.10, investMult: 1.0, note: "Distributed, global teams add coordination overhead." }
  ]
};
