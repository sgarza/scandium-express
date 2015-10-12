var Promise = require('bluebird');
var expect = require('chai').expect;

require('./../');

describe('Scandium-Express Unit Tests', function() {

  it('Should create a Role Instance', function() {
    var role = new Sc.Role('visitor');

    expect(role).is.an.instanceof(Sc.Role);
  });

  it('Should fail to create a Role Instance', function() {
    expect(function() { return new Sc.Role()}).to.throw(Error)
  })

  it('Should create a Resource Instance', function() {
    var resource = new Sc.Resource('videos');

    expect(resource).is.an.instanceof(Sc.Resource);
  });

  it('Should fail to create a Resource Instance', function() {
    expect(function() { return new Sc.Resource()}).to.throw(Error)
  })

  it('Should add a role to the ACL roles registry', function() {
    var role = new Sc.Role('visitor');

    Sc.ACL.addRole(role);

    expect(Sc.ACL.roles[role.id].instance).to.equal(role);
  });

  it('Should fail when adding a role that already exists', function() {
    var role = new Sc.Role('visitor');

    expect(function() { return Sc.ACL.addRole(role)}).to.throw(Error);
  });

  it('Should add a resource to the ACL resources registry', function() {
    var res = new Sc.Resource('videos');

    Sc.ACL.addResource(res);

    expect(Sc.ACL.resources[res.id]).to.equal(res);
  });

  it('Should add a role with a parent role to the registy', function() {
    var role = new Sc.Role('user');

    Sc.ACL.addRole(role, 'visitor');

    expect(Sc.ACL.roles[role.id].instance).to.equal(role);

    expect(Sc.ACL.roles[role.id].parents).include(Sc.ACL.roles['visitor'].instance);
  });

  it('Should add a role with parents roles to the registy', function() {
    var role = new Sc.Role('admin');

    Sc.ACL.addRole(role, ['user', 'visitor']);

    expect(Sc.ACL.roles[role.id].instance).to.equal(role);

    expect(Sc.ACL.roles[role.id].parents).include(Sc.ACL.roles['visitor'].instance);
    expect(Sc.ACL.roles[role.id].parents).include(Sc.ACL.roles['user'].instance);
  });

  it('Should fail when adding a role and the parent doesnt exists', function() {
    var role = new Sc.Role('superadmin');

    expect(function() { return Sc.ACL.addRole(role, 'superuser')}).to.throw(Error);
  });

  it('Should create a new allow rule', function() {
    var allow = true;

    Sc.ACL.allow('admin', 'edit', 'videos', Promise.resolve().then(function() {
      if (allow) {
        return true;
      }

      return false
    }));

    expect(Sc.ACL.hasRule('edit', 'videos', 'admin')).to.be.equal(true);
    expect(Sc.ACL.getRule('edit', 'videos', 'admin', true).assert).is.an.instanceof(Promise);
  });

  it('Sc.Helpers.allOf Should return true if all the arguments are true', function() {
    var allOf = Sc.Helpers.allOf(true, true, true, true, true);

    expect(allOf).to.be.eql(true);
  });

  it('Sc.Helpers.allOf Should return false if one or more of the arguments are false', function() {
    var allOf = Sc.Helpers.allOf(true, true, true, false, true);

    expect(allOf).to.be.eql(false);
  });

  it('Sc.Helpers.anyOf Should return true if any of the args is true', function() {
    var anyOf = Sc.Helpers.anyOf(false, false, true, false);

    expect(anyOf).to.be.eql(true);
  });

  it('Sc.Helpers.anyOf Should return false if all of the args are false', function() {
    var anyOf = Sc.Helpers.anyOf(false, false);

    expect(anyOf).to.be.eql(false);
  });
});
