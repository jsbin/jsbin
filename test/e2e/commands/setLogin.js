exports.command = function (username, key) {
    this
        .url(this.launch_url + 'login')
        .pause(this.globals.defaultTimeout)
        .setValue('#login-username', username)
        .setValue('#login-key', key)
        .pause(this.globals.defaultTimeout);
    this
        .click('input[value="Log in"]')
        .pause(this.globals.defaultTimeoutMax);
    return this
};

