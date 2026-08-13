function getDashboard(token,classId,date){
  var user=requireSession_(token);date=normalizeDate_(date||today_());var classes=sheetObjects_('classes').filter(function(c){return active_(c['啟用狀態'])&&canAccessClass_(user,c['班級ID'],'read');});
  if(!classId&&classes.length)classId=classes[0]['班級ID'];if(!classId)return{classId:'',className:'',studentCount:0,present:0,late:0,early:0,absent:0,leave:0,positive:0,negative:0};var cls=requireClassAccess_(user,classId,'read');
  var students=sheetObjects_('students').filter(function(s){return s['班級ID']===classId&&active_(s['啟用狀態']);});var ids={};students.forEach(function(s){ids[s['學生ID']]=true;});
  var counts={present:0,late:0,early:0,absent:0,leave:0};sheetObjects_('attendance').forEach(function(r){if(!ids[r['學生ID']]||active_(r['是否刪除'])||dateCellToString_(r['日期'])!==date)return;if(r['狀態']==='出席')counts.present++;else if(r['狀態']==='遲到')counts.late++;else if(r['狀態']==='早退')counts.early++;else if(r['狀態']==='缺席')counts.absent++;else if(r['狀態']==='請假')counts.leave++;});
  var positive=0,negative=0;sheetObjects_('scores').forEach(function(r){if(!ids[r['學生ID']]||active_(r['是否刪除'])||dateCellToString_(r['日期'])!==date)return;var n=Number(r['分數'])||0;if(n>=0)positive+=n;else negative+=n;});
  return toClientValue_({classId:classId,className:cls['班級名稱'],date:date,studentCount:students.length,present:counts.present,late:counts.late,early:counts.early,absent:counts.absent,leave:counts.leave,positive:positive,negative:negative});
}

function getBootstrap(token){var user=requireSession_(token);var classes=getClasses(token);return{user:publicUser_(user),classes:classes,systemName:String(getSettingValue_('system_name','班級管理系統')),schoolName:String(getSettingValue_('school_name','')),today:today_(),roles:APP.ROLES,statuses:APP.ATTENDANCE_STATUSES,leaveTypes:APP.LEAVE_TYPES};}
