'use strict';

const neeoapi = require('neeo-sdk');
const ID = 'default';

// example how to use the powerstate sensor

let markDeviceOnFunction = () => { console.log('MARKDEVICEON FUNCTION NOT INITIALIZED'); };
let markDeviceOffFunction = () => { console.log('MARKDEVICEOFF FUNCTION NOT INITIALIZED'); };
let powerState = false;

const controller = {
  onButtonPressed: function onButtonPressed(name) {
    console.log(`[COOL-CONTROLLER] ${name} button pressed`);
    if (name === 'powertoggle-button') {
      if (powerState === false) {
        console.log('power on');
        powerState = true;
        markDeviceOnFunction(ID);
      } else {
        console.log('power off');
        powerState = false;
        markDeviceOffFunction(ID);
      }
    }
    // TODO implement the actions for your device here
  },

  getPowerstate: function() {
    return powerState;
  },

  registerStateUpdateCallback: function(updateFunction, optionalCallbackFunctions) {
    if (optionalCallbackFunctions && optionalCallbackFunctions.powerOnNotificationFunction) {
      markDeviceOnFunction = optionalCallbackFunctions.powerOnNotificationFunction;
    }
    if (optionalCallbackFunctions && optionalCallbackFunctions.powerOffNotificationFunction) {
      markDeviceOffFunction = optionalCallbackFunctions.powerOffNotificationFunction;
    }
  }
};

const coolTvDevice = neeoapi.buildDevice('Cool Device')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('multiple')
  .setType('TV')

  .addButton({ name: 'cool-button', label: 'Cool Button' })
  .addButton({ name: 'awesome-button', label: 'Awesome Button' })
  .addButton({ name: 'powertoggle-button', label: 'Powertoggle' })
  .addButton({ name: 'INPUT HDMI 1' })
  .addButtonGroup('Power')
  .addButtonGroup('Controlpad')
  .addButtonHandler(controller.onButtonPressed)
  .addPowerStateSensor({ getter: controller.getPowerstate })
  .registerSubscriptionFunction(controller.registerStateUpdateCallback);

module.exports = coolTvDevice;
