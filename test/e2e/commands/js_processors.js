exports.command = function(selector, callback) {
    var data = this.globals;
    this
      .url(this.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      this.click('a[href="#javascriptprocessors"]')
      .click(selector).pause(data.defaultTime)
        this.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();


  return this; // allows the command to be chained.
};
