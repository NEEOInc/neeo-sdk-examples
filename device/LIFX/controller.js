/*
 * Quick example for an LIFX light wrote by Geert Wille
 */

'use strict';

const BluePromise = require('bluebird');

let lifx = require('lifx-http-api');
let client = new lifx({
  bearerToken: 'INSERT_ACCESS_TOKEN_HERE' // https://cloud.lifx.com/settings
});

let sliderValue = 50;
let switchValue = true;
let sendComponentUpdate;

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onPulse = function (deviceId, name) {
  // Just randomly pulse the light
  client.pulse('id:' + name, {
    color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
    from_color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
    period: 1,
    cycles: 5,
    persist: false,
    power_on: true,
    peak: 0.8
  });
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
  client.setState('id:' + deviceId, {
    power: switchValue == 'true' ? 'on' : 'off'
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
  client.setState('all', {
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
module.exports.discoverLIFX = function discoverLIFX() {
  return client.listLights('all')
    .then((LIFXLights) => {
      return LIFXLights.map((LIFX) => ({
        id: LIFX.id,
        name: LIFX.group.name,
        reachable: LIFX.reachable
      }));
    })
    .catch((err) => {
      console.error('ERROR!', err);
    });
}
