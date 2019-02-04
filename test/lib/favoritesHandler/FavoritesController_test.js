'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const requireHelper = require('../../require_helper.js');
const FavoritesController = requireHelper('lib/favoritesHandler/FavoritesController');

const deviceId = 'default';
const POWER_ON = 'POWER ON';

describe('./lib/favoritesHandler/FavoritesController.js', function() {
  let sandbox, controller;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    controller = FavoritesController.build();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should build controller instance', function() {
    expect(controller).to.be.instanceof(FavoritesController);
  });

  describe('onButtonPressed', function() {
    it('should handle button without error', function() {
      expect(() => {
        controller.onButtonPressed(POWER_ON, deviceId);
      }).to.not.throw();
    });
  });

  describe('executeFavorite', function() {
    it('should handle favorite without error', function() {
      expect(() => {
        controller.executeFavorite('421', deviceId);
      }).to.not.throw();
    });
  });
});
