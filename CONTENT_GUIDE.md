# How to update your website (no coding required)

Everything on your site — your bio, your jobs, your projects — lives in one
file: **`content.js`**. You never need to touch any other file to add or
change what shows up on the page.

There are two ways to edit it. Pick whichever feels easier.

## Option A — Edit directly on GitHub.com (easiest, works from your phone)

1. Go to your repository on github.com and open the file `content.js`.
2. Click the **pencil icon** (Edit this file) in the top right of the file view.
3. Make your change (see "Common edits" below).
4. Scroll to the bottom, add a short note like "Added Tokyo trip", and click
   **Commit changes**.
5. Wait about a minute — your live site at sashadesansky.com will update
   automatically.

## Option B — Edit on your computer

1. Open `content.js` in any plain text editor (TextEdit, Notepad, VS Code —
   anything that edits plain text, not Microsoft Word).
2. Make your change and save the file.
3. Upload the changed file back to GitHub (drag-and-drop on the repo page,
   or use "Add file → Upload files").

---

## Common edits

### Change your bio / tagline
Find the `about:` section near the top of `content.js` and edit the text
inside the quotes. Each paragraph is its own line, wrapped in quotes,
separated by commas.

### Add a new AI project
Find the `projects:` section (the main AI Project Portfolio / Playground on
the site) — or `funProjects:` if it belongs in the lighter "For Fun" section
instead (that's where Roxy's Churu Run and the Vacation Destination Explorer
live). Both use the exact same block format. Copy one whole block that looks
like this:

```js
{
  title: "Example project — replace me",
  date: "2026",
  tags: ["Tag one", "Tag two"],
  description: "A short couple of sentences about what you built and why it's interesting.",
  link: "",
  linkLabel: "View project",
  emoji: "✨",
  image: ""
},
```

Paste it at the **top** of the list (so newest shows first), then edit:
- `title` — the project name
- `date` — e.g. `"2026"` or `"March 2026"`
- `tags` — a few short labels in quotes, separated by commas
- `description` — one or two sentences
- `link` — a URL if there's somewhere to see it live (or leave as `""`)
- `linkLabel` — the button text, e.g. `"View demo"` (only matters if you set a link)
- `emoji` — any emoji to use as a placeholder icon (only shows if you don't add a photo)
- `image` — a filename like `"my-project.jpg"` if you've added a photo to
  `images/projects/` — otherwise leave as `""`

**Don't forget the comma `,` after the closing `}`** if it's not the last
project in the list.

### Add a photo
1. On GitHub, open the `images/projects` folder.
2. Click **Add file → Upload files** and drag your photo in.
3. Keep the filename simple — lowercase, no spaces (use dashes instead),
   e.g. `my-project.jpg`.
4. Back in `content.js`, set `image: "my-project.jpg"` on that entry.

### Add a headshot photo
Upload your photo directly into the `images/` folder (not a subfolder),
then in `content.js` find the `site:` section near the top and set:
```js
photo: "your-filename.jpg"
```

### Change the Experience section text
The Experience section on the site doesn't list individual jobs — it just
points visitors to your LinkedIn profile. Find the `experience:` section
in `content.js` and edit `heading`, `note`, or `buttonLabel` to change that
wording.

### Update your email or LinkedIn link
Find the `site:` section at the top of `content.js`. Your email is split
into two fields to keep it out of the page's source as a scrapeable
address — edit `emailUser` (the part before `@`) and `emailDomain` (the
part after) separately, e.g. `emailUser: "jane"` and
`emailDomain: "gmail.com"` for jane@gmail.com. Edit `linkedin` the same
way as any other field.

---

## If something breaks

The most common mistake is a missing comma, quote, or bracket. If the site
stops showing your content after an edit:
1. Go back to the file on GitHub and look at the "History" for that file
   (or your last commit).
2. Compare your change against the version before it — look for a missing
   `,` `"` `{` or `}` near your edit.
3. If you're stuck, you can always revert to the previous version of
   `content.js` from the file's history on GitHub and try again.

Nothing you do in `content.js` can break the site's design or layout —
you're only ever editing text and lists, never code logic.
