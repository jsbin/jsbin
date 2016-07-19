module.exports = {
  sendMail: function (email, callback) {
    if (email.quiet) {
      return callback(null, email);
    }
    console.log('--------- DUMMY EMAIL ---------');
    console.log(email);
    console.log('-------------------------------');
    callback(null, email);
  }
};