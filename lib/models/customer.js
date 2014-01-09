var Observable = require('../utils').Observable;

module.exports = Observable.extend({
  constructor: function CustomerModel(store) {
    Observable.call(this);
    this.store = store;
  },
  setCustomer: function (customer, fn) {
    return this.store.setCustomer(customer, fn);
  },
  getCustomerByStripeId: function (id, fn) {
    return this.store.getCustomerByStripeId(id, fn); 
  },
  getCustomerByUser: function (user, fn) {
    return this.store.getCustomerByUser(user, fn);
  }
});
