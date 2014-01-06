module.exports = function(options) {

  if (options.payment && options.payment.stripe) {
    return function setupRoutes(app) {
      require('./routes')(app, options.payment.stripe);
    };
  } else {
    return function setupRoutes() {
      console.log('no support for stripe');
    };
  }

};
