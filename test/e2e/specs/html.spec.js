module.exports = {
 'Basic HTML test': function (client){
 var data = client.globals;
 client
  .url(client.launch_url)
  .waitForElementVisible('.html .CodeMirror')
  .execute(function (text){
    return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
  }, ["jsb<b>in"])
  .frame(1)
  .pause(data.defaultTime)
  .frame(0)
  .assert.containsText('body', 'jsbin')
  .assert.urlMatch(/\/\w+\/edit\?html,output$/)
  .end();
 }
};