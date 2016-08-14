exports.command = function (processor, callback) {
    return this
        .waitForElementVisible(processor)
        .click(processor);
};
