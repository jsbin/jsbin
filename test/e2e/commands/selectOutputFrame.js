exports.command = function() {
    this
    .frame('iframe-live-one')
    .pause(this.globals.defaultTimeout)
    .frame(0)
    .pause(this.globals.defaultTimeout);

  return this;
};
