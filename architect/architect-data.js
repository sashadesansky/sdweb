/*
  Agentic Architecture Generator — pattern data.

  This file holds the starter patterns the page uses to build a design from
  a business idea. Edit the text here to change what visitors see; no code
  logic lives in this file.

  LIVE MODE (optional): the site is static, so by default the page assembles
  a design from these patterns ("template mode"). To have Claude design each
  one for the visitor's exact idea, deploy architect/live-endpoint.example.js
  as a serverless function elsewhere (GitHub Pages cannot run it) and put its
  URL in `endpoint` below. If the call fails, the page falls back to the
  patterns automatically.
*/

window.ARCHITECT_DATA = {

  endpoint: "",

  examples: [
    "AI bookkeeping service for freelancers",
    "Online store selling custom pet portraits",
    "Weekly climate tech newsletter with sponsor sales"
  ],

  // Each pattern: `match` is tested against the visitor's idea (lowercased).
  // First match wins. Tech names are examples, not endorsements.
  domains: [
    {
      match: /support|helpdesk|ticket|customer service|chatbot|faq/,
      trigger: "Customer ticket or chat message",
      orch: ["Support orchestrator", "Routes each ticket and tracks resolution", ["Claude Sonnet 5.5", "Task queue (SQS)"]],
      workers: [
        ["Triage agent", "Classifies urgency and topic", ["Claude Haiku 5.5", "Zendesk API"]],
        ["Answer agent", "Drafts replies from the knowledge base", ["Claude Sonnet 5.5", "pgvector search"]],
        ["Action agent", "Looks up orders, issues refunds", ["Order database", "Stripe API"]]
      ],
      humans: [["Support lead approves risky replies", "Refunds above a limit, upset customers, and low-confidence answers go to a person"]],
      output: ["Reply sent and ticket closed", "Resolution logged for quality review"],
      driver: "Long ticket histories re-sent to the model on every step",
      costs: [
        ["Knowledge base upkeep", "Answers are only as good as the docs, and someone has to keep them current"],
        ["Help desk fees", "Zendesk or Intercom charges can add up per seat and per resolution"]
      ],
      watch: [
        ["Wrong refunds", "Cap refund amounts in code, not just in the prompt"],
        ["Brand and tone risk", "One bad reply to a key customer can cost more than the savings"]
      ]
    },
    {
      match: /\bshop|\bstore|ecommerce|e-commerce|retail|inventory|dropship|merch/,
      trigger: "New customer order or product request",
      orch: ["Store orchestrator", "Sequences each order from intake to delivery", ["Claude Sonnet 5.5", "Temporal workflows"]],
      workers: [
        ["Order agent", "Validates orders and checks stock", ["Shopify API", "Postgres"]],
        ["Creative agent", "Drafts product pages, images, and copy", ["Claude Sonnet 5.5", "Image generation API"]],
        ["Service agent", "Answers customer questions", ["Claude Haiku 5.5", "Email API"]]
      ],
      humans: [["Owner approves custom work", "Anything made to order, plus refunds and unusual requests, is reviewed before it ships"]],
      output: ["Order fulfilled and customer notified", "Order record updated"],
      driver: "Creative generation and rework loops on custom items",
      costs: [
        ["Platform and payment fees", "Shopify, payment processing, and shipping fees apply to every order regardless of AI"],
        ["Returns and rework", "Wrong or low-quality items cost materials and shipping, not just tokens"]
      ],
      watch: [
        ["Incorrect stock or pricing", "Agents should read live inventory and prices, never remember them"],
        ["Product claims", "Generated copy can overstate what a product does; review before publishing"]
      ]
    },
    {
      match: /content|newsletter|blog|marketing|social|seo|copywrit|video|podcast|brand|media/,
      trigger: "Content calendar slot or new topic",
      orch: ["Editorial orchestrator", "Plans the calendar and assigns each piece", ["Claude Sonnet 5.5", "Airtable or Notion"]],
      workers: [
        ["Research agent", "Gathers sources and facts", ["Web search API", "Claude Haiku 5.5"]],
        ["Drafting agent", "Writes the first version", ["Claude Sonnet 5.5", "Style guide in prompt"]],
        ["Fact-check agent", "Verifies claims against sources", ["Claude Opus 5.5", "Source store"]]
      ],
      humans: [["Editor approves before publishing", "A person signs off on facts, tone, and anything sponsored"]],
      output: ["Piece published and distributed", "Performance data fed back"],
      driver: "Research and fact-checking reading many sources per piece",
      costs: [
        ["Source and tool subscriptions", "Data feeds, search APIs, and publishing tools bill separately"],
        ["Editing time", "If drafts need heavy rewrites, editor hours can exceed writing hours saved"]
      ],
      watch: [
        ["Fabricated facts", "Require a source link for every claim and check them"],
        ["Sameness", "Unedited AI output tends to read alike and can hurt audience trust"]
      ]
    },
    {
      match: /financ|account|bookkeep|invoice|\btax|expense|payroll|budget|invest|\blend|\bloan/,
      trigger: "New invoice, receipt, or transaction batch",
      orch: ["Finance orchestrator", "Sequences intake, matching, and reporting", ["Claude Sonnet 5.5", "Temporal workflows"]],
      workers: [
        ["Extraction agent", "Reads documents into structured data", ["Claude Haiku 5.5", "OCR service"]],
        ["Matching agent", "Categorizes and reconciles entries", ["Claude Sonnet 5.5", "QuickBooks API"]],
        ["Reporting agent", "Builds summaries and flags anomalies", ["Python and SQL tools", "Postgres"]]
      ],
      humans: [["Accountant reviews exceptions and sign-off", "Unusual amounts, new vendors, and period close are always approved by a person"]],
      output: ["Books updated and report issued", "Audit trail stored"],
      driver: "Document extraction at volume, plus reprocessing of failures",
      costs: [
        ["Accountant oversight", "Qualified review is required and is often the largest cost line"],
        ["Integration upkeep", "Accounting APIs change, and broken syncs create silent errors"]
      ],
      watch: [
        ["Silent numeric errors", "Use code for arithmetic and totals; do not let the model do the math"],
        ["Financial data handling", "Limit what the model sees, log access, and check regulatory duties"]
      ]
    },
    {
      match: /recruit|hiring|\bhr\b|talent|candidate|resume|\bjob|staffing/,
      trigger: "New role opening or candidate application",
      orch: ["Recruiting orchestrator", "Moves each candidate through the pipeline", ["Claude Sonnet 5.5", "Greenhouse or Lever API"]],
      workers: [
        ["Sourcing agent", "Finds and summarizes candidates", ["Search APIs", "Claude Haiku 5.5"]],
        ["Screening agent", "Compares applications to the role criteria", ["Claude Sonnet 5.5", "Structured scoring"]],
        ["Scheduling agent", "Coordinates interviews", ["Google Calendar API", "Email API"]]
      ],
      humans: [["Recruiter decides who advances", "People make every accept or reject decision and review the scoring criteria"]],
      output: ["Shortlist delivered and interviews booked", "Decision log retained"],
      driver: "Reading many resumes and long role descriptions per candidate",
      costs: [
        ["Compliance and audits", "Bias testing and documentation may be required for automated screening"],
        ["ATS and data fees", "Applicant tracking and sourcing tools bill per seat or per lookup"]
      ],
      watch: [
        ["Bias and legal exposure", "Never let an agent auto-reject; test outcomes across groups"],
        ["Candidate privacy", "Resumes contain personal data and need retention limits"]
      ]
    },
    {
      match: /software|saas|\bcode\b|developer|\bapi\b|platform|startup|website|\bapp\b|automation/,
      trigger: "Feature request or bug report",
      orch: ["Engineering orchestrator", "Breaks work into tasks and tracks them", ["Claude Opus 5.5", "GitHub Issues"]],
      workers: [
        ["Investigator agent", "Searches code and reproduces issues", ["Claude Sonnet 5.5", "Code search tools"]],
        ["Coder agent", "Writes the change in an isolated copy", ["Git worktrees", "Docker sandbox"]],
        ["Test agent", "Writes and runs tests", ["CI runner", "Claude Haiku 5.5"]]
      ],
      humans: [["Engineer reviews the pull request", "A person approves every merge and every deployment"]],
      output: ["Pull request merged and deployed", "Change summary logged"],
      driver: "Coder and test loops that re-run with growing context",
      costs: [
        ["CI minutes and sandboxes", "Every agent run consumes build and compute time on top of tokens"],
        ["Review burden", "Large generated diffs can take engineers longer to review than to write"]
      ],
      watch: [
        ["Security flaws", "Generated code needs scanning and review before it ships"],
        ["Agents editing the same files", "Give each agent its own copy of the repo"]
      ]
    }
  ],

  // Used when nothing above matches.
  generic: {
    trigger: "New customer request or scheduled job",
    orch: ["Lead orchestrator", "Plans the work and assigns tasks", ["Claude Sonnet 5.5", "Task queue (SQS)"]],
    workers: [
      ["Research agent", "Gathers information and context", ["Web search API", "Claude Haiku 5.5"]],
      ["Execution agent", "Does the core work for the customer", ["Claude Sonnet 5.5", "Business APIs"]],
      ["Review agent", "Checks quality before handoff", ["Claude Opus 5.5", "Checklist evals"]]
    ],
    humans: [["Owner approves before delivery", "A person signs off on outputs that reach customers or move money"]],
    output: ["Result delivered to the customer", "Run logged for review"],
    driver: "Context re-sent on every agent step across the whole team",
    costs: [["Third-party API fees", "Data, communication, and payment tools bill on their own meters"]],
    watch: [["Scope creep", "Start with one narrow workflow and add agents only where results improve"]]
  },

  // Added to every design.
  baseCosts: [
    ["Token spend grows with steps", "Each agent step re-sends its context. Prompt caching and per-task budgets keep it in check"],
    ["Human review time", "Reviewers cost real money, and slow approvals become the bottleneck"],
    ["Evals and upkeep", "Someone must build tests, tune prompts, and fix breakages when models or tools change"],
    ["Infrastructure", "Queue, state store, sandboxes, and monitoring all need setup and ongoing spend"]
  ],
  baseWatch: [
    ["Runaway loops", "Set step limits, retry caps, and a spend ceiling per run"],
    ["Cost per success, not per run", "Failed runs still cost money; track cost per accepted outcome"],
    ["Untrusted input", "Customer text, web pages, and files can hide instructions; agents should not act on them unchecked"],
    ["Duplicate side effects", "Retries can repeat emails or payments; make actions safe to repeat"]
  ],

  // Ideas touching these areas get an extra compliance checkpoint.
  regulated: /health|medical|clinic|patient|legal|\blaw\b|attorney|insurance|child|school|pharma/,

  platform: ["Postgres (state)", "Redis or SQS (queue)", "Docker sandboxes", "OpenTelemetry tracing", "MCP tool servers"]
};
