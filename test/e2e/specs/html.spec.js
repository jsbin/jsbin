module.exports = {
 'Basic HTML test': function (client){
   var data = client.globals;
   client
    .url(client.launch_url)
    .waitForElementVisible('.html .CodeMirror')
    .execute(function (text){
      return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
    }, ["<b>jsbin"])//This check is the text in html. <b> isn't really a text
    .frame(1)
    .pause(data.defaultTime)
    .frame(0)
    .assert.containsText('body', 'jsbin')
    .assert.urlMatch(/\/\w+\/edit\?html,output$/)
    .end();
 }
};