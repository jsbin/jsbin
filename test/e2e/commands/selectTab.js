exports.command = function(processor, callback) {
    var data = this.globals;
    const processorToSelectorMapping = {
    'JavaScript': '#panel-javascript',
    'CSS': '#panel-css'
    };
    this
    .waitForElementVisible(processorToSelectorMapping[processor])
    .click(processorToSelectorMapping[processor]);


  return this; // allows the command to be chained.
};
