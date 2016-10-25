var bgColorProp = 'rgba(0, 0, 0, 1)';
module.exports = {
  'Basic CSS test' : function (client) {
       client
          .url(client.launch_url)
          .selectTab('CSS')
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(bgColorProp,client)
          .end();
  },

  'Test processor-CSS  test' : function (client) {
       client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("css")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(bgColorProp,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-less  test' : function (client) {
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("less")
          .setCssValue("@color:#000;body{background-color:@color}")
          .assert.bodyBgColorProp(bgColorProp,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-myth  test' : function (client) {
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("myth")
          .setCssValue(":root {--bgcolor: #000;}" +
              "body{background-color: var(--bgcolor)}")
          .assert.bodyBgColorProp(bgColorProp,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-stylus  test' : function (client) {
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("stylus")
          .setCssValue("body \n background-color #000")
          .assert.bodyBgColorProp(bgColorProp,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  },

  'Test processor-convert-css  test' : function (client) {
        client
          .url(client.launch_url)
          .selectTab('CSS')
          .selectCssProcessor("convert-css")
          .setCssValue("body{background-color:#000}")
          .assert.bodyBgColorProp(bgColorProp,client)
          .assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
          .end();
  }
};
