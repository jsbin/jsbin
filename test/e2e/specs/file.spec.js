module.exports = {
    'Create fresh bin test': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Hello'")
            .pause(1000)
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .click('#createnew')
            .pause(1000)
            .assert.urlMatch(/\/\?html,js,output/)
            .end();
    },
    'Archive and Unarchive  bin test': function (client) {
        client
            .url(client.launch_url)
            .setLogin('yourmail', '123')
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Archive'")
            .pause(1000)
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .click('a.archivebin.button.group')
            .pause(client.globals.defaultTimeout)
            .click('a.toppanel-button.homebtn')
            .pause(client.globals.defaultTimeout)
            .click('#toggleArchive')
            .assert.urlMatch(/\/\w+\/edit\?/)
            .pause(client.globals.defaultTimeout);
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
            .assert.urlMatch(/\/\w+\/1\/edit\?html,js,output$/)
            .click('a.toppanel-button.homebtn')
            .pause(client.globals.defaultTimeout)
            .click('#toggleArchive')
            .url(function (response) {
                var url = response.value;
                var arrDataUrl = url.split('/');
                client
                    .pause(client.globals.defaultTimeout)
                    .click('tr[data-url="/' + arrDataUrl[3] + '/1"]')
                    .pause(client.globals.defaultTimeout)
                    .click('.unarchive').pause(client.globals.defaultTimeout);
                client.expect.element('tr[data-url="/' + arrDataUrl[3] + '/1"]').to.be.not.visible;
            });
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
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .pause(client.globals.defaultTimeout);
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
                        console.log('WARN: Two url are the same ' + arrDataUrl[3]);
                        console.log(url);
                        console.log(arrDataUrl[3]);
                        console.log(urlClone);
                        console.log(arrDataUrlClone[3]);
                    }
                });
        });
        client.end();
    },
    'My bins test': function (client) {
        client
            .url(client.launch_url)
            .setLogin(client.globals.jsbin.login, client.globals.jsbin.password)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .pause(client.globals.defaultTimeout)
            .click('a[data-shortcut="ctrl+o"]')
            .pause(client.globals.defaultTimeout);
        client.expect.element('#history').to.be.visible;
        client.end();
    },
    'Save snapshot test': function (client) {
        client
            .url(client.launch_url)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .pause(client.globals.defaultTimeout)
            .click('a[data-shortcut="ctrl+s"]')
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\/\w+\/edit\?html,output$/)
            .end();
    },
    'Export as gist test': function (client) {
        client
            .url(client.launch_url)
            .click('a.brand.button.button-dropdown.group.button-dropdown-arrow')
            .pause(client.globals.defaultTimeout)
            .click('a[href="#export-to-gist"]')
            .pause(1000)
            .click('#tip a')
            .pause(client.globals.defaultTimeout)
            .selectWindow(1)
            .pause(client.globals.defaultTimeout)
            .assert.urlMatch(/\.github\.com\/anonymous\/[a-z0-9-]+/)
            .end();
    }
};