exports.command = function (text) {
    return this
        .waitForElementVisible(".css .CodeMirror")
        .execute(function (text) {
            return $(".css .CodeMirror")[0].CodeMirror.setValue(text);
        }, [text]);
};
