'use strict';

const neeoapi = require('neeo-sdk');
const debug = require('debug')('neeo:lifx-local:controller');
const LifxService = require('./lifxservice');
const Subscriptions = require('./subscriptions');

// the mobile app polls each 4500ms
const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';
const COMPONENT_AMBIENTLIGHT = 'ambientlight';
let markDeviceOn = () => { debug('MARKDEVICEON FUNCTION NOT INITIALIZED'); };
let markDeviceOff = () => { debug('MARKDEVICEOFF FUNCTION NOT INITIALIZED'); };
const subscriptions = Subscriptions.build();

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

module.exports.deviceSubscriptionCallback = {
  deviceAdded: (deviceId) => {
    subscriptions.add(deviceId);
  },
  deviceRemoved: (deviceId) => {
    subscriptions.remove(deviceId);
  },
  initializeDeviceList: (deviceIds) => {
    subscriptions.resetWith(deviceIds);
  },
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
  // The devicestate is used as a cached discovery step
  return deviceState.getAllDevices()
    .filter(isValidLifx)
    .map(formatLifxDiscoveryResult);
};

function isValidLifx(deviceEntry) {
  return deviceEntry.id && deviceEntry.clientObject;
}

function formatLifxDiscoveryResult(deviceEntry) {
  const name = deviceEntry.clientObject.label || 'Lifx ' + deviceEntry.id;

  return {
    id: deviceEntry.id,
    name,
    reachable: deviceEntry.reachable,
  };
}

function sendNotificationToBrain(uniqueDeviceId, component, value) {
  const skipNonSubscribedDevices = !subscriptions.isSubscribed(uniqueDeviceId);

  if (skipNonSubscribedDevices) {
    debug('NOTIFICATION_SKIPPED', uniqueDeviceId);
    return;
  }

  sendMessageToBrainFunction({ uniqueDeviceId, component, value })
    .catch((error) => {
      debug('NOTIFICATION_FAILED', error.message);
    });
}

function sendPowerStateUpdateToBrain(uniqueDeviceId, powerState) {
  const skipNonSubscribedDevices = !subscriptions.isSubscribed(uniqueDeviceId);

  if (skipNonSubscribedDevices) {
    debug('POWERSTATE_NOTIFICATION_SKIPPED', uniqueDeviceId);
    return;
  }

  if (powerState) {
    markDeviceOn(uniqueDeviceId);
  } else {
    markDeviceOff(uniqueDeviceId);
  }
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
        .then((state) => {
          // send the update notifications to the brain.
          // the SDK handles repeated messages, so just fire and forget
          sendPowerStateUpdateToBrain(lifx.id, state.power);
          sendNotificationToBrain(lifx.id, COMPONENT_BRIGHTNESS, state.brightness);
          sendNotificationToBrain(lifx.id, COMPONENT_POWER, state.power);
          sendNotificationToBrain(lifx.id, COMPONENT_AMBIENTLIGHT, state.ambientlight);
        })
        .catch((error) => {
          debug('polling failed', error.message);
        });
    });
}

module.exports.registerStateUpdateCallback = function(_sendMessageToBrainFunction, optionalCallbackFunctions) {
  debug('registerStateUpdateCallback');
  sendMessageToBrainFunction = _sendMessageToBrainFunction;
  if (optionalCallbackFunctions && optionalCallbackFunctions.powerOnNotificationFunction) {
    markDeviceOn = optionalCallbackFunctions.powerOnNotificationFunction;
  }
  if (optionalCallbackFunctions && optionalCallbackFunctions.powerOffNotificationFunction) {
    markDeviceOff = optionalCallbackFunctions.powerOffNotificationFunction;
  }
};

module.exports.initialise = function() {
  if (pollingIntervalId) {
    debug('already initialised, ignore call');
    return false;
  }
  debug('initialise LIFX service, start polling');
  // lifx does not provide a callback function whenever the state of a lamp changed, so we need to poll all the lamps
  // using an interval. if your device support state update callback, no polling is needed.
  lifxService = new LifxService(deviceState);
  pollingIntervalId = setInterval(pollAllLifxDevices, DEVICE_POLL_TIME_MS);
};
