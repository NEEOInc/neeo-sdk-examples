'use strict';

const debug = require('debug')('neeo:lifx-local:service');
const BluePromise = require('bluebird');
const LifxDeps = require('./lifxdeps');

const LIFX_FADETIME_MS = 200;
const LIFX_ALERT_FADETIME_MS = 800;
const LIFX_ALERT_TIMEOUT_MS = 1000;
const POWER_ON_INTEGER = 1;
const MAX_AMBIENTLIGHT_RAW_VALUE = 400;
const MAX_AMBIENTLIGHT_NORMALIZED_VALUE = 10;

const LIFX_LIBRARY_SETTINGS = {
  debug: false
};

class LifxService {

  constructor(deviceState) {
    this.deviceState = deviceState;
    this.lifxClient = LifxDeps.buildLifxClientInstance();
    this.lifxClient.init(LIFX_LIBRARY_SETTINGS);

    debug('LIFX discovery started...');
    this.lifxClient.on('light-new', (lifx) => {
      debug('discovered new light', lifx.id);
      deviceState.addDevice(lifx.id, lifx);
    });
    this.lifxClient.on('light-online', (lifx) => {
      debug('light-online', lifx.id);
      deviceState.updateReachable(lifx.id, true);
    });
    this.lifxClient.on('light-offline', (lifx) => {
      debug('light-offline', lifx.id);
      deviceState.updateReachable(lifx.id, false);
    });
  }

  stop() {
    // stop lifx discovery, stop sending packages
    this.lifxClient.destroy();
  }

  invalidateCache(deviceId) {
    this.deviceState
      .getCachePromise(deviceId)
      .invalidate();
  }

  getState(deviceId) {
    const light = this.deviceState.getClientObjectIfReachable(deviceId);
    if (!light) {
      return BluePromise.reject(new Error('NOT_REACHABLE'));
    }

    function getLampState() {
      return new BluePromise((resolve, reject) => {
        debug('fetch new LIFX state', deviceId);
        light.getState((err, state) => {
          if (err) {
            reject(err);
          }
          if (!state || !state.color) {
            reject(new Error('INVALID_ANSWER'));
          }
          resolve(state);
        });
      });
    }

    return this.deviceState
      .getCachePromise(deviceId)
      .getValue(getLampState);
  }

  getBrightness(deviceId) {
    return this.getState(deviceId)
      .then((state) => {
        return state.color.brightness;
      });
  }

  setBrightness(deviceId, brightnessString) {
    const brightness = parseInt(brightnessString, 10);
    const light = this.deviceState.getClientObjectIfReachable(deviceId);
    if (!light) {
      return BluePromise.reject(new Error('NOT_REACHABLE'));
    }
    return this.getState(deviceId)
      .then((state) => {
        if (state.power !== POWER_ON_INTEGER) {
          // need to power on the lamp first, before set color works
          light.on(0);
        }
        light.color(state.color.hue, state.color.saturation, brightness, state.color.kelvin, LIFX_FADETIME_MS);
        this.invalidateCache(deviceId);
      });
  }

  getPowerState(deviceId) {
    return this.getState(deviceId)
      .then((state) => {
        return state.power === POWER_ON_INTEGER;
      });
  }

  setPowerState(deviceId, value) {
    return new BluePromise((resolve, reject) => {
      debug('setPowerState', value);
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      if (value === true || value === 'true') {
        light.on(LIFX_FADETIME_MS);
      } else {
        light.off(LIFX_FADETIME_MS);
      }
      this.invalidateCache(deviceId);
      resolve();
    });
  }

  powerToggle(deviceId) {
    return this.getPowerState(deviceId)
      .then((powerState) => {
        this.setPowerState(deviceId, !powerState);
      });
  }

  getAmbientLight(deviceId) {
    return new BluePromise((resolve, reject) => {
      debug('getAmbientLight');
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      light.getAmbientLight((err, ambientLight) => {
        if (err) {
          reject(err);
        }

        const validAmbientValue = ambientLight === 0 || ambientLight > 0;
        if (!validAmbientValue) {
          reject(new Error('NO_STATE_RECIEVED'));
        }
        // normalize to 0..10, we don't know the range yet (assume 0..400)
        // but we can fix it in code without config migration
        if (ambientLight > MAX_AMBIENTLIGHT_RAW_VALUE) {
          debug('normalizedAmbientValue exceeded max value', ambientLight);
          resolve(10);
        } else {
          const normalizedAmbientValue = (1 / MAX_AMBIENTLIGHT_RAW_VALUE) * ambientLight * MAX_AMBIENTLIGHT_NORMALIZED_VALUE;
          const ambientRangeValue = parseInt(normalizedAmbientValue + 0.5, MAX_AMBIENTLIGHT_NORMALIZED_VALUE);
          debug(ambientLight, 'normalizedAmbientValue', ambientRangeValue);
          resolve(ambientRangeValue);
        }
      });
    });
  }

  getStateForPolling(deviceId) {
    let deviceState;
    return this.getState(deviceId)
      .then((_deviceState) => {
        deviceState = _deviceState;
        return this.getAmbientLight(deviceId);
      })
      .then((ambientLightSensor) => {
        return {
          brightness: deviceState.color.brightness,
          power: deviceState.power === POWER_ON_INTEGER,
          ambientlight: ambientLightSensor
        };
      });
  }

  showAlert(deviceId) {
    if (this.alertTimeoutId) {
      return BluePromise.reject(new Error('ALERT_ALREADY_RUNNING'));
    }
    const light = this.deviceState.getClientObjectIfReachable(deviceId);
    if (!light) {
      return BluePromise.reject(new Error('NOT_REACHABLE'));
    }
    let preAlertLampColorState;
    return this.getState(deviceId)
      .then((state) => {
        preAlertLampColorState = state.color;
        // fade to red
        light.color(0, 100, 100, preAlertLampColorState.kelvin, LIFX_ALERT_FADETIME_MS);
        this.alertTimeoutId = setTimeout(() => {
          light.color(preAlertLampColorState.hue, preAlertLampColorState.saturation, preAlertLampColorState.brightness, preAlertLampColorState.kelvin, LIFX_ALERT_FADETIME_MS);
          this.alertTimeoutId = undefined;
        }, LIFX_ALERT_TIMEOUT_MS);
        this.invalidateCache(deviceId);
      })
      .catch((error) => {
        clearTimeout(this.alertTimeoutId);
        this.alertTimeoutId = undefined;
        return BluePromise.reject(error);
      });
  }

}

module.exports = LifxService;
