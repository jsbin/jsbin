module.exports = {
  'Basic JavaScript test' : function (client) {
    client
      .url(client.launch_url)
      .waitForElementVisible('.html .CodeMirror', 1000)
      .execute(function (text){
        return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["jsbin"]).pause(10000)
      .assert.containsText('body', 'jsbin')
      .assert.urlMatch(/\/\w+\/edit\?html,output$/)
      .end();
  }
};
