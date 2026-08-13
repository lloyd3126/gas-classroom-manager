function now_() { return new Date(); }

function cleanString_(value) { return value == null ? '' : String(value).trim(); }

function required_(value, label) {
  var v = cleanString_(value);
  if (!v) throw new Error(label + '為必填欄位');
  return v;
}

function boolean_(value) {
  return value === true || String(value).toLowerCase() === 'true';
}

function number_(value, label) {
  var n = Number(value);
  if (value === '' || value == null || !isFinite(n)) throw new Error(label + '必須是數字');
  return n;
}

function assertOneOf_(value, allowed, label) {
  if (allowed.indexOf(value) === -1) throw new Error(label + '不正確');
  return value;
}

function normalizeDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return Utilities.formatDate(value, APP.TIMEZONE, 'yyyy-MM-dd');
  var text = cleanString_(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('日期格式必須為 yyyy-MM-dd');
  var parts = text.split('-');
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (d.getFullYear() !== Number(parts[0]) || d.getMonth() !== Number(parts[1]) - 1 || d.getDate() !== Number(parts[2])) throw new Error('日期不存在');
  return text;
}

function today_() { return Utilities.formatDate(now_(), APP.TIMEZONE, 'yyyy-MM-dd'); }

function normalizeTime_(value, label) {
  var text = cleanString_(value);
  if (!text) return '';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) throw new Error((label || '時間') + '格式必須為 HH:mm');
  return text;
}

function newId_(table) {
  return (APP.ID_PREFIX[table] || 'ID_') + Utilities.getUuid().replace(/-/g, '').substring(0, 20);
}

function randomSecret_() {
  return Utilities.base64EncodeWebSafe(Utilities.getUuid() + Utilities.getUuid()).replace(/=+$/g, '');
}

function bytesToHex_(bytes) {
  return bytes.map(function (b) { var v = b < 0 ? b + 256 : b; return ('0' + v.toString(16)).slice(-2); }).join('');
}

function hashPassword_(password) {
  password = required_(password, '密碼');
  if (password.length < 8) throw new Error('密碼至少需要 8 個字元');
  var salt = randomSecret_().substring(0, 24);
  var pepper = required_(getScriptProperties_().getProperty('PASSWORD_PEPPER'), 'PASSWORD_PEPPER');
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password + pepper, Utilities.Charset.UTF_8);
  return salt + '$' + bytesToHex_(digest);
}

function verifyPassword_(password, stored) {
  var parts = cleanString_(stored).split('$');
  if (parts.length !== 2) return false;
  var pepper = getScriptProperties_().getProperty('PASSWORD_PEPPER') || '';
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, parts[0] + String(password || '') + pepper, Utilities.Charset.UTF_8);
  return constantTimeEqual_(bytesToHex_(digest), parts[1]);
}

function constantTimeEqual_(a, b) {
  a = String(a); b = String(b);
  var diff = a.length ^ b.length;
  for (var i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i % (a.length || 1)) || 0) ^ (b.charCodeAt(i % (b.length || 1)) || 0);
  return diff === 0;
}

function createSessionToken_() {
  var nonce = randomSecret_();
  var secret = required_(getScriptProperties_().getProperty('SESSION_SECRET'), 'SESSION_SECRET');
  var sig = bytesToHex_(Utilities.computeHmacSha256Signature(nonce, secret, Utilities.Charset.UTF_8));
  return nonce + '.' + sig;
}

function withScriptLock_(callback) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(APP.LOCK_TIMEOUT_MS)) throw new Error('系統忙碌中，請稍後再試');
  try { return callback(); } finally { lock.releaseLock(); }
}

function toClientValue_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, APP.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
  if (Array.isArray(value)) return value.map(toClientValue_);
  if (value && typeof value === 'object') {
    var out = {};
    Object.keys(value).forEach(function (key) { out[key] = toClientValue_(value[key]); });
    return out;
  }
  return value;
}

function publicUser_(user) {
  if (!user) return null;
  var copy = Object.assign({}, user);
  delete copy['密碼雜湊'];
  return toClientValue_(copy);
}

function json_(value) {
  try { return JSON.stringify(toClientValue_(value == null ? null : value)); } catch (e) { return 'null'; }
}
