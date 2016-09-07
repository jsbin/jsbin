module.exports = {
  'Basic JavaScript test' : function (client) {
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      .execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  }
};
