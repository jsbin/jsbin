module.exports = {
    'Test Console: add to the body HTML text': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-console')
            .waitForElementVisible('div #exec')
            .setValue('div #exec', ["document.body.innerHTML = 'Hello'", client.Keys.ENTER])
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .assert.urlMatch(/\/\?html,console,output$/)
            .end();
    },
    'Test Console: output error': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-console')
            .waitForElementVisible('div #exec')
            .setValue('div #exec', ["b", client.Keys.ENTER])
            .assert.containsText('.echo', 'b')
            .assert.containsText('.str', '"b is not defined"')
            .end();
    },
    'Test Console: output value of the variable ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-console')
            .waitForElementVisible('div #exec')
            .setValue('div #exec', ["a = 1", client.Keys.ENTER])
            .assert.containsText('.lit', '1')
            .end();
    }
};