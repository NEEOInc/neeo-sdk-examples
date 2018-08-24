'use strict';

const neeoapi = require('neeo-sdk');
const AccessoryController = require('./AccessoryController');

const controller = AccessoryController.build();

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use a single very
 * simple device.
 */

// First we set the device info, used to identify it on the Brain
const simpleAccessory = neeoapi.buildDevice('Accessory SDK Example')
  .setManufacturer('NEEO')
  .setType('ACCESSORY')
  .addAdditionalSearchToken('SDK')

  // Then we add the capabilities of the device
  .addButton({ name: 'button-a', label: 'Button A' })
  .addButton({ name: 'button-b', label: 'Button B' })

  // Then we wire the controller handler for these capabilities
  .addButtonHandler((name, deviceId) => controller.onButtonPressed(name, deviceId));

/*
 * The last step is to export the driver, this makes it available to the
 * to tools like the CLI to start running the driver.
 */
module.exports = {
  devices: [
    simpleAccessory,
  ],
};

