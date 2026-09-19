/*
  Reference dataset for the AI Use Case → Federal Compliance Mapper.

  Grounded in publicly available text of:
    - NIST AI Risk Management Framework 1.0 (NIST AI 100-1, Jan 2023) —
      the four core functions (Govern, Map, Measure, Manage) and their
      19 categories.
    - OMB Memorandum M-24-10, "Advancing Governance, Innovation, and Risk
      Management for Agency Use of Artificial Intelligence" (March 28, 2024)
      — definitions of rights-impacting and safety-impacting AI, minimum
      risk management practices, and agency governance requirements.

  This is NOT a live feed and NOT legal advice. The "purposes" catalog
  paraphrases the kinds of uses M-24-10's Appendix I presumes to be
  rights- or safety-impacting, based on public secondary reporting on that
  appendix (the primary PDF could not be fetched directly while building
  this) — always confirm actual applicability, and the exact current text
  of Appendix I, with your agency's Chief AI Officer, privacy office, or
  legal counsel. Memoranda are also periodically superseded — verify you
  are looking at the current guidance in effect.
*/

window.COMPLIANCE_DATA = {
  purposes: [
    // ---- Presumed rights-impacting (OMB M-24-10 Appendix I, paraphrased) ----
    {
      id: "content-moderation",
      label: "Content moderation — blocking, removing, hiding, or limiting speech",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Falls within the category of AI used to block, remove, hide, or limit protected speech."
    },
    {
      id: "law-enforcement-monitoring",
      label: "Law enforcement — risk assessment, identification, tracking, or monitoring of individuals",
      rightsImpacting: true,
      safetyImpacting: "maybe",
      note: "Presumed rights-impacting under the law enforcement category; may also be safety-impacting depending on the specific use (e.g., use-of-force decision support)."
    },
    {
      id: "education-decisions",
      label: "Education — admissions, discipline, or plagiarism detection",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Presumed rights-impacting under the education category."
    },
    {
      id: "likeness-replication",
      label: "Replicating a person's likeness or voice without their express consent",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Explicitly called out as presumed rights-impacting."
    },
    {
      id: "housing-lending",
      label: "Housing or lending — tenant screening, valuations, mortgage underwriting, or insurance",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Presumed rights-impacting under the housing/lending category."
    },
    {
      id: "employment-decisions",
      label: "Employment — screening, hiring, promotion, performance management, or termination",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Presumed rights-impacting under the employment category."
    },
    {
      id: "benefits-eligibility",
      label: "Public benefits — eligibility screening, fraud detection, or benefit-amount determinations",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Presumed rights-impacting where AI output is a principal basis for a benefits decision about a specific individual."
    },
    {
      id: "immigration-processing",
      label: "Immigration — application processing, biometric identification, or enforcement tracking",
      rightsImpacting: true,
      safetyImpacting: "maybe",
      note: "Presumed rights-impacting; enforcement-tracking uses may also raise safety-impacting considerations."
    },
    {
      id: "healthcare-access",
      label: "Healthcare access — eligibility, coverage, or service-access determinations (non-clinical)",
      rightsImpacting: true,
      safetyImpacting: false,
      note: "Presumed rights-impacting where it determines an individual's access to healthcare benefits or services."
    },

    // ---- Presumed safety-impacting (mapped to the 4 prongs of the official
    //      M-24-10 definition: life/well-being, climate/environment,
    //      critical infrastructure, strategic assets) ----
    {
      id: "clinical-decision-support",
      label: "Clinical — medical diagnosis or treatment recommendation",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'human life or well-being' in the official safety-impacting definition."
    },
    {
      id: "occupational-safety",
      label: "Occupational safety or workplace hazard monitoring",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'human life or well-being' (occupational hazards) in the official safety-impacting definition."
    },
    {
      id: "hazard-detection",
      label: "Biological, chemical, or physical hazard detection or response",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'human life or well-being' in the official safety-impacting definition."
    },
    {
      id: "environmental-control",
      label: "Environmental monitoring or control with potential for irreversible damage",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'climate or environment' in the official safety-impacting definition."
    },
    {
      id: "critical-infrastructure",
      label: "Critical infrastructure control or monitoring (energy, water, transportation, communications)",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'critical infrastructure' (PPD-21 sectors) in the official safety-impacting definition."
    },
    {
      id: "election-integrity",
      label: "Election administration or voting infrastructure integrity",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Explicitly included under 'critical infrastructure' in the official safety-impacting definition."
    },
    {
      id: "strategic-assets",
      label: "Management of strategic assets, or classified/sensitive government information or property",
      rightsImpacting: false,
      safetyImpacting: true,
      note: "Falls under 'strategic assets or resources' in the official safety-impacting definition."
    },

    // ---- Typically neither (general/internal/administrative use) ----
    {
      id: "productivity-drafting",
      label: "Internal productivity — drafting, summarization, or search assistance",
      rightsImpacting: false,
      safetyImpacting: false,
      note: "General-purpose internal productivity use, not a principal basis for a rights- or safety-affecting decision about a specific individual."
    },
    {
      id: "data-analysis-research",
      label: "Data analysis, research, or internal reporting (not about specific individuals)",
      rightsImpacting: false,
      safetyImpacting: false,
      note: "Aggregate analysis without an individual-level decision is generally outside the rights-impacting definition."
    },
    {
      id: "it-operations",
      label: "IT operations, cybersecurity, or network monitoring (internal)",
      rightsImpacting: false,
      safetyImpacting: false,
      note: "Internal IT/security tooling not tied to critical infrastructure control is generally outside both presumptions."
    },
    {
      id: "public-chatbot-informational",
      label: "Public-facing chatbot or FAQ assistant (informational only, no eligibility decisions)",
      rightsImpacting: false,
      safetyImpacting: false,
      note: "Purely informational public assistance, without serving as a principal basis for a decision about a specific individual."
    },
    {
      id: "predictive-maintenance",
      label: "Predictive maintenance for non-safety-critical equipment",
      rightsImpacting: false,
      safetyImpacting: false,
      note: "Maintenance scheduling for non-critical, non-safety equipment is generally outside both presumptions."
    },
    {
      id: "other",
      label: "Other / not listed — use the direct questions below to assess",
      rightsImpacting: "maybe",
      safetyImpacting: "maybe",
      note: "No specific presumption on file for this purpose — rely on the direct questions below and confirm with your agency's CAIO office."
    }
  ],

  // ---- NIST AI RMF 1.0 — 4 functions, 19 categories ------------------------
  nistFunctions: [
    {
      id: "govern",
      name: "GOVERN",
      summary: "Cross-cutting: cultivates a culture of AI risk management and establishes accountability across the AI lifecycle.",
      categories: [
        { id: "govern-1", code: "GOVERN 1", title: "Policies, processes, and procedures are in place", description: "AI risk management policies, processes, and procedures are established, transparent, and implemented effectively.", emphasizeWhen: [] },
        { id: "govern-2", code: "GOVERN 2", title: "Accountability structures are in place", description: "Roles and responsibilities for AI risk management are clear, and staff are empowered and trained.", emphasizeWhen: [] },
        { id: "govern-3", code: "GOVERN 3", title: "Workforce and culture support risk management", description: "The organization's workforce has the diversity, resources, and support needed to identify and manage AI risks.", emphasizeWhen: [] },
        { id: "govern-4", code: "GOVERN 4", title: "Organizational culture prioritizes risk management", description: "Risk mapping, measurement, and management are prioritized throughout the AI lifecycle, not treated as an afterthought.", emphasizeWhen: [] },
        { id: "govern-5", code: "GOVERN 5", title: "Robust engagement with relevant AI actors", description: "Processes are in place for engaging affected communities, civil society, and other stakeholders.", emphasizeWhen: ["rightsImpacting"] },
        { id: "govern-6", code: "GOVERN 6", title: "Third-party and supply chain risks are addressed", description: "Policies and procedures address risks from third-party software, data, and AI systems.", emphasizeWhen: ["thirdPartyModel", "cloudHosted"] }
      ]
    },
    {
      id: "map",
      name: "MAP",
      summary: "Establishes the context for the specific AI system so risks can be framed correctly.",
      categories: [
        { id: "map-1", code: "MAP 1", title: "Context is established and understood", description: "The intended purpose, users, and deployment setting for the AI system are documented and understood.", emphasizeWhen: [] },
        { id: "map-2", code: "MAP 2", title: "The AI system is categorized", description: "The specific task, method, and deployment context of the AI system are categorized.", emphasizeWhen: [] },
        { id: "map-3", code: "MAP 3", title: "Capabilities, benefits, and costs are understood", description: "AI capabilities, targeted usage, and benefits/costs are understood relative to non-AI alternatives.", emphasizeWhen: [] },
        { id: "map-4", code: "MAP 4", title: "Third-party risks and benefits are mapped", description: "Risks and benefits associated with third-party data, software, and models are mapped.", emphasizeWhen: ["thirdPartyModel"] },
        { id: "map-5", code: "MAP 5", title: "Impacts to individuals and society are mapped", description: "Likely impacts to individuals, groups, communities, organizations, and society are identified and characterized.", emphasizeWhen: ["rightsImpacting", "safetyImpacting"] }
      ]
    },
    {
      id: "measure",
      name: "MEASURE",
      summary: "Analyzes, assesses, and tracks identified AI risks using appropriate methods and metrics.",
      categories: [
        { id: "measure-1", code: "MEASURE 1", title: "Methods and metrics are identified and applied", description: "Appropriate methods and metrics are identified and applied to measure AI risks.", emphasizeWhen: [] },
        { id: "measure-2", code: "MEASURE 2", title: "AI is evaluated for trustworthy characteristics", description: "The system is evaluated for validity, reliability, safety, security, resilience, fairness, privacy, and explainability.", emphasizeWhen: ["rightsImpacting", "safetyImpacting", "pii"] },
        { id: "measure-3", code: "MEASURE 3", title: "Mechanisms track risks over time", description: "Mechanisms are in place to track identified risks, including through ongoing monitoring after deployment.", emphasizeWhen: ["safetyImpacting"] },
        { id: "measure-4", code: "MEASURE 4", title: "Feedback on measurement efficacy is gathered", description: "Feedback about the efficacy of measurement approaches is sought and used to improve them.", emphasizeWhen: [] }
      ]
    },
    {
      id: "manage",
      name: "MANAGE",
      summary: "Allocates risk-management resources to identified and measured risks on a regular basis.",
      categories: [
        { id: "manage-1", code: "MANAGE 1", title: "Risks are prioritized and acted upon", description: "AI risks based on assessments are prioritized, responded to, and documented.", emphasizeWhen: ["rightsImpacting", "safetyImpacting"] },
        { id: "manage-2", code: "MANAGE 2", title: "Strategies to maximize benefit and minimize harm", description: "Strategies to maximize AI benefits and minimize negative impacts are planned, implemented, and communicated.", emphasizeWhen: ["rightsImpacting", "safetyImpacting"] },
        { id: "manage-3", code: "MANAGE 3", title: "Third-party risks and benefits are managed", description: "AI risks and benefits from third-party resources are regularly monitored and managed.", emphasizeWhen: ["thirdPartyModel", "cloudHosted"] },
        { id: "manage-4", code: "MANAGE 4", title: "Risk treatments are monitored and improved", description: "Risk treatments, including responses to AI incidents, are documented and monitored regularly.", emphasizeWhen: [] }
      ]
    }
  ],

  // ---- OMB M-24-10 minimum risk management practices -------------------------
  minimumPractices: {
    shared: [
      { title: "Complete an AI impact assessment prior to deployment", detail: "Document the AI's intended purpose, expected benefits, and potential risks to rights or safety before it goes into use." },
      { title: "Test the AI for performance in a real-world context prior to deployment", detail: "Validate that the system performs as intended under the actual conditions it will be used in, not just in a lab/test environment." },
      { title: "Independently evaluate the AI", detail: "Have a function independent of the system's developers assess its performance and risks." },
      { title: "Conduct ongoing monitoring after deployment", detail: "Monitor for degradation in functionality and for changes in the AI's impact on rights or safety, including periodic human review." },
      { title: "Provide additional human training, oversight, and accountability", detail: "Ensure the humans using the AI to inform decisions are trained on its proper use and limitations, with clear accountability for the final decision." }
    ],
    rightsOnly: [
      { title: "Notify individuals and provide a plain-language explanation", detail: "When the AI meaningfully influences a decision about a specific individual, notify them and explain, in plain language, the AI's role." },
      { title: "Provide an option to opt out in favor of a human alternative, where feasible", detail: "Give affected individuals a practical way to access a human decision-maker instead of the AI, when feasible given the program's context." }
    ]
  },

  // ---- Agency approvals & processes ------------------------------------------
  approvals: [
    {
      id: "caio-review",
      name: "Chief AI Officer (CAIO) review & approval",
      appliesWhenAny: ["rightsImpacting", "safetyImpacting"],
      description: "M-24-10 directs agencies to prohibit use of rights- or safety-impacting AI without CAIO approval, a documented waiver of specific minimum practices, or an OMB-approved extension.",
      citation: "OMB M-24-10"
    },
    {
      id: "waiver-pathway",
      name: "CAIO waiver / OMB extension pathway (if a minimum practice can't be met)",
      appliesWhenAny: ["rightsImpacting", "safetyImpacting"],
      description: "If a minimum practice genuinely cannot be met, the CAIO can waive it (documented and reported in the agency's annual AI use case inventory) or the agency can seek an OMB-approved extension. Absent one of these, the agency must stop using the AI until it complies.",
      citation: "OMB M-24-10"
    },
    {
      id: "governance-board",
      name: "AI Governance Board coordination",
      appliesWhenAny: ["always"],
      description: "M-24-10 directs agencies to establish (or designate) an AI Governance Board or coordination mechanism, chaired by the CAIO, to manage AI risk and promote responsible innovation agency-wide.",
      citation: "OMB M-24-10"
    },
    {
      id: "ai-inventory",
      name: "Agency AI Use Case Inventory listing",
      appliesWhenAny: ["always"],
      description: "Agencies must maintain and annually report a public inventory of their AI use cases, including whether each is rights- or safety-impacting and whether any minimum practice was waived.",
      citation: "OMB M-24-10"
    },
    {
      id: "pia",
      name: "Privacy Impact Assessment (PIA)",
      appliesWhenAny: ["pii"],
      description: "Standard federal requirement (E-Government Act of 2002) when a system creates, collects, or maintains information in identifiable form — reinforced by M-24-10's privacy-risk expectations for AI.",
      citation: "E-Government Act §208; OMB M-24-10"
    },
    {
      id: "sorn",
      name: "System of Records Notice (SORN) — confirm with your Privacy Office",
      appliesWhenAny: ["pii"],
      description: "May apply if personal information is retrieved by a personal identifier from a Privacy Act system of records. Applicability depends on retrieval-method specifics this questionnaire can't fully determine — confirm with your agency's Privacy Office.",
      citation: "Privacy Act of 1974"
    },
    {
      id: "fedramp-ato",
      name: "FedRAMP authorization / Authority to Operate (ATO)",
      appliesWhenAny: ["cloudHosted"],
      description: "Cloud-hosted federal systems generally require a FedRAMP-authorized cloud service offering and an Authority to Operate from your agency's authorizing official before handling agency data in production.",
      citation: "FedRAMP; FISMA"
    }
  ]
};
