# GAS Classroom Manager

一套可直接部署為 Google Apps Script Web App 的班級學生管理系統。資料儲存在 Google Sheets，前端由 GAS `HtmlService` 提供，使用自建的 `users` + `sessions` 登入機制；不需要 Firebase、外部資料庫、Node.js 或 GitHub Pages。

本 repository 也是一個實驗：觀察 ChatGPT Work 在單次完整 Prompt 下，能完成多少需求分析、官方文件確認、全端實作、靜態驗證與專案整理工作。

## 官方文件確認（2026-08-13）

- Bootstrap：目前最新穩定版為 **5.3.8**；CSS 與 `bootstrap.bundle.min.js` 採官方 Quick Start 的 jsDelivr URL、SRI 與 `crossorigin` 寫法。[Bootstrap Versions](https://getbootstrap.com/docs/versions/) · [Bootstrap Quick Start](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- Bootstrap Icons：目前最新穩定版為 **1.13.1**；採官方提供的 jsDelivr icon-font stylesheet。[Bootstrap Icons](https://icons.getbootstrap.com/)
- Google Apps Script：實作依據包括 [Web Apps](https://developers.google.com/apps-script/guides/web)、[HTML Service](https://developers.google.com/apps-script/guides/html)、[google.script.run](https://developers.google.com/apps-script/guides/html/reference/run)、[PropertiesService](https://developers.google.com/apps-script/reference/properties/properties-service)、[Utilities](https://developers.google.com/apps-script/reference/utilities/utilities)、[LockService](https://developers.google.com/apps-script/reference/lock) 與 [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)。

主要做法：使用 Bootstrap 官方 Navbar／Offcanvas／Modal／Toast／Accordion 與 Color Modes；GAS 前後端透過非同步 `google.script.run`；敏感設定只放 Script Properties；重要 Sheet 寫入使用 Script Lock。

## Repository 結構

```text
prompts/
  gas-classroom-manager.prompt.md   # 本次實驗的完整原始 Prompt

app/
  Setup.gs                          # setupSystem() 與初始化 helper
  Config.gs                         # Schema、角色、狀態、預設設定
  Database.gs                       # Sheet Repository 與 Header Map
  Auth.gs                           # 登入、Session、密碼
  Permissions.gs                    # 伺服器端角色／班級授權
  Students.gs                       # 學生與個人紀錄
  Classes.gs                        # 班級
  Scores.gs                         # 加減分原因與紀錄
  Attendance.gs                     # 每日點名與 Upsert
  Users.gs                          # 使用者管理
  Settings.gs                       # 系統設定
  Audit.gs                          # 稽核紀錄
  Dashboard.gs                      # 首頁統計
  Utils.gs                          # 驗證、安全與共用 helper
  Code.gs                           # doGet() 與 HTML include
  Index.html                        # HtmlService 入口
  Components.html                   # 共用 HTML template
  Styles.html                       # 少量品牌與行動版 CSS
  Scripts.html                      # SPA 狀態、Renderer 與 UI 事件
  appsscript.json                   # V8、時區與 Web App manifest

ACCEPTANCE.md                       # 靜態／實機驗收清單
AGENT_TESTING.example.md            # Agent 使用者端全功能實測流程與進度範本
.env.example                       # Agent 遠端操作目標的本機設定範例
README.md
```

## 功能

- Idempotent `setupSystem()`：初始化時自動識別綁定的試算表副本並保存 `SPREADSHEET_ID`；Web App 執行時以該 ID 開啟資料庫，並補齊 9 張 Sheet、Header、格式、設定與首次管理員。
- 獨立 salt + SHA-256 + Script Property pepper 的密碼雜湊。
- 24 小時預設 Session、活動時間更新、過期／停用失效、登出。
- 管理員、導師、任課教師、行政的後端權限與班級範圍控制。
- 學生、班級、使用者、加減分規則、加減分、每日點名、設定、Audit Log。
- 「日期 + 學生 ID」點名 Upsert、一鍵全班出席、Soft Delete。
- Dashboard 與學生個人加減分／出缺席歷史。
- Bootstrap Mobile First UI、手機點名卡片、手機資料卡、Audit Accordion。
- 自動／手機／電腦顯示模式，與自動／亮色／深色主題；偏好保存在 `localStorage`。

## 第一次安裝

先從範本試算表建立自己的副本，是最快且最不容易漏掉資料表結構的安裝方式。

### 只使用系統

只需要使用班級管理功能時，不需要 clone repository，也不需要 `.env`、Node.js 或 `clasp`。

1. 開啟[班級管理系統範本試算表](https://docs.google.com/spreadsheets/d/1MXMO_kBrVIkUWxEUE7ZrLiCgRx0ifMeZ-NIlDfgAN3A/edit?gid=0#gid=0)。
2. 選擇 `檔案 → 建立副本`，後續只操作自己的副本，不要直接修改共用範本。
3. 在副本選擇 `擴充功能 → Apps Script`，開啟隨副本建立的 Apps Script 專案。
4. 如需自訂首次管理員，先依下一節設定 `INITIAL_ADMIN_USERNAME`、`INITIAL_ADMIN_PASSWORD` 與 `INITIAL_ADMIN_NAME`。
5. 在 Apps Script 編輯器選擇 `setupSystem()` 並執行，完成 Google 授權。系統會自動識別目前綁定的副本並保存其 `SPREADSHEET_ID`。
6. 確認執行結果的 `spreadsheetId` 與副本網址中的 ID 相同，並記下首次回傳的 `adminUsername` 與 `temporaryPassword`。
7. 依「部署 Web App」一節完成部署。

`setupSystem()` 可安全重跑；它會補齊缺少的 Sheet、Header 與設定，不會清除既有資料或重複建立管理員。

### 開發或維護新功能

只有需要修改 `app/` 原始碼、使用 Agent 操作遠端專案或以 `clasp` 同步程式時，才需要以下本機設定：

1. Clone 此 repository，執行 `nvm use` 使用 Node 20。
2. 執行 `cp .env.example .env`，將自己的副本 ID 填入 `SPREADSHEET_ID`。
3. 從副本的 Apps Script 專案設定取得 Script ID，填入 `.env` 的 `APPS_SCRIPT_ID`。
4. 建立或更新本機 `.clasp.json`：`scriptId` 必須與 `.env` 的 `APPS_SCRIPT_ID` 完全相同，`rootDir` 必須是 `app`。`.env` 與 `.clasp.json` 都不可提交。
5. 執行 `clasp show-authorized-user` 確認 Google 帳號，再以 `clasp show-file-status` 預覽同步範圍。
6. 確認目標無誤後才執行 `clasp push`。Agent 只能操作 `.env` 明列的 ID；README 的範本連結本身不構成遠端操作授權。

## 自訂首次管理員

請在**第一次**執行 `setupSystem()` 前，前往：

`Apps Script → Project Settings → Script Properties`

新增：

```text
INITIAL_ADMIN_USERNAME
INITIAL_ADMIN_PASSWORD
INITIAL_ADMIN_NAME
```

密碼至少 8 個字元。若不設定，系統建立帳號 `admin`、姓名「系統管理員」，並只在首次初始化結果中回傳一次隨機臨時密碼；明文不寫入 Sheet 或 Script Properties。

## 部署 Web App

1. `Deploy → New deployment`。
2. 類型選 `Web app`。
3. `Execute as` 選 `Me / 部署者`。
4. 存取範圍選擇組織政策允許、且實際使用者可開啟的範圍。
5. 部署後開啟 `/exec` URL，即顯示系統登入畫面。

若組織政策不允許匿名 Web App，請在部署 UI 使用組織允許的範圍；應用程式內部身分仍由 `users` + `sessions` 驗證。

## 驗證

靜態語法、前後端函式引用、Sheet schema、敏感字串掃描與 UI selector 檢查記錄於 [ACCEPTANCE.md](ACCEPTANCE.md)。需 Google 授權或實際部署的項目會保持未勾選，待在 GAS 環境完成實機驗收。
