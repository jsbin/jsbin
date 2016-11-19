exports.command = function (processor, callback) {
    return this
        .waitForElementVisible('.javascript .CodeMirror')
        .click('a[href="#javascriptprocessors"]')
        .click('#processor-' + processor).pause(this.globals.defaultTimeout)
};
