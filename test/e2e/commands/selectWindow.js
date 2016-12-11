exports.command = function (number, callback) {
    return this
              .windowHandles(function(result) {
     var handle = result.value[number];
     this.switchWindow(handle);
   })

};
