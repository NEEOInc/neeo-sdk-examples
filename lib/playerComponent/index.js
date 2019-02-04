'use strict';

const neeoapi = require('neeo-sdk');
const PlayerController = require('./PlayerController');

/*
 * BETA feature: Player widget example
 * This example shows how to use the player functionality and the requirements.
 *
 * Current player requirements:
 * - supported device types: MUSICPLAYER / MEDIAPLAYER / VOD
 * - required components and sensors: see below
 *
 * PLEASE NOTE:
 * - this is a BETA feature, development is still in progress
 * - the player can change in future versions
 * - the player is not yet feature complete
 * - documentation is work in progress
 *
 * Feel free to start developing with it, but do not release it in your stable driver versions.
 */

const controller = PlayerController.build();

const playerDevice = neeoapi.buildDevice('Player SDK Example')
  .setManufacturer('NEEO')
  .setType('MUSICPLAYER')
  .addAdditionalSearchToken('SDK')
  .addAdditionalSearchToken('player')
  .addButtonGroup('POWER')
  // please note the arrow function here, needed so "this" is pointing to the controller
  // also check out
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this
  .registerSubscriptionFunction((...args) => controller.setNotificationCallbacks(...args))
  .registerInitialiseFunction(() => controller.initialize())

  // The player is automatically generated on the Brain when all the required
  // components are present. addPlayerWidget() registers these components.
  .addPlayerWidget({
    rootDirectory: {
      name: 'PLAYER_ROOT_DIRECTORY', // Optional: will default to ROOT_DIRECTORY
      label: 'My Library', // Optional: will default to ROOT
      controller: controller.browseRoot, // See addDirectory in the doc for details
    },
    // Note: the queue is optional
    queueDirectory: {
      name: 'PLAYER_QUEUE_DIRECTORY', // Optional: will default to QUEUE_DIRECTORY
      label: 'Queue', // Optional: will default to QUEUE
      controller: controller.browseQueue,
    },
    // The controllers for the slider, sensors and switches are
    // required:
    volumeController: controller.volumeSlider,
    coverArtController: controller.coverArtSensor,
    titleController: controller.titleSensor,
    descriptionController: controller.descriptionSensor,
    playingController: controller.playSwitch,
    muteController: controller.muteSwitch,
    shuffleController: controller.shuffleSwitch,
    repeatController: controller.repeatSwitch,
    // - Buttons used by the player are automatically registered
  })
  .addButtonHandler(controller.buttonHandler);

/*
 * The last step is to export the driver, this makes it available to the
 * to tools like the CLI to start running the driver.
 */
module.exports = {
  devices: [
    playerDevice,
  ],
};
