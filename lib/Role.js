Sc.Role = Class(Sc, 'Role')({
  prototype : {
    id : null,

    init : function(id) {
      if (!id) {
        throw new Error('Invalid role id');
      }

      this.id = id;

      return this;
    }
  }
});

module.exports = Sc.Role;
