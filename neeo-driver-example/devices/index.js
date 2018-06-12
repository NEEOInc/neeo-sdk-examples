'use strict';

const neeoapi = require('neeo-sdk');
const ExampleController = require('./ExampleController');

const controller = ExampleController.build();

const exampleDriver = neeoapi.buildDevice('Driver SDK Example')
  .setManufacturer('NEEO')
  .setType('TV')
  .addAdditionalSearchToken('SDK')

  // Then we add the capabilities of the device
  .addButton({ name: 'POWER ON', label: 'POWER ON' })
  .addButton({ name: 'POWER OFF', label: 'POWER OFF' })
  .addButton({ name: 'INPUT HDMI', label: 'INPUT HDMI' })

  // Then we wire the controller handler for these capabilities
  .addButtonHandler(controller.onButtonPressed);

/*
 * The last step is to export the driver, this makes it available to the
 * to tools like the CLI to start running the driver.
 */
module.exports = {
  devices: [
    exampleDriver,
  ],
};

