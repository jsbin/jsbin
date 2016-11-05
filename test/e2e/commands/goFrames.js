exports.command = function() {
    var data = this.globals;
    this
    .frame(1)
    .pause(data.defaultTimeout)
    .frame(0);

  return this; // allows the command to be chained.
};
