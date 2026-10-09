/*
  Agentic Architecture Generator — pattern data.

  This file holds the starter patterns the page uses to build a design from
  a business idea. Edit the text here to change what visitors see; no code
  logic lives in this file. Everything runs in the visitor's browser: there
  is no server, no API, and no cost per use.

  Worker and orchestrator entries are [name, description, tech chips, state line].
  The state line says what that step reads from and writes to the state store.
*/

window.ARCHITECT_DATA = {

  examples: [
    "A software engineering team shipping a new feature",
    "A finance department closing out year-end sales",
    "A custom pet portrait shipping business"
  ],

  // Each pattern: `match` is tested against the visitor's idea (lowercased).
  // First match wins. Tech names are examples, not endorsements.
  domains: [
    {
      match: /portrait|\bpets?\b|custom art|commission|illustrat/,
      trigger: "New custom portrait order with pet photos",
      orch: ["Portrait order orchestrator", "Runs each order from photo intake to delivery", ["Claude Sonnet 5.5", "Temporal workflows"], "Reads order + photo refs · Writes order status and plan"],
      workers: [
        ["Intake agent", "Checks photo quality, style choice, and shipping address", ["Claude Haiku 5.5", "Shopify API"], "Reads order · Writes validated brief"],
        ["Artwork agent", "Drafts the portrait from the photos and style guide", ["Image generation API", "Claude Sonnet 5.5"], "Reads brief + photos · Writes draft image to S3"],
        ["Proof agent", "Sends the proof, handles revisions, and records approval", ["Email API", "Claude Haiku 5.5"], "Reads draft + feedback · Writes revision count"],
        ["Fulfillment agent", "Orders the print, buys the label, and sends tracking", ["Print vendor API", "Shipping label API"], "Reads approved art + address · Writes tracking number"]
      ],
      humans: [
        ["Artist checks the portrait", "A person confirms the pet looks right before the customer sees a proof"],
        ["Owner approves refunds and rework", "Unhappy customers, damaged shipments, and unusual requests go to a person"]
      ],
      output: ["Print shipped and customer notified", "Order, proof approval, and tracking stored"],
      stack: {
        entry: [["Order intake", ["Shopify webhook", "Photo upload to S3"]]],
        tools: [["Creative tools", ["Image generation API", "Template renderer"]], ["Fulfillment tools", ["Print vendor API", "Shipping label API"]], ["Comms tools", ["Email API", "Order status page"]]],
        data: [["Order and photo store", ["Order database", "Customer photos with retention timer"]]],
        review: [["Proof review", ["Proof page with approve or revise", "Artist queue"]]],
        controls: [["Revision cap", ["Max 3 agent revisions, then a person takes over"]]],
        lanes: [
          ["intake", ["High concurrency", "Cheap model"]],
          ["artwork", ["Low concurrency", "Image API rate limit"]],
          ["proof", ["Waits on customer", "Long timeout"]],
          ["fulfillment", ["Serial per order", "Vendor API"]]
        ],
        records: [
          ["orders", ["order_id, status, style", "Optimistic version"]],
          ["artifacts", ["Draft and final images", "S3 key + checksum"]],
          ["revisions", ["Count and feedback per proof", "Feeds the revision cap"]],
          ["shipments", ["Vendor job id, tracking", "Idempotent label purchase"]]
        ],
        decision: ["Printing and label purchase are idempotent", "A retried fulfillment task must never buy two labels, so the vendor call carries an idempotency key built from order_id"]
      },
      driver: "Image generation and revision loops on custom artwork",
      costs: [
        ["Rework and reprints", "A wrong or low-quality print costs materials and shipping, not just tokens"],
        ["Platform and payment fees", "Shopify, payment processing, and shipping apply to every order regardless of AI"]
      ],
      watch: [
        ["Customer photo privacy", "Pet photos often include people and homes; set retention limits and access controls"],
        ["Revision loops", "Cap agent revisions per order so a picky customer cannot run up generation costs"]
      ]
    },
    {
      match: /support|helpdesk|ticket|customer service|chatbot|faq/,
      trigger: "Customer ticket or chat message",
      orch: ["Support orchestrator", "Routes each ticket and tracks resolution", ["Claude Sonnet 5.5", "Task queue (SQS)"], "Reads ticket + history summary · Writes routing decision"],
      workers: [
        ["Triage agent", "Classifies urgency and topic", ["Claude Haiku 5.5", "Zendesk API"], "Reads ticket · Writes category and priority"],
        ["Answer agent", "Drafts replies from the knowledge base", ["Claude Sonnet 5.5", "pgvector search"], "Reads ticket + KB hits · Writes draft reply"],
        ["Action agent", "Looks up orders, issues refunds", ["Order database", "Stripe API"], "Reads order · Writes refund request"]
      ],
      humans: [["Support lead approves risky replies", "Refunds above a limit, upset customers, and low-confidence answers go to a person"]],
      output: ["Reply sent and ticket closed", "Resolution logged for quality review"],
      stack: {
        entry: [["Ticket intake", ["Zendesk webhook", "Chat widget"]]],
        tools: [["Help desk tools", ["Zendesk API", "Macros and tags"]], ["Billing tools", ["Stripe API", "Refund cap in code"]], ["Knowledge tools", ["Docs search", "Order lookup"]]],
        data: [["Knowledge base", ["Help center articles", "Embeddings index"]]],
        review: [["Approval console", ["Slack approval buttons", "Escalation queue"]]],
        controls: [["Refund limits", ["Enforced in code, not in prompts"]]],
        lanes: [
          ["triage", ["High concurrency", "Cheap model"]],
          ["answer", ["Medium concurrency", "Per-ticket ordering"]],
          ["actions", ["Serial per customer", "Refund cap"]]
        ],
        records: [
          ["tickets", ["ticket_id, status, owner", "Optimistic version"]],
          ["conversation summary", ["Rolling summary, not transcript", "Keeps context small"]],
          ["actions", ["Refund requests and results", "Idempotency keys"]]
        ],
        decision: ["One ticket, one ordered lane", "Messages for the same customer are processed in order so two agents never answer the same ticket twice"]
      },
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
      orch: ["Store orchestrator", "Sequences each order from intake to delivery", ["Claude Sonnet 5.5", "Temporal workflows"], "Reads order + inventory · Writes order status"],
      workers: [
        ["Order agent", "Validates orders and checks stock", ["Shopify API", "Postgres"], "Reads live stock · Writes validated order"],
        ["Creative agent", "Drafts product pages, images, and copy", ["Claude Sonnet 5.5", "Image generation API"], "Reads product brief · Writes draft assets to S3"],
        ["Service agent", "Answers customer questions", ["Claude Haiku 5.5", "Email API"], "Reads order status · Writes reply draft"]
      ],
      humans: [["Owner approves custom work", "Anything made to order, plus refunds and unusual requests, is reviewed before it ships"]],
      output: ["Order fulfilled and customer notified", "Order record updated"],
      stack: {
        entry: [["Order intake", ["Shopify webhooks", "Contact form"]]],
        tools: [["Store tools", ["Shopify API", "Inventory lookups"]], ["Creative tools", ["Image generation API", "Template renderer"]], ["Comms tools", ["Email API", "Shipping label API"]]],
        data: [["Catalog and orders", ["Product database", "Order history"]]],
        review: [["Owner approval", ["Email or Slack approve and reject", "Proof review page"]]],
        controls: [["Price and stock checks", ["Read live, never remembered"]]],
        lanes: [
          ["orders", ["Serial per order", "Webhook driven"]],
          ["creative", ["Low concurrency", "Image API limit"]],
          ["service", ["High concurrency", "Cheap model"]]
        ],
        records: [
          ["orders", ["order_id, status", "Optimistic version"]],
          ["assets", ["Generated images and copy", "S3 key + checksum"]],
          ["inventory snapshot", ["Read live at action time", "Never cached in prompts"]]
        ],
        decision: ["Inventory is read live, not remembered", "Stock and prices live in the system of record, so an agent never acts on a stale number"]
      },
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
      orch: ["Editorial orchestrator", "Plans the calendar and assigns each piece", ["Claude Sonnet 5.5", "Airtable or Notion"], "Reads calendar + brief · Writes piece plan"],
      workers: [
        ["Research agent", "Gathers sources and facts", ["Web search API", "Claude Haiku 5.5"], "Reads brief · Writes source list"],
        ["Drafting agent", "Writes the first version", ["Claude Sonnet 5.5", "Style guide in prompt"], "Reads sources + style guide · Writes draft"],
        ["Fact-check agent", "Verifies claims against sources", ["Claude Opus 5.5", "Source store"], "Reads draft + sources · Writes claim report"]
      ],
      humans: [["Editor approves before publishing", "A person signs off on facts, tone, and anything sponsored"]],
      output: ["Piece published and distributed", "Performance data fed back"],
      stack: {
        entry: [["Editorial calendar", ["Airtable or Notion", "Scheduler"]]],
        tools: [["Research tools", ["Web search API", "Source fetcher"]], ["Publishing tools", ["CMS API", "Newsletter platform"]], ["Analytics tools", ["Site analytics API"]]],
        data: [["Source library", ["Saved sources and quotes", "Style guide"]]],
        review: [["Editor review", ["Draft in CMS with comments", "Publish gate"]]],
        controls: [["Citation check", ["Every claim linked to a source"]]],
        lanes: [
          ["research", ["High concurrency", "Cheap model"]],
          ["drafting", ["Medium concurrency", "Per-piece ordering"]],
          ["fact-check", ["Low concurrency", "Strongest model"]]
        ],
        records: [
          ["pieces", ["piece_id, status, version", "Optimistic version"]],
          ["sources", ["URL, quote, retrieved_at", "Linked to claims"]],
          ["claims", ["Claim to source mapping", "Blocks publish if empty"]]
        ],
        decision: ["Claims are data, not prose", "Each claim is stored with its source, so the publish gate is a database check, not a judgment call by the model"]
      },
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
      match: /financ|account|bookkeep|invoice|\btax|expense|payroll|budget|invest|\blend|\bloan|year-end|year end|ledger|\bclose\b|closing/,
      trigger: "Close period opens (year-end, quarter-end, or month-end)",
      orch: ["Close orchestrator", "Runs the close calendar and tracks every checklist task", ["Claude Sonnet 5.5", "Temporal workflows"], "Reads close calendar + task states · Writes plan and dependencies"],
      workers: [
        ["Collection agent", "Pulls sub-ledger, billing, and bank data for the period", ["ERP API (NetSuite or SAP)", "Salesforce API"], "Reads source systems · Writes period snapshot"],
        ["Reconciliation agent", "Matches sales to payments and flags breaks", ["Python and SQL tools", "Claude Sonnet 5.5"], "Reads snapshot · Writes matches and exceptions"],
        ["Revenue review agent", "Checks cutoff, accruals, and unusual entries", ["Claude Opus 5.5", "Rules in code"], "Reads exceptions + policy · Writes proposed journal entries"],
        ["Reporting agent", "Builds the close package and variance notes", ["Python and SQL tools", "Claude Haiku 5.5"], "Reads locked figures · Writes report draft"]
      ],
      humans: [
        ["Controller approves journal entries", "Agents propose entries; a person posts them. Nothing hits the ledger without sign-off"],
        ["CFO signs off the close", "Final review of the package and any judgment calls before the period locks"]
      ],
      output: ["Period locked and close package issued", "Full audit trail stored"],
      stack: {
        entry: [["Close calendar", ["Scheduler", "ERP period status webhook"]]],
        tools: [["ERP tools", ["NetSuite or SAP API", "Read-only by default"]], ["CRM and billing tools", ["Salesforce API", "Billing export"]], ["Calculation tools", ["Python and SQL", "Deterministic totals"]]],
        data: [["Close workpapers", ["Reconciliation files", "Supporting schedules"]]],
        review: [["Close review console", ["Exception queue", "Journal entry approvals", "Period-lock sign-off"]]],
        controls: [["Period lock", ["Agents cannot write after lock", "Math in code, not the model"]]],
        lanes: [
          ["collect", ["Parallel by source", "Read-only"]],
          ["reconcile", ["Parallel by account", "Deterministic"]],
          ["review", ["Serial", "Strongest model"]],
          ["post", ["Human only", "Never an agent"]]
        ],
        records: [
          ["close checklist", ["Task, owner, due date, status", "Dependencies between tasks"]],
          ["period snapshot", ["Immutable, hashed", "What every agent read"]],
          ["proposed entries", ["Journal entries awaiting approval", "Approver id + timestamp"]],
          ["audit log", ["Append-only events", "Who, what, when, why"]]
        ],
        decision: ["Agents propose, humans post", "The ledger is the system of record. Agents work on an immutable snapshot and can only create proposals, so a bad run can never corrupt the books"]
      },
      driver: "Reconciling large transaction volumes, plus reprocessing after late entries",
      costs: [
        ["Controller and CFO review time", "Qualified review is required and is often the largest cost line during close"],
        ["ERP and integration upkeep", "ERP APIs and sync jobs change, and a broken sync creates silent errors"]
      ],
      watch: [
        ["Silent numeric errors", "Use code for arithmetic and totals; do not let the model do the math"],
        ["Late entries after snapshot", "Define how changes after the snapshot are handled, or reports will not tie out"],
        ["Financial data handling", "Limit what the model sees, log access, and check regulatory and audit duties"]
      ]
    },
    {
      match: /recruit|hiring|\bhr\b|talent|candidate|resume|\bjob|staffing/,
      trigger: "New role opening or candidate application",
      orch: ["Recruiting orchestrator", "Moves each candidate through the pipeline", ["Claude Sonnet 5.5", "Greenhouse or Lever API"], "Reads role + candidate stage · Writes pipeline status"],
      workers: [
        ["Sourcing agent", "Finds and summarizes candidates", ["Search APIs", "Claude Haiku 5.5"], "Reads role criteria · Writes candidate summaries"],
        ["Screening agent", "Compares applications to the role criteria", ["Claude Sonnet 5.5", "Structured scoring"], "Reads application + criteria · Writes score with reasons"],
        ["Scheduling agent", "Coordinates interviews", ["Google Calendar API", "Email API"], "Reads availability · Writes interview slots"]
      ],
      humans: [["Recruiter decides who advances", "People make every accept or reject decision and review the scoring criteria"]],
      output: ["Shortlist delivered and interviews booked", "Decision log retained"],
      stack: {
        entry: [["Application intake", ["ATS webhook", "Careers form"]]],
        tools: [["ATS tools", ["Greenhouse or Lever API"]], ["Sourcing tools", ["Search APIs"]], ["Scheduling tools", ["Calendar API", "Email API"]]],
        data: [["Candidate records", ["Encrypted store", "Retention timers"]]],
        review: [["Recruiter console", ["Shortlist review", "Decision log"]]],
        controls: [["Fairness checks", ["Outcome audits across groups", "No auto-reject"]]],
        lanes: [
          ["sourcing", ["Medium concurrency", "Search API limit"]],
          ["screening", ["High concurrency", "Structured output"]],
          ["scheduling", ["Serial per candidate", "Calendar API"]]
        ],
        records: [
          ["candidates", ["candidate_id, stage", "Encrypted, retention timer"]],
          ["scores", ["Score plus reasons", "Versioned criteria"]],
          ["decisions", ["Human decision and reason", "Append-only"]]
        ],
        decision: ["Scores are advice, decisions are human", "The state store records the person who made each decision, so the audit trail never shows an agent rejecting anyone"]
      },
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
      match: /software|saas|\bcode\b|developer|engineering|\bfeature|\bapi\b|platform|startup|website|\bapp\b|automation/,
      trigger: "Approved feature spec or bug report",
      orch: ["Engineering orchestrator", "Breaks the feature into tasks and tracks them to release", ["Claude Opus 5.5", "GitHub Issues"], "Reads spec + task states · Writes task graph"],
      workers: [
        ["Spec agent", "Turns the request into acceptance criteria and a task list", ["Claude Sonnet 5.5", "Code search tools"], "Reads issue + repo map · Writes acceptance criteria"],
        ["Coder agent", "Writes the change in an isolated copy of the repo", ["Git worktrees", "Docker sandbox"], "Reads task + criteria · Writes branch and diff"],
        ["Test agent", "Writes and runs tests against the change", ["CI runner", "Claude Haiku 5.5"], "Reads branch · Writes test results"],
        ["Review agent", "Checks the diff for bugs, style, and security issues", ["Claude Opus 5.5", "Security scanner"], "Reads diff + results · Writes review comments"]
      ],
      humans: [
        ["Engineer reviews the pull request", "A person approves every merge. Agents cannot merge their own work"],
        ["Release manager approves the rollout", "A person decides when the feature flag turns on and for whom"]
      ],
      output: ["Pull request merged and shipped behind a feature flag", "Change summary and test evidence logged"],
      stack: {
        entry: [["Issue intake", ["GitHub Issues webhook", "Chat command"]]],
        tools: [["Repo tools", ["Git and code search", "Branch and PR API"]], ["Build tools", ["CI runner", "Test framework"]], ["Release tools", ["Feature flag service", "Dependency and security scanners"]]],
        data: [["Repo copies", ["Git worktrees per agent", "Build artifacts"]]],
        review: [["Pull request review", ["Required human approval", "Protected main branch"]], ["Release approval", ["Flag rollout gate", "Rollback button"]]],
        controls: [["Merge protection", ["No agent can merge or deploy", "Feature flag for rollout"]]],
        lanes: [
          ["spec", ["Low concurrency", "Strongest model"]],
          ["code", ["One worktree per task", "Sandboxed"]],
          ["test", ["Parallel", "CI minutes budget"]],
          ["review", ["Per pull request", "Security scan"]]
        ],
        records: [
          ["task graph", ["Tasks and dependencies", "Optimistic version"]],
          ["branches", ["Branch, commit sha, diff ref", "Owned by one task"]],
          ["test runs", ["Results and logs in S3", "Linked to commit sha"]],
          ["approvals", ["Reviewer id + timestamp", "Required to merge"]]
        ],
        decision: ["One task, one worktree, one owner", "A leased task owns its branch exclusively, so two agents never edit the same files and a crashed agent's lease simply expires"]
      },
      driver: "Coder and test loops that re-run with growing context",
      costs: [
        ["CI minutes and sandboxes", "Every agent run consumes build and compute time on top of tokens"],
        ["Review burden", "Large generated diffs can take engineers longer to review than to write"]
      ],
      watch: [
        ["Security flaws", "Generated code needs scanning and review before it ships"],
        ["Agents editing the same files", "Give each agent its own copy of the repo"],
        ["Flaky tests", "A flaky test makes the test agent loop; cap retries and quarantine flaky tests"]
      ]
    }
  ],

  // Used when nothing above matches.
  generic: {
    trigger: "New customer request or scheduled job",
    orch: ["Lead orchestrator", "Plans the work and assigns tasks", ["Claude Sonnet 5.5", "Task queue (SQS)"], "Reads request + task states · Writes plan"],
    workers: [
      ["Research agent", "Gathers information and context", ["Web search API", "Claude Haiku 5.5"], "Reads request · Writes findings summary"],
      ["Execution agent", "Does the core work for the customer", ["Claude Sonnet 5.5", "Business APIs"], "Reads plan + findings · Writes result draft"],
      ["Review agent", "Checks quality before handoff", ["Claude Opus 5.5", "Checklist evals"], "Reads result · Writes quality report"]
    ],
    humans: [["Owner approves before delivery", "A person signs off on outputs that reach customers or move money"]],
    output: ["Result delivered to the customer", "Run logged for review"],
    stack: {
      entry: [["Request intake", ["Web form or email", "Scheduler"]]],
      tools: [["Business tools", ["Third-party APIs", "Internal systems via MCP"]], ["Research tools", ["Web search API"]]],
      data: [["Business records", ["Customer database"]]],
      review: [["Approval console", ["Email or Slack approvals"]]],
      controls: [],
      lanes: [
        ["research", ["High concurrency", "Cheap model"]],
        ["execution", ["Medium concurrency", "Business APIs"]],
        ["review", ["Low concurrency", "Strongest model"]]
      ],
      records: [
        ["runs", ["run_id, status, budget", "Optimistic version"]],
        ["task results", ["Small summaries", "Large files in S3"]],
        ["approvals", ["Approver id + timestamp", "Append-only"]]
      ],
      decision: ["Start with one lane per role", "Separate queues per role let you scale and cap each kind of work independently as the design grows"]
    },
    driver: "Context re-sent on every agent step across the whole team",
    costs: [["Third-party API fees", "Data, communication, and payment tools bill on their own meters"]],
    watch: [["Scope creep", "Start with one narrow workflow and add agents only where results improve"]]
  },

  // Added to every design.
  baseCosts: [
    ["Token spend grows with steps", "Each agent step re-sends its context. Prompt caching and per-task budgets keep it in check"],
    ["Human review time", "Reviewers cost real money, and slow approvals become the bottleneck"],
    ["Evals and upkeep", "Someone must build tests, tune prompts, and fix breakages when models or tools change"],
    ["Queue and state infrastructure", "Queue, database, locks, and monitoring all need setup, on-call ownership, and ongoing spend"]
  ],
  baseWatch: [
    ["Runaway loops", "Set step limits, retry caps, and a spend ceiling per run"],
    ["Cost per success, not per run", "Failed runs still cost money; track cost per accepted outcome"],
    ["Untrusted input", "Customer text, web pages, and files can hide instructions; agents should not act on them unchecked"],
    ["Duplicate side effects", "The queue delivers at least once, so retries can repeat emails or payments; make actions safe to repeat"],
    ["Stale or conflicting state", "Two agents writing the same record can overwrite each other; use versioned writes"]
  ],

  // Ideas touching these areas get an extra compliance checkpoint.
  regulated: /health|medical|clinic|patient|legal|\blaw\b|attorney|insurance|child|school|pharma/,

  // Technical layers shown in every design's "Technical architecture" view.
  baseStack: {
    entry: [["API gateway and auth", ["Cognito or Auth0", "Rate limits"]]],
    orchestration: [
      ["Workflow engine", ["Temporal or Step Functions", "Durable timers and retries"]]
    ],
    data: [
      ["Artifact storage", ["Object storage (S3)", "Large files by reference"]],
      ["Cache and locks", ["Redis", "Short-lived leases and rate limits"]]
    ],
    isolation: [["Sandboxes", ["Docker containers", "One per task, no shared files"]]],
    controls: [
      ["Guardrails", ["Tool allowlists", "Step and spend limits"]],
      ["Observability", ["OpenTelemetry tracing", "Cost per run"]],
      ["Secrets and access", ["Secrets manager", "Least-privilege keys"]],
      ["Evals", ["Test set per agent", "Rerun on model change"]]
    ]
  },
  regulatedControl: ["Compliance controls", ["Data retention rules", "Access logging"]],

  // Task queue, shown between the orchestrator and the workers in both views.
  baseQueue: {
    name: "Task queue",
    desc: "The orchestrator enqueues tasks; stateless workers pull them. A crashed worker's task reappears for another worker.",
    tech: ["SQS FIFO or Redis Streams", "At-least-once delivery"],
    props: [
      ["Visibility timeout", "Task is hidden while a worker holds it, and reappears if the worker dies"],
      ["Retries with backoff", "A few attempts with growing delays, then give up"],
      ["Dead-letter queue", "Tasks that keep failing park here for a person to triage"],
      ["Idempotency key", "run_id plus step, so a repeat does not repeat the side effect"]
    ]
  },

  // State store, shown as the system of record under every design.
  baseState: {
    name: "State store (system of record)",
    desc: "Agents hand off references and small summaries through the store, never long transcripts. Every change is also appended to an event log.",
    tech: ["Postgres", "Append-only event log", "Optimistic locking"],
    props: [
      ["Versioned writes", "An update succeeds only if the record is unchanged since it was read"],
      ["Event log", "Every state change is appended, so any run can be replayed and audited"],
      ["Artifacts by reference", "Large outputs live in S3; the store keeps the key and checksum"]
    ]
  },

  // Task lifecycle drawn in the technical view.
  lifecycle: ["queued", "leased", "running", "awaiting review", "done"],
  failurePath: ["retry with backoff", "dead-letter queue", "human triage"],
  taskRecord: ["task_id", "run_id", "step", "status", "attempt", "lease_expires_at", "idempotency_key", "input_ref", "output_ref", "version"],

  // Design decisions shown in every technical view, after the pattern's own.
  baseDecisions: [
    ["At-least-once delivery plus idempotency", "Exactly-once is not realistic across queues and third-party APIs, so every side-effecting step is safe to repeat"],
    ["State lives in the database, not in prompts", "Workers are stateless and replaceable, and a run can resume after a crash from the last committed state"],
    ["Leases and heartbeats instead of locks", "A worker holds a task for a limited time and renews it; if it stops, the task returns to the queue"],
    ["Humans gate irreversible actions", "Approvals are recorded as state, so a run can pause for days and resume without losing its place"]
  ],

  platform: ["Docker sandboxes", "OpenTelemetry tracing", "MCP tool servers"],

  // Optional agentic design patterns. The visitor ticks any of these under the
  // idea box and each one adds nodes, a flow strip, costs, watch-outs, a design
  // decision, and state records to both diagram views. Nothing here depends on
  // the business idea, so every pattern works with every scenario.
  //   flow:    steps shown as a strip
  //   nodes:   [kind, tag, name, description, tech chips, state line]
  //   records: [name, [line one, line two]] added to the state store's records
  //   costs, watch: [title, detail] pairs appended to the side panel
  //   decision: [title, detail] appended to key design decisions
  patterns: [
    {
      id: "tools",
      label: "Tool use / function calling",
      hint: "Agents call real systems through a controlled gateway",
      flow: ["Agent picks a tool", "Arguments checked against schema", "Permission check", "Call runs with a scoped token", "Result returned to the agent"],
      nodes: [
        ["sys", "Tool gateway", "Tool registry and gateway", "Each agent sees only the tools on its allowlist, and every call is validated against a schema before it runs", ["MCP tool servers", "JSON schemas"], "Reads allowlist + call arguments · Writes call log"],
        ["sys", "Credentials", "Scoped credential broker", "Short-lived tokens are issued per call through an auth provider, so the model never holds a raw secret", ["OAuth token exchange (Auth0)", "Secrets manager"], "Reads agent identity + scope · Writes token grant record"]
      ],
      records: [
        ["tool call log", ["Tool, argument hash, result ref", "Append-only, tied to run_id + step"]]
      ],
      costs: [
        ["Tool descriptions in every prompt", "Each tool's schema and description is sent to the model on every step, so a long tool list inflates token spend"],
        ["Integration upkeep", "APIs change versions and auth rules, so every connected tool needs an owner"]
      ],
      watch: [
        ["Over-permissioned tools", "Give each agent the narrowest allowlist; read-only by default, with writes behind an approval"],
        ["Plausible but wrong arguments", "The model can produce valid-looking values that are wrong; validate and bound them in code"]
      ],
      decision: ["Enforce tool rules in the gateway, not the prompt", "Schemas, allowlists, and rate limits run in code, so a confused or manipulated model cannot exceed its permissions"]
    },
    {
      id: "reflection",
      label: "Reflection",
      hint: "Agents critique and revise their own output before handoff",
      flow: ["Generate", "Critique against a checklist", "Should it continue?", "Revise", "Output"],
      nodes: [
        ["agent", "Reflection loop", "Critic agent", "Reviews a draft against a written checklist and returns specific fixes, not a vague score", ["Claude Opus 5.5", "Rubric stored in code"], "Reads draft + rubric · Writes critique and pass or fail"],
        ["sys", "Loop control", "Stop conditions", "The loop ends on a pass, on no meaningful change between rounds, or at a hard round cap, whichever comes first", ["Max 2 to 3 rounds", "Per-run token budget"], "Reads round count + critique · Writes continue or stop"]
      ],
      records: [
        ["critique rounds", ["Round, issues found, outcome", "Shows whether revisions helped"]]
      ],
      costs: [
        ["Extra model calls per output", "Every critique and revision round is another full call, so cost multiplies with the round cap"],
        ["Added latency", "Loops add time before anything reaches a person or a customer"]
      ],
      watch: [
        ["Self-agreement", "A model reviewing its own work can miss its own blind spots; use a different model or deterministic checks where possible"],
        ["Endless polishing", "Without a round cap, loops chase marginal gains and burn budget"]
      ],
      decision: ["Cap the loop and prefer critics that run code", "Tests, schema validation, and rule checks are more reliable than a second opinion from the model, and a hard round cap keeps spend predictable"]
    },
    {
      id: "plan",
      label: "Plan & execute",
      hint: "A planner writes the task list, then re-plans as results come in",
      flow: ["User request", "Planner generates tasks", "Single-task agent executes each task", "State updated with results", "Re-plan or respond"],
      nodes: [
        ["agent", "Planning", "Planner agent", "Turns the request into an ordered task list with dependencies and a success check for each task", ["Claude Opus 5.5", "Structured task schema"], "Reads request + context · Writes task list"],
        ["agent", "Planning", "Replanner agent", "After each task result, decides whether to continue, revise the remaining tasks, or respond to the user", ["Claude Sonnet 5.5", "Plan diff check"], "Reads task results + remaining plan · Writes updated plan"]
      ],
      records: [
        ["plan", ["Tasks, dependencies, status", "New version on every re-plan"]]
      ],
      costs: [
        ["Planning overhead", "Planner and replanner calls add cost to every run, including small requests that did not need a plan"],
        ["Re-planning loops", "A plan that keeps changing means more calls and more work thrown away"]
      ],
      watch: [
        ["Plans that drift", "Compare each revised plan with the original and require approval for large scope changes"],
        ["Over-planning simple work", "Route simple requests straight to a worker and plan only when tasks depend on each other"]
      ],
      decision: ["The plan is data, not prose", "Tasks are stored with status and dependencies, so a run can resume after a crash and a person can read or edit the plan before it executes"]
    },
    {
      id: "memory",
      label: "Memory & context management",
      hint: "A per-run scratchpad plus long-term memory kept out of the prompt",
      flow: ["Query", "Retrieve relevant memory", "Work with a small context", "Save task state", "Store lasting lessons after a checked outcome"],
      nodes: [
        ["sys", "Working memory", "Working memory (per run)", "A task scratchpad holding parameters, intermediate results, and next steps. Offloading here keeps prompts small and lets a run resume mid-task", ["Postgres JSON state", "Redis for short-lived data"], "Reads run state · Writes task context and intermediate results"],
        ["sys", "Long-term memory", "Long-term memory (across runs)", "Persistent knowledge retrieved selectively: past events and preferences (episodic), domain facts (semantic), and learned routines (procedural)", ["Vector index (pgvector)", "Memory table with owner and expiry"], "Reads query + scope · Writes lessons and preferences after a checked outcome"],
        ["sys", "Context manager", "Context manager", "Decides what goes into each prompt: retrieves what is relevant, summarizes older steps, and drops the rest", ["Rolling summaries", "Token budget per step"], "Reads working state + memory hits · Writes the assembled prompt context"]
      ],
      records: [
        ["working state", ["Per-run scratchpad", "Archived or cleared at run end"]],
        ["long-term memories", ["Type, content, source, expires_at", "Episodic, semantic, procedural"]]
      ],
      costs: [
        ["Memory store and retrieval", "Embeddings, index hosting, and retrieval calls add a new bill and a new system to run"],
        ["Memory curation", "Someone has to review, correct, and expire what the agents remember"]
      ],
      watch: [
        ["Wrong or stale memories", "Store the source and date with each memory, and let people correct or delete it"],
        ["Privacy of remembered data", "Personal details saved across runs need consent, retention limits, and access controls"],
        ["Memory poisoning", "Untrusted text saved as memory can steer future runs; write to long-term memory only through a checked step"]
      ],
      decision: ["Retrieve selectively, write deliberately", "Agents pull only what the current step needs and save only after a validated outcome, which keeps context small and stops bad data from becoming permanent"]
    }
  ]
};
