# Panther · Bang for the Buck

A single-page voting site for the Panther team. Each voter gets $100 to spend across the bets. Submissions land in a Google Sheet only you can see.

## What's here

- `index.html` — the whole site. React + Tailwind via CDN, no build step.
- `apps-script.gs` — the Google Apps Script that receives votes and writes them to a Sheet.

## Setup (one-time, ~10 minutes)

### 1. Create the Sheet + Apps Script backend

1. New Google Sheet. Rename the first tab to `Votes`.
2. Extensions → Apps Script.
3. Paste the contents of `apps-script.gs` into `Code.gs`. Save.
4. Deploy → **New deployment** → gear icon → **Web app**.
   - Description: `Panther vote intake`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click Deploy, authorize, and copy the **Web app URL**.

### 2. Wire the URL into index.html

Open `index.html`, find:

```js
const ENDPOINT = "REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL";
```

Paste the URL from step 1.5 between the quotes. Save.

### 3. Push to a new repo and turn on Pages

```bash
cd panther-vote
git init -b main
git add .
git commit -m "Panther vote site"
gh repo create govpilot/panther-vote --public --source=. --push
```

Then on GitHub:

- Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → Save.
- Wait ~1 minute. URL will be `https://govpilot.github.io/panther-vote/`.

Share that URL with the Panther team.

## Where the results live

In the Google Sheet. One row per voter, columns:

`submitted_at | voter | team | spent | num_picks | pick_ids | pick_names | note`

Sort by `pick_ids` or pivot in another tab to tally totals. There is no results page on the site — votes go straight to your Sheet.

## Editing the bets

Open `index.html`, edit the `BETS` array near the top. Commit and push, GitHub Pages redeploys in about a minute.

## If something goes wrong

- **"Voting endpoint isn't configured yet."** — `ENDPOINT` in `index.html` is still the placeholder. Paste the Apps Script URL.
- **Votes don't appear in the Sheet.** — Re-deploy the Apps Script as Web app, make sure access is "Anyone." Each redeploy gets a new URL; update `index.html` if so.
- **CORS errors in console** — Expected. The page uses `mode: "no-cors"` because Apps Script web apps don't return CORS headers. The Sheet is the source of truth; if the row is there, the vote landed.
