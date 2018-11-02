'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const requireHelper = require('../../require_helper.js');
const SecurityController = requireHelper('lib/securityCodeRegistration/SecurityController');

describe('./lib/securityCodeRegistration/SecurityController.js', function() {
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
          id: '42',
          name: 'Security Code Device',
          reachable: true,
        }]);
      });
  });

  it('should return promise of security code', function() {
    // GIVEN
    const code = 'test-code';
    controller._securityCode = code;
    // WHEN
    return controller.getTextLabelValue()
      .then((result) => {
        // THEN
        expect(result).to.equal(code);
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

  it('should fail to register without securityCode', function() {
    // GIVEN
    const credentials = {};
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('INVALID_PAYLOAD_DATA');
        expect(error.status).to.equal(400);
      });
  });

  it('should fail to register with the wrong securityCode', function() {
    // GIVEN
    const credentials = {
      securityCode: '420',
    };
    // WHEN
    return controller.register(credentials)
      .catch((error) => {
        // THEN
        expect(error.message).to.equal('This cannot be the answer.');
      });
  });

  it('should register with the correct securityCode', function() {
    // GIVEN
    const credentials = {
      securityCode: '42',
    };
    // WHEN
    return controller.register(credentials)
      .catch(() => {
        // THEN
        expect.fail();
      });
  });
});
