module.exports = {
    'Test HTML': function (client) {
        client
            .url(client.launch_url)
            .setHtml("jsbin") 
            .selectOutputFrame()
            .assert.containsText("body", "jsbin")
            .assert.urlMatch(/\/\w+\/edit\?html,output$/)
            .end();
    }
};
