module.exports = {
  'Basic CSS test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-css")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },

  'Test processor-CSS  test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-css")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },
  'Test processor-less  test' : function (client) {
       var data = client.globals;
        client
      .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-less")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },
  'Test processor-myth  test' : function (client) {
       var data = client.globals;
      client
      .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-myth")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },
  'Test processor-stylus  test' : function (client) {
       var data = client.globals;
        client
      .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-stylus")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },
  'Test processor-convert-css  test' : function (client) {
       var data = client.globals;
        client
            .url(client.launch_url)
      .selectTab('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessorCss("#processor-convert-css")
      .insertEditBoxCss(".css .CodeMirror")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  }

};
