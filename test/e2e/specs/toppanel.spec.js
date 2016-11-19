module.exports = {
    'Basic top panel test': function (client) {
        var data = client.globals;
        client
            .url(client.launch_url)
            .click('.toppanel-hide')
            .pause(data.defaultTimeout);
        client.expect.element('.toppanel-hide').to.be.not.visible;
        client.click('.toppanel-logo')
            .waitForElementVisible('.toppanel-hide')
            .pause(data.defaultTimeout);
        client.expect.element('.toppanel-hide').to.be.visible;
        client.assert.urlMatch(/\/\?html,output$/)
            .end();
    }
};