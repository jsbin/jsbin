module.exports = {
    'Test Console': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-console')
            .waitForElementVisible('div #exec')
            .setValue('div #exec', ["document.body.innerHTML = 'Hello'",client.Keys.ENTER])
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .end();
    }
};