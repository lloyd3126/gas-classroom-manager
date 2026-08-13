# App 原始碼

此資料夾內容可直接複製到新的 Google Apps Script 專案。

## 安裝

1. 在 GAS 專案中建立本資料夾列出的所有 `.gs` 與 `.html` 檔。
2. 顯示並以此處的 `appsscript.json` 取代專案 manifest。
3. 執行一次 `setupSystem()` 並完成授權。
4. 從執行記錄取得 Spreadsheet URL 與首次管理員資訊。
5. 部署：`Deploy → New deployment → Web app`，`Execute as` 選部署者。

完整架構、安全說明、官方文件版本與驗收狀態請見 repository 根目錄的 `README.md` 與 `ACCEPTANCE.md`。
