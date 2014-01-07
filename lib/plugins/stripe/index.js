module.exports = function(options, app) {

  if (options.payment && options.payment.stripe) {
    require('./routes')(app, options.payment.stripe);
  } else {
    console.log('no support for stripe');
  }

};
