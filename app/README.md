# App 原始碼

建議先依 repository 根目錄 README，從範本試算表建立副本；只有副本未包含程式檔時，才需要手動複製此資料夾內容。

## 安裝

1. 從根目錄 README 提供的範本試算表建立自己的副本。
2. 依根目錄 `.env.example` 建立 `.env`，只填入明確授權的 `SPREADSHEET_ID` 與 `APPS_SCRIPT_ID`；README 的範本連結本身不構成 Agent 操作授權。
3. 在副本選擇 `擴充功能 → Apps Script`；若副本未包含程式檔，建立本資料夾列出的所有 `.gs` 與 `.html` 檔。
4. 顯示並以此處的 `appsscript.json` 取代專案 manifest。
5. 將副本的 Spreadsheet ID 設為 Apps Script 的 `SPREADSHEET_ID` Script Property，不可沿用範本 ID。
6. 執行一次 `setupSystem()` 並完成授權，確認回傳的是副本 ID，並保存首次管理員資訊。
7. 部署：`Deploy → New deployment → Web app`，`Execute as` 選部署者。

完整架構、安全說明、官方文件版本與驗收狀態請見 repository 根目錄的 `README.md` 與 `ACCEPTANCE.md`。
