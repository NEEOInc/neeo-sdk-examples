'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');
const LifxMock = require('./lifxmock');
const requireHelper = require('../../../require_helper.js');
const neeoapi = require('neeo-sdk');

describe('./lib/device/lifx-local/lifxservice.js', function() {
  const sandbox = sinon.sandbox.create();
  const ID = '0123deadbeef';
  let lifxService, deviceState;
  let clientState, onDuration, offDuration, clientParameter, ambientLight;

  beforeEach(function() {
    mockery.enable({ warnOnReplace: true, warnOnUnregistered: false, useCleanCache: true });
    mockery.registerMock('./lifxdeps', LifxMock);

    clientState = {};
    clientParameter = {};
    ambientLight = undefined;
    onDuration = undefined;
    offDuration = undefined;
    deviceState = neeoapi.buildDeviceState();
    const LifxService = requireHelper('lib/device/lifx-local/lifxservice');
    lifxService = new LifxService(deviceState);
  });

  afterEach(function() {
    lifxService.stop();
    sandbox.restore();
    mockery.deregisterAll();
    mockery.disable();
  });

  function getClientObject() {
    return {
      getState: (callback) => {
        callback(null, clientState);
      },
      getAmbientLight: (callback) => {
        callback(null, ambientLight);
      },
      on: (duration) => {
        onDuration = duration;
      },
      off: (duration) => {
        offDuration = duration;
      },
      color: (hue, saturation, brightness, kelvin, fadeTime) => {
        clientParameter = {
          hue, saturation, brightness, kelvin, fadeTime
        };
      },
    };
  }

  it('should fail when non existant device is requested', function() {
    return lifxService.getBrightness(ID)
      .catch((error) => {
        expect(error.message).to.equal('NOT_REACHABLE');
      });
  });

  it('should fail to get brightness value when invalid data is returned', function() {
    clientState = {};
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getBrightness(ID)
    .catch((error) => {
      expect(error.message).to.equal('INVALID_ANSWER');
    });
  });

  it('should return brightness value for a registered device', function() {
    clientState = {
      color: {
        brightness: 50
      }
    };
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getBrightness(ID)
      .then((result) => {
        expect(result).to.equal(50);
      });
  });

  function setValidColorState() {
    clientState = {
      color: {
        hue: 1,
        saturation: 2,
        brightness: 50,
        kelvin: 1000,
      },
    };
  }

  it('should update brightness, power on lamp first', function() {
    const NEW_BRIGHTNESS = 42;
    setValidColorState();
    deviceState.addDevice(ID, getClientObject());
    return lifxService.setBrightness(ID, NEW_BRIGHTNESS)
      .then(() => {
        expect(onDuration).to.equal(0);
        expect(clientParameter.hue).to.equal(1);
        expect(clientParameter.saturation).to.equal(2);
        expect(clientParameter.brightness).to.equal(NEW_BRIGHTNESS);
        expect(clientParameter.kelvin).to.equal(1000);
        expect(clientParameter.fadeTime).to.equal(200);
      });
  });

  it('should update brightness, dont power on lamp when already powered on', function() {
    const NEW_BRIGHTNESS = 42;
    setValidColorState();
    clientState.power = 1;

    deviceState.addDevice(ID, getClientObject());
    return lifxService.setBrightness(ID, NEW_BRIGHTNESS)
      .then(() => {
        expect(onDuration).to.equal(undefined);
        expect(clientParameter.brightness).to.equal(NEW_BRIGHTNESS);
      });
  });

  function setPowerOnState() {
    setValidColorState();
    clientState.power = 1;
  }
  function setPowerOffState() {
    setValidColorState();
  }

  it('should get powerstate on', function() {
    setPowerOnState();
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getPowerState(ID)
      .then((result) => {
        expect(result).to.equal(true);
      });
  });

  it('should get powerstate off', function() {
    setPowerOffState();
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getPowerState(ID)
      .then((result) => {
        expect(result).to.equal(false);
      });
  });

  it('should set powerstate on', function() {
    deviceState.addDevice(ID, getClientObject());
    return lifxService.setPowerState(ID, true)
      .then(() => {
        expect(onDuration > 0).to.equal(true);
      });
  });

  it('should set powerstate off', function() {
    deviceState.addDevice(ID, getClientObject());
    return lifxService.setPowerState(ID, false)
      .then(() => {
        expect(offDuration > 0).to.equal(true);
      });
  });

  it('should powertoggle on -> off', function() {
    setPowerOnState();
    deviceState.addDevice(ID, getClientObject());
    return lifxService.powerToggle(ID)
      .then(() => {
        expect(offDuration > 0).to.equal(true);
      });
  });

  it('should powertoggle off -> on', function() {
    setPowerOffState();
    deviceState.addDevice(ID, getClientObject());
    return lifxService.powerToggle(ID)
      .then(() => {
        expect(onDuration > 0).to.equal(true);
      });
  });

  it('should getAmbientLight, lowest value', function() {
    setValidColorState();
    ambientLight = 0;
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getAmbientLight(ID)
      .then((result) => {
        expect(result).to.equal(0);
      });
  });

  it('should getAmbientLight, highest value', function() {
    setValidColorState();
    ambientLight = 400;
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getAmbientLight(ID)
      .then((result) => {
        expect(result).to.equal(10);
      });
  });

  it('should getAmbientLight, too high value', function() {
    setValidColorState();
    ambientLight = 4000;
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getAmbientLight(ID)
      .then((result) => {
        expect(result).to.equal(10);
      });
  });

  it('should getAmbientLight, negative value', function() {
    setValidColorState();
    ambientLight = -4;
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getAmbientLight(ID)
      .catch((error) => {
        expect(error.message).to.equal('NO_STATE_RECIEVED');
      });
  });

  it('should getStateForPolling', function() {
    setValidColorState();
    ambientLight = 400;
    deviceState.addDevice(ID, getClientObject());
    return lifxService.getStateForPolling(ID)
      .then((result) => {
        expect(result).to.deep.equal({
          brightness: 50,
          power: false,
           ambientlight: 10
        });
      });
  });


});
