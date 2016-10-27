exports.command = function() {
    this
    .frame(1)
    .pause(data.defaultTimeout)
    .frame(0);

  return this; // allows the command to be chained.
};
