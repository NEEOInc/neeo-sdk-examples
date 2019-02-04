'use strict';

const debug = require('debug')('neeo:customFavoriteHandling:controller');

module.exports = class FavoritesController {
  static build() {
    return new FavoritesController();
  }

  /**
   * If no favoritesHandler is defined, they will be handled here:
   * - Channel 42 executed on the brain for default device
   * - onButtonPressed('DIGIT 4')
   * - onButtonPressed('DIGIT 2')
   *
   * @param {*} name
   * @param {*} deviceId
   */
  onButtonPressed(name, deviceId) {
    debug(`${name} pressed for ${deviceId} device`);
  }

  /**
   * This handler will be called once per favorite:
   * - Channel 42 executed on the brain for default device
   * - executeFavorite('default', '42')
   *
   * This allows executing favorites differently, or adding post or prefix
   * commands.
   *
   * @param {string} deviceId
   * @param {string} channelNr
   */
  executeFavorite(deviceId, channelNr) {
    debug(`executing favorite ${channelNr} for ${deviceId} device`);
  }
};
