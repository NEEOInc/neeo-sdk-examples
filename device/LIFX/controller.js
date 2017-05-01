'use strict';

/*
 * Example code for an LIFX light integration wrote by Geert Wille
 */
const BluePromise = require('bluebird');
const Lifx = require('lifx-http-api');
const client = new Lifx({
  bearerToken: '' // https://cloud.lifx.com/settings
});

const LIFX_ALL_LIGHTS_SELECTOR = 'all';
const LIFX_LIGHT_OFF = 'off';
const LIFX_LIGHT_ON = 'on';

let sliderValue = 50;
let switchValue = true;

// Helper function
function getLifxDeviceSelector(deviceId) {
  return 'id:' + deviceId;
}

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onPulse = function (name, deviceId) {
  // Just randomly pulse the light
  client.pulse(getLifxDeviceSelector(deviceId), {
    color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
    from_color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
    period: 1,
    cycles: 5,
    persist: false,
    power_on: true,
    peak: 0.8
  });
};

module.exports.allOff = function (name, deviceId) {
  // Just randomly pulse the light
  client.setState(LIFX_ALL_LIGHTS_SELECTOR, {
    power: LIFX_LIGHT_OFF
  }).then(console.log, console.error);
};

/**
 * Getters and setters:
 * - The getters are used to send the current Values through the SDK (read)
 * - The setter allow changing values on the Brain and handling the changes here (write)
 */
module.exports.switchSet = function (deviceId, value) {
  console.log('[CONTROLLER] switch set to', deviceId, value);
  switchValue = value;

  // Update LIFX light
  client.setState(getLifxDeviceSelector(deviceId), {
    power: switchValue == 'true' ? LIFX_LIGHT_ON : LIFX_LIGHT_OFF
  }).then(console.log, console.error);
};

module.exports.switchGet = function (deviceId) {
  console.log('[CONTROLLER] return switch value', deviceId, switchValue);
  return BluePromise.resolve(switchValue);
};

module.exports.sliderSet = function (deviceId, value) {
  console.log('[CONTROLLER] dimmer set to', deviceId, value);
  sliderValue = value;

  // Update LIFX light  
  client.setState(LIFX_ALL_LIGHTS_SELECTOR, {
    brightness: sliderValue / 100
  }).then(console.log, console.error);
};

module.exports.sliderGet = function (deviceId) {
  console.log('[CONTROLLER] return current dimmer value', deviceId, sliderValue);
  return BluePromise.resolve(sliderValue);
};

/*
 * Discover all LIFX lights and return them in the proper format
 */
module.exports.discoverLifx = function () {
  return client.listLights(LIFX_ALL_LIGHTS_SELECTOR)
    .then((LifxLights) => {
      console.info(LifxLights);
      return LifxLights.map((lifx) => ({
        id: lifx.id,
        name: lifx.label,
        reachable: lifx.reachable
      }));
    })
    .catch((err) => {
      console.error('ERROR!', err);
    });
}
