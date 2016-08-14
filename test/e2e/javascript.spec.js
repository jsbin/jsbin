module.exports = {
  'Basic JavaScript test' : function (client) {
    client
      .url(client.launch_url)
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#panels a:nth-child(3)', 1000)
      .click('#panels a:nth-child(3)')
      .waitForElementVisible('.javascript .CodeMirror', 1000)
      .click('.javascript .CodeMirror textarea')
      .keys('document.body.innerHTML = \'Hello\';')
      .waitForElementVisible('iframe', 1000)
      .frame(2)
      .assert.containsText('body', 'Hello')
      .end();
  }
};