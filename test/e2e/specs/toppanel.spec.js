module.exports = {
 'Basic top panel test': function (client){
   var data = client.globals;
   client
    .url(client.launch_url)
    .waitForElementVisible('.toppanel-hide')
    .click('.toppanel-hide')
    .pause(data.defaultTime)
    .waitForElementNotVisible('.toppanel-hide')
    .click('.toppanel-logo')
    .waitForElementVisible('.toppanel-hide')
    .assert.urlMatch(/\/\?html,output$/)//real server adress ?html,css,output$/ . You need to find out why an address ?html,output
    .end();
 }
};