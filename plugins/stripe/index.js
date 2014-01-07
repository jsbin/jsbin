module.exports = function(options) {

  if (options.payment && options.payment.stripe) {
    return {
      initialize: function setupRoutes(app) {
        require('./routes')(app, options.payment.stripe);
      }
    };
  } else {
    return {
      initialize: function setupRoutes() {
        console.log('no support for stripe');
      }
    };
  }

};
