/*
module.exports = {
  'Basic CSS test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .selectTab('CSS')
      .setCssValue("body{background-color:#000}")
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
      .selectTab('CSS')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessor("css")
      .setCssValue("body{background-color:#000}")
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
      .selectTab('CSS')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessor("less")
      .setCssValue("body{background-color:#000}")
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
      .selectTab('CSS')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessor("myth")
      .setCssValue("body{background-color:#000}")
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
      .selectTab('CSS')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessor("stylus")
      .setCssValue("body{background-color:#000}")
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
      .selectTab('CSS')
      .waitForElementVisible('.css .CodeMirror')
      .selectProcessor("convert-css")
      .setCssValue("body{background-color:#000}")
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  }

};
*/