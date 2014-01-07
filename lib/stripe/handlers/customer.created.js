module.exports = function (customer, fn) {
  // Get user by customer.email;
  // user.name(id) => customer.id
  // insert into customer table
  // ↓↓ if all is well 
  fn();
};
