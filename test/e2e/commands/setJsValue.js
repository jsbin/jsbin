exports.command = function (text) {
    return this
        .waitForElementVisible(".javascript .CodeMirror")
        .execute(function (text) {
            return $(".javascript .CodeMirror")[0].CodeMirror.setValue(text);
        }, [text]);
};
