exports.command = function (text) {
    return this
        .waitForElementVisible('.html .CodeMirror')
        .execute(function (text) {
            return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
        }, [text]);
};
