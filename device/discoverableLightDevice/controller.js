'use strict';

const BluePromise = require('bluebird');

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */

const UPDATE_FREQUENCY_MS = 2000;
const COMPLEX_DEVICE_SLIDER_NAME = 'power-slider';
const COMPLEX_DEVICE_TEXTLABEL_NAME = 'example-text';
const COMPLEX_DEVICE_UPDATE_ENTRY = 'unique-device-id-001';

let textlabelValue = 'initial value';
let sliderValue = 50;
let switchValue = true;
let sendComponentUpdate;

/**
 * One button handler for each registered button
 */
module.exports.button = function(deviceid, name) {
  console.log(`[CONTROLLER] ${name} button pressed on ${deviceid}!`);
};

/**
 * Getters and setters:
 * - The getters are used to send the current Values through the SDK (read)
 * - The setter allow changing values on the Brain and handling the changes here (write)
 */
module.exports.sliderSet = function(deviceid, value) {
  console.log('[CONTROLLER] dimmer set to', deviceid, value);
  // here we dim the light
  sliderValue = value;
};

module.exports.sliderGet = function(deviceid) {
  console.log('[CONTROLLER] return current dimmer value', deviceid, sliderValue);
  // you can return a promise if that make sense OR just return a value
  return BluePromise.resolve(sliderValue);
};

module.exports.switchSet = function(deviceid, value) {
  console.log('[CONTROLLER] switch set to', deviceid, value);
  switchValue = value;
};

module.exports.switchGet = function(deviceid) {
  console.log('[CONTROLLER] return switch value', deviceid, switchValue);
  return BluePromise.resolve(switchValue);
};

module.exports.getExampleText = function(deviceid) {
  console.log('[CONTROLLER] get example text', deviceid);
  return BluePromise.resolve(textlabelValue);
};

/**
 * Since both devices are very similar they can use the same discovery function internally.
 *
 * However we need a way to filter resutls for the Brain by type. This is because on the Brain
 * they are exposing different functionality.
 * - Adding a lite device as a pro device would result in broken functionality in the UI (pro functions ont work on lite)
 * - Adding a pro device as a lite device would result in missing functionality in the UI (pro functions wont be listed)
 *
 *
 */
function sharedDeviceDiscovery() {
  return [
    {
      id: COMPLEX_DEVICE_UPDATE_ENTRY,
      name: 'first device',
      type: 'pro'
    },
    {
      id: 'unique-device-id-002',
      name: 'second device, but not reachable',
      reachable: false,
      type: 'pro'
    },
    {
      id: 'unique-device-id-003',
      name: 'third device, unreachable',
      reachable: false,
      type: 'lite'
    },
    {
      id: 'unique-device-id-004',
      name: 'fourth device, unreachable',
      reachable: false,
      type: 'lite'
    }
  ];
}

module.exports.discoverLiteDevices = function() {
  console.log('[CONTROLLER] lite discovery call');
  return sharedDeviceDiscovery()
    .filter((device)=> device.type === 'lite')
    .map((device) => ({
      id: device.id,
      name: device.name,
      reachable: device.reachable,
    }));
};

module.exports.discoverProDevices = function() {
  console.log('[CONTROLLER] pro discovery call');
  return sharedDeviceDiscovery()
    .filter((device)=> device.type === 'pro')
    .map((device) => ({
      id: device.id,
      name: device.name,
      reachable: device.reachable,
    }));
};

/**
 * Sending updates to Brain:
 * If the device value can change, the updated values should be sent to the Brain.
 *
 * - Upon registration the SDK will provide an updat callback to the adapter.
 * - That function can be called with sensor updates
 */
module.exports.registerStateUpdateCallback = function(updateFunction) {
  console.log('[CONTROLLER] register update state for complicatedDevice');
  sendComponentUpdate = updateFunction;
};

/**
 * Send random updates to the NEEO Brain. This is just for illustration purpose,
 * idealy those events would be sent of a device
 */
setInterval(() => {
  if (!sendComponentUpdate) {
   console.log('update function not yet registered');
   return;
  }

  sliderValue = parseInt(Math.random()*200, 10);
  const updatePayload = {
    uniqueDeviceId: COMPLEX_DEVICE_UPDATE_ENTRY,
    component: COMPLEX_DEVICE_SLIDER_NAME,
    value: sliderValue
  };
  sendComponentUpdate(updatePayload)
    .catch((error) => {
     console.log('failed to send slider notification', error.message);
    });

  textlabelValue = 'Update ' + parseInt(Math.random()*200, 10);
  const updateTextlabelPayload = {
   uniqueDeviceId: COMPLEX_DEVICE_UPDATE_ENTRY,
   component: COMPLEX_DEVICE_TEXTLABEL_NAME,
   value: textlabelValue
  };
  sendComponentUpdate(updateTextlabelPayload)
   .catch((error) => {
     console.log('failed to send text notification', error.message);
   });

}, UPDATE_FREQUENCY_MS);
