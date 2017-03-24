exports.command = function () {
    return this
        .frame("sandbox")
        .pause(this.globals.defaultTimeout)
        .frame(0)
        .pause(this.globals.defaultTimeout);
};
