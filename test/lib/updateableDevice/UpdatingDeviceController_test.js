'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const requireHelper = require('../../require_helper.js');
const UpdatingDeviceController = requireHelper('lib/updateableDevice/UpdatingDeviceController');

describe('./lib/updateableDevice/UpdatingDeviceController.js', function() {
  const sandbox = sinon.createSandbox();
  let controller;

  beforeEach(function() {
    controller = UpdatingDeviceController.build();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should build controller instance', function() {
    // THEN
    expect(controller).to.be.instanceof(UpdatingDeviceController);
  });

  it('should handle button press', function() {
    // GIVEN
    sandbox.stub(console, 'log');
    const testName = 'test-name';
    const testId = 'test-id';
    // WHEN
    controller.onButtonPressed(testName, testId);
    // THEN
    expect(console.log).to.have.been.calledOnce;
  });
});
