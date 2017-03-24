exports.command = function (processor, callback) {
    return this
        .waitForElementVisible(".css .CodeMirror")
        .click("a[href='#cssprocessors']")
        .click("#processor-" + processor)
        .pause(this.globals.defaultTimeout);
};
