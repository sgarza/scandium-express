var Promise = require('bluebird');
var expect = require('chai').expect;
var express = require('express');
var app = express();
var request = require('superagent');

require('./../');

// Create a resource
Sc.ACL.addResource(new Sc.Resource('videos'));

// Create a visitor role
Sc.ACL.addRole(new Sc.Role('Visitor'));

// Create a User role that inherits from visitor
Sc.ACL.addRole(new Sc.Role('User'), 'Visitor');

// Create the visitor rule to edit videos
Sc.ACL.allow('Visitor', 'edit', 'videos', function(acl, req) {
  var promise = Promise.resolve();

  return promise.then(function() {
    return false;
  });
});

// Create the User rule to edit videos
Sc.ACL.allow('User', 'edit', 'videos', function(acl, req) {
  var promise = Promise.resolve();

  return promise.then(function() {
    return true;
  });
});

// Mock session
var session = {};

app.use(function(req, res, next) {
  req.role = session.role;
  next();
})

// App route
app.get('/edit-video', Sc.ACL.can('edit', 'videos'), function(req, res, next) {
  res.send('ok').status(200);
});

// Error handler middleware
app.use(function(err, req, res, next) {
  if (err.name === 'ForbiddenError') {
    return res.status(403).send(err);
  }

  next();
});

app.listen(4444);

describe('Integration Tests', function() {

  it('Sould deny access for Visitor', function(done) {
    // Mock session role
    session.role = 'Visitor';

    request.get('http://localhost:4444/edit-video')
      .end(function(err, res) {
        expect(err.status).to.be.eql(403);
        done();
      });
  });

  it('Sould allow access for User', function(done) {
    // Mock session role
    session.role = 'User';

    request.get('http://localhost:4444/edit-video')
      .end(function(err, res) {
        expect(res.status).to.be.eql(200);
        done();
      });
  });
});
