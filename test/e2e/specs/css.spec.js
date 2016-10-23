var cssVariable = 'rgba(0, 0, 0, 1)';
module.exports = {
  'Basic CSS test' : function (client) {
       var data = client.globals;
       client
          .url(client.launch_url)
          .selectTab('CSS')
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .end();
  },

  'Test processor-CSS  test' : function (client) {
       var data = client.globals;
       client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("css")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-less  test' : function (client) {
        var data = client.globals;
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("less")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-myth  test' : function (client) {
        var data = client.globals;
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("myth")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-stylus  test' : function (client) {
        var data = client.globals;
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("stylus")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-convert-css  test' : function (client) {
        var data = client.globals;
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("convert-css")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(cssVariable,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  }
};
