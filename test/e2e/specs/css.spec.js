module.exports = {
  'Basic JavaScript test' : function (client) {
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-css', 1000)
      .click('#panel-css')
      .waitForElementVisible('.css .CodeMirror', 1000)
      .execute(function (text){
        return $('.css .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["body{background-color:black;}"])
      .pause(1000)
      .waitForElementVisible('#live iframe iframe', 1000)
      .expect.element('body').to.have.css('backgroundColor').which.equals('black');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);


      client.end();
  }
};
