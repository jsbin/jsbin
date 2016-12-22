exports.command = function (username, key) {
    this
        .click('#loginbtn')
        .pause(this.globals.defaultTimeout)
        .setValue('#login-username', username)
        .setValue('#login-key', key)
        .pause(this.globals.defaultTimeout);
    this
        .click('input[value="Log in"]')
        .pause(this.globals.defaultTimeout);
    return this
};

