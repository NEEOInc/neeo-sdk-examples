'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');
const CONSTANTS = require('./constants');

/*
 * Adapter - an Adapter contains one or more DEVICES. The idea of supporting
 * multiple devices in one adapter is, that you can support multiple similar
 * devices (think a full version or a lite version).
 * This allows not only supporting multiple of the same device, but also similar
 * devices.
 */

const discoveryInstructions = {
  headerText: 'HELLO HEADER',
  description: 'ADD SOME ADDITIONAL INFORMATION HOW TO PREPARE YOUR DEVICE,' +
    ' FOR EXAMPLE PRESS A BUTTON TO ENABLE THE DISCOVERY MODE'
};

const complexDeviceLite = neeoapi.buildDevice('Complex Device Lite')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('lite')
  .setType('light')
  .addSlider(
    { name: CONSTANTS.POWER_SLIDER_NAME, label: 'Dimmer', range: [0,200], unit: '%' },
    { setter: controller.sliderSet, getter: controller.sliderGet }
  )
  .enableDiscovery(discoveryInstructions, controller.discoverLiteDevices);

const complexDeviceFull = neeoapi.buildDevice('Complex Device Pro')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('pro')
  .setType('light')
  .addSlider({ name: CONSTANTS.POWER_SLIDER_NAME, label: 'Dimmer', range: [0,200], unit: '%' },
    { setter: controller.sliderSet, getter: controller.sliderGet })
  .addSwitch({ name: 'pro-switch', label: 'Pro power-saving mode' },
    { setter: controller.switchSet, getter: controller.switchGet })
  .addButton({ name: 'pro-button', label: 'Pro Bonus Button' })
  .addButton({ name: 'pro-button2', label: 'Pro Bonus Button2' })
  .addButtonHandler(controller.button)
  .enableDiscovery(discoveryInstructions, controller.discoverProDevices)
  .addTextLabel({ name: CONSTANTS.TEXT_LABEL_NAME, label: 'Example Textlabel', isLabelVisible: true, }, controller.getExampleText)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback);

module.exports = [
  complexDeviceLite,
  complexDeviceFull,
];
