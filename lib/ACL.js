Sc.ACL = Class(Sc, 'ACL')({
  TYPE_ALLOW : 'TYPE_ALLOW',
  TYPE_DENY : 'TYPE_DENY',
  roles : {},
  resources : {},
  rules : {
    allResources : {
      allRoles : {
        allPrivileges : {
          type : 'TYPE_DENY',
          assert : null
        }
      }
    }
  },

  addRole : function(role, parents) {
    if (!this.roles[role.id]) {
      this.roles[role.id] = {
        instance : role,
        parents : [],
        children : []
      }

      if (parents) {
        if (parents.constructor === String) {
          parents = [parents];
        }

        for (var i = 0; i < parents.length; i++) {
          if (!this.roles[parents[i]]) {
            throw new Error('Role ' + parents[i] + ' does not exists');
          }

          this.roles[role.id].parents.push(this.roles[parents[i]].instance);
          this.roles[parents[i]].children.push(this.roles[role.id].instance);
        }
      }
    }

    return this;
  },

  addResource : function(resource) {
    this.resources[resource.id] = resource;
  },

  setRule : function(action, resource, role, assert, type) {
    if (!this.rules[resource]) {
      this.rules[resource] = {}
    }

    if (!this.rules[resource][role]) {
      this.rules[resource][role] = {}
    }

    if (!this.rules[resource][role][action]) {
      this.rules[resource][role][action] = {}
    }

    this.rules[resource][role][action] = {
      type : type,
      assert : assert
    }
  },

  allow : function(actions, resources, role, assertPromise) {
    var acl = this;

    if ((actions instanceof Array) === false) {
      actions = [actions];
    }

    if ((resources instanceof Array) === false) {
      resources = [resources];
    }

    resources.forEach(function(resource) {
      actions.forEach(function(action) {
        acl.setRule(action, resource, role, assertPromise, acl.TYPE_ALLOW);
      });
    });
  },

  can : function(role, action, resource) {
    var assertResult;

    var rule = this.getRule(action, resource, role, true);

    return function(req, res, next) {
      rule.assert(this, req).then(function(isAllowed) {
        if (isAllowed) {
          return next();
        } else {
          var err = new Error();
          err.name    = 'ForbiddenError';
          err.message = 'Not Authorized';

          return next(err);
        }
      });
    }

    if (rule.assert) {
      assertResult = rule.assert(this);
    } else {
      assertResult = true;
    }

    if (assertResult && rule.type === this.TYPE_ALLOW) {
      return true;
    }

    return false
  },

  hasRule : function(action, resource, role) {
    if (!this.rules[resource]) {
      resource = 'allResources';
    }

    if (!this.rules[resource][role] && this.rules.allResources[role]) {
      resource = 'allResources';
    }

    if (!this.rules[resource][role]) {
      return false;
    }

    if (!this.rules[resource][role][action] && !this.rules[resource][role].allPrivileges) {
      return false;
    }

    return true;
  },

  getRule : function(action, resource, role, init) {
    if ('allResources' !== resource && !this.resources[resource]) {
      throw new Error(resource + ' is not a resource');
    }

    if ('allRoles' !== role && !this.roles[role]) {
      throw new Error(role + ' is not a role');
    }

    if (this.hasRule(action, resource, role)) {
      if (!this.rules[resource]) {
        resource = 'allResources';
      }

      if (!this.rules[resource][role] && this.rules.allResources[role]) {
        resource = 'allResources';
      }

      if (!this.rules[resource][role]) {
        role = 'allRoles';
      }

      if (!this.rules[resource][role][action]) {
        action = 'allPrivileges';
      }

      return this.rules[resource][role][action];
    }

    var rule;

    for (var i = 0; i < this.roles[role].parents.length; i++) {
      role = this.getRule(action, resource, this.roles[role].parents[i].id);

      if (role) {
        return role;
      }
    }

    if (!init || this.roles[role].parents.length === 0) {
      return this.getRule(action, resource, 'allRoles');
    } else {
      return null;
    }
  }
});

module.exports = Sc.ACL;