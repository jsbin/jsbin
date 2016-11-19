var bgColorProp = 'rgba(0, 0, 0, 1)';
module.exports = {
    'Test CSS without preprocessing ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-css')
            .setCssValue("body{background-color:#000}")
            .selectOutputFrame()
            .assert.outputBackgroundIs(bgColorProp)
            .end();
    },

    'Test CSS preprocessed with CSS  ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-css')
            .selectCssProcessor("css")
            .setCssValue("body{background-color:#000}")
            .selectOutputFrame()
            .assert.outputBackgroundIs(bgColorProp)
            .end();
    },

    'Test CSS preprocessed with Less  ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-css')
            .selectCssProcessor("less")
            .setCssValue("@color:#000;body{background-color:@color}")
            .selectOutputFrame()
            .assert.outputBackgroundIs(bgColorProp)
            .end();
    },

    'Test CSS preprocessed with Myth  ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-css')
            .selectCssProcessor("myth")
            .setCssValue(":root {--bgcolor: #000;}" +
                "body{background-color: var(--bgcolor)}")
            .selectOutputFrame()
            .assert.outputBackgroundIs(bgColorProp)
            .end();
    },

    'Test CSS preprocessed with Stylus  ': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-css')
            .selectCssProcessor("stylus")
            .setCssValue("body \n background-color #000")
            .selectOutputFrame()
            .assert.outputBackgroundIs(bgColorProp)
            .end();
    }
};
