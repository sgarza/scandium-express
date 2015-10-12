Sc.Helpers = Module(Sc, 'Helpers')({
  allOf : function() {
    var args = Array.prototype.slice.call(arguments, 0);

    var all = true;

    for (var i = 0; i < args.length; i++) {
      if (args[i] === false) {
        all = false;
        break;
      }
    }

    return all;
  },

  anyOf : function() {
    var args = Array.prototype.slice.call(arguments, 0);

    var any = false;

    for (var i = 0; i < args.length; i++) {
      if (args[i] === true) {
        any = true;
        break;
      }
    }

    return any;
  }
});

module.exports = Sc.Helpers;
