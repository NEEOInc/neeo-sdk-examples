'use strict';

/*
 * Example code for an LIFX light integration written by Geert Wille
 */
const neeoapi = require('neeo-sdk');
const controller = require('./controller');

/*
 * Adapter - simple LIFX integration.
 */

// first we set the device info, used to identify it on the Brain
const lifxLight = neeoapi.buildDevice('Smart Light (cloud)')
  .setManufacturer('LIFX')
  .addAdditionalSearchToken('light')
  .setType('LIGHT')
  .enableDiscovery({
    headerText: 'Ready to discover LIFX lights',
    description: 'Make sure that you\'re logged in in the LIFX app and that you\'ve create a new accessToken on https://cloud.lifx.com/settings so we can retrieve your lights'
  }, controller.discoverLifx)
  // Then we add the capabilities of the LIFX bulb
  .addSlider({ name: 'power-slider', label: 'Dimmer', range: [0, 100], unit: '%' }, { setter: controller.sliderSet, getter: controller.sliderGet })
  .addSwitch({ name: 'toggle', label: 'Toggle On/Off' }, { setter: controller.switchSet, getter: controller.switchGet })
  .addButton({ name: 'pulse', label: 'Pulse' })
  .addButton({ name: 'all-off', label: 'All Off' })
  .addButtonHandler(controller.button);

module.exports = lifxLight;
