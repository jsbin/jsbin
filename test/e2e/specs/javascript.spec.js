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
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("javascript")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-babel' : function (client) {
    client
        .url(client.launch_url)
        .selectTab('JavaScript')
        .selectProcessor("babel")
        .setJsValue("document.body.innerHTML = 'Hello'")
        .frame(2)
        .assert.containsText('body', 'Hello')
        .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
        .end();
  },

  'Test processor-jsx' : function (client) {
    client
        .url(client.launch_url)
        .selectTab('JavaScript')
        .selectProcessor("jsx")
        .setJsValue("document.body.innerHTML = 'Hello'")
        .frame(2)
        .assert.containsText('body', 'Hello')
        .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
        .end();
  },

  'Test processor-coffeescript' : function (client) {
    client
          .url(client.launch_url)
          .selectTab('JavaScript')
          .selectProcessor("coffeescript")
          .setJsValue("document.body.innerHTML = 'Hello'")
          .frame(2)
          .assert.containsText('body', 'Hello')
          .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
          .end();
  },

  'Test processor-traceur' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("traceur")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-typescript' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("typescript")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-processing' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("processing")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-livescript' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("livescript")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-convert' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectProcessor("convert")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  }
};