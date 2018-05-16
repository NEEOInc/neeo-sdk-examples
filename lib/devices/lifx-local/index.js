'use strict';

// LIFX local discovery and controller, thanks to Geert Wille (@GeertWille) and Niels de Klerk (@nklerk) for their initial work

const neeoapi = require('neeo-sdk');
const controller = require('./lifxcontroller');

const slider = {
  name: 'brightness',
  label: 'Dimmer',
  range: [0, 100],
  unit: '%'
};
const powerSwitch = {
  name: 'power',
  label: 'Power'
};
const ambientLightSensor = {
  name: 'ambientlight',
  label: 'Ambient Light Sensor',
  range: [0, 10],
  unit: 'Brightness'
};
const discoveryInstructions = {
  headerText: 'Discover devices',
  description: 'NEEO will discover your LIFX lights now, press NEXT'
};
const POWER_TOGGLE_BUTTON = { name: 'POWER_TOGGLE', label: 'Power Toggle' };
const ALERT_BUTTON = { name: 'ALERT', label: 'Alert' };

const lifx = neeoapi.buildDevice('Smart Light')
  .setManufacturer('LIFX')
  .addAdditionalSearchToken('lamp')
  .setType('LIGHT')
  .addButtonGroup('Power')
  .addButton(POWER_TOGGLE_BUTTON)
  .addButton(ALERT_BUTTON)
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(slider, controller.brightnessSliderCallback)
  .addSwitch(powerSwitch, controller.powerSwitchCallback)
  .addPowerStateSensor(controller.powerSwitchCallback)
  .addSensor(ambientLightSensor, controller.ambientLightSensorCallback)
  .enableDiscovery(discoveryInstructions, controller.discoverDevices)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .registerInitialiseFunction(controller.initialise)
  .registerDeviceSubscriptionHandler(controller.deviceSubscriptionCallback);


module.exports = lifx;
