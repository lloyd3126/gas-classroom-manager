function requireRole_(user, allowed) {
  if (allowed.indexOf(user['角色']) === -1) throw new Error('權限不足：此操作不適用於您的角色');
}

function canAccessClass_(user, classId, mode) {
  if (user['角色'] === '管理員') return true;
  if (user['角色'] === '行政') return mode === 'read' || mode === 'attendance';
  if (String(user['班級ID'] || '') !== String(classId || '')) return false;
  if (user['角色'] === '導師') return true;
  if (user['角色'] === '任課教師') return mode === 'read' || mode === 'score';
  return false;
}

function requireClassAccess_(user, classId, mode) {
  classId = required_(classId, '班級ID');
  var cls = requireRecord_('classes', '班級ID', classId, '班級');
  if (!canAccessClass_(user, classId, mode || 'read')) throw new Error('權限不足：無法操作此班級');
  return cls;
}

function requireStudentAccess_(user, studentId, mode) {
  var student = requireRecord_('students', '學生ID', studentId, '學生');
  requireClassAccess_(user, student['班級ID'], mode || 'read');
  return student;
}

function accessibleClassIds_(user, mode) {
  var classes = sheetObjects_('classes').filter(function (c) { return active_(c['啟用狀態']); });
  return classes.filter(function (c) { return canAccessClass_(user, c['班級ID'], mode || 'read'); }).map(function (c) { return String(c['班級ID']); });
}
