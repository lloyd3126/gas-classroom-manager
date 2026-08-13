function doGet(){
  var template=HtmlService.createTemplateFromFile('Index');
  return template.evaluate().setTitle('班級管理系統').addMetaTag('viewport','width=device-width, initial-scale=1, viewport-fit=cover').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function include(filename){return HtmlService.createHtmlOutputFromFile(filename).getContent();}
