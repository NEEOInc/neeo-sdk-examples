'use strict';

const neeoapi = require('neeo-sdk');

const controller = {
  onButtonPressed: function onButtonPressed(name) {
    console.log(`[COOL-CONTROLLER] ${name} button pressed`);

    // TODO implement the actions for your device here
  }
};


const coolTvDevice = neeoapi.buildDevice('Cool Device')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('multiple')
  .setType('TV')

  .addButton({ name: 'cool-button', label: 'Cool Button' })
  .addButton({ name: 'awesome-button', label: 'Awesome Button' })
  .addButtonGroup('Controlpad')
  .addButtonHandler(controller.onButtonPressed);

module.exports = coolTvDevice;
