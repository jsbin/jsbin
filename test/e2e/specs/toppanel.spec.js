module.exports = {
 'Basic top panel test': function (client){
   var data = client.globals;
   client
    .url(client.launch_url)
    .click('.toppanel-hide')
    .waitForElementNotVisible('.toppanel-hide')
    .click('.toppanel-logo')
    .waitForElementVisible('.toppanel-hide')
    .assert.urlMatch(/\/\?html,output$/)
    .end();
 }
};