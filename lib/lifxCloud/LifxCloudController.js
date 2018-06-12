'use strict';

/*
 * Example code for an LIFX light integration.
 * originaly written by Geert Wille
 */
const BluePromise = require('bluebird');
const Lifx = require('lifx-http-api');

const LIFX_ALL_LIGHTS_SELECTOR = 'all';
const LIFX_LIGHT_OFF = 'off';
const LIFX_LIGHT_ON = 'on';
const LIFX_BEARER_TOKEN = process.env.LIFX_BEARER_TOKEN;

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class LifxCloudController {
  constructor() {
    // Initialize the service connection
    this._client = new Lifx({
      bearerToken: LIFX_BEARER_TOKEN
    });

    /*
     * We can cache the state values in the controller instance
     */
    this._sliderCachedValue = 50;
    this._switchCachedValue = true;

    /*
     * Getters and setters:
     * - The getters are used to send the current Values through the SDK (read)
     * - The setter allow changing values on the Brain and handling the changes here (write)
     */
    this.sliderHandlers = {
      getter: (deviceId) => this.sliderGet(deviceId),
      setter: (deviceId, params) => this.sliderSet(deviceId, params),
    };
    this.switchHandlers = {
      getter: (deviceId) => this.switchSet(deviceId),
      setter: (deviceId, params) => this.switchSet(deviceId, params),
    };
  }

  static build() {
    return new LifxCloudController();
  }

  static validateEnvironment() {
    if (!LIFX_BEARER_TOKEN) {
      throw new Error(
        'Error, no LIFX API token set, make sure to set LIFX_BEARER_TOKEN ' +
        'env variable, get it from https://cloud.lifx.com/settings'
      );
    }
  }

  /**
   * Set a slider to a new brightness value
   * @param {string} deviceId identifier for device to send value to
   * @param {string} value value to set the slider to
   */
  sliderSet(deviceId, value) {
    console.log('[CONTROLLER] dimmer set to', deviceId, value);
    this._sliderCachedValue = value;

    const brightness = this._sliderCachedValue / 100;

    return this._client.setState(LIFX_ALL_LIGHTS_SELECTOR, { brightness })
      .then(logStateUpdate)
      .catch(handleError);
  }

  /**
   * Get the brightness value of a slider
   * @param {string} deviceId identifier for device to get value for
   */
  sliderGet(deviceId) {
    console.log('[CONTROLLER] return current dimmer value', deviceId, this._sliderCachedValue);
    return BluePromise.resolve(this._sliderCachedValue);
  }

  /**
   * Set a switch to a new power value
   * @param {string} deviceId identifier for device to send value to
   * @param {boolean} value value to set the power to
   */
  switchSet(deviceId, value) {
    console.log('[CONTROLLER] switch set to', deviceId, value);
    this._switchCachedValue = value;

    const power = this._switchCachedValue ? LIFX_LIGHT_ON : LIFX_LIGHT_OFF;

    return this._client.setState(getLifxDeviceSelector(deviceId), { power })
      .then(logStateUpdate)
      .catch(handleError);
  }

  /**
   * Get the brightness value of a switch
   * @param {string} deviceId identifier for device to get value for
   */
  switchGet(deviceId) {
    console.log('[CONTROLLER] return switch value', deviceId, this._switchCachedValue);
    return BluePromise.resolve(this._switchCachedValue);
  }

  /**
   * Button handler
   * @param {string} name button name
   * @param {string} deviceId device identifier
   */
  handleButton(name, deviceId) {
    console.log(`[CONTROLLER] ${name} button pressed on ${deviceId}!`);
    switch(name) {
      case 'pulse':
        this._client.pulse(getLifxDeviceSelector(deviceId), {
          /*jshint camelcase: false */
          color: generateRandomColor(),
          from_color: generateRandomColor(),
          period: 1,
          cycles: 5,
          persist: false,
          power_on: true,
          peak: 0.8
        })
        .then(logStateUpdate)
        .catch(handleError);
        return;
      case 'all-off':
        this._client
          .setState(LIFX_ALL_LIGHTS_SELECTOR, {
            power: LIFX_LIGHT_OFF
          })
          .then(logStateUpdate)
          .catch(handleError);
        return;
      default:
        console.error('[CONTROLLER] Unknown command:', name);
    }
  }

  /**
   * Discover all LIFX lights and return them in the proper format
   */
  discover() {
    return this._client.listLights(LIFX_ALL_LIGHTS_SELECTOR)
      .then((LifxLights) => {
        console.info('[CONTROLLER] Lights discovered:', LifxLights);
        return LifxLights.map((lifx) => ({
          id: lifx.id,
          name: lifx.label,
          reachable: lifx.reachable
        }));
      })
      .catch((error) => {
        console.error('[CONTROLLER] Discovery error:', error.message);
        throw error;
      });
  }
};

function logStateUpdate(data) {
  console.log('[CONTROLLER] state update:', data);
}

function handleError(error) {
  console.error('[CONTROLLER] error:', error.message);
}

function getLifxDeviceSelector(deviceId) {
  return 'id:' + deviceId;
}

function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
