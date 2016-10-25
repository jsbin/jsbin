module.exports = {
  'General JavaScript  test' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .waitForElementVisible('.javascript .CodeMirror')
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-javascript' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("javascript")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-babel' : function (client) {
    client
        .url(client.launch_url)
        .selectTab('JavaScript')
        .selectJsProcessor("babel")
        .setJsValue("const value = 'Hello';document.body.innerHTML = value")
        .selectOutputFrame()
        .assert.containsText('body', 'Hello')
        .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
        .end();
  },

  'Test processor-jsx' : function (client) {
    client
        .url(client.launch_url)
        .selectTab('JavaScript')
        .selectJsProcessor("jsx")
        .setJsValue("document.body.innerHTML = 'Hello'")
        .selectOutputFrame()
        .assert.containsText('body', 'Hello')
        .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
        .end();
  },

  'Test processor-coffeescript' : function (client) {
    client
          .url(client.launch_url)
          .selectTab('JavaScript')
          .selectJsProcessor("coffeescript")
          .setJsValue("document.body.innerHTML = 'Hello'")
          .selectOutputFrame()
          .assert.containsText('body', 'Hello')
          .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
          .end();
  },

  'Test processor-traceur' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("traceur")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-typescript' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("typescript")
      .setJsValue("let value: string = 'Hello';document.body.innerHTML = value")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-processing' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("processing")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-livescript' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("livescript")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-convert' : function (client) {
    client
      .url(client.launch_url)
      .selectTab('JavaScript')
      .selectJsProcessor("convert")
      .setJsValue("document.body.innerHTML = 'Hello'")
      .selectOutputFrame()
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  }
};