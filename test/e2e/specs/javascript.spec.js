module.exports = {
  'General JavaScript  test one' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-javascript' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-javascript"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

        'Test processor-babel' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-babel"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-jsx' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-jsx"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-coffeescript' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-coffeescript"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-traceur' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-traceur"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

          'Test processor-typescript' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-typescript"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-processing' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-processing"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
        'Test processor-livescript' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-livescript"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },
          'Test processor-convert' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.click('a[href="#javascriptprocessors"]')
      .click('a[id="processor-convert"]').pause(data.defaultTime)
        client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  }
};


