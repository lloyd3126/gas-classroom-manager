function getClasses(token) {
  var user = requireSession_(token);
  var rows = sheetObjects_('classes').filter(function (c) { return canAccessClass_(user, c['班級ID'], 'read'); });
  rows = joinLookups_(rows, [{table: 'users', id: '使用者ID', foreign: '導師ID', display: '姓名', as: '導師姓名'}]);
  rows.sort(function (a, b) { return Number(b['學年度']) - Number(a['學年度']) || Number(a['年級']) - Number(b['年級']) || String(a['班級名稱']).localeCompare(String(b['班級名稱'])); });
  return toClientValue_(rows);
}

function createClass(token, data) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); data = data || {};
  var teacherId = cleanString_(data.teacherId);
  if (teacherId) requireRecord_('users', '使用者ID', teacherId, '導師');
  return withScriptLock_(function () {
    var now = now_();
    var record = {'班級ID': newId_('classes'), '學年度': number_(data.schoolYear, '學年度'), '學期': number_(data.semester, '學期'), '年級': number_(data.grade, '年級'), '班級名稱': required_(data.name, '班級名稱'), '導師ID': teacherId, '啟用狀態': true, '建立時間': now, '修改時間': now};
    appendObject_('classes', record); writeAudit_(user['使用者ID'], 'CREATE', 'classes', record['班級ID'], null, record, 'web'); return toClientValue_(record);
  });
}

function updateClass(token, classId, data) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); var before = requireRecord_('classes', '班級ID', classId, '班級'); data = data || {};
  var teacherId = cleanString_(data.teacherId); if (teacherId) requireRecord_('users', '使用者ID', teacherId, '導師');
  return withScriptLock_(function () {
    var patch = {'學年度': number_(data.schoolYear, '學年度'), '學期': number_(data.semester, '學期'), '年級': number_(data.grade, '年級'), '班級名稱': required_(data.name, '班級名稱'), '導師ID': teacherId, '修改時間': now_()};
    updateObjectRow_('classes', before.__row, patch); writeAudit_(user['使用者ID'], 'UPDATE', 'classes', classId, before, patch, 'web'); return toClientValue_(Object.assign({}, before, patch));
  });
}

function setClassActive(token, classId, active) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); var before = requireRecord_('classes', '班級ID', classId, '班級');
  return withScriptLock_(function () { var patch = {'啟用狀態': boolean_(active), '修改時間': now_()}; updateObjectRow_('classes', before.__row, patch); writeAudit_(user['使用者ID'], 'UPDATE', 'classes', classId, before, patch, 'web'); return {success: true}; });
}
