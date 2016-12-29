module.exports = {
    'Test JavaScript without preprocessing': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .waitForElementVisible('.javascript .CodeMirror')
            .setJsValue("document.body.innerHTML = 'Hello'")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
            .end();
    },

    'Test JavaScript preprocessed with JavaScript': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("javascript")
            .setJsValue("document.body.innerHTML = 'Hello'")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with Babel': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("babel")
            .setJsValue("let value = `\nHello`;\ndocument.body.innerHTML = value;")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with JSX': function (client) {
        client
            .url(client.launch_url)
            .setHtml("<div id='root'> </div>")
            .selectTab('#panel-javascript')
            .selectJsProcessor("jsx")
            .setJsValue("ReactDOM.render\n(<div>Hello</div>,\n document.getElementById('root'));")
            .selectOutputFrame()
            .pause(1000)
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with CoffeeScript': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("coffeescript")
            .setJsValue("class Foo\n bar: 'Hello'\nobj = new Foo()\ndocument.body.innerHTML = obj.bar")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with Traceur': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("traceur")
            .setJsValue("const value = 'Hello';\ndocument.body.innerHTML = value;")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with TypeScript': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("typescript")
            .setJsValue("let value: string = 'Hello';\ndocument.body.innerHTML = value;")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    },

    'Test JavaScript preprocessed with Processing': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("processing")
            .setJsValue("size(200, 200);")
            .selectOutputFrame()
            .assert.attributeEquals("canvas", "width", "200")
            .assert.attributeEquals("canvas", "height", "200")
            .end();
    },

    'Test JavaScript preprocessed with LiveScript': function (client) {
        client
            .url(client.launch_url)
            .selectTab('#panel-javascript')
            .selectJsProcessor("livescript")
            .setJsValue("value = \\Hello;\ndocument.body.innerHTML = value;")
            .selectOutputFrame()
            .assert.containsText('body', 'Hello')
            .end();
    }

};