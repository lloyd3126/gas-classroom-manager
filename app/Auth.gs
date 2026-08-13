function login(username, password) {
  username = required_(username, '帳號').toLowerCase();
  password = required_(password, '密碼');
  return withScriptLock_(function () {
    var user = sheetObjects_('users').find(function (u) { return cleanString_(u['帳號']).toLowerCase() === username; });
    if (!user || !active_(user['啟用狀態']) || !verifyPassword_(password, user['密碼雜湊'])) throw new Error('帳號或密碼不正確');
    var created = now_();
    var ttl = Number(getSettingValue_('session_ttl_hours', APP.SESSION_TTL_HOURS));
    if (!isFinite(ttl) || ttl <= 0) ttl = APP.SESSION_TTL_HOURS;
    var expires = new Date(created.getTime() + ttl * 3600000);
    var token = createSessionToken_();
    appendObject_('sessions', {'Token': token, '使用者ID': user['使用者ID'], '建立時間': created, '到期時間': expires, '最後活動時間': created, '啟用狀態': true});
    updateObjectRow_('users', user.__row, {'最後登入時間': created, '修改時間': created});
    writeAudit_(user['使用者ID'], 'LOGIN', 'sessions', token.substring(0, 12), null, {expiresAt: expires}, 'web');
    return {token: token, expiresAt: toClientValue_(expires), user: publicUser_(user)};
  });
}

function logout(token) {
  return withScriptLock_(function () {
    var session = findBy_('sessions', 'Token', cleanString_(token));
    if (!session || !active_(session['啟用狀態'])) return {success: true};
    updateObjectRow_('sessions', session.__row, {'啟用狀態': false, '最後活動時間': now_()});
    writeAudit_(session['使用者ID'], 'LOGOUT', 'sessions', cleanString_(token).substring(0, 12), null, null, 'web');
    return {success: true};
  });
}

function getCurrentUser(token) { return publicUser_(requireSession_(token)); }

function requireSession_(token) {
  token = required_(token, 'Session Token');
  var session = findBy_('sessions', 'Token', token);
  var now = now_();
  if (!session || !active_(session['啟用狀態'])) throw new Error('SESSION_EXPIRED：登入狀態已失效');
  var expires = session['到期時間'] instanceof Date ? session['到期時間'] : new Date(session['到期時間']);
  if (isNaN(expires.getTime()) || expires.getTime() <= now.getTime()) {
    updateObjectRow_('sessions', session.__row, {'啟用狀態': false, '最後活動時間': now});
    throw new Error('SESSION_EXPIRED：登入已過期，請重新登入');
  }
  var user = findBy_('users', '使用者ID', session['使用者ID']);
  if (!user || !active_(user['啟用狀態'])) {
    updateObjectRow_('sessions', session.__row, {'啟用狀態': false, '最後活動時間': now});
    throw new Error('SESSION_EXPIRED：帳號已停用');
  }
  updateObjectRow_('sessions', session.__row, {'最後活動時間': now});
  return user;
}

function changePassword(token, oldPassword, newPassword) {
  var user = requireSession_(token);
  oldPassword = required_(oldPassword, '舊密碼');
  newPassword = required_(newPassword, '新密碼');
  if (!verifyPassword_(oldPassword, user['密碼雜湊'])) throw new Error('舊密碼不正確');
  return withScriptLock_(function () {
    var current = requireRecord_('users', '使用者ID', user['使用者ID'], '使用者');
    updateObjectRow_('users', current.__row, {'密碼雜湊': hashPassword_(newPassword), '修改時間': now_()});
    invalidateUserSessions_(user['使用者ID'], token);
    writeAudit_(user['使用者ID'], 'PASSWORD_CHANGE', 'users', user['使用者ID'], null, {changed: true}, 'web');
    return {success: true};
  });
}

function invalidateUserSessions_(userId, keepToken) {
  var sheet = getSheet_('sessions');
  var rows = sheetObjects_('sessions');
  var map = getHeaderMap_(sheet);
  rows.forEach(function (s) {
    if (String(s['使用者ID']) === String(userId) && s['Token'] !== keepToken && active_(s['啟用狀態'])) sheet.getRange(s.__row, map['啟用狀態'] + 1).setValue(false);
  });
}
