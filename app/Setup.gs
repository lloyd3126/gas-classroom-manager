function setupSystem() {
  var result = withScriptLock_(function () {
    var props = getScriptProperties_();
    var spreadsheet = resolveSetupSpreadsheet_(props);
    var spreadsheetId = spreadsheet.getId();
    if (!props.getProperty('PASSWORD_PEPPER')) props.setProperty('PASSWORD_PEPPER', randomSecret_());
    if (!props.getProperty('SESSION_SECRET')) props.setProperty('SESSION_SECRET', randomSecret_());
    try { spreadsheet.setSpreadsheetTimeZone(APP.TIMEZONE); } catch (ignore) {}

    var createdSheets = [];
    var names = Object.keys(APP.SHEETS);
    var defaultSheet = spreadsheet.getSheets().length === 1 ? spreadsheet.getSheets()[0] : null;
    names.forEach(function (name, index) {
      var sheet = spreadsheet.getSheetByName(name);
      if (!sheet && index === 0 && defaultSheet && defaultSheet.getLastRow() <= 1 && defaultSheet.getLastColumn() <= 1) {
        sheet = defaultSheet;
        sheet.setName(name);
        createdSheets.push(name);
      } else if (!sheet) {
        sheet = spreadsheet.insertSheet(name);
        createdSheets.push(name);
      }
      ensureSheetSchema_(sheet, APP.SHEETS[name]);
    });

    ensureDefaultSettings_();
    var admin = ensureInitialAdmin_();
    props.setProperty('SYSTEM_INITIALIZED', 'true');
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetUrl: spreadsheet.getUrl(),
      createdSheets: createdSheets,
      adminUsername: admin.username,
      temporaryPassword: admin.temporaryPassword,
      message: '初始化完成'
    };
  });
  Logger.log(JSON.stringify(result));
  return result;
}

function resolveSetupSpreadsheet_(props) {
  var spreadsheet = null;
  try { spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); } catch (ignore) {}
  if (spreadsheet) {
    props.setProperty('SPREADSHEET_ID', spreadsheet.getId());
    return spreadsheet;
  }
  var spreadsheetId = props.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('找不到綁定的試算表，請從試算表的「擴充功能 → Apps Script」開啟專案後執行 setupSystem()');
  try { return SpreadsheetApp.openById(spreadsheetId); }
  catch (e) { throw new Error('SPREADSHEET_ID 指向的試算表不存在或無權存取，請修正 Script Property 後再執行'); }
}

function ensureSheetSchema_(sheet, expectedHeaders) {
  var lastColumn = sheet.getLastColumn();
  var existing = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String) : [];
  var missing = expectedHeaders.filter(function (h) { return existing.indexOf(h) === -1; });
  if (!existing.some(function (h) { return h !== ''; })) {
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
  } else if (missing.length) {
    sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  }
  var width = sheet.getLastColumn();
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, width).setFontWeight('bold').setBackground('#E8F0FE').setFontColor('#174EA6');
  var map = getHeaderMap_(sheet);
  formatColumns_(sheet, map);
  if (!sheet.getFilter()) {
    try { sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 2), width).createFilter(); } catch (ignore) {}
  }
  sheet.autoResizeColumns(1, width);
}

function formatColumns_(sheet, map) {
  var maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  Object.keys(map).forEach(function (header) {
    var range = sheet.getRange(2, map[header] + 1, maxRows, 1);
    if (header === '日期') range.setNumberFormat('yyyy-mm-dd');
    else if (header.indexOf('時間') >= 0 && ['到校時間', '離校時間'].indexOf(header) === -1) range.setNumberFormat('yyyy-mm-dd hh:mm:ss');
    else if (['到校時間', '離校時間'].indexOf(header) >= 0) range.setNumberFormat('@');
    else if (['啟用狀態', '是否刪除'].indexOf(header) >= 0) range.setNumberFormat('BOOLEAN');
  });
}

function ensureDefaultSettings_() {
  var existing = {};
  sheetObjects_('settings').forEach(function (row) { existing[String(row['設定鍵'])] = true; });
  var now = now_();
  APP.DEFAULT_SETTINGS.forEach(function (item) {
    if (!existing[item[0]]) appendObject_('settings', {'設定鍵': item[0], '設定值': item[1], '資料型態': item[2], '說明': item[3], '修改者ID': 'SYSTEM', '修改時間': now});
  });
}

function ensureInitialAdmin_() {
  var props = getScriptProperties_();
  var username = cleanString_(props.getProperty('INITIAL_ADMIN_USERNAME')) || 'admin';
  var users = sheetObjects_('users');
  var found = users.find(function (u) { return cleanString_(u['帳號']).toLowerCase() === username.toLowerCase(); });
  if (found) return {username: found['帳號']};
  var configuredPassword = props.getProperty('INITIAL_ADMIN_PASSWORD');
  var temporaryPassword = configuredPassword || ('Tmp!' + randomSecret_().substring(0, 14));
  var now = now_();
  appendObject_('users', {
    '使用者ID': newId_('users'), '帳號': username, '密碼雜湊': hashPassword_(temporaryPassword),
    '姓名': cleanString_(props.getProperty('INITIAL_ADMIN_NAME')) || '系統管理員', '角色': '管理員',
    '班級ID': '', '啟用狀態': true, '最後登入時間': '', '建立時間': now, '修改時間': now
  });
  return {username: username, temporaryPassword: configuredPassword ? undefined : temporaryPassword};
}
