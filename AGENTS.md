# Repository Guidelines

## Project Structure & Module Organization

`app/` is the deployable Google Apps Script source. Server modules are split by responsibility (`Auth.gs`, `Students.gs`, `Attendance.gs`, and similar); `Code.gs` provides `doGet()` and template includes. The UI is assembled from `Index.html`, `Components.html`, `Styles.html`, and `Scripts.html`. `app/appsscript.json` defines the V8 runtime, timezone, and web-app settings. `prompts/` preserves the original project specification. Use `README.md` for setup and deployment instructions and `ACCEPTANCE.md` for verified and pending checks. There is currently no separate test or asset directory.

## Build, Test, and Development Commands

This project has no compilation step. Use Node 20 for clasp tooling:

```sh
nvm use                         # select the version in .nvmrc
clasp show-authorized-user      # verify the active Google account
clasp show-file-status          # preview files under app/
clasp push                      # upload local source to Apps Script
clasp open-script               # open the linked remote project
jq empty app/appsscript.json    # validate the manifest JSON
git diff --check                # detect whitespace errors
```

Treat `clasp pull` as destructive to local source: commit or inspect the working tree first.

## Remote Target Safety

The spreadsheet linked in `README.md` is a distribution template for a human to copy. That README link alone is never authorization to open, inspect, edit, or otherwise operate the spreadsheet through an automated browser, Google Sheets connector, `clasp`, or Apps Script API. An Agent may operate it only when the exact target is also explicitly present in the local `.env`.

`.env` is the only source of authorization for remote Google targets. `.env.example` defines the fields but does not authorize any target. Before remote operations:

- For browser or connector access to Sheets, require a non-empty `SPREADSHEET_ID` in `.env` and operate only that spreadsheet. When a URL is needed, derive it as `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.
- For any `clasp` command that contacts Google, require non-empty `APPS_SCRIPT_ID` in `.env` and verify that it exactly matches `scriptId` in the local ignored `.clasp.json`.
- For browser access to Apps Script, require a non-empty `APPS_SCRIPT_ID` in `.env` and derive the URL as `https://script.google.com/home/projects/<APPS_SCRIPT_ID>/edit`.
- If `.env` is missing, a required value is empty, or any ID does not match, stop and ask the user to identify their own copied spreadsheet or Apps Script project. Do not infer a target from README, Git history, prompts, or other files.

Never commit `.env`, `.clasp.json`, `.clasprc.json`, credentials, deployment URLs, or Script Properties. Keep `.env.example` empty of real IDs.

## Agent-operated Test Ledger

`AGENT_TESTING.md` is the required local source of truth for user-facing browser, Google Sheets, Apps Script initialization, deployment, and Web App testing. It intentionally excludes source development, Git, Node.js, and `clasp` synchronization checks. It is ignored by Git because it may contain target IDs, deployment URLs, test account references, progress, and evidence. `AGENT_TESTING.example.md` is the committed workflow template.

- Before the first operation after a spreadsheet copy exists, create `AGENT_TESTING.md` from the example if it is missing, then fill its run metadata from the authorized local environment.
- Before every Agent-operated remote or browser action, read `AGENT_TESTING.md`, resume from its first relevant unchecked item, and review unresolved blockers.
- Immediately after every attempted action, update the matching checkbox, current progress, timestamp, operation log, and any blocker or defect. Record failed attempts as well as successful ones; do not rely on conversation history as the test record.
- Mark `[x]` only after observing the expected result in the real interface or remote system. Keep blocked or failed items unchecked and attach evidence or reproduction details.
- When product behavior or test scope changes, update `AGENT_TESTING.example.md` and merge the same checklist change into the local ledger without resetting completed progress.
- At the end of a run, synchronize evidence-backed results to `ACCEPTANCE.md`, update the ledger's final summary, and leave an explicit next step.

The ledger does not broaden authorization. Continue to follow `.env` target restrictions and obtain user authority for deployment, writes, destructive cleanup, account changes, or other external mutations.

## Coding Style & Naming Conventions

Use two-space indentation in `.gs` files and preserve the compact style already used in `Scripts.html`. Prefer `var` and ES5-compatible server patterns where existing GAS code does; browser code may use modern JavaScript supported by the current frontend. Public GAS functions use `camelCase`; internal helpers end with `_`, such as `requireSession_`. Constants use uppercase names. Keep Sheet headers and user-facing copy in Traditional Chinese. Add behavior to the existing responsibility-based module instead of creating broad utility abstractions.

## Testing Guidelines

There is no automated framework or coverage threshold. Update and follow `ACCEPTANCE.md`. At minimum, validate the manifest, inspect clasp’s push set, and confirm Apps Script parses all uploaded files. Changes involving data writes must exercise idempotency, authorization, soft deletion, and Script Lock behavior. UI changes require desktop and 360–390 px mobile checks, including light/dark themes and keyboard accessibility.

## Commit & Pull Request Guidelines

History uses short imperative subjects, for example `Implement GAS classroom manager`. Keep commits focused and describe the affected behavior. Pull requests should summarize changed modules, list local and GAS verification, call out schema or permission changes, and include screenshots for visible UI work. Never commit OAuth tokens, passwords, `.env` files, or Script Properties; `.clasp.json` and `.clasprc.json` remain local and ignored.
