'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const requireHelper = require('../../require_helper.js');
const PlayerController = requireHelper('lib/playerComponent/PlayerController');
const PlayerService = requireHelper('lib/playerComponent/PlayerService');
const browserService = requireHelper('lib/playerComponent/browserService');

describe('./lib/playerComponent/PlayerController.js', function() {
  const sandbox = sinon.createSandbox();
  let playerController, dummyFunction;

  beforeEach(function() {
    playerController = PlayerController.build();

    dummyFunction = sinon.stub().resolves();
    playerController.initialize();
    playerController.setNotificationCallbacks(dummyFunction);

    sandbox.spy(PlayerService, 'build');
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('build', function() {
    it('should build instance', function() {
      expect(playerController instanceof PlayerController).to.equal(true);
    });

    it('should enable notifications', function() {
      expect(playerController._notificationsEnabled).to.equal(true);
    });

    it('should initialize callbacks', function() {
      [
        'playSwitch',
        'muteSwitch',
        'shuffleSwitch',
        'repeatSwitch',
        'volumeSlider',
        'coverArtSensor',
        'titleSensor',
        'descriptionSensor',
        'volumeSlider',
      ]
        .forEach((element) => {
          expect(playerController[element].getter).to.be.a('function');
          expect(playerController[element].setter).to.be.a('function');
        });
    });

    it('should initialize directory callbacks', function() {
      expect(playerController.browseRoot.getter).to.be.a('function');
      expect(playerController.browseQueue.getter).to.be.a('function');
    });
  });

  describe('initialize', function() {
    it('should initialize PlayerService', function() {
      playerController.initialize();

      expect(PlayerService.build).to.have.been.called;
    });
  });

  describe('notifications', function() {
    it('should set function', function() {
      playerController.setNotificationCallbacks(dummyFunction);

      expect(playerController.sendMessageToBrainFunction).to.be.a('function');
    });

    it('should call notification function', function() {
      const uniqueDeviceId = '1234';
      const component = 'COMPONENT';
      const value = 5;
      playerController.setNotificationCallbacks(dummyFunction);

      playerController.sendNotificationToBrain(uniqueDeviceId, component, value);

      expect(dummyFunction).to.have.been.calledWith({ uniqueDeviceId, component, value });
    });
  });

  describe('callbacks', function() {

    beforeEach(function() {
      sinon.spy(playerController.playerService, 'getState');
      sinon.spy(playerController.playerService, 'updateState');
    });

    it('should correctly call getState in _getCallback (getter)', function() {
      const deviceId = '1234';
      const expectedComponent = 'PLAYING';

      playerController.playSwitch.getter(deviceId);

      expect(playerController.playerService.getState).to.have.been.calledWith({ deviceId, key: expectedComponent });
    });

    it('should correctly call updateState in _getCallback (setter)', function() {
      const deviceId = '1234';
      const value = false;
      const expectedComponent = 'PLAYING';

      playerController.playSwitch.setter(deviceId, value);

      expect(playerController.playerService.updateState).to.have.been.calledWith({ deviceId, key: expectedComponent, value });
    });
  });

  describe('queue callbacks', function() {
    beforeEach(function() {
      sandbox.stub(browserService, 'browse').resolves();
    });

    it('should correctly call queue browse (getter)', function() {
      const deviceId = '1234';
      const params = {};

      playerController.browseQueue.getter(deviceId, params);

      expect(browserService.browse).to.have.been.calledWith({ deviceId, params, showQueue: true });
    });

    it('should correctly update title (action)', function() {
      const uniqueDeviceId = '1234';
      const params = {
        actionIdentifier: 'ACTION!',
      };

      playerController.browseQueue.action(uniqueDeviceId, params);

      expect(dummyFunction).to.have.been.calledWith({ uniqueDeviceId, component: 'TITLE_SENSOR', value: params.actionIdentifier });
    });
  });

  describe('root callbacks', function() {
    beforeEach(function() {
      sandbox.stub(browserService, 'browse').resolves();
    });

    it('should correctly call queue browse (getter)', function() {
      const deviceId = '1234';
      const params = {};

      playerController.browseRoot.getter(deviceId, params);

      expect(browserService.browse).to.have.been.calledWith({ deviceId, params, showRoot: true });
    });

    it('should correctly update title (action)', function() {
      const uniqueDeviceId = '1234';
      const params = {
        actionIdentifier: 'ACTION!',
      };

      playerController.browseRoot.action(uniqueDeviceId, params);

      expect(dummyFunction).to.have.been.calledWith({ uniqueDeviceId, component: 'TITLE_SENSOR', value: params.actionIdentifier });
    });
  });

  describe('onButtonPressed', function() {
    let deviceId;

    beforeEach(function() {
      deviceId = '1234';
      sandbox.stub(browserService, 'browse').resolves();
    });

    it('should handle PLAY', function() {
      sandbox.stub(playerController.playSwitch, 'setter');

      playerController.onButtonPressed('PLAY', deviceId);

      expect(playerController.playSwitch.setter).to.have.been.calledWith(deviceId, true);
    });

    it('should handle PLAY TOGGLE - playing', function() {
      sandbox.stub(playerController.playSwitch, 'getter').returns(true);
      sandbox.stub(playerController.playSwitch, 'setter');

      playerController.onButtonPressed('PLAY TOGGLE', deviceId);

      expect(playerController.playSwitch.setter).to.have.been.calledWith(deviceId, false);
    });

    it('should handle PLAY TOGGLE - not playing', function() {
      sandbox.stub(playerController.playSwitch, 'getter').returns(false);
      sandbox.stub(playerController.playSwitch, 'setter');

      playerController.onButtonPressed('PLAY TOGGLE', deviceId);

      expect(playerController.playSwitch.setter).to.have.been.calledWith(deviceId, true);
    });

    it('should handle PAUSE', function() {
      sandbox.stub(playerController.playSwitch, 'setter');

      playerController.onButtonPressed('PAUSE', deviceId);

      expect(playerController.playSwitch.setter).to.have.been.calledWith(deviceId, false);
    });

    it('should handle VOLUME UP - not playing', function() {
      const initialVolume = 10;
      sandbox.stub(playerController.volumeSlider, 'getter').returns(initialVolume);
      sandbox.stub(playerController.volumeSlider, 'setter');

      playerController.onButtonPressed('VOLUME UP', deviceId);

      expect(playerController.volumeSlider.setter).to.have.been.calledWith(deviceId, 15);
    });

    it('should handle VOLUME DOWN - not playing', function() {
      const initialVolume = 10;
      sandbox.stub(playerController.volumeSlider, 'getter').returns(initialVolume);
      sandbox.stub(playerController.volumeSlider, 'setter');

      playerController.onButtonPressed('VOLUME DOWN', deviceId);

      expect(playerController.volumeSlider.setter).to.have.been.calledWith(deviceId, 5);
    });

    it('should handle NEXT TRACK', function() {
      sandbox.stub(playerController.titleSensor, 'setter');

      playerController.onButtonPressed('NEXT TRACK', deviceId);

      expect(playerController.titleSensor.setter).to.have.been.calledWith(deviceId, 'NEXT TRACK');
    });

    it('should handle PREVIOUS TRACK', function() {
      sandbox.stub(playerController.titleSensor, 'setter');

      playerController.onButtonPressed('PREVIOUS TRACK', deviceId);

      expect(playerController.titleSensor.setter).to.have.been.calledWith(deviceId, 'PREVIOUS TRACK');
    });
  });
});
