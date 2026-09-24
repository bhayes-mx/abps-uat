# Aji Bio-Pharma — Website UAT Tracker

A browser-based UAT tracker for **live.ajibio.com**. It runs on GitHub Pages and saves results to a Google Sheet. It replaces the one-tab-per-tester spreadsheet. Everyone uses one URL, and the dashboard totals update on their own.

## What's in this folder

| File | What it does | Edit it? |
|---|---|---|
| `index.html` | The tracker app | No |
| `support.js` | Runtime the app needs | No |
| `config.js` | Backend URL, site URL, deadline, testers, section assignments, test columns | **Yes** |
| `pages.csv` | The pages under test, one row each (built from the WordPress export) | **Yes** |
| `apps-script.gs` | Backend code you paste into Google Apps Script | Once |
| `assets/` | Fonts and logo | No |

## One-time setup (about 10 minutes)

### 1. Create the results sheet
1. Create a new Google Sheet, e.g. "Aji Website UAT Results".
2. Open **Extensions → Apps Script**.
3. Delete the starter code in `Code.gs` and paste in all of `apps-script.gs`. Save.
4. Pick **setup** from the function dropdown and click **Run**. Approve the permission prompt. This creates three tabs: **Results**, **Dev Updates** and **Content Updates**.
5. Click **Deploy → New deployment**. Pick the gear icon, then **Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
6. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.

> "Anyone" means anyone who has the URL can post results. The URL is long and unguessable, and it's only ever inside `config.js`. The Sheet itself stays private to you.

### 2. Configure the tracker
Open `config.js` and paste the URL into `appsScriptUrl`:

```js
appsScriptUrl: 'https://script.google.com/macros/s/AKfy…/exec',
```

### 3. Publish on GitHub Pages
1. Commit this whole folder to a repo, either at the root or in a subfolder.
2. Go to **Settings → Pages**. Set *Source* to **Deploy from a branch**, then pick `main` and `/ (root)`.
3. Share the Pages URL with testers.

Until `appsScriptUrl` is set, the tracker runs in **demo mode**: it works fully but saves results only in the current browser. A yellow banner shows when this is the case.

## How testers use it
1. Open the link and choose their name. The browser remembers it.
2. Go through **My Testing** page by page. Click a cell to cycle through **Pass → Fail → N/A → blank**. **Shift-click** any cell to mark every blank cell in that row Pass.
3. Any row with a Fail turns pink until a note is added: device, OS, browser, and the steps that led to the failure.
4. Log anything that needs fixing in **Dev Updates**. This means broken, not working as intended, or showing an error. Log changes to copy, assets, links or translations in **Content Updates**.

Every change saves as soon as it's made. If the connection drops, changes wait in the browser and send when it comes back. The header shows *Offline — N waiting* in the meantime.

## Everyday edits

**Add or remove a tester.** Edit the `testers` list in `config.js`.

**Split the work.** With 24 testers × 54 pages × 11 checks, everyone testing everything means about 14,000 cases. To give people only some sections, add them to `assignments`:
```js
assignments: {
  'Els Roeland':    ['Small Molecule', 'Company'],
  'Joris DeKeijser':['Small Molecule', 'News & Resources'],
},
```
Section names must match the **Section** column in `pages.csv` exactly. Anyone not listed gets every section. The dashboard counts each tester only against their assigned pages.

**Add a page.** Add a row to `pages.csv`. **ID** must be unique and must never change once testing starts, because results are stored against it. **Depth** (0–3) sets the indent under a parent page.

**Change the deadline.** Edit `deadline` in `config.js`.

**Add or rename a test column.** Edit `checks` in `config.js`. You can safely change a `label`. Don't change an `id` after testing starts, or the results saved under the old id will no longer show.

## About the page list
`pages.csv` was built from `aji-multisite.WordPress.2026-09-22.xml`:
- **48 published pages.** The draft, trashed and "Test" pages are excluded.
- **6 template rows**, one each for Press Release, News Article, Resource, Webinar, Event and Leadership Bio. Each points at one sample item. Testing the template covers the layout for all items of that type (85 posts, 26 news items, 48 resources, 11 webinars, 2 events, 5 leaders). Content accuracy on individual items belongs in **Content Updates**.

The export's URLs use `test.ajibio.com`. The tracker keeps the paths and opens them on whatever `siteUrl` is set to in `config.js`, currently `https://live.ajibio.com`.

## The Google Sheet
- **Results** has one row per tester × page × check, updated in place. A row with Check = `notes` holds that tester's note for the page.
- **Dev Updates** and **Content Updates** are the issue logs. Issue numbers are assigned automatically.

You can sort, filter or chart the Sheet as you like. Don't rename the tabs or reorder the columns, because the script finds data by position.

**If you change `apps-script.gs`:** go to **Deploy → Manage deployments**, click the pencil, set *Version* to **New version**, then **Deploy**. The URL stays the same.
