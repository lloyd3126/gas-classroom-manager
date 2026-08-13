# GAS 班級管理系統完整開發 Agent Prompt

你是一位資深 **Google Apps Script 全端工程師、Bootstrap 前端工程師與系統架構師**。

請直接完成一套可以正式長期使用的：

**班級學生管理系統**

最終目標是：

```text
建立範本 Google 試算表副本
→ 從副本開啟綁定的 Google Apps Script 專案
→ 第一次執行 setupSystem()
→ 完成授權
→ Deploy as Web App
→ 開啟 /exec
→ 直接登入使用
```

不要只提供：

* 架構
* 教學
* 範例
* Prototype
* 偽代碼
* 部分函式
* TODO

我要的是：

**完整、可執行、彼此相容、可以直接部署的正式版本。**

---

# 0. 開始寫程式前，強制查詢最新官方文件

這是本任務的強制要求。

在產生任何正式程式碼之前，你必須先使用網路搜尋並閱讀**最新官方文件**。

禁止只依賴模型記憶中的版本或 API。

至少查詢：

## Bootstrap 官方

只優先採用：

```text
getbootstrap.com
```

確認：

* Bootstrap 目前最新「穩定版」
* Getting Started
* CDN 官方建議載入方式
* CSS
* JavaScript Bundle
* Grid
* Breakpoints
* Containers
* Responsive utilities
* Display utilities
* Navbar
* Offcanvas
* Cards
* Buttons
* Button groups
* Dropdowns
* Forms
* Input groups
* Modal
* Toast
* Alerts
* Badges
* Accordion
* List group
* Pagination
* Spinners
* Placeholders
* Color modes
* Accessibility
* Utilities

不要使用 Alpha、Beta、RC 或預發布版本，除非 Bootstrap 官方已經將其定義為最新正式穩定版本。

---

## Bootstrap Icons 官方

只優先採用：

```text
icons.getbootstrap.com
```

確認：

* Bootstrap Icons 最新穩定版
* 官方 CDN / web font 使用方式
* Icon class 名稱
* Accessibility 建議

不要猜 Icon 名稱。

使用任何 Bootstrap Icon 前，如有疑問，請查官方 Icons 文件。

---

## Google Apps Script 官方

只優先採用：

```text
developers.google.com/apps-script
```

至少確認：

* Web Apps
* HtmlService
* HTML Service restrictions
* HTML Service best practices
* google.script.run
* PropertiesService
* SpreadsheetApp
* Utilities
* LockService
* CacheService（如果採用）
* Session / Web App 執行限制
* Apps Script Quotas
* appsscript.json
* Deployment

特別確認：

```text
PropertiesService
Utilities.computeDigest / HMAC
google.script.run
HtmlService
LockService
SpreadsheetApp
```

目前官方 API 是否有任何更新。

---

# 1. 官方文件研究結果必須先列出

正式輸出答案時，在程式碼之前先給：

```text
【官方文件確認】

Bootstrap：
版本：
官方來源：

Bootstrap Icons：
版本：
官方來源：

Google Apps Script：
本次查閱的主要官方文件：
- ...
- ...
```

並簡短說明：

```text
本實作採用哪些最新官方做法
```

不要大量引用文件內容。

重點是證明你真的有重新確認目前最新官方文件。

---

# 2. 技術架構

整個系統使用：

```text
Google Apps Script
Google Sheets
GAS HtmlService
HTML
CSS
JavaScript
Bootstrap
Bootstrap Icons
```

不要使用：

```text
React
Vue
Angular
Node.js
npm
Firebase
外部資料庫
GitHub Pages
Google Login
OAuth Login
```

網站直接由：

```javascript
doGet()
```

配合：

```javascript
HtmlService
```

部署為 GAS Web App。

前端與 GAS Server Functions 之間主要使用：

```javascript
google.script.run
```

不要為自己的 GAS 前後端另外建立 fetch REST API。

---

# 3. Bootstrap 必須使用最新穩定版

前端必須使用你在開始實作時查到的：

**最新 Bootstrap 穩定版**

以及：

**最新 Bootstrap Icons 穩定版**

版本不可憑模型記憶硬寫。

必須依當下官方文件決定。

使用 Bootstrap 官方目前建議的 HTTPS CDN 方式。

如果官方文件目前建議：

* integrity
* crossorigin
* bootstrap.bundle
* 其他安全或載入屬性

請依官方最新方式實作。

Bootstrap JavaScript 請使用官方適合本系統的 Bundle 方式，避免自己重新實作 Bootstrap 已經提供的互動元件。

---

# 4. Bootstrap First：禁止沒必要的手刻 UI

這是前端最重要原則之一。

如果 Bootstrap 已經有成熟元件，必須優先使用 Bootstrap。

例如：

```text
Button
Button Group
Navbar
Offcanvas
Dropdown
Card
List Group
Accordion
Modal
Toast
Alert
Badge
Spinner
Placeholder
Form Control
Input Group
Nav
Tabs
Pagination
Breadcrumb
Collapse
```

不要自己重新手刻一套：

```text
自製 Modal
自製 Toast
自製 Dropdown
自製 Accordion
自製 Drawer
自製 Button system
自製 Grid system
自製 Form system
```

除非 Bootstrap 官方元件真的無法滿足需求。

如果必須寫 Custom CSS：

只能處理：

* 品牌視覺
* 少量尺寸
* 特定 Layout
* 手機操作最佳化
* Bootstrap 未提供的必要狀態

不要重新建立一套和 Bootstrap 重複的 CSS Framework。

---

# 5. Bootstrap Icons 優先

所有常見 UI Icon 優先使用：

**Bootstrap Icons**

例如：

```text
Dashboard
學生
班級
點名
加分
扣分
設定
使用者
登入
登出
編輯
刪除
搜尋
篩選
新增
儲存
重新整理
返回
選單
資訊
警告
成功
錯誤
```

不要：

* 使用 Emoji 當正式 UI Icon
* 自己畫 SVG
* 混用其他 Icon Library

Icon-only button 必須：

```text
有 aria-label
有 title 或 Tooltip（適合時）
```

文字清楚的按鈕可以使用：

```text
Icon + 文字
```

例如：

```text
[＋ 新增學生]
[✓ 全班出席]
[儲存]
```

---

# 6. 建立可復用的前端 UI 元件

雖然不使用 React / Vue，但禁止到處複製貼上 HTML。

請在 Vanilla JavaScript 架構中建立可復用 UI Renderer / Component Helpers。

例如可以建立：

```javascript
UI.button(...)
UI.iconButton(...)
UI.badge(...)
UI.emptyState(...)
UI.loading(...)
UI.error(...)
UI.confirmModal(...)
UI.formModal(...)
UI.toast(...)
UI.pagination(...)
UI.filterBar(...)
UI.statCard(...)
UI.mobileCard(...)
UI.desktopTable(...)
UI.responsiveDataView(...)
```

實際命名可自行設計。

重點：

**同樣的 UI Pattern 只實作一次。**

例如：

* 刪除確認 Modal 全系統共用
* Toast 全系統共用
* Loading 全系統共用
* Empty State 全系統共用
* Pagination 全系統共用
* Filters 共用
* Mobile Data Card 共用
* Desktop Table Wrapper 共用

不要每個頁面自己做一套 Modal、Toast、Filter。

---

# 7. Mobile First

系統是老師實際使用的工具。

手機使用體驗是第一級需求，不是事後補 RWD。

設計順序：

```text
Mobile
↓
Tablet
↓
Desktop
```

必須依 Bootstrap 官方最新 Breakpoints / Grid 文件設計。

不要自行假設 Bootstrap breakpoint 數值。

實作時先查當下 Bootstrap 官方 Breakpoints。

---

# 8. 自動 + 手動顯示模式

系統必須支援三種顯示模式：

```text
自動
手機版
電腦版
```

UI 中提供清楚的模式切換，例如 Navbar / Settings menu：

```text
顯示模式
○ 自動
○ 手機版
○ 電腦版
```

可以搭配 Bootstrap Icons。

---

## 自動模式

預設：

```text
auto
```

根據 Bootstrap 官方 breakpoint / viewport 自動決定主要資料呈現。

不要主要依賴 User-Agent 判斷手機。

優先使用：

```javascript
window.matchMedia(...)
```

或 CSS media query / Bootstrap responsive utilities。

---

## 手動手機版

使用者選：

```text
手機版
```

後，即使瀏覽器比較寬，也使用 Mobile-oriented Renderer。

---

## 手動電腦版

使用者選：

```text
電腦版
```

後，使用 Desktop-oriented Renderer。

如果螢幕真的很窄：

* 仍不可讓功能無法使用
* 必要表格提供 `.table-responsive`
* 不可出現無法操作的按鈕
* 不可讓 Dialog 超出螢幕

---

## 儲存偏好

顯示模式使用：

```javascript
localStorage
```

保存：

```text
auto
mobile
desktop
```

重新開啟網站仍保留使用者選擇。

登入帳號資料庫不需要記錄這個偏好。

---

# 9. 不要維護兩套完全不同的網站

雖然支援：

```text
Mobile View
Desktop View
```

但不要因此複製兩份完整程式。

資料：

```text
Store
API
State
Validation
Permissions
Business Logic
```

全部共用。

只有**呈現方式明顯不同的部分**，才有：

```text
Mobile Renderer
Desktop Renderer
```

例如：

```javascript
renderStudentsMobile(data)
renderStudentsDesktop(data)
```

可以存在。

但：

```text
getStudents()
filterStudents()
studentValidation()
studentActions()
```

必須共用。

避免雙版本造成未來維護兩套 Bug。

---

# 10. 表格使用原則

這是強制 UX 規則。

**不要因為資料是 rows，就全部使用 `<table>`。**

桌面版可以合理使用 Table。

手機版必須慎用 Table。

---

# 11. Desktop 資料呈現

Desktop / Large screen 適合以下資料使用 Bootstrap Table：

```text
學生管理
使用者管理
班級管理
加減分規則
操作紀錄
大量加減分紀錄
```

使用：

```text
.table
.table-hover
.align-middle
.table-responsive
```

等 Bootstrap 官方類別。

但請依實際 UI 選擇，不需要把所有 Bootstrap class 都堆上去。

重要操作欄：

```text
查看
編輯
更多
```

避免塞過多按鈕。

可以使用：

```text
Dropdown
Icon Button
```

收納次要操作。

---

# 12. Mobile 資料呈現

手機版不要把 8～12 欄 Table 強行縮成小字。

手機資料優先使用：

```text
Card
List Group
Accordion
Stacked layout
Badge
Dropdown
Offcanvas
```

例如學生：

```text
┌──────────────────────┐
│ 01 王小明            │
│ 學號 10101           │
│ 三年一班             │
│                      │
│ 積分 +12   出席 96%  │
│                      │
│ [查看]      [更多 ⋮] │
└──────────────────────┘
```

不要做：

```text
座號 | 姓名 | 學號 | 班級 | 分數 | 狀態 | ...
```

然後在手機上縮到看不清楚。

---

# 13. 建立 ResponsiveDataView 元件

請建立一個可復用資料呈現架構，例如：

```javascript
ResponsiveDataView
```

概念：

```text
Desktop
→ Bootstrap Table

Mobile
→ Bootstrap Card/List
```

共用：

```text
資料
Filter
Search
Pagination
Actions
Empty state
Loading
Error
```

不要每個管理頁重新寫一次相同判斷。

---

# 14. 各頁面手機呈現規範

## Dashboard

手機：

```text
2 欄或適當單欄 Stat Cards
```

例如：

```text
學生總數   今日出席
今日遲到   今日請假
今日加分   今日扣分
```

桌面：

依 Bootstrap Grid 顯示較多欄。

---

## 今日點名

這是 Mobile UX 最高優先頁面。

禁止手機使用大型出席 Table。

每位學生顯示成快速操作列 / Card，例如：

```text
01 王小明

[出席] [遲到] [缺席] [請假]
```

使用：

```text
Bootstrap Button Group
Bootstrap Buttons
Bootstrap Badges
```

如適合。

請假後展開：

```text
假別
備註
到校時間
離校時間
```

可以使用：

```text
Collapse
Offcanvas
Modal
```

選擇最合理方式。

頁首固定提供：

```text
[✓ 全班出席]
```

以及：

```text
日期
班級
未點名人數
```

目標：

**老師用單手手機操作也能快速完成點名。**

---

## 學生管理

Desktop：

Table。

Mobile：

Card / List。

每張卡只顯示核心資訊。

進階資料放：

```text
查看詳情
更多選單
```

---

## 加減分

Mobile 優先使用：

```text
選學生
→ 點加減分原因
→ 預設分數
→ 可修改
→ 備註
→ 儲存
```

常用原因可以用：

```text
Bootstrap Button
Button Group
Card
Badge
```

快速操作。

不要要求老師每次手打原因。

---

## 出缺席歷史

Desktop：

Table。

Mobile：

Timeline-like List 或 Card。

例如：

```text
8/14  病假
病假｜感冒
登錄：陳老師

8/13  出席

8/12  遲到
08:12 到校
```

---

## Audit Logs

Desktop：

Table。

Mobile：

Card / Accordion。

「修改前 / 修改後 JSON」不要直接塞滿手機畫面。

使用：

```text
Accordion
Modal
Offcanvas
```

查看詳細差異。

---

# 15. 導航設計

Desktop：

可以使用：

```text
Navbar + Sidebar
```

或符合 Bootstrap 官方架構的 Dashboard layout。

Mobile：

優先使用：

```text
Navbar
Offcanvas
```

不要自行實作 Drawer。

手機 Navbar 必須至少能操作：

```text
Menu
目前頁面
使用者
顯示模式
登出
```

---

# 16. Modal / Offcanvas 使用策略

Bootstrap：

```text
Modal
Offcanvas
```

各有用途。

建議：

Modal：

```text
確認刪除
簡單表單
重要確認
```

Offcanvas：

```text
手機篩選
詳細資料
行動版選單
較長編輯內容
```

但請依 Bootstrap 最新官方文件及 UX 判斷。

不要所有事情都塞 Modal。

---

# 17. Toast

成功 / 一般提示使用 Bootstrap Toast。

例如：

```text
學生新增成功
點名已儲存
分數已更新
設定已儲存
```

Error 如果會影響操作：

可以 Toast + inline validation。

不要使用：

```javascript
alert()
confirm()
prompt()
```

作為正式 UI。

確認操作請使用共用 Bootstrap Modal。

---

# 18. Loading

所有 `google.script.run` 非同步操作都必須有適當 Loading 狀態。

例如：

```text
Button Spinner
Page Placeholder
Skeleton-like Bootstrap Placeholder
Spinner
```

禁止使用者連按兩次導致重複提交。

寫入期間：

```text
Disable Submit Button
顯示 Spinner
完成後恢復
```

---

# 19. Empty State

不要讓空資料頁只剩空白。

例如：

```text
尚無學生資料
[新增學生]
```

```text
今天尚未點名
[開始點名]
```

```text
尚無加減分紀錄
```

建立共用 Empty State。

使用 Bootstrap Icons + 文字 + Action button。

---

# 20. Accessibility

遵守 Bootstrap 最新官方 Accessibility 建議。

至少包含：

* 正確 `<label>`
* aria-label
* aria-expanded
* aria-controls
* Modal accessibility
* Offcanvas accessibility
* Icon-only button accessible name
* Keyboard navigation
* Focus state
* 不只依賴顏色表達狀態
* 合理 Contrast
* Respect prefers-reduced-motion

觸控操作按鈕不要做得過小。

---

# 21. 前端 Theme

整體風格：

```text
乾淨
現代
專業
資訊清楚
適合學校老師
低學習成本
```

不要做：

```text
大量 Gradient
玻璃特效
炫技動畫
大量陰影
遊戲風
過度鮮豔
```

Bootstrap 原生設計語言優先。

Custom CSS 控制在合理範圍。

---

# 22. Dark Mode

請查詢當下 Bootstrap 最新官方 Color Modes 文件。

如果目前最新穩定 Bootstrap 已正式支援 Color Mode，請建立：

```text
亮色
深色
自動
```

使用 Bootstrap 官方推薦方式。

例如透過：

```text
data-bs-theme
```

如果官方目前做法已改變，請採最新官方方式。

顯示模式與色彩模式分開：

```text
顯示模式：
自動 / 手機 / 電腦

主題：
自動 / 亮色 / 深色
```

偏好保存在：

```javascript
localStorage
```

---

# 23. GAS 登入方式

不要 Google Login。

建立自己的簡單：

```text
帳號
密碼
```

系統。

使用：

```text
users
sessions
```

---

# 24. users

```text
使用者ID | 帳號 | 密碼雜湊 | 姓名 | 角色 | 班級ID | 啟用狀態 | 最後登入時間 | 建立時間 | 修改時間
```

角色：

```text
管理員
導師
任課教師
行政
```

帳號唯一。

---

# 25. Session

登入：

```javascript
login(username, password)
```

成功後產生 Token。

前端：

```javascript
localStorage
```

保存 Token。

提供：

```javascript
login(username, password)
logout(token)
getCurrentUser(token)
changePassword(token, oldPassword, newPassword)
```

預設 Session：

```text
24 小時
```

實際時數由：

```text
settings.session_ttl_hours
```

控制。

所有 Backend Function 必須重新驗證 Token。

禁止相信前端傳來：

```text
使用者ID
角色
權限
班級ID
```

登入者身分必須由：

```text
Token
→ sessions
→ users
```

取得。

---

# 26. 密碼

禁止明碼密碼。

使用 GAS 官方目前支援的安全 Hash / HMAC 能力。

請先查 `Utilities` 最新官方文件。

使用：

```text
每個帳號獨立 salt
+
PASSWORD_PEPPER
+
密碼
```

產生 Password Hash。

users 可以保存：

```text
salt$hash
```

不要保存明碼。

---

# 27. Script Properties

敏感資料使用：

```javascript
PropertiesService.getScriptProperties()
```

必須至少有：

```text
SPREADSHEET_ID
PASSWORD_PEPPER
SESSION_SECRET
SYSTEM_INITIALIZED
```

初始化管理員可選：

```text
INITIAL_ADMIN_USERNAME
INITIAL_ADMIN_PASSWORD
INITIAL_ADMIN_NAME
```

禁止把：

```text
PASSWORD_PEPPER
SESSION_SECRET
```

放：

```text
Sheet
HTML
前端 JS
settings
```

---

# 28. setupSystem()

必須提供：

```javascript
function setupSystem()
```

第一次執行一次，就建立整套資料庫。

初始化時必須先嘗試：

```javascript
SpreadsheetApp.getActiveSpreadsheet()
```

如果取得綁定的 Spreadsheet：

```text
使用該 Spreadsheet
把其 ID 寫入 Script Properties 的 SPREADSHEET_ID
即使複製來的 Script Property 有舊 ID，也必須以目前綁定副本覆寫
```

如果沒有 Active Spreadsheet，但已存在 `SPREADSHEET_ID`，才使用：

```javascript
SpreadsheetApp.openById(spreadsheetId)
```

如果兩者都不存在，必須明確報錯並要求從試算表的 `擴充功能 → Apps Script` 執行；禁止另外建立一份 Spreadsheet。

Web App 與 `google.script.run` 執行期間不得依賴 Active Spreadsheet，所有資料存取仍必須從 Script Properties 取得 `SPREADSHEET_ID` 並使用 `openById()`。

不要求使用者手動設定 `SPREADSHEET_ID`。

---

# 29. setupSystem() 必須是 Idempotent

可以安全重跑。

如果存在：

```text
Spreadsheet
Sheet
Header
設定
管理員
```

不要：

* 重複新增
* 清除資料
* 覆蓋原資料

如果缺少：

自動補齊。

即使：

```text
SYSTEM_INITIALIZED=true
```

也仍然檢查結構完整性。

---

# 30. 9 張 Sheet

一次建立：

```text
students
users
classes
score_reasons
scores
attendance
settings
audit_logs
sessions
```

---

# 31. students

```text
學生ID | 學號 | 姓名 | 班級ID | 座號 | 啟用狀態 | 建立時間 | 修改時間
```

---

# 32. users

```text
使用者ID | 帳號 | 密碼雜湊 | 姓名 | 角色 | 班級ID | 啟用狀態 | 最後登入時間 | 建立時間 | 修改時間
```

---

# 33. classes

```text
班級ID | 學年度 | 學期 | 年級 | 班級名稱 | 導師ID | 啟用狀態 | 建立時間 | 修改時間
```

---

# 34. score_reasons

```text
原因ID | 名稱 | 預設分數 | 類別 | 說明 | 啟用狀態 | 排序
```

類別：

```text
加分
扣分
```

---

# 35. scores

```text
紀錄ID | 日期 | 學生ID | 原因ID | 分數 | 備註 | 登錄者ID | 建立時間 | 修改者ID | 修改時間 | 是否刪除
```

`score_reasons.預設分數` 只負責預填。

歷史實際分數一定存：

```text
scores.分數
```

Soft Delete：

```text
是否刪除 = TRUE
```

---

# 36. attendance

```text
紀錄ID | 日期 | 學生ID | 狀態 | 假別 | 到校時間 | 離校時間 | 備註 | 登錄者ID | 建立時間 | 修改者ID | 修改時間 | 是否刪除
```

這是：

```text
每日點名
```

不是逐節點名。

不要增加節次。

狀態：

```text
出席
遲到
早退
缺席
請假
```

假別：

```text
病假
事假
公假
喪假
生理假
其他
```

當：

```text
狀態 != 請假
```

假別清空。

有效紀錄原則：

```text
日期 + 學生ID
```

只能有一筆。

使用 Upsert。

不要重複新增。

---

# 37. settings

```text
設定鍵 | 設定值 | 資料型態 | 說明 | 修改者ID | 修改時間
```

初始化：

```text
system_name | 班級管理系統 | string | 系統名稱
school_name | | string | 學校名稱
school_year | 115 | number | 目前學年度
semester | 1 | number | 目前學期
late_time | 08:00 | time | 遲到判定時間
session_ttl_hours | 24 | number | Session 有效時數
timezone | Asia/Taipei | string | 系統時區
```

---

# 38. audit_logs

```text
稽核ID | 使用者ID | 操作 | 資料表 | 資料ID | 修改前 | 修改後 | 來源 | 操作時間
```

操作：

```text
CREATE
UPDATE
DELETE
LOGIN
LOGOUT
PASSWORD_CHANGE
```

來源：

```text
web
system
```

修改前 / 修改後可使用 JSON。

不要假裝 GAS 可以可靠取得使用者真實 IP。

---

# 39. sessions

```text
Token | 使用者ID | 建立時間 | 到期時間 | 最後活動時間 | 啟用狀態
```

過期：

```text
視為失效
```

登出：

```text
啟用狀態 = FALSE
```

停用 users 後：

該使用者所有 Session 必須立即失效。

---

# 40. 第一次管理員

setupSystem() 讀取：

```text
INITIAL_ADMIN_USERNAME
INITIAL_ADMIN_PASSWORD
INITIAL_ADMIN_NAME
```

有設定就使用。

沒有：

```text
帳號：admin
姓名：系統管理員
```

密碼自動產生臨時密碼。

明碼只在第一次 setupSystem 回傳。

禁止：

```text
存 Sheet
永久存 Script Properties
```

Sheet 只保存 Hash。

setupSystem() 回傳：

```javascript
{
  success: true,
  spreadsheetId: "...",
  spreadsheetUrl: "...",
  createdSheets: [],
  adminUsername: "admin",
  temporaryPassword: "...",
  message: "初始化完成"
}
```

只有「本次真的新建管理員」才回傳 temporaryPassword。

---

# 41. Sheet 初始化品質

所有 Sheet：

* Freeze Header row
* Header bold
* 合理 Filter
* 合理欄寬
* 日期格式
* 時間格式
* DateTime 格式
* TRUE/FALSE 正確型態

不要把 Column Number 到處 hardcode。

建立：

```javascript
getHeaderMap(sheet)
```

例如：

```javascript
{
  學生ID: 0,
  學號: 1,
  姓名: 2
}
```

所有 Repository 優先依 Header 操作。

---

# 42. ID

使用：

```javascript
Utilities.getUuid()
```

不要：

```text
最後一列 + 1
```

ID Prefix：

```text
STU_
USR_
CLS_
RSN_
SCR_
ATT_
LOG_
```

Session Token 另外使用足夠隨機的 Token 產生方式。

---

# 43. LockService

重要寫入：

```text
登入 Session 建立
學生新增
加減分
Attendance Upsert
User 新增
初始化
```

適當使用：

```javascript
LockService
```

必須：

```text
timeout
try
finally
releaseLock()
```

避免 race condition。

---

# 44. 資料層

建立共用 Repository / Database Helpers。

避免：

```javascript
sheet.getRange(row, col).getValue()
```

大量逐格讀取。

優先：

```javascript
getDataRange().getValues()
```

處理完再：

```javascript
setValues()
```

大量寫入。

避免 Sheets API Call 爆量。

---

# 45. 前端 GAS 呼叫 Wrapper

建立 Promise wrapper：

```javascript
gasCall(functionName, ...args)
```

封裝：

```javascript
google.script.run
  .withSuccessHandler(...)
  .withFailureHandler(...)
```

使前端可以：

```javascript
await gasCall(...)
```

統一處理：

```text
Loading
Error
Session expired
Toast
```

---

# 46. 權限

後端權限是真正安全邊界。

前端 Menu 隱藏只是 UX。

每個 Server Function 都重新：

```text
驗證 Token
→ 取得 User
→ 檢查啟用
→ 檢查 Role
→ 檢查 Class permission
```

---

# 47. 管理員

可以：

```text
管理 users
管理 classes
管理 students
管理 score_reasons
管理 scores
管理 attendance
管理 settings
查看 audit_logs
查看全部班級
```

---

# 48. 導師

可以：

```text
查看自己班級
管理自己班級學生
點名
登錄請假
加減分
查看班級學生紀錄
```

---

# 49. 任課教師

可以：

```text
查看授權班級
查看學生
登錄加減分
```

第一版 users 使用一個：

```text
班級ID
```

作為主要授權班級。

---

# 50. 行政

可以：

```text
查看學生
查看班級
管理 attendance
查看請假資料
```

---

# 51. 學生 API

完整實作：

```javascript
getStudents(token, filters)
getStudent(token, studentId)
createStudent(token, data)
updateStudent(token, studentId, data)
setStudentActive(token, studentId, active)
```

支援：

```text
班級篩選
姓名搜尋
學號搜尋
座號排序
啟用狀態
```

---

# 52. Classes API

```javascript
getClasses(token)
createClass(token, data)
updateClass(token, classId, data)
setClassActive(token, classId, active)
```

---

# 53. Score Reasons API

```javascript
getScoreReasons(token)
createScoreReason(token, data)
updateScoreReason(token, reasonId, data)
setScoreReasonActive(token, reasonId, active)
```

---

# 54. Scores API

```javascript
getScores(token, filters)
addScore(token, data)
updateScore(token, recordId, data)
deleteScore(token, recordId)
```

新增自動：

```text
登錄者ID
建立時間
```

修改自動：

```text
修改者ID
修改時間
```

刪除：

```text
Soft Delete
```

所有寫入 Audit Log。

---

# 55. Attendance API

```javascript
getAttendance(token, filters)
getDailyAttendance(token, classId, date)
saveAttendance(token, data)
setAllPresent(token, classId, date)
deleteAttendance(token, recordId)
```

今日點名流程：

```text
日期
↓
班級
↓
全班學生
↓
一鍵全到
↓
只修改異常
↓
儲存
```

必須 Upsert。

---

# 56. Dashboard

顯示：

```text
目前班級
學生總數
今日出席
今日遲到
今日早退
今日缺席
今日請假
今日加分
今日扣分
```

管理員：

可切班。

導師：

預設自己的班。

---

# 57. 學生詳細頁

顯示：

```text
姓名
學號
班級
座號
```

統計：

```text
目前累計分數
加分總計
扣分總計
```

加減分歷史：

```text
日期
原因
分數
備註
登錄者
```

出缺席：

```text
日期
狀態
假別
到校時間
離校時間
備註
登錄者
```

Desktop / Mobile 必須採不同合理呈現方式。

不要手機硬塞 Table。

---

# 58. 使用者管理

管理員：

```text
新增帳號
修改姓名
修改角色
指定班級
啟用
停用
重設密碼
```

禁止：

```text
查看原密碼
```

只能：

```text
設定新密碼
```

停用帳號：

Session 全失效。

---

# 59. Settings UI

管理：

```text
系統名稱
學校名稱
學年度
學期
遲到時間
Session 時數
```

修改：

```text
settings
audit_logs
```

---

# 60. Audit Log UI

只有管理員。

支援：

```text
日期
使用者
操作
資料表
資料ID
```

篩選。

Desktop Table。

Mobile Card / Accordion。

---

# 61. 搜尋與篩選 UX

管理頁不要把所有 Filter 永久佔據手機上方。

Desktop：

Inline Filter Bar。

Mobile：

簡單搜尋常駐。

進階篩選放：

```text
Offcanvas
Collapse
```

例如：

```text
[搜尋學生...] [篩選]
```

篩選開啟 Offcanvas。

---

# 62. Pagination

資料多的頁面不要一次 Rendering 幾千筆。

建立共用 Pagination。

如果 Backend pagination 對 GAS / Sheets 架構更合理，請實作 Server-side pagination。

如果資料量合理可 client-side，仍應限制畫面一次呈現數量。

請依 GAS Quota / Performance 最新官方文件做合理設計。

---

# 63. Client State

建立乾淨的 State。

例如：

```javascript
AppState = {
  token,
  user,
  currentPage,
  currentClassId,
  viewMode,
  themeMode
}
```

不要把全域變數散落各檔案。

---

# 64. Routing

因為是 GAS HtmlService 單一 Web App，可以建立簡單 SPA-like navigation。

例如：

```text
#/dashboard
#/attendance
#/students
#/scores
#/classes
#/score-reasons
#/users
#/settings
#/audit
```

可以自行決定是否 Hash Routing。

但：

* 不使用 React Router
* 不需要重新載入頁面
* Back button 盡可能合理
* 手機導航自然

---

# 65. 檔案架構

合理拆分。

建議：

```text
Code.gs
Setup.gs
Config.gs
Database.gs
Auth.gs
Permissions.gs
Students.gs
Classes.gs
Scores.gs
Attendance.gs
Users.gs
Settings.gs
Audit.gs
Utils.gs

Index.html
Styles.html
Scripts.html
Components.html

appsscript.json
```

如果有更乾淨的 GAS 架構可以調整。

不要全部塞 Code.gs。

---

# 66. HTML include

建立：

```javascript
include(filename)
```

使用 HtmlTemplate 組裝：

```text
Styles
Scripts
Components
```

如果最新 GAS 官方最佳做法有更好的方式，優先採官方文件。

---

# 67. doGet()

提供完整：

```javascript
function doGet()
```

回傳網站。

包含：

```text
Viewport
Title
必要 Meta
```

確保手機正確 RWD。

---

# 68. Bootstrap CDN

因為這版明確要求 Bootstrap：

可以使用官方文件目前推薦的 CDN。

但：

* 必須 HTTPS
* 必須採當下最新正式版
* 必須依 Bootstrap 官方最新 snippet
* 不可混用不同 Bootstrap 版本
* Bootstrap Icons 版本也必須確認
* 不要載入重複 JS
* 不要同時載 Bootstrap bundle + 重複 Popper

如果 GAS HTML Service 官方限制與某種載入方式衝突：

優先依最新官方文件調整。

---

# 69. 不要引入不必要第三方 Library

允許：

```text
Bootstrap
Bootstrap Icons
```

除非真的必要，不要再加入：

```text
jQuery
DataTables
SweetAlert
Lodash
Moment.js
Font Awesome
Chart library
其他 UI Framework
```

能用：

```text
Bootstrap
Bootstrap Icons
Native JS
Intl
```

完成就不要加 Dependency。

---

# 70. 日期時間

統一：

```text
Asia/Taipei
```

Server / Sheet / Display 必須一致。

appsscript.json 設定正確 timezone。

前端格式：

```text
YYYY/MM/DD
HH:mm
YYYY/MM/DD HH:mm
```

依情境合理使用。

---

# 71. Input Validation

後端必須檢查：

```text
帳號不可重複
學號不可重複
班級存在
學生存在
使用者存在
原因存在
分數是數字
日期正確
必填欄位
角色合法
Attendance 不重複
```

前端也做 UX Validation。

但是：

**後端 Validation 才是真正標準。**

---

# 72. Audit

至少記錄：

```text
登入
登出
密碼修改
學生建立
學生修改
分數新增
分數修改
分數刪除
點名新增
點名修改
點名刪除
班級新增/修改
帳號新增/修改/停用
設定修改
```

---

# 73. 錯誤處理

不要直接把 GAS Stack Trace 顯示給使用者。

後端建立統一 Error 處理。

前端顯示：

```text
操作失敗，請稍後再試
帳號或密碼錯誤
登入已過期，請重新登入
沒有此功能權限
學生不存在
```

等人類可理解訊息。

開發者必要 Detail 可以：

```text
console.error
```

但不要暴露 Sensitive Data。

---

# 74. Session Expired UX

如果 Server 回傳 Session 過期：

自動：

```text
清除 localStorage Token
清除 User state
Toast / 提示
跳登入頁
```

不要讓每個頁面各自寫一次。

共用處理。

---

# 75. 確認危險操作

以下操作使用共用 Bootstrap Modal：

```text
刪除分數
刪除 Attendance
停用使用者
停用學生
重設密碼
```

Modal 顯示：

```text
操作對象
影響
確認按鈕
取消
```

---

# 76. Touch UX

手機優先考量：

```text
按鈕不要太小
操作之間不要太擠
常用 Action 靠近拇指容易操作區
避免 Hover-only 功能
避免需要精準點小 Icon
```

Attendance 是最高優先。

---

# 77. 避免過多水平捲動

手機正常模式下：

**不要以水平捲動 Table 當主要解決方案。**

`.table-responsive` 是最後防線，不是 Mobile UI 的主要架構。

手機版能轉成 Card / List 就轉。

只有真的需要矩陣式資訊才保留表格。

---

# 78. Performance

前端：

* 不重複 Bootstrap Component 初始化
* Event delegation 適當使用
* 不重建整個 DOM 如果只需要更新一區
* Search 適度 debounce
* 避免大量同步 DOM 操作

Backend：

* 批次 Sheet read/write
* Cache 適合的 Settings / Header Map
* Lock 範圍不要過大
* 不要每個欄位一次 Spreadsheet call

是否使用：

```javascript
CacheService
```

請先查最新 GAS 官方文件並合理判斷。

不能因 Cache 導致權限或資料一致性錯誤。

---

# 79. 首次初始化 UI 不需要公開

setupSystem() 是 Apps Script Editor 裡第一次手動執行。

不要建立：

```text
/setup
公開初始化網址
```

避免任何訪客可以初始化系統。

---

# 80. Setup 完成

setupSystem() 最後：

```text
SYSTEM_INITIALIZED=true
```

並輸出 Logger / return object。

---

# 81. README / 部署說明

全部程式產生完後，提供：

## 第一次安裝

```text
純使用：
1. 開啟範本 Google 試算表
2. 建立自己的副本
3. 從副本的「擴充功能 → Apps Script」開啟綁定專案
4. 執行 setupSystem()
5. 完成授權
6. 確認回傳的 Spreadsheet ID 是副本 ID
7. 記下 admin 臨時密碼

開發新功能：
只有需要修改原始碼或使用 clasp / Agent 操作遠端專案時，才建立本機 .env 與 .clasp.json。
```

指定管理員時：

```text
Apps Script
→ Project Settings
→ Script Properties
```

加入：

```text
INITIAL_ADMIN_USERNAME
INITIAL_ADMIN_PASSWORD
INITIAL_ADMIN_NAME
```

再執行 setupSystem()。

---

# 82. 部署

提供最新 GAS 官方 Web App 部署步驟。

大意：

```text
Deploy
→ New deployment
→ Web app
```

本系統自己的：

```text
users
sessions
```

負責網站身份驗證。

部署後：

```text
/exec
```

直接顯示登入頁。

不要 GitHub Pages。

---

# 83. 輸出方式

你的答案必須按照以下順序：

## A. 官方文件確認

Bootstrap / Icons / GAS。

## B. 架構簡述

不要太長。

## C. setupSystem() 與初始化 helper

我要先看到初始化核心。

## D. 所有 GAS .gs

每個完整檔案。

## E. 所有 HTML

每個完整檔案。

## F. appsscript.json

完整。

## G. 第一次安裝

完整。

## H. 部署

完整。

## I. 預設管理員登入說明

完整。

## J. 驗收 Checklist

完整。

---

# 84. 禁止省略

禁止：

```text
// TODO
// 略
// same as above
// implement yourself
其餘同理
請自行補上
```

任何被呼叫到的函式：

**都必須存在。**

任何 HTML 呼叫的 GAS function：

**都必須存在。**

任何 CSS class / DOM ID / JS selector：

必須互相一致。

---

# 85. 如果回答長度有限

如果平台單次輸出限制不足：

請按照：

```text
Part 1
Part 2
Part 3
...
```

完整輸出。

但：

**不要因為長度限制刪除程式。**

不要把完整程式改成簡化版。

不要詢問「是否繼續」。

直接依平台可用方式完整完成。

---

# 86. Code Review

完成後，在輸出之前自行檢查：

```text
Undefined function
錯誤 function name
HTML ID mismatch
Script include mismatch
Sheet header mismatch
Bootstrap component initialization
Bootstrap version mismatch
Bootstrap Icons version mismatch
權限漏洞
Session 驗證遺漏
Lock 未釋放
Sheet API 過度呼叫
Mobile table 問題
Modal 重複建立
Event listener 重複綁定
```

有問題直接修好。

---

# 87. Bootstrap 專門驗收

額外檢查：

```text
□ Bootstrap 使用實作當下最新穩定版
□ Bootstrap Icons 使用實作當下最新穩定版
□ 版本來自官方文件
□ CDN 使用官方推薦方式
□ Bootstrap JS 只載一次
□ Bootstrap Icons 正常
□ Modal 使用 Bootstrap
□ Offcanvas 使用 Bootstrap
□ Toast 使用 Bootstrap
□ Dropdown 使用 Bootstrap
□ Button / Form / Badge 優先使用 Bootstrap
□ 沒有重做 Bootstrap 已有元件
□ Responsive 使用官方 breakpoint
□ Mobile 不依賴大型 Table
□ 手機操作不需要精準點擊小按鈕
□ Icon-only button 有 accessible label
□ Mobile navigation 使用 Offcanvas 或合理 Bootstrap 元件
```

---

# 88. Responsive 專門驗收

```text
□ 360px 寬度可正常操作
□ 375px 可正常操作
□ 390px 可正常操作
□ Tablet 可正常操作
□ Desktop 可正常操作
□ Auto mode 正常
□ Mobile mode 可手動切換
□ Desktop mode 可手動切換
□ View mode 會保留
□ Theme mode 會保留
□ Mobile 學生頁不是大 Table
□ Mobile Attendance 不是大 Table
□ Mobile Audit Log 有 Card/Accordion 呈現
□ Desktop 大量資料有合理 Table
□ Forced desktop 在窄螢幕仍可操作
□ Modal 不超出手機 viewport
□ Offcanvas 正常
□ Filter 在手機不長期佔據大量畫面
```

---

# 89. 功能驗收

```text
□ setupSystem() 第一次執行成功
□ setupSystem() 可以安全重跑
□ setupSystem() 自動識別綁定的 Spreadsheet 副本並保存 ID
□ Web App 使用 openById()，不依賴 Active Spreadsheet
□ 缺少 Active Spreadsheet 與 SPREADSHEET_ID 時不會意外另建 Spreadsheet
□ 9 張 Sheet 全部建立
□ Header 正確
□ Script Properties 正確
□ Secret 不進前端
□ admin 可登入
□ 密碼非明碼
□ Session 正常
□ Session 過期正常
□ Logout 正常
□ 修改密碼正常
□ Users CRUD 正常
□ Classes CRUD 正常
□ Students CRUD 正常
□ Score Reasons CRUD 正常
□ Scores CRUD 正常
□ Soft Delete 正常
□ Daily Attendance 正常
□ 全班出席正常
□ Attendance Upsert 正常
□ 遲到正常
□ 早退正常
□ 缺席正常
□ 請假正常
□ 假別正常
□ Dashboard 正常
□ 學生詳細頁正常
□ Audit Logs 正常
□ Role Permission 正常
□ Mobile 正常
□ Desktop 正常
□ GAS Web App /exec 可直接使用
```

---

# 90. 最重要的開發原則

請遵守以下優先順序：

```text
1. 正確性
2. 資料完整性
3. 權限
4. 手機可用性
5. Bootstrap 官方元件復用
6. 維護性
7. 效能
8. 視覺美觀
```

不要為了漂亮犧牲操作效率。

不要為了程式短而犧牲完整性。

不要為了「全部同一版型」而讓手機難用。

不要為了「手機版 / 電腦版」而複製兩套 Business Logic。

---

# 最終目標

我希望得到的是一個：

**真正可以每天讓老師在手機或電腦使用的 GAS 班級管理 Web App。**

老師在手機上可以：

```text
打開網站
→ 登入
→ 今日點名
→ 一鍵全班出席
→ 點幾個異常學生
→ 完成
```

也可以：

```text
選學生
→ 點「主動服務 +2」
→ 儲存
```

管理者在電腦上則可以：

```text
管理學生
管理班級
管理老師帳號
管理加減分規則
查出缺席
查 Audit Log
修改系統設定
```

前端應以：

**最新 Bootstrap + 最新 Bootstrap Icons + Bootstrap 官方元件 + 最少必要 Custom CSS**

完成。

而且 Agent 在開始實作前：

**必須重新查閱 Bootstrap、Bootstrap Icons、Google Apps Script 最新官方文件，不可依賴舊版模型知識。**

最後交付必須達到：

**建立範本試算表副本 → 執行 setupSystem() → Deploy Web App → 可以直接使用。**
