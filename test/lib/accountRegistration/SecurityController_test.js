'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const requireHelper = require('../../require_helper.js');
const SecurityController = requireHelper('lib/accountRegistration/SecurityController');

describe('./lib/accountRegistration/SecurityController.js', function() {
  let sandbox, controller;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    controller = SecurityController.build();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should build controller instance', function() {
    // THEN
    expect(controller).to.be.instanceof(SecurityController);
  });

  it('should return promise of registered state', function() {
    // GIVEN
    const isRegistered = true;
    controller._registered = isRegistered;
    // WHEN
    return controller.isRegistered()
      .then((result) => {
        // THEN
        expect(result).to.equal(isRegistered);
      });
  });

  it('should return promise of devices', function() {
    // WHEN
    return controller.discoverDevices()
      .then((result) => {
        // THEN
        expect(result).to.deep.equal([{
          id: 'account-security-device',
          name: 'Security Code Device',
          reachable: true,
        }]);
      });
  });

  it('should return promise of textlabel value when not registerd', function() {
    // WHEN
    return controller.getTextLabelValue()
      .then((result) => {
        // THEN
        expect(result).to.equal('not logged in');
      });
  });

  it('should return promise of textlabel value when not registerd', function() {
    // GIVEN
    controller._username = 'test-user';
    // WHEN
    return controller.getTextLabelValue()
      .then((result) => {
        // THEN
        expect(result).to.equal('test-user');
      });
  });

  it('should fail to register without credentials', function() {
    // WHEN
    return controller.register()
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('INVALID_PAYLOAD_DATA');
        expect(error.status).to.equal(400);
      });
  });

  it('should fail to register without username', function() {
    // GIVEN
    const credentials = { password: 'test-password' };
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('INVALID_PAYLOAD_DATA');
        expect(error.status).to.equal(400);
      });
  });

  it('should fail to register without password', function() {
    // GIVEN
    const credentials = { username: 'test-username' };
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('INVALID_PAYLOAD_DATA');
        expect(error.status).to.equal(400);
      });
  });

  it('should fail to register with the wrong username', function() {
    // GIVEN
    const credentials = {
      username: 'wrong-username',
      password: 'hunter2',
    };
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('Incorrect username or password.');
      });
  });

  it('should fail to register with the wrong password', function() {
    // GIVEN
    const credentials = {
      username: 'sdkuser',
      password: 'wrong-password',
    };
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('Incorrect username or password.');
      });
  });

  it('should register with the correct securityCode', function() {
    // GIVEN
    const credentials = {
      username: 'sdkuser',
      password: 'hunter2',
    };
    // WHEN
    return controller.register(credentials)
      .catch(() => {
        // THEN
        expect.fail();
      });
  });
});
