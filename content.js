/*
  =========================================================================
  YOUR CONTENT — this is the only file you need to touch to update the site.
  =========================================================================

  Everything on sashadesansky.com — your bio, jobs, education, projects —
  lives in this one file. There is no code to write. You are just
  editing text between quote marks.

  RULES OF THE ROAD (read this once):
    1. Keep every piece of text wrapped in "double quotes".
    2. Keep every comma between items in a list. The last item in a list
       (right before a closing bracket "]" or brace "}") does NOT get a
       comma after it.
    3. To add a new Project entry, copy an existing block
       (from the { to the matching }), paste it above or below, then edit
       the text inside. Don't forget the comma after the closing } if it's
       not the last one in the list.
    4. To remove something, delete its whole { ... } block, including the
       comma that follows it (or precedes it, if it was last).
    5. If the site stops loading after an edit, you likely deleted a comma,
       quote, or bracket by accident. Undo your last change and try again.
    6. Photos: drop image files into the /images/projects folder, then
       set "image" below to the filename, e.g. "my-project.jpg".
       If you leave "image" as "" (empty), a simple emoji icon is shown
       instead — totally fine to launch with.

  For a full walkthrough (including how to edit this on GitHub from your
  phone or browser, no software install needed), see CONTENT_GUIDE.md.
  =========================================================================
*/

window.SITE_CONTENT = {

  // ---- Masthead / global site info -------------------------------------
  site: {
    name: "Sasha Desansky",
    // Short line shown in the browser tab and search results.
    tagline: "Technology strategy, AI transformation, and a running log of what I'm building and exploring.",
    // Your email, split into two parts so it doesn't sit in the page's
    // source as a plain "name@domain.com" string (that's what most spam
    // bots scan static sites for). The site still joins these back
    // together to build a real, working "Email me" link — this just
    // keeps it out of plain sight in the source files. Edit each part
    // separately if your email ever changes.
    emailUser: "sashadesansky",
    emailDomain: "gmail.com",
    linkedin: "https://www.linkedin.com/in/aleksandradesansky/",
    location: "Washington, D.C.",
    // Initials shown in the round avatar mark if you don't add a photo.
    initials: "AD",
    // Optional: put a photo file in /images (e.g. "headshot.jpg") and set
    // it here to use a real photo instead of the initials mark. Leave ""
    // to keep the initials mark.
    photo: "headshot.jpg"
  },

  // ---- Hero (top of homepage) --------------------------------------------
  hero: {
    eyebrow: "Technology Strategy · AI Transformation · Trusted Advisor",
    headline: "Welcome to Sasha's project portfolio!",
    subhead: "Objective of this site is to explore AI's capabilities through hands-on projects, showcasing sample work and ideas along the way"
  },

  // ---- About ---------------------------------------------------------
  about: {
    heading: "A quick background...",
    paragraphs: [
      "Professionally, I'm a Principal-level technology and AI strategy consultant, advising C-suite executives on AI strategy, enterprise architecture, and organization design. I've led teams of 100+ people through large-scale technology transformation initiatives, including AI efforts, and I push my teams to break complex problems into manageable pieces and find where AI can give us meaningful time back. Having worked as a software engineer and now as a senior people leader, my sweet spot is the intersection of technology and how people actually use it to make the world better.",
      "Personally, I'm a curious person who loves a good challenge. Whether it's traveling to the other side of the world, using new gadgets to optimize my daily routine, or picking up a new way of thinking about a problem, I'm always exploring."
    ]
  },

  // ---- Experience ---------------------------------------------------------
  // Instead of listing every job here, this points visitors to LinkedIn.
  experience: {
    heading: "Experience",
    note: "For a detailed look at my professional experience as a technology leader, academic background as an engineer, professional certifications, and network, check out my LinkedIn profile",
    buttonLabel: "View LinkedIn Profile"
  },

  // ---- AI Project Portfolio / Playground ---------------------------------
  // Add a new block any time you try something worth showcasing. Newest
  // entries should go at the top of the list.
  projects: [
    {
      title: "Vacation Destination Explorer",
      date: "2026",
      tags: ["AI", "Live Data", "Travel"],
      description: "A dashboard for exploring a new vacation spot: top coffee shops, hidden-gem restaurants, dessert spots, a live 5-day forecast, local events, and fun facts. Defaults to Arlington, VA — type any destination to explore it instead.",
      embed: "dashboard/vacation-dashboard-embed.html",
      embedAutoHeight: true,
      link: "dashboard/vacation-dashboard.html",
      linkLabel: "Open Full Screen",
      emoji: "🧳",
      image: ""
    },
    {
      title: "Roxy's Churu Run",
      date: "2026",
      tags: ["Game", "Just for Fun"],
      description: "Mini-game created to test AI's capabilities in making custom classic arcade games starring my Maine Coon kitten, Roxy — collect churus, dodge computer cords, and reach the yarn ball across 3 levels. Playable right in your browser.",
      embed: "game/roxy-game-embed.html",
      link: "game/roxy-game.html",
      linkLabel: "Open Full Screen",
      emoji: "🐾",
      image: ""
    }
  ],

  // ---- Footer ---------------------------------------------------------
  footer: {
    note: "Built as a living portfolio — updated whenever something new is worth sharing."
  }

};
