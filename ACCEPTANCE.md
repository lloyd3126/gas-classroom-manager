# 驗收清單

驗收日期：2026-08-14

標記說明：

- `[x]` 已由原始碼／靜態檢查確認。
- `[ ]` 必須在實際 Google Apps Script、Google Sheets 或已部署 Web App 中人工驗證；未把未執行的雲端測試誤標成通過。

## A. 官方版本與依賴

- [x] Bootstrap 使用 2026-08-13 官方最新穩定版 5.3.8。
- [x] Bootstrap CSS 與 Bundle 使用官方 Quick Start URL、SRI、`crossorigin`。
- [x] Bootstrap JavaScript Bundle 只載入一次。
- [x] Bootstrap Icons 使用官方目前版本 1.13.1 與官方 CDN 寫法。
- [x] 沒有 jQuery、React、Vue、Angular、Node runtime、Firebase、DataTables 或第二套 UI framework。
- [x] 核心為 GAS + Sheets + HtmlService + `google.script.run`。
- [ ] 在實際 GAS HtmlService 確認組織網路可載入 jsDelivr。

## B. 初始化與 Sheet

- [x] 存在完整 `setupSystem()`。
- [x] 缺少 `PASSWORD_PEPPER`、`SESSION_SECRET` 時自動產生至 Script Properties。
- [x] 從綁定試算表執行時，`setupSystem()` 使用 `getActiveSpreadsheet()` 取得副本並保存其 `SPREADSHEET_ID`。
- [x] 無 Active Spreadsheet 時，可使用既有 `SPREADSHEET_ID` 以 `openById()` 開啟資料庫。
- [x] Active Spreadsheet 與 `SPREADSHEET_ID` 都不存在時會明確失敗，不會意外建立另一份試算表。
- [x] Schema 定義包含 9 張必要 Sheet 與指定 Header。
- [x] 初始化只補缺少的 Sheet、Header、設定與管理員，不清除既有資料。
- [x] Header freeze、加粗、背景、Filter、欄寬與基本日期／時間／Boolean 格式存在。
- [x] 所有 Repository 寫入透過 Header Map，不以散落固定欄號處理業務欄位。
- [x] ID 使用 UUID 與 STU／USR／CLS／RSN／SCR／ATT／LOG prefix。
- [x] 完成後寫入 `SYSTEM_INITIALIZED=true`。
- [ ] 從範本試算表副本的綁定 GAS 專案第一次執行 `setupSystem()` 成功，且回傳副本 ID。
- [ ] 第二次執行確認無重複 Sheet、管理員、設定且原資料保留。
- [ ] 實際檢視 9 張 Sheet 的格式與 Filter。

## C. 認證與安全

- [x] `login`、`logout`、`getCurrentUser`、`changePassword` 全部存在。
- [x] 密碼採獨立 salt + SHA-256 + Script Property pepper，Sheet 僅存 `salt$hash`。
- [x] Session Token 包含隨機 nonce 與 HMAC-SHA256 signature，並只以完整 Token 查找 Session。
- [x] Session 到期、停用狀態與使用者停用均於伺服器驗證。
- [x] 每次受保護呼叫更新最後活動時間。
- [x] 管理員停用帳號或重設密碼時，既有 Session 失效。
- [x] Secrets 不存在 `.gs` 常數、HTML、settings 預設資料。
- [x] 前端 Session 過期共用處理會清除 Token 並回登入畫面。
- [ ] 首次管理員以回傳的臨時密碼登入成功。
- [ ] 24 小時或自訂 TTL 到期後實際確認 Session 失效。
- [ ] 修改密碼、重設密碼、停用帳號後重新登入流程實測。

## D. 角色與權限

- [x] 角色包含管理員、導師、任課教師、行政。
- [x] 所有公開業務函式先以 Token 取得真正使用者。
- [x] 管理員可存取所有班級與管理模組。
- [x] 導師只管理授權班級學生、點名與加減分。
- [x] 任課教師只查看授權班級並登錄加減分。
- [x] 行政可查看全部學生／班級並管理 Attendance，但不能管理分數與系統設定。
- [x] 前端依角色隱藏不適用選單；後端另有獨立權限檢查。
- [ ] 以四種角色帳號逐項進行越權呼叫與 UI 實測。

## E. 資料與功能

- [x] Students API：查詢、單筆、新增、修改、啟停用。
- [x] Classes API：查詢、新增、修改、啟停用。
- [x] Score Reasons API：查詢、新增、修改、啟停用。
- [x] Scores API：查詢、新增、修改、Soft Delete。
- [x] Attendance API：查詢、每日名單、批次儲存、全班出席、Soft Delete。
- [x] Users API：查詢、新增、修改、啟停用、重設密碼。
- [x] Settings 與 Audit Log API 完整。
- [x] 學號、帳號唯一檢查；班級／學生／使用者／原因存在檢查。
- [x] 分數、日期、時間、角色、出席狀態、假別均有後端驗證。
- [x] 非請假狀態強制清空假別。
- [x] Attendance 在 Script Lock 內以日期 + 學生 ID Upsert。
- [x] Dashboard 包含學生、出席、遲到、早退、缺席、請假、加分、扣分。
- [x] 學生詳細資料包含分數統計、加減分歷史與出缺席歷史。
- [x] 重要 CREATE／UPDATE／DELETE／LOGIN／LOGOUT／PASSWORD_CHANGE 寫入 Audit Log。
- [ ] 在 Sheet 中以實際資料完成所有 CRUD 與 Soft Delete 測試。
- [ ] 兩個瀏覽器同時點名／加分，確認 Lock 與 Attendance 唯一性。

## F. Bootstrap、Responsive 與 UX

- [x] Navbar、Offcanvas、Modal、Toast、Accordion、Button、Form、Badge／狀態標籤以 Bootstrap 為基礎。
- [x] 危險操作使用共用 Bootstrap 確認 Modal，不使用原生 `confirm()`。
- [x] Loading 由共用 `google.script.run` Promise wrapper 控制。
- [x] Empty State 有共用圖示與文字樣式。
- [x] 手機主選單使用 Bootstrap Offcanvas。
- [x] 今日點名使用學生 Card、五種快速狀態按鈕、請假才展開假別、全班出席。
- [x] 學生管理在桌面為 Table、手機為 Card。
- [x] 學生歷史在桌面為 Table、手機為 Card。
- [x] Audit Log 在桌面為 Table、手機為 Accordion，JSON 不直接鋪滿主畫面。
- [x] 自動／手機／電腦顯示模式與自動／亮色／深色主題均保存於 `localStorage`。
- [x] 深色模式使用 Bootstrap `data-bs-theme`。
- [x] Icon-only 控制有 `aria-label` 或可視輔助文字，裝飾 icon 有 `aria-hidden`。
- [x] 包含 `prefers-reduced-motion` 處理。
- [ ] 在 360、375、390 px 實機／DevTools 操作所有頁面。
- [ ] 平板與桌面操作所有頁面。
- [ ] 測試強制手機／強制電腦模式與偏好重載保留。
- [ ] 測試亮色／深色／系統自動主題。
- [ ] 鍵盤操作、Focus、螢幕閱讀器名稱與 Contrast 人工檢查。

## G. 靜態完整性

- [x] 15 個 `.gs` 檔案可由 JavaScript parser 解析。
- [x] 前端 `Scripts.html` 可由 JavaScript parser 解析。
- [x] 每個前端 `gasCall('functionName')` 均有同名 server function。
- [x] `include('Styles')`、`include('Components')`、`include('Scripts')` 均有對應 HTML 檔案。
- [x] `appsscript.json` 為有效 JSON，時區為 Asia/Taipei、runtime 為 V8。
- [x] 原始碼無 TODO、`其餘同理`、`自行完成` 或省略函式。
- [ ] 使用 `clasp push` 或手動建立檔案後，在 Apps Script 編輯器確認所有檔案無解析錯誤。

## H. 部署

- [x] `doGet()` 使用 HtmlTemplate、include 與 viewport meta 回傳首頁。
- [x] README 包含首次安裝、Script Properties 與 Web App 部署步驟。
- [ ] `Deploy → New deployment → Web app` 完成部署。
- [ ] 以 `/exec` URL 確認登入畫面、登入、導覽與登出。
- [ ] 依實際 Workspace／組織政策確認 Web App 存取範圍。
