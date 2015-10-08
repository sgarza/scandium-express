var Promise = require('bluebird');
var expect = require('chai').expect;

require('./../../');

describe('Scandium-Express Unit Tests', function() {

  it('Should create a Role Instance', function() {
    var role = new Sc.Role('visitor');

    expect(role).is.an.instanceof(Sc.Role);
  });

  it('Should create a Resource Instance', function() {
    var resource = new Sc.Resource('videos');

    expect(resource).is.an.instanceof(Sc.Resource);
  });

  it('Should add a role to the ACL roles registry', function() {
    var role = new Sc.Role('visitor');

    Sc.ACL.addRole(role);

    expect(Sc.ACL.roles[role.id].instance).to.equal(role);
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
});
