# Link Up Aspiring Leaders Roleplay

A static, no AI leadership roleplay experience for **Aspiring Leaders Link Up Session 2**.

## What is included

* Link Up branded registration screen
* Name, address and location collection
* Session 2 scenario: **The Strong Performer**
* Two stage branching leadership conversation
* Scripted Alex responses
* Principle, People Impact and Process reflection
* Google Apps Script response collection
* Mobile responsive layout
* No AI API required
* Ready for GitHub Pages

## GitHub files

Upload these files to the root of your GitHub repository:

```text
index.html
styles.css
app.js
```

The `apps-script/Code.gs` file is included only as a backup/reference copy of the Google Apps Script collector.

## Your Apps Script URL

The current site is already configured to use:

```text
https://script.google.com/a/macros/linkupbpo.com/s/AKfycbwB9_zRq3XNwAlparwPH6kdKlhZyMXHAXoSXMx5Vg3geb0AAvijWDynyL06fQBbGWM/exec
```

If you redeploy Apps Script and receive a new URL, update the `APPS_SCRIPT_URL` constant at the very top of `app.js`.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, and `app.js` to the root.
3. Open the repository **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your main branch and the root `/` folder.
7. Save.
8. GitHub will provide the public site URL.

## Response flow

The site sends data to Apps Script at these moments:

1. Participant registration
2. After Part 1
3. After Part 2
4. When the final reflection is saved or the participant finishes

The same `sessionId` is used so Apps Script can update one row instead of creating a new row for each stage.

## Important note about Workspace access

Your Apps Script URL uses the `linkupbpo.com` Google Workspace domain. If the deployment is restricted to your Workspace, participants may be required to sign into a Link Up Google account before Apps Script accepts the request.

Test the published GitHub site in an incognito/private browser window before using it in the live session.

## Edit the roleplay

Open `app.js`.

The scripted Alex responses are in:

```javascript
const firstReplies = { ... };
const secondReplies = { ... };
```

The reflection text is in:

```javascript
const reflectionContent = { ... };
const processContent = { ... };
const reflectionQuestions = { ... };
```

You can edit these without changing the page layout.

## Edit the scenario text

Open `index.html` and search for:

```text
The Strong Performer
```

You can update the participant-facing scenario content there.

## Branding

The design uses Link Up inspired navy and teal styling and a simple CSS based logo mark. It does not depend on any external image asset.

The font is loaded from Google Fonts. If your organization blocks Google Fonts, the site will automatically fall back to system fonts.
