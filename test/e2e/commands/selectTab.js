exports.command = function(processor, callback) {
    const processorToSelectorMapping = {
        'JavaScript': '#panel-javascript',
        'CSS': '#panel-css'
    };
    this
        .waitForElementVisible(processorToSelectorMapping[processor])
        .click(processorToSelectorMapping[processor]);
    return this;
};
