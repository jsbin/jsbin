exports.command = function(selector, callback) {
    var data = this.globals;
    this
      .url(this.launch_url)
      .waitForElementVisible('#panel-css')
      .click('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
      .click('a[href="#cssprocessors"]')
      .click(selector).pause(data.defaultTime)
        this.execute(function (text){
        return $('.css .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["body{background-color:#000}"])
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
      .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      this.assert.urlMatch(/\/\w+\/edit\?html,css,output$/)
      .end();


  return this; // allows the command to be chained.
};
