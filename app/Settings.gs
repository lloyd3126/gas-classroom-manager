function getSettings(token){var user=requireSession_(token);requireRole_(user,['管理員']);return toClientValue_(sheetObjects_('settings'));}

function updateSettings(token,values){
  var user=requireSession_(token);requireRole_(user,['管理員']);values=values||{};var allowed=['system_name','school_name','school_year','semester','late_time','session_ttl_hours'];
  return withScriptLock_(function(){var rows=sheetObjects_('settings');var byKey={};rows.forEach(function(r){byKey[r['設定鍵']]=r;});var changed=[];allowed.forEach(function(key){if(values[key]===undefined)return;var row=byKey[key];if(!row)throw new Error('設定不存在：'+key);var value=values[key];if(row['資料型態']==='number')value=number_(value,key);if(key==='session_ttl_hours'&&(value<=0||value>720))throw new Error('Session 有效時數必須介於 1 到 720');if(key==='late_time')value=normalizeTime_(value,'遲到判定時間');var before=row['設定值'];updateObjectRow_('settings',row.__row,{'設定值':value,'修改者ID':user['使用者ID'],'修改時間':now_()});writeAudit_(user['使用者ID'],'UPDATE','settings',key,{value:before},{value:value},'web');changed.push(key);});return{success:true,changed:changed};});
}

function getPublicConfig(){
  if(getScriptProperties_().getProperty('SYSTEM_INITIALIZED')!=='true')return{initialized:false,systemName:'班級管理系統'};
  try{return{initialized:true,systemName:String(getSettingValue_('system_name','班級管理系統')),schoolName:String(getSettingValue_('school_name',''))};}catch(e){return{initialized:false,systemName:'班級管理系統'};}
}
