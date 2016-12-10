module.exports = {
    'Show window Keyboard Shortcuts test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#showhelp')
            .expect.element('body.keyboardHelp').to.be.visible;
        client.assert.urlMatch(/\/\?html,output$/)
            .end();
    }
};