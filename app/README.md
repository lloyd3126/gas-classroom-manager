# App 原始碼

此資料夾供開發或維護新功能使用。只需要使用系統的人，請依 repository 根目錄 README 的「只使用系統」流程建立試算表副本，不需要 `.env` 或 `clasp`。

## 開發者設定

1. 先依根目錄 README 從範本建立自己的副本並完成初始化。
2. 依根目錄 `.env.example` 建立 `.env`，只填入自己的 `SPREADSHEET_ID` 與 `APPS_SCRIPT_ID`。
3. 確認本機 `.clasp.json` 的 `scriptId` 與 `.env` 完全相同，且 `rootDir` 為 `app`。
4. 使用 Node 20 執行 `clasp show-authorized-user` 與 `clasp show-file-status`，確認帳號及同步範圍後才執行 `clasp push`。

完整架構、安全說明、官方文件版本與驗收狀態請見 repository 根目錄的 `README.md` 與 `ACCEPTANCE.md`。
