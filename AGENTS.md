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

## Coding Style & Naming Conventions

Use two-space indentation in `.gs` files and preserve the compact style already used in `Scripts.html`. Prefer `var` and ES5-compatible server patterns where existing GAS code does; browser code may use modern JavaScript supported by the current frontend. Public GAS functions use `camelCase`; internal helpers end with `_`, such as `requireSession_`. Constants use uppercase names. Keep Sheet headers and user-facing copy in Traditional Chinese. Add behavior to the existing responsibility-based module instead of creating broad utility abstractions.

## Testing Guidelines

There is no automated framework or coverage threshold. Update and follow `ACCEPTANCE.md`. At minimum, validate the manifest, inspect clasp’s push set, and confirm Apps Script parses all uploaded files. Changes involving data writes must exercise idempotency, authorization, soft deletion, and Script Lock behavior. UI changes require desktop and 360–390 px mobile checks, including light/dark themes and keyboard accessibility.

## Commit & Pull Request Guidelines

History uses short imperative subjects, for example `Implement GAS classroom manager`. Keep commits focused and describe the affected behavior. Pull requests should summarize changed modules, list local and GAS verification, call out schema or permission changes, and include screenshots for visible UI work. Never commit OAuth tokens, passwords, `.env` files, or Script Properties; `.clasp.json` and `.clasprc.json` remain local and ignored.
