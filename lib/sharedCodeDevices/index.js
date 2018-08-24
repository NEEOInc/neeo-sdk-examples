'use strict';

const neeoapi = require('neeo-sdk');
const CONSTANTS = require('./constants');
const LightController = require('./LightController');

/*
 * Adapter - Example driver with multiple devices in the same driver.
 *
 * The idea of supporting multiple devices in one adapter is that you can support
 * multiple similar devices (think a full version or a lite version). This is
 * helpfull for devices whith shared code/functionality.
 *
 * If devices do not need to share code or are not similar it is recommended
 * to implement them as separate indepdentent drivers.
 *
 * In this case
 * - Light Lite only has a power switch
 * - Light Pro has a power switch and a dimmer
 *
 * The power switch and discovery code in the controller can be shared by both.
 */

const discoveryInstructions = {
  headerText: 'Light SDK Example',
  description: 'This SDK example shows how devices can share code,' +
    'the next screen will discover some of the light devices.'
};

// Shared controller for lights
const controller = LightController.build();

const complexDeviceLite = neeoapi.buildDevice('Light Lite SDK Example')
  .setManufacturer('NEEO')
  .setType('light')
  .addAdditionalSearchToken('SDK')

  // This device only has a switch
  .addSwitch(
    CONSTANTS.POWER_SWITCH,
    controller.switchHandlers
  )

  .enableDiscovery(
    discoveryInstructions,
    // We use the lite discovery here, it only returns lite devices.
    () => controller.discoverLiteDevices()
  );

const complexDeviceFull = neeoapi.buildDevice('Light Pro SDK Example')
  .setManufacturer('NEEO')
  .setType('light')
  .addAdditionalSearchToken('SDK')

  // Here we add the power switch like the lite device
  .addSwitch(
    CONSTANTS.POWER_SWITCH,
    controller.switchHandlers
  )
  // And the slider a feature not available on the lite device
  .addSlider(
    CONSTANTS.DIMMER,
    controller.sliderHandlers
  )

  .enableDiscovery(
    discoveryInstructions,
    // We use the pro discovery here, it only returns pro devices.
    () => controller.discoverProDevices()
  );

module.exports = {
  devices: [
    // Here we export both devices for the NEEO Brain to use.
    complexDeviceLite,
    complexDeviceFull,
  ],
};
