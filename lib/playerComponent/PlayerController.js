'use strict';

/*
 * While the list handling could be done directly in the controller
 * we recommand separating it.
 */
const BluePromise = require('bluebird');
const browserService = require('./browserService');
const PlayerService = require('./PlayerService');
const debug = require('debug')('neeo:player:controller');

const VOLUME_STEP = 5;

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class PlayerController {
  constructor() {
    this._notificationsEnabled = true;
    this.sendMessageToBrainFunction = (param) => {
      debug('NOT_INITIALISED_YET %o', param);
    };

    this.playSwitch = this._getCallbacks(PlayerService.SWITCH_PLAYING);
    this.muteSwitch = this._getCallbacks(PlayerService.SWITCH_MUTE);
    this.shuffleSwitch = this._getCallbacks(PlayerService.SWITCH_SHUFFLE);
    this.repeatSwitch = this._getCallbacks(PlayerService.SWITCH_REPEAT);

    this.volumeSlider = this._getCallbacks(PlayerService.SLIDER_VOLUME);

    this.coverArtSensor = this._getCallbacks(PlayerService.SENSOR_COVERART);
    this.titleSensor = this._getCallbacks(PlayerService.SENSOR_TITLE);
    this.descriptionSensor = this._getCallbacks(PlayerService.SENSOR_DESCRIPTION);

    this.browseRoot = this._getBrowseRootCallbacks();
    this.browseQueue = this._getBrowseQueueCallbacks();

    this.buttonHandler = (name, deviceId) => this.onButtonPressed(name, deviceId);
  }

  static build() {
    return new PlayerController();
  }

  sendNotificationToBrain(uniqueDeviceId, component, value) {
    this.sendMessageToBrainFunction({ uniqueDeviceId, component, value })
      .catch((error) => {
        debug('NOTIFICATION_FAILED', error.message);
      });
  }

  setNotificationCallbacks(updateFunction) {
    debug('setNotificationCallbacks');
    this.sendMessageToBrainFunction = updateFunction;
  }

  initialize() {
    debug('initialize');
    this.playerService = PlayerService.build();
  }

  _getCallbacks(component) {
    return {
      setter: (deviceId, value) => {
        debug(`Setting component ${deviceId} ${component} to ${value}`);
        this.sendNotificationToBrain(deviceId, component, value);
        return this.playerService.updateState({ deviceId, key: component, value });
      },
      getter: (deviceId) => {
        debug(`Getting component state ${deviceId} ${component}`);
        return this.playerService.getState({ deviceId, key: component });
      },
    };
  }

  _getBrowseQueueCallbacks() {
    return {
      getter: (deviceId, params) => {
        const showQueue = !params.browseIdentifier;
        const browseParams = { deviceId, showQueue, params };
        return browserService.browse(browseParams)
          .catch((error) => {
            console.error('FILEBROWSER_LIST_BUILD_ERROR', { function: '_browseQueue', error });
            throw error;
          });
      },
      action: (deviceId, params) => {
        debug('queue list action called with %o', { deviceId, params });
        return this._updateCurrentTitle(deviceId, params);
      },
    };
  }

  _getBrowseRootCallbacks() {
    return {
      getter: (deviceId, params) => {
        const showRoot = !params.browseIdentifier;
        const browseParams = { deviceId, showRoot, params };
        return browserService.browse(browseParams)
          .catch((error) => {
            console.error('FILEBROWSER_LIST_BUILD_ERROR', { function: '_browseRoot', error });
            throw error;
          });
      },
      action: (deviceId, params) => {
        debug('root list action called with %o', { deviceId, params });
        return this._updateCurrentTitle(deviceId, params);
      },
    };
  }

  _updateCurrentTitle(deviceId, params) {
    if (params && params.actionIdentifier) {
      this.playerService.updateState({ deviceId, key: PlayerService.SENSOR_TITLE, value: params.actionIdentifier });
      this.sendNotificationToBrain(deviceId, PlayerService.SENSOR_TITLE, params.actionIdentifier);
    }
    return BluePromise.resolve();
  }

  onButtonPressed(name, deviceId) {
    debug(`${name} button pressed for device ${deviceId}`);
    switch(name) {
      case 'PLAY':
        return this.playSwitch.setter(deviceId, true);
      case 'PLAY TOGGLE':
        const currentPlayState = this.playSwitch.getter(deviceId);
        return this.playSwitch.setter(deviceId, !currentPlayState);
      case 'PAUSE':
        return this.playSwitch.setter(deviceId, false);
      case 'VOLUME UP': {
        const currentVolume = this.volumeSlider.getter(deviceId);
        return this.volumeSlider.setter(deviceId, currentVolume + VOLUME_STEP);
      }
      case 'VOLUME DOWN': {
        const currentVolume = this.volumeSlider.getter(deviceId);
        return this.volumeSlider.setter(deviceId, currentVolume - VOLUME_STEP);
      }
      case 'NEXT TRACK':
        return this.titleSensor.setter(deviceId, 'NEXT TRACK');
      case 'PREVIOUS TRACK':
      return this.titleSensor.setter(deviceId, 'PREVIOUS TRACK');
    }
  }
};
