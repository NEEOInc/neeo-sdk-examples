'use strict';

/*
 * Example code for an LIFX light integration written by Geert Wille
 *
 * Adapter - simple LIFX light integration.
 */
const neeoapi = require('neeo-sdk');
const LifxCloudController = require('./LifxCloudController');

/*
 * Lifx Cloud requires an API token to work, here we check and fail
 * to start the driver if the token is not defined.
 * To prevent from crashing other drivers we just return no devices.
 */
try {
  LifxCloudController.validateEnvironment();
}
catch (error) {
  console.error('Skipping lifxCloud:', error.message);
  module.exports = { devices: [] };
  return;
}

const discoveryInstructions = {
  headerText: 'Ready to discover LIFX lights',
  description: 'Make sure that you\'re logged in in the LIFX app and that ' +
    'you\'ve create a new accessToken on https://cloud.lifx.com/settings ' +
    'so we can retrieve your lights',
};
const controller = LifxCloudController.build();

const lifxLight = neeoapi.buildDevice('Smart Light (cloud) SDK Example')
  .setManufacturer('LIFX')
  .setType('LIGHT')
  .addAdditionalSearchToken('lamp')
  .addAdditionalSearchToken('SDK')

  // Button capabilities
  .addButton({ name: 'pulse', label: 'Pulse' })
  .addButton({ name: 'all-off', label: 'All Off' })
  .addButtonHandler((name, deviceId) => controller.handleButton(name, deviceId))

  // Unlike buttons switch and sliders each have their own handlers.
  .addSlider(
    { name: 'power-slider', label: 'Dimmer', range: [0, 100], unit: '%' },
    controller.sliderHandlers
  )
  .addSwitch(
    { name: 'toggle', label: 'Toggle On/Off' },
    controller.switchHandlers
  )

  // Discovery allows searching the network for devices and letting the
  // user select which one to add from the resutls.
  .enableDiscovery(discoveryInstructions, controller.discoverLifx);

module.exports = {
  devices: [
    lifxLight,
  ],
};

