module.exports = {
 'Basic HTML test': function (client){
 client
  .url(client.launch_url)
  .waitForElementVisible('.html .CodeMirror', 1000)
  .execute(function (text){
    return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
  }, ["jsb<b>in"])
  .frame(1)
  .pause(1000)
  .frame(0)
  .assert.containsText('body', 'jsbin')
  .assert.urlMatch(/\/\w+\/edit\?html,output$/)
  .end();
 }
};