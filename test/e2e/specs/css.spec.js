module.exports = {
  'Basic CSS test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-css')
      .click('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .execute(function (text){
        return $('.css .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["body{background:rgba(0, 0, 0, 1)"])
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
          .css_processors("#processor-css");
  },
  'Test processor-less  test' : function (client) {
       var data = client.globals;
        client
          .css_processors("#processor-less");
  },
  'Test processor-myth  test' : function (client) {
       var data = client.globals;
        client
          .css_processors("#processor-myth");
  },
  'Test processor-stylus  test' : function (client) {
       var data = client.globals;
        client
          .css_processors("#processor-stylus");
  },
  'Test processor-convert-css  test' : function (client) {
       var data = client.globals;
        client
          .css_processors("#processor-convert-css");
  }

};
