'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const mockery = require('mockery');
const requireHelper = require('../../require_helper.js');

describe('./lib/dynamicDeviceBuilder/index.js', function() {
  const sandbox = sinon.createSandbox();
  let adapter, controller;

  beforeEach(function() {
    mockery.enable({ warnOnReplace: true, warnOnUnregistered: false, useCleanCache: true });

    controller = {
      build: sandbox.stub(),
    };

    mockery.registerMock('./LightController', controller);
    adapter = requireHelper('lib/dynamicDeviceBuilder');
  });

  afterEach(function() {
    sandbox.restore();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should export a device', function() {
    expect(adapter.devices).to.have.length(1);
  });

  it('should have built controller', function() {
    expect(controller.build).to.have.been.calledOnce;
  });

  it('should have enabled dynamic device discovery', function() {
    const device = adapter.devices[0];
    expect(device.setup.enableDynamicDeviceBuilder).to.equal(true);
  });
});
