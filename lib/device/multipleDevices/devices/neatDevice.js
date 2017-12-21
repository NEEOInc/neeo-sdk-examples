'use strict';

const neeoapi = require('neeo-sdk');

const controller = {
  onButtonPressed: function onButtonPressed(name) {
    console.log(`[NEAR-CONTROLLER] ${name} button pressed`);

    // TODO implement the actions for your device here
  },
  getNeatPhrase: function getNeatPhrase() {
    return 'How neat is that!?';
  }
};

const neatTvDevice = neeoapi.buildDevice('Neat Device')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('multiple')
  .setType('TV')

  .addButton({ name: 'neat-button', label: 'Neat Button' })
  .addButton({ name: 'INPUT HDMI 1' })
  
  .addButtonHandler(controller.onButtonPressed)

  .addTextLabel({ name: 'neat-phrase' }, controller.getNeatPhrase)
  .addCapability('alwaysOn');

module.exports = neatTvDevice;
