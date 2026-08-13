function getScoreReasons(token) {
  var user = requireSession_(token);
  requireRole_(user, APP.ROLES);
  var rows = sheetObjects_('score_reasons');
  rows.sort(function (a, b) { return Number(a['排序'] || 0) - Number(b['排序'] || 0) || String(a['名稱']).localeCompare(String(b['名稱'])); });
  return toClientValue_(rows);
}

function createScoreReason(token, data) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); data = data || {};
  var category = assertOneOf_(required_(data.category, '類別'), ['加分', '扣分'], '類別');
  var score = number_(data.defaultScore, '預設分數');
  if ((category === '加分' && score < 0) || (category === '扣分' && score > 0)) throw new Error('預設分數正負值與類別不符');
  return withScriptLock_(function () {
    var record = {'原因ID': newId_('score_reasons'), '名稱': required_(data.name, '名稱'), '預設分數': score, '類別': category, '說明': cleanString_(data.description), '啟用狀態': true, '排序': Number(data.sort || 0)};
    appendObject_('score_reasons', record); writeAudit_(user['使用者ID'], 'CREATE', 'score_reasons', record['原因ID'], null, record, 'web'); return toClientValue_(record);
  });
}

function updateScoreReason(token, reasonId, data) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); var before = requireRecord_('score_reasons', '原因ID', reasonId, '加減分原因'); data = data || {};
  var category = assertOneOf_(required_(data.category, '類別'), ['加分', '扣分'], '類別'); var score = number_(data.defaultScore, '預設分數');
  if ((category === '加分' && score < 0) || (category === '扣分' && score > 0)) throw new Error('預設分數正負值與類別不符');
  return withScriptLock_(function () { var patch = {'名稱': required_(data.name, '名稱'), '預設分數': score, '類別': category, '說明': cleanString_(data.description), '排序': Number(data.sort || 0)}; updateObjectRow_('score_reasons', before.__row, patch); writeAudit_(user['使用者ID'], 'UPDATE', 'score_reasons', reasonId, before, patch, 'web'); return toClientValue_(Object.assign({}, before, patch)); });
}

function setScoreReasonActive(token, reasonId, active) {
  var user = requireSession_(token); requireRole_(user, ['管理員']); var before = requireRecord_('score_reasons', '原因ID', reasonId, '加減分原因');
  return withScriptLock_(function () { var patch = {'啟用狀態': boolean_(active)}; updateObjectRow_('score_reasons', before.__row, patch); writeAudit_(user['使用者ID'], 'UPDATE', 'score_reasons', reasonId, before, patch, 'web'); return {success: true}; });
}

function getScores(token, filters) {
  var user = requireSession_(token); filters = filters || {}; var allowed = accessibleClassIds_(user, 'read');
  var students = {}; sheetObjects_('students').forEach(function (s) { students[s['學生ID']] = s; });
  var rows = sheetObjects_('scores').filter(function (r) { var s = students[r['學生ID']]; return !active_(r['是否刪除']) && s && allowed.indexOf(String(s['班級ID'])) >= 0; });
  if (filters.classId) { requireClassAccess_(user, filters.classId, 'read'); rows = rows.filter(function (r) { return students[r['學生ID']]['班級ID'] === filters.classId; }); }
  if (filters.studentId) { requireStudentAccess_(user, filters.studentId, 'read'); rows = rows.filter(function (r) { return r['學生ID'] === filters.studentId; }); }
  if (filters.reasonId) rows = rows.filter(function (r) { return r['原因ID'] === filters.reasonId; });
  if (filters.dateFrom) { var from = normalizeDate_(filters.dateFrom); rows = rows.filter(function (r) { return dateCellToString_(r['日期']) >= from; }); }
  if (filters.dateTo) { var to = normalizeDate_(filters.dateTo); rows = rows.filter(function (r) { return dateCellToString_(r['日期']) <= to; }); }
  rows = joinLookups_(rows, [{table:'students',id:'學生ID',foreign:'學生ID',display:'姓名',as:'學生姓名'},{table:'score_reasons',id:'原因ID',foreign:'原因ID',display:'名稱',as:'原因名稱'},{table:'users',id:'使用者ID',foreign:'登錄者ID',display:'姓名',as:'登錄者姓名'}]);
  rows.forEach(function (r) { r['班級ID'] = students[r['學生ID']]['班級ID']; r['學號'] = students[r['學生ID']]['學號']; });
  rows.sort(function (a,b) { return String(b['日期']).localeCompare(String(a['日期'])) || String(b['建立時間']).localeCompare(String(a['建立時間'])); });
  return toClientValue_(rows.slice(0, 1000));
}

function addScore(token, data) {
  var user = requireSession_(token); data = data || {}; var student = requireStudentAccess_(user, required_(data.studentId, '學生'), 'score');
  var reason = requireRecord_('score_reasons', '原因ID', required_(data.reasonId, '加減分原因'), '加減分原因'); if (!active_(reason['啟用狀態'])) throw new Error('此加減分原因已停用');
  var score = data.score === '' || data.score == null ? number_(reason['預設分數'], '分數') : number_(data.score, '分數'); var date = normalizeDate_(data.date || today_());
  return withScriptLock_(function () { var now=now_(); var record={'紀錄ID':newId_('scores'),'日期':date,'學生ID':student['學生ID'],'原因ID':reason['原因ID'],'分數':score,'備註':cleanString_(data.note),'登錄者ID':user['使用者ID'],'建立時間':now,'修改者ID':'','修改時間':'','是否刪除':false}; appendObject_('scores',record); writeAudit_(user['使用者ID'],'CREATE','scores',record['紀錄ID'],null,record,'web'); return toClientValue_(record); });
}

function updateScore(token, recordId, data) {
  var user=requireSession_(token); var before=requireRecord_('scores','紀錄ID',recordId,'加減分紀錄'); if(active_(before['是否刪除'])) throw new Error('此紀錄已刪除'); var student=requireStudentAccess_(user,before['學生ID'],'score'); data=data||{};
  var targetStudentId=cleanString_(data.studentId)||student['學生ID']; requireStudentAccess_(user,targetStudentId,'score'); var reason=requireRecord_('score_reasons','原因ID',required_(data.reasonId,'加減分原因'),'加減分原因');
  return withScriptLock_(function(){var patch={'日期':normalizeDate_(data.date),'學生ID':targetStudentId,'原因ID':reason['原因ID'],'分數':number_(data.score,'分數'),'備註':cleanString_(data.note),'修改者ID':user['使用者ID'],'修改時間':now_()};updateObjectRow_('scores',before.__row,patch);writeAudit_(user['使用者ID'],'UPDATE','scores',recordId,before,patch,'web');return toClientValue_(Object.assign({},before,patch));});
}

function deleteScore(token, recordId) {
  var user=requireSession_(token);var before=requireRecord_('scores','紀錄ID',recordId,'加減分紀錄');requireStudentAccess_(user,before['學生ID'],'score');if(active_(before['是否刪除']))return{success:true};
  return withScriptLock_(function(){var patch={'是否刪除':true,'修改者ID':user['使用者ID'],'修改時間':now_()};updateObjectRow_('scores',before.__row,patch);writeAudit_(user['使用者ID'],'DELETE','scores',recordId,before,patch,'web');return{success:true};});
}
