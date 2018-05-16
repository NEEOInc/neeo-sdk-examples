'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use a single very
 * simple device.
 */

// first we set the device info, used to identify it on the Brain
const customLightDevice = neeoapi.buildDevice('Simple Accessory')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('foo')
  .setType('ACCESSORY')

  // Then we add the capabilities of the device
  .addButton({ name: 'button-a', label: 'Button A' })
  .addButton({ name: 'button-b', label: 'Button B' })
  .addButtonGroup('Color Buttons')
  .addButtonHandler(controller.onButtonPressed);

module.exports = customLightDevice;
