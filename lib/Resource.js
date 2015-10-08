Sc.Resource = Class(Sc, 'Resource')({
  prototype : {
    id : null,

    init : function(id) {
      if (!id) {
        throw new Error('Invalid resource id');
      }

      this.id = id;

      return this;
    }
  }
});

module.exports = Sc.Resource;
