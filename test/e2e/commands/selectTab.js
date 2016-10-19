exports.command = function(selector, callback) {
    var data = this.globals;

        if(selector === 'JavaScript'){
            this
            .waitForElementVisible('#panel-javascript')
            .click('#panel-javascript')
        }
        else if(selector === 'CSS'){
           this
            .waitForElementVisible('#panel-css')
            .click('#panel-css')

        }
  return this; // allows the command to be chained.
};
