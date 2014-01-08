var Observable = require('../utils').Observable;

module.exports = Observable.extend({
  constructor: function CustomerModel(store) {
    Observable.call(this);
    this.store = store;
  },
  setCustomer: function () {
    //this.store.setCustomer(/* TODO */);
  },
  getCustomerByStripeId: function () {
                           
  },
  getCustomerByUser: function () {
                     
  }
});
