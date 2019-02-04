'use strict';

const neeoapi = require('neeo-sdk');
const FavoritesController = require('./FavoritesController');

/*
 * Custom Favorites Handling Example
 *
 * This device is a sample showing how favorite handling can be used.
 * - Device with favorite support (only 'TV', 'DVB' and 'TUNER' support favorites)
 * - Favorite handler to handle channels in a single action.
 */

const controller = FavoritesController.build();

const favoritesDevice = neeoapi.buildDevice('Favorite SDK Example')
  .setManufacturer('NEEO')
  .setType('TV')
  .addAdditionalSearchToken('SDK')
  .addButtonGroup('Power')
  .addButtonGroup('Volume')
  .addButtonGroup('Numpad')
  .addButton({ name: 'INPUT HDMI 1', label: 'INPUT HDMI 1' })
  .addButtonHandler((name, deviceId) => controller.onButtonPressed(name, deviceId))
  /*
   * Below we register the custom favorite handler, this will be used instead of
   * the default splitting of the channel number into digits which are then sent
   * to onButtonPressed above one at a time.
   */
  .registerFavoriteHandlers({
    execute: (deviceId, channelNr) => controller.executeFavorite(deviceId, channelNr),
  });

module.exports = {
  devices: [
    favoritesDevice,
  ],
};
