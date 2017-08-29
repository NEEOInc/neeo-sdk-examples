'use strict';

/*
 * Example code for an LIFX light integration wrote by Geert Wille
 */
const BluePromise = require('bluebird');
const Lifx = require('lifx-http-api');

const lifxApiToken = process.env.LIFX_BEARER_TOKEN;
if (!lifxApiToken) {
  throw new Error('Error, no LIFX API token set, make sure to set LIFX_BEARER_TOKEN env variable, get it from https://cloud.lifx.com/settings');
}
const client = new Lifx({
  bearerToken: lifxApiToken
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
module.exports.button = function(name, deviceId) {
 console.log(`[CONTROLLER] ${name} button pressed on ${deviceId}!`);
 switch(name) {
   case 'pulse':
     client.pulse(getLifxDeviceSelector(deviceId), {
       /*jshint camelcase: false */
       color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
       from_color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
       period: 1,
       cycles: 5,
       persist: false,
       power_on: true,
       peak: 0.8
     });
     break;
   case 'all-off':
     client.setState(LIFX_ALL_LIGHTS_SELECTOR, {
       power: LIFX_LIGHT_OFF
     }).then(console.log, console.error);
     break;
 }
};

/**
 * Getters and setters:
 * - The getters are used to send the current Values through the SDK (read)
 * - The setter allow changing values on the Brain and handling the changes here (write)
 */
module.exports.switchSet = function(deviceId, value) {
  console.log('[CONTROLLER] switch set to', deviceId, value);
  switchValue = value;

  // Update LIFX light
  client.setState(getLifxDeviceSelector(deviceId), {
    power: switchValue === 'true' ? LIFX_LIGHT_ON : LIFX_LIGHT_OFF
  }).then(console.log, console.error);
};

module.exports.switchGet = function(deviceId) {
  console.log('[CONTROLLER] return switch value', deviceId, switchValue);
  return BluePromise.resolve(switchValue);
};

module.exports.sliderSet = function(deviceId, value) {
  console.log('[CONTROLLER] dimmer set to', deviceId, value);
  sliderValue = value;

  // Update LIFX light
  client.setState(LIFX_ALL_LIGHTS_SELECTOR, {
    brightness: sliderValue / 100
  }).then(console.log, console.error);
};

module.exports.sliderGet = function(deviceId) {
  console.log('[CONTROLLER] return current dimmer value', deviceId, sliderValue);
  return BluePromise.resolve(sliderValue);
};

/*
 * Discover all LIFX lights and return them in the proper format
 */
module.exports.discoverLifx = function() {
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
};
