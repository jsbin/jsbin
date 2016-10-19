module.exports = {
  'General JavaScript  test' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .waitForElementVisible('.javascript .CodeMirror')
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-javascript' : function (client) {
    client
        .checkJsProcessors("#processor-javascript");
  },

  'Test processor-babel' : function (client) {
    client
        .checkJsProcessors("#processor-babel");
  },

  'Test processor-jsx' : function (client) {
    client
        .checkJsProcessors("#processor-jsx");
  },

  'Test processor-coffeescript' : function (client) {
    client
          .checkJsProcessors("#processor-coffeescript");
  },

  'Test processor-traceur' : function (client) {
    client
      .checkJsProcessors("#processor-traceur");
  },

  'Test processor-typescript' : function (client) {
    client
      .checkJsProcessors("#processor-typescript");
  },

  'Test processor-processing' : function (client) {
    client
      .checkJsProcessors("#processor-processing");
  },

  'Test processor-livescript' : function (client) {
    client
      .checkJsProcessors("#processor-livescript");
  },

  'Test processor-convert' : function (client) {
    client
      .checkJsProcessors("#processor-convert");
  }
};