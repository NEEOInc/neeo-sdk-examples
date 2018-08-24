'use strict';

const neeoapi = require('neeo-sdk');
const MediaPlayerController = require('./MediaPlayerController');

const controller = MediaPlayerController.build();

const mediaPlayer = neeoapi.buildDevice('MediaPlayer SDK Example')
  .setManufacturer('NEEO')
  .setType('MEDIAPLAYER')
  .addAdditionalSearchToken('SDK')

  /*
   * If this example MEDIAPLAYER is  always on and it has no power on or
   * power off commands. To avoid it being listed as a not-so-smart device
   * we can use the always on capability:
   */
  .addCapability('alwaysOn')

  /*
   * Button groups automatically add multiple buttons
   * and correspond to widgets automatically generated on the NEEO Brain
   * See https://github.com/NEEOInc/neeo-sdk#neeo-macro-names for a
   * list of the groups.
   */
  .addButtonGroup('Volume')
  .addButtonGroup('Numpad')
  .addButtonGroup('Menu and Back')
  .addButtonGroup('Controlpad')

  .addButtonHandler((name, deviceId) => controller.onButtonPressed(name, deviceId));

module.exports = {
  devices: [
    mediaPlayer,
  ],
};

