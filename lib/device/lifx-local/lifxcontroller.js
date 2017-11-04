'use strict';

const debug = require('debug')('neeo:lifx-local:controller');
const LifxService = require('./lifxservice');
const neeoapi = require('neeo-sdk');

// the mobile app polls each 4500ms
const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';
const COMPONENT_AMBIENTLIGHT = 'ambientlight';

const deviceState = neeoapi.buildDeviceState();
let lifxService;
let sendMessageToBrainFunction;
let pollingIntervalId;

function setBrightness(deviceId, value) {
  return lifxService.setBrightness(deviceId, value);
}

function getBrightness(deviceId) {
  return lifxService.getBrightness(deviceId);
}

function setPowerState(deviceId, value) {
  return lifxService.setPowerState(deviceId, value);
}

function getPowerState(deviceId) {
  return lifxService.getPowerState(deviceId);
}

function getAmbientLightSensor(deviceId) {
  return lifxService.getAmbientLight(deviceId);
}

module.exports.brightnessSliderCallback = {
  setter: setBrightness,
  getter: getBrightness,
};

module.exports.powerSwitchCallback = {
  setter: setPowerState,
  getter: getPowerState,
};

module.exports.ambientLightSensorCallback = {
  getter: getAmbientLightSensor,
};

module.exports.onButtonPressed = (action, deviceId) => {
  switch (action) {
    case MACRO_POWER_ON:
      debug(`Powering on ${deviceId}`);
      return lifxService.setPowerState(deviceId, true);
    case MACRO_POWER_OFF:
      debug(`Powering off ${deviceId}`);
      return lifxService.setPowerState(deviceId, false);
    case MACRO_ALERT:
      debug(`Alert ${deviceId}`);
      return lifxService.showAlert(deviceId);
    case MACRO_POWER_TOGGLE:
      debug(`Power toggle ${deviceId}`);
      return lifxService.powerToggle(deviceId);
    default:
      debug(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }
};

module.exports.discoverDevices = function() {
  debug('discovery call');
  const allDevices = deviceState.getAllDevices();
  return allDevices
    .map((deviceEntry) => {
      return {
        id: deviceEntry.id,
        name: deviceEntry.clientObject.label,
        reachable: deviceEntry.reachable
      };
    });
};

function sendNotificationToBrain(uniqueDeviceId, component, value) {
  sendMessageToBrainFunction({ uniqueDeviceId, component, value })
    .catch((error) => {
      debug('NOTIFICATION_FAILED', error.message);
    });
}

function pollAllLifxDevices() {
  debug('poll all lifx devices');
  deviceState.getAllDevices()
    .forEach((lifx) => {
      if (!lifx.reachable) {
        return;
      }
      lifxService
        .getStateForPolling(lifx.id)
        .then((deviceState) => {
          sendNotificationToBrain(lifx.id, COMPONENT_BRIGHTNESS, deviceState.brightness);
          sendNotificationToBrain(lifx.id, COMPONENT_POWER, deviceState.power);
          sendNotificationToBrain(lifx.id, COMPONENT_AMBIENTLIGHT, deviceState.ambientlight);
        })
        .catch((error) => {
          debug('polling failed', error.message);
        });
    });
}

module.exports.registerStateUpdateCallback = function(_sendMessageToBrainFunction) {
  debug('registerStateUpdateCallback');
  sendMessageToBrainFunction = _sendMessageToBrainFunction;
};

module.exports.initialise = function() {
  if (pollingIntervalId) {
    debug('already initialised, ignore call');
    return false;
  }
  debug('initialise LIFX service, start polling');
  lifxService = new LifxService(deviceState);
  pollingIntervalId = setInterval(pollAllLifxDevices, DEVICE_POLL_TIME_MS);
};
