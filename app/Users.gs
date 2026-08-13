function getUsers(token){var user=requireSession_(token);requireRole_(user,['管理員']);var rows=sheetObjects_('users').map(publicUser_);rows=joinLookups_(rows,[{table:'classes',id:'班級ID',foreign:'班級ID',display:'班級名稱',as:'班級名稱'}]);rows.sort(function(a,b){return String(a['角色']).localeCompare(String(b['角色']))||String(a['姓名']).localeCompare(String(b['姓名']));});return toClientValue_(rows);}

function createUser(token,data){
  var admin=requireSession_(token);requireRole_(admin,['管理員']);data=data||{};var username=required_(data.username,'帳號');var role=assertOneOf_(required_(data.role,'角色'),APP.ROLES,'角色');var classId=cleanString_(data.classId);if(classId)requireRecord_('classes','班級ID',classId,'班級');if(['導師','任課教師'].indexOf(role)>=0&&!classId)throw new Error(role+'必須指定班級');
  return withScriptLock_(function(){if(sheetObjects_('users').some(function(u){return cleanString_(u['帳號']).toLowerCase()===username.toLowerCase();}))throw new Error('帳號已存在');var now=now_();var record={'使用者ID':newId_('users'),'帳號':username,'密碼雜湊':hashPassword_(data.password),'姓名':required_(data.name,'姓名'),'角色':role,'班級ID':classId,'啟用狀態':true,'最後登入時間':'','建立時間':now,'修改時間':now};appendObject_('users',record);writeAudit_(admin['使用者ID'],'CREATE','users',record['使用者ID'],null,publicUser_(record),'web');return publicUser_(record);});
}

function updateUser(token,userId,data){
  var admin=requireSession_(token);requireRole_(admin,['管理員']);var before=requireRecord_('users','使用者ID',userId,'使用者');data=data||{};var role=assertOneOf_(required_(data.role,'角色'),APP.ROLES,'角色');var classId=cleanString_(data.classId);if(classId)requireRecord_('classes','班級ID',classId,'班級');if(['導師','任課教師'].indexOf(role)>=0&&!classId)throw new Error(role+'必須指定班級');
  return withScriptLock_(function(){var patch={'姓名':required_(data.name,'姓名'),'角色':role,'班級ID':classId,'修改時間':now_()};updateObjectRow_('users',before.__row,patch);writeAudit_(admin['使用者ID'],'UPDATE','users',userId,publicUser_(before),patch,'web');return publicUser_(Object.assign({},before,patch));});
}

function setUserActive(token,userId,active){
  var admin=requireSession_(token);requireRole_(admin,['管理員']);var before=requireRecord_('users','使用者ID',userId,'使用者');var enabled=boolean_(active);if(userId===admin['使用者ID']&&!enabled)throw new Error('不能停用目前登入的管理員帳號');
  return withScriptLock_(function(){var patch={'啟用狀態':enabled,'修改時間':now_()};updateObjectRow_('users',before.__row,patch);if(!enabled)invalidateUserSessions_(userId);writeAudit_(admin['使用者ID'],'UPDATE','users',userId,publicUser_(before),patch,'web');return{success:true};});
}

function resetUserPassword(token,userId,newPassword){var admin=requireSession_(token);requireRole_(admin,['管理員']);var before=requireRecord_('users','使用者ID',userId,'使用者');return withScriptLock_(function(){updateObjectRow_('users',before.__row,{'密碼雜湊':hashPassword_(newPassword),'修改時間':now_()});invalidateUserSessions_(userId);writeAudit_(admin['使用者ID'],'PASSWORD_CHANGE','users',userId,null,{resetByAdmin:true},'web');return{success:true};});}
