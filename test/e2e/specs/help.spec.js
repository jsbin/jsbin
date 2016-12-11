module.exports = {
    'Show window Keyboard Shortcuts test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#showhelp')
            .expect.element('body.keyboardHelp').to.be.visible;
        client.assert.urlMatch(/\/\?html,output$/)
            .end();
    },
    'Show window JS Bin URLs test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#showurls')
            .expect.element('body.urlHelp').to.be.visible;
        client.assert.urlMatch(/\/\?html,output$/)
            .end();
    },
    'Show window Help topics test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#menu-help-tips').pause(client.globals.defaultTimeout)
            .selectWindow(1)
            .assert.urlEquals(client.globals.buttonUrls.menuHelpTips)
            .end();
    },
    'Show window Send feedback & file bugs test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#menu-feedback').pause(client.globals.defaultTimeout)
            .selectWindow(1)
            .url(function (response) {
                if (client.globals.buttonUrls.menuFeedback != response.value + '') {
                    console.log('Sign in to GitHub!!!!');
                    client.end();
                }
            });
        client.assert.urlEquals(client.globals.buttonUrls.menuFeedback);
        client.end();
    },
    'Show window Donate on Gratipay test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#menu-fork')
            .pause(client.globals.defaultTimeout)
            .selectWindow(1);
        client.assert.urlEquals(client.globals.buttonUrls.menuFork);
        client.end();
    },
    'Show window Follow @js_bin test': function (client) {
        client
            .url(client.launch_url)
            .click('#button-help')
            .click('#menu-follow-jsbin')
            .pause(client.globals.defaultTimeout)
            .selectWindow(1);
        client.assert.urlEquals(client.globals.buttonUrls.menuFollowJsbin);
        client.end();
    }
};