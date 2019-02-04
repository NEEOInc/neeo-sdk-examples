'use strict';

const neeoapi = require('neeo-sdk');
const LightController = require('./LightController');
const CONSTANTS = require('./constants');

/*
 * Adapter - Example driver with multiple devices in the same driver.
 *
 * The idea of supporting multiple devices in one adapter is that you can support
 * multiple similar devices (think a full version or a lite version).
 *
 * In this case
 * - Light Lite only has a power switch
 * - Light Pro has a power switch and a dimmer
 *
 */

const discoverHeaderText = 'Light SDK Example';
const discoverDescription = 'This SDK example shows how devices can share code the next screen will discover some of the light devices.';

// Shared controller for lights
const controller = LightController.build();

const complexDeviceFull = neeoapi.buildDevice(CONSTANTS.UNIQUE_DEVICE_NAME)
  .setManufacturer('NEEO')
  .setType('light')
  .addAdditionalSearchToken('SDK')
  .enableDiscovery(
    // Here we enable the dynamic device builder, so the discovery function must return
    // build neeo devices too - see discovery function
    {
      headerText: discoverHeaderText,
      description: discoverDescription,
      enableDynamicDeviceBuilder: true,
    },
    // this function returns the discovered devices
    (optionalDeviceId) => controller.discoverDevices(optionalDeviceId)
  );

module.exports = {
  devices: [
    complexDeviceFull,
  ],
};
