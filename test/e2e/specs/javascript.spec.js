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
        .setJsValue("const value = 'Hello';\ndocument.body.innerHTML = value;")
        .selectOutputFrame()
        .assert.containsText('body', 'Hello')
        .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
        .end();
  },

  'Test processor-jsx' : function (client) {
    client
        .url(client.launch_url)
        .setHtml("<div id='root'> </div>")
        .selectTab('JavaScript')
        .selectJsProcessor("jsx")
        .setJsValue("ReactDOM.render\n(<div>Hello</div>,\n document.getElementById('root'));")
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
          .setJsValue("class Foo\n bar: 'Hello'\nobj = new Foo()\ndocument.body.innerHTML = obj.bar")
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
      .setJsValue("const value = 'Hello';\ndocument.body.innerHTML = value;")
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
      .setJsValue("let value: string = 'Hello';\ndocument.body.innerHTML = value;")
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
      .setJsValue("str value = 'Hello';\ndocument.body.innerHTML = value;")
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
      .setJsValue("value = \\Hello;\ndocument.body.innerHTML = value;")
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
