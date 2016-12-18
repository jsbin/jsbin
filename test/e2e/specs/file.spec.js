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
    },
    'Archive  bin test': function (client) {
        client
            .url(client.launch_url)
            .click('#loginbtn').pause(client.globals.defaultTimeout)
            .setValue('#login-username', '')
            .setValue('#login-key', '')
            .pause(client.globals.defaultTimeout);
        client
            .click('input[value="Log in"]')
            .pause(client.globals.defaultTimeout)
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Archive'")
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .click('a.archivebin.button.group').pause(client.globals.defaultTimeout)
            .pause(client.globals.defaultTimeout)
            .click('a.toppanel-button.homebtn').pause(client.globals.defaultTimeout)
            .click('#toggleArchive')
            .assert.urlMatch(/\/\w+\/edit\?/).pause(client.globals.defaultTimeout);
        client.url(function (response) {
            var url = response.value;
            var arrDataUrl = url.split('/');
            client
                .pause(client.globals.defaultTimeout)
                .click('tr[data-url="/' + arrDataUrl[3] + '/1"]')
                .pause(client.globals.defaultTimeout)
                .click('tr[data-url="/' + arrDataUrl[3] + '/1"]')
                .pause(client.globals.defaultTimeout)
        });
        client
            .assert.urlMatch(/\/\w+\/1\/edit\?html,js,output$/);

        client.end();
    },

    'Add your bin description test': function (client) {
        client
            .url(client.launch_url)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .click('#addmeta')
            .pause(client.globals.defaultTimeout)
            .assert.containsText('span.cm-string.highlight', '[add your bin description]')
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\/\w+\/edit\?html,output$/)
            .end();
    },
    'Clone test': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Clone'")
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow').pause(1000);
        client.url(function (response) {
            client.assert.urlMatch(/\/\w+\/edit\?html,js,output$/);
            var url = response.value;
            var arrDataUrl = url.split('/');
            client.click('#clone')
                .pause(client.globals.defaultTimeout)
                .url(function (response) {
                    client.assert.urlMatch(/\/\w+\/1\/edit\?html,js,output$/);
                    var urlClone = response.value;
                    var arrDataUrlClone = urlClone.split('/');
                    if (arrDataUrl[3] === arrDataUrlClone[3]) {
                        console.log('WARN: Two url are the same ' + arrDataUrl[3])
                        console.log(url);
                        console.log(arrDataUrl[3]);
                        console.log(urlClone);
                        console.log(arrDataUrlClone[3]);
                    }
                });
        });
        client.end();
    }

};