function getAttendance(token, filters) {
  var user=requireSession_(token);filters=filters||{};var allowed=accessibleClassIds_(user,'read');var students={};sheetObjects_('students').forEach(function(s){students[s['學生ID']]=s;});
  var rows=sheetObjects_('attendance').filter(function(r){var s=students[r['學生ID']];return !active_(r['是否刪除'])&&s&&allowed.indexOf(String(s['班級ID']))>=0;});
  if(filters.classId){requireClassAccess_(user,filters.classId,'read');rows=rows.filter(function(r){return students[r['學生ID']]['班級ID']===filters.classId;});}
  if(filters.studentId){requireStudentAccess_(user,filters.studentId,'read');rows=rows.filter(function(r){return r['學生ID']===filters.studentId;});}
  if(filters.date){var date=normalizeDate_(filters.date);rows=rows.filter(function(r){return dateCellToString_(r['日期'])===date;});}
  if(filters.status)rows=rows.filter(function(r){return r['狀態']===filters.status;});
  rows=joinLookups_(rows,[{table:'students',id:'學生ID',foreign:'學生ID',display:'姓名',as:'學生姓名'},{table:'users',id:'使用者ID',foreign:'登錄者ID',display:'姓名',as:'登錄者姓名'}]);
  rows.forEach(function(r){r['班級ID']=students[r['學生ID']]['班級ID'];r['學號']=students[r['學生ID']]['學號'];r['座號']=students[r['學生ID']]['座號'];});
  rows.sort(function(a,b){return String(b['日期']).localeCompare(String(a['日期']))||Number(a['座號'])-Number(b['座號']);});return toClientValue_(rows.slice(0,1500));
}

function getDailyAttendance(token,classId,date){
  var user=requireSession_(token);requireClassAccess_(user,classId,'read');date=normalizeDate_(date||today_());
  var students=sheetObjects_('students').filter(function(s){return s['班級ID']===classId&&active_(s['啟用狀態']);}).sort(function(a,b){return Number(a['座號'])-Number(b['座號']);});
  var current={};sheetObjects_('attendance').forEach(function(r){if(dateCellToString_(r['日期'])===date&&!active_(r['是否刪除']))current[r['學生ID']]=r;});
  return toClientValue_({date:date,classId:classId,students:students.map(function(s){return{student:s,attendance:current[s['學生ID']]||null};})});
}

function saveAttendance(token,data){
  var user=requireSession_(token);data=data||{};var date=normalizeDate_(data.date||today_());var entries=Array.isArray(data.entries)?data.entries:[];if(!entries.length)throw new Error('沒有可儲存的點名資料');
  var classId=required_(data.classId,'班級');requireClassAccess_(user,classId,'attendance');
  return withScriptLock_(function(){
    var students={};sheetObjects_('students').forEach(function(s){if(s['班級ID']===classId&&active_(s['啟用狀態']))students[s['學生ID']]=s;});
    var existing={};sheetObjects_('attendance').forEach(function(r){if(dateCellToString_(r['日期'])===date&&students[r['學生ID']]&&!active_(r['是否刪除']))existing[r['學生ID']]=r;});
    var now=now_(),created=0,updated=0;
    entries.forEach(function(entry){var studentId=required_(entry.studentId,'學生');if(!students[studentId])throw new Error('學生不屬於所選班級或已停用');var status=assertOneOf_(required_(entry.status,'出席狀態'),APP.ATTENDANCE_STATUSES,'出席狀態');var leave=status==='請假'?assertOneOf_(required_(entry.leaveType,'假別'),APP.LEAVE_TYPES,'假別'):'';var arrival=normalizeTime_(entry.arrivalTime,'到校時間'),departure=normalizeTime_(entry.departureTime,'離校時間');var old=existing[studentId];
      if(old){var patch={'狀態':status,'假別':leave,'到校時間':arrival,'離校時間':departure,'備註':cleanString_(entry.note),'修改者ID':user['使用者ID'],'修改時間':now};updateObjectRow_('attendance',old.__row,patch);writeAudit_(user['使用者ID'],'UPDATE','attendance',old['紀錄ID'],old,patch,'web');updated++;}
      else{var record={'紀錄ID':newId_('attendance'),'日期':date,'學生ID':studentId,'狀態':status,'假別':leave,'到校時間':arrival,'離校時間':departure,'備註':cleanString_(entry.note),'登錄者ID':user['使用者ID'],'建立時間':now,'修改者ID':'','修改時間':'','是否刪除':false};appendObject_('attendance',record);writeAudit_(user['使用者ID'],'CREATE','attendance',record['紀錄ID'],null,record,'web');created++;}
    });return{success:true,created:created,updated:updated};
  });
}

function setAllPresent(token,classId,date){
  var user=requireSession_(token);requireClassAccess_(user,classId,'attendance');var students=sheetObjects_('students').filter(function(s){return s['班級ID']===classId&&active_(s['啟用狀態']);});
  return saveAttendance(token,{classId:classId,date:date,entries:students.map(function(s){return{studentId:s['學生ID'],status:'出席',leaveType:'',arrivalTime:'',departureTime:'',note:''};})});
}

function deleteAttendance(token,recordId){var user=requireSession_(token);var before=requireRecord_('attendance','紀錄ID',recordId,'點名紀錄');requireStudentAccess_(user,before['學生ID'],'attendance');if(active_(before['是否刪除']))return{success:true};return withScriptLock_(function(){var patch={'是否刪除':true,'修改者ID':user['使用者ID'],'修改時間':now_()};updateObjectRow_('attendance',before.__row,patch);writeAudit_(user['使用者ID'],'DELETE','attendance',recordId,before,patch,'web');return{success:true};});}
