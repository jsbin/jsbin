module.exports = {
    'Create fresh bin test': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Hello'")
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .click('#createnew')
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\/\?html,js,output/)
            .end();
    }
};