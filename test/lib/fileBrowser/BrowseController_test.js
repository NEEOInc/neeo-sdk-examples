'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const requireHelper = require('../../require_helper.js');
const BrowseController = requireHelper('lib/fileBrowser/BrowseController');

const deviceId = 'default';

describe('./lib/fileBrowser/BrowseController.js', function() {
  let sandbox, controller;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    controller = BrowseController.build();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should build controller instance', function() {
    expect(controller).to.be.instanceof(BrowseController);
  });

  describe('browse', function() {
    beforeEach(function() {
      sandbox.stub(controller, 'fetchList');
      sandbox.stub(controller, 'handleListAction');
    });

    it('should allow getter without context', function() {
      const getter = controller.browse.getter;
      const params = {};

      getter(deviceId, params);

      expect(controller.fetchList).to.have.been.calledWith(deviceId, params);
    });

    it('should allow action without context', function() {
      const action = controller.browse.action;
      const params = {};

      action(deviceId, params);

      expect(controller.handleListAction).to.have.been.calledWith(deviceId, params);
    });
  });
});
