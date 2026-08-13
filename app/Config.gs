var APP = Object.freeze({
  TIMEZONE: 'Asia/Taipei',
  SESSION_TTL_HOURS: 24,
  LOCK_TIMEOUT_MS: 30000,
  ROLES: ['管理員', '導師', '任課教師', '行政'],
  ATTENDANCE_STATUSES: ['出席', '遲到', '早退', '缺席', '請假'],
  LEAVE_TYPES: ['病假', '事假', '公假', '喪假', '生理假', '其他'],
  SHEETS: {
    students: ['學生ID', '學號', '姓名', '班級ID', '座號', '啟用狀態', '建立時間', '修改時間'],
    users: ['使用者ID', '帳號', '密碼雜湊', '姓名', '角色', '班級ID', '啟用狀態', '最後登入時間', '建立時間', '修改時間'],
    classes: ['班級ID', '學年度', '學期', '年級', '班級名稱', '導師ID', '啟用狀態', '建立時間', '修改時間'],
    score_reasons: ['原因ID', '名稱', '預設分數', '類別', '說明', '啟用狀態', '排序'],
    scores: ['紀錄ID', '日期', '學生ID', '原因ID', '分數', '備註', '登錄者ID', '建立時間', '修改者ID', '修改時間', '是否刪除'],
    attendance: ['紀錄ID', '日期', '學生ID', '狀態', '假別', '到校時間', '離校時間', '備註', '登錄者ID', '建立時間', '修改者ID', '修改時間', '是否刪除'],
    settings: ['設定鍵', '設定值', '資料型態', '說明', '修改者ID', '修改時間'],
    audit_logs: ['稽核ID', '使用者ID', '操作', '資料表', '資料ID', '修改前', '修改後', '來源', '操作時間'],
    sessions: ['Token', '使用者ID', '建立時間', '到期時間', '最後活動時間', '啟用狀態']
  },
  DEFAULT_SETTINGS: [
    ['system_name', '班級管理系統', 'string', '系統名稱'],
    ['school_name', '', 'string', '學校名稱'],
    ['school_year', 115, 'number', '目前學年度'],
    ['semester', 1, 'number', '目前學期'],
    ['late_time', '08:00', 'time', '遲到判定時間'],
    ['session_ttl_hours', 24, 'number', 'Session 有效時數'],
    ['timezone', 'Asia/Taipei', 'string', '系統時區']
  ],
  ID_PREFIX: {
    students: 'STU_', users: 'USR_', classes: 'CLS_', score_reasons: 'RSN_',
    scores: 'SCR_', attendance: 'ATT_', audit_logs: 'LOG_'
  }
});

function getScriptProperties_() {
  return PropertiesService.getScriptProperties();
}
