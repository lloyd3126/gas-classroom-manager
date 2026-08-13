function writeAudit_(userId, action, table, dataId, before, after, source) {
  appendObject_('audit_logs', {
    '稽核ID': newId_('audit_logs'), '使用者ID': userId || 'SYSTEM', '操作': action,
    '資料表': table || '', '資料ID': dataId || '', '修改前': json_(before), '修改後': json_(after),
    '來源': source || 'web', '操作時間': now_()
  });
}

function getAuditLogs(token, filters) {
  var user = requireSession_(token);
  requireRole_(user, ['管理員']);
  filters = filters || {};
  var rows = sheetObjects_('audit_logs');
  if (filters.action) rows = rows.filter(function (r) { return r['操作'] === filters.action; });
  if (filters.userId) rows = rows.filter(function (r) { return r['使用者ID'] === filters.userId; });
  if (filters.dateFrom) rows = rows.filter(function (r) { return dateCellToString_(r['操作時間']) >= filters.dateFrom; });
  rows.sort(function (a, b) { return new Date(b['操作時間']) - new Date(a['操作時間']); });
  rows = joinLookups_(rows.slice(0, 500), [{table: 'users', id: '使用者ID', foreign: '使用者ID', display: '姓名', as: '使用者名稱'}]);
  return toClientValue_(rows);
}

function dateCellToString_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, APP.TIMEZONE, 'yyyy-MM-dd');
  return cleanString_(value).substring(0, 10);
}
