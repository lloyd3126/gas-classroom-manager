function getSpreadsheet_() {
  var id = getScriptProperties_().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('系統尚未初始化，請先執行 setupSystem()');
  try { return SpreadsheetApp.openById(id); } catch (e) { throw new Error('無法開啟系統資料庫，請確認 SPREADSHEET_ID 與部署帳號權限'); }
}

function getSheet_(name) {
  var sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error('缺少資料表：' + name + '，請重新執行 setupSystem()');
  return sheet;
}

function getHeaderMap_(sheet) {
  var lastColumn = sheet.getLastColumn();
  if (!lastColumn) return {};
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) { if (h !== '') map[String(h)] = i; });
  return map;
}

function sheetObjects_(name) {
  var sheet = getSheet_(name);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(String);
  return values.slice(1).filter(function (row) { return row.some(function (v) { return v !== ''; }); }).map(function (row, index) {
    var obj = { __row: index + 2 };
    headers.forEach(function (header, i) { if (header) obj[header] = row[i]; });
    return obj;
  });
}

function appendObject_(name, object) {
  var sheet = getSheet_(name);
  var map = getHeaderMap_(sheet);
  var row = new Array(sheet.getLastColumn()).fill('');
  Object.keys(object).forEach(function (key) { if (map[key] !== undefined) row[map[key]] = object[key]; });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
  return object;
}

function updateObjectRow_(name, rowNumber, patch) {
  var sheet = getSheet_(name);
  var map = getHeaderMap_(sheet);
  var range = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn());
  var row = range.getValues()[0];
  Object.keys(patch).forEach(function (key) { if (map[key] !== undefined) row[map[key]] = patch[key]; });
  range.setValues([row]);
  return patch;
}

function findBy_(name, field, value) {
  return sheetObjects_(name).find(function (item) { return String(item[field]) === String(value); }) || null;
}

function requireRecord_(name, field, value, label) {
  var record = findBy_(name, field, value);
  if (!record) throw new Error((label || '資料') + '不存在');
  return record;
}

function active_(value) { return value === true || String(value).toUpperCase() === 'TRUE'; }

function getSettingValue_(key, fallback) {
  var item = findBy_('settings', '設定鍵', key);
  if (!item) return fallback;
  if (item['資料型態'] === 'number') return Number(item['設定值']);
  return item['設定值'];
}

function joinLookups_(rows, definitions) {
  var maps = {};
  definitions.forEach(function (def) {
    maps[def.table] = {};
    sheetObjects_(def.table).forEach(function (r) { maps[def.table][String(r[def.id])] = r; });
  });
  return rows.map(function (row) {
    var copy = Object.assign({}, row);
    definitions.forEach(function (def) {
      var target = maps[def.table][String(row[def.foreign])];
      copy[def.as] = target ? target[def.display] : '';
    });
    return copy;
  });
}
