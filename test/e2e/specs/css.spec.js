module.exports = {
  'Basic CSS test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-css')
      .click('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
        .insert('.css .CodeMirror')
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();
  }
};
