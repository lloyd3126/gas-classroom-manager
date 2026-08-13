function getStudents(token, filters) {
  var user = requireSession_(token);
  filters = filters || {};
  var allowed = accessibleClassIds_(user, 'read');
  var rows = sheetObjects_('students').filter(function (s) { return allowed.indexOf(String(s['班級ID'])) >= 0; });
  if (filters.classId) {
    requireClassAccess_(user, filters.classId, 'read');
    rows = rows.filter(function (s) { return String(s['班級ID']) === String(filters.classId); });
  }
  if (filters.active !== undefined && filters.active !== '') rows = rows.filter(function (s) { return active_(s['啟用狀態']) === boolean_(filters.active); });
  var keyword = cleanString_(filters.keyword).toLowerCase();
  if (keyword) rows = rows.filter(function (s) { return String(s['學號']).toLowerCase().indexOf(keyword) >= 0 || String(s['姓名']).toLowerCase().indexOf(keyword) >= 0; });
  rows.sort(function (a, b) { return String(a['班級ID']).localeCompare(String(b['班級ID'])) || Number(a['座號'] || 999) - Number(b['座號'] || 999); });
  return toClientValue_(joinLookups_(rows, [{table: 'classes', id: '班級ID', foreign: '班級ID', display: '班級名稱', as: '班級名稱'}]));
}

function getStudent(token, studentId) {
  var user = requireSession_(token);
  return toClientValue_(requireStudentAccess_(user, studentId, 'read'));
}

function createStudent(token, data) {
  var user = requireSession_(token);
  data = data || {};
  var classId = required_(data.classId, '班級');
  requireClassAccess_(user, classId, 'student');
  var studentNo = required_(data.studentNo, '學號');
  var name = required_(data.name, '姓名');
  var seatNo = number_(data.seatNo, '座號');
  if (seatNo < 1 || Math.floor(seatNo) !== seatNo) throw new Error('座號必須是正整數');
  return withScriptLock_(function () {
    if (sheetObjects_('students').some(function (s) { return cleanString_(s['學號']).toLowerCase() === studentNo.toLowerCase(); })) throw new Error('學號已存在');
    var now = now_();
    var record = {'學生ID': newId_('students'), '學號': studentNo, '姓名': name, '班級ID': classId, '座號': seatNo, '啟用狀態': true, '建立時間': now, '修改時間': now};
    appendObject_('students', record);
    writeAudit_(user['使用者ID'], 'CREATE', 'students', record['學生ID'], null, record, 'web');
    return toClientValue_(record);
  });
}

function updateStudent(token, studentId, data) {
  var user = requireSession_(token);
  var before = requireStudentAccess_(user, studentId, 'student');
  data = data || {};
  var classId = required_(data.classId, '班級');
  requireClassAccess_(user, classId, 'student');
  var studentNo = required_(data.studentNo, '學號');
  var seatNo = number_(data.seatNo, '座號');
  if (seatNo < 1 || Math.floor(seatNo) !== seatNo) throw new Error('座號必須是正整數');
  return withScriptLock_(function () {
    if (sheetObjects_('students').some(function (s) { return s['學生ID'] !== studentId && cleanString_(s['學號']).toLowerCase() === studentNo.toLowerCase(); })) throw new Error('學號已存在');
    var patch = {'學號': studentNo, '姓名': required_(data.name, '姓名'), '班級ID': classId, '座號': seatNo, '修改時間': now_()};
    updateObjectRow_('students', before.__row, patch);
    writeAudit_(user['使用者ID'], 'UPDATE', 'students', studentId, before, patch, 'web');
    return toClientValue_(Object.assign({}, before, patch));
  });
}

function setStudentActive(token, studentId, active) {
  var user = requireSession_(token);
  var before = requireStudentAccess_(user, studentId, 'student');
  return withScriptLock_(function () {
    var patch = {'啟用狀態': boolean_(active), '修改時間': now_()};
    updateObjectRow_('students', before.__row, patch);
    writeAudit_(user['使用者ID'], 'UPDATE', 'students', studentId, before, patch, 'web');
    return {success: true};
  });
}

function getStudentDetails(token, studentId) {
  var user = requireSession_(token);
  var student = requireStudentAccess_(user, studentId, 'read');
  var cls = findBy_('classes', '班級ID', student['班級ID']);
  var reasons = {}; sheetObjects_('score_reasons').forEach(function (r) { reasons[r['原因ID']] = r; });
  var users = {}; sheetObjects_('users').forEach(function (u) { users[u['使用者ID']] = u; });
  var scores = sheetObjects_('scores').filter(function (r) { return r['學生ID'] === studentId && !active_(r['是否刪除']); }).map(function (r) {
    var copy = Object.assign({}, r); copy['原因名稱'] = reasons[r['原因ID']] ? reasons[r['原因ID']]['名稱'] : ''; copy['登錄老師'] = users[r['登錄者ID']] ? users[r['登錄者ID']]['姓名'] : ''; return copy;
  }).sort(function (a, b) { return String(b['日期']).localeCompare(String(a['日期'])); });
  var attendance = sheetObjects_('attendance').filter(function (r) { return r['學生ID'] === studentId && !active_(r['是否刪除']); }).map(function (r) {
    var copy = Object.assign({}, r); copy['登錄老師'] = users[r['登錄者ID']] ? users[r['登錄者ID']]['姓名'] : ''; return copy;
  }).sort(function (a, b) { return String(b['日期']).localeCompare(String(a['日期'])); });
  var positive = 0, negative = 0;
  scores.forEach(function (r) { var n = Number(r['分數']) || 0; if (n >= 0) positive += n; else negative += n; });
  return toClientValue_({student: Object.assign({}, student, {'班級名稱': cls ? cls['班級名稱'] : ''}), totals: {total: positive + negative, positive: positive, negative: negative}, scores: scores, attendance: attendance});
}
