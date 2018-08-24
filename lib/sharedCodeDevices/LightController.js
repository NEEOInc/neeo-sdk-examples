'use strict';

const BluePromise = require('bluebird');

let sliderValue = 0;
let switchValue = true;

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class LightController {
  constructor() {

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
    return new LightController();
  }

  /**
   * Slider set handler, only used by Pro device
   * @param {string} deviceid
   * @param {boolean} value
   */
  sliderSet(deviceid, value) {
    console.log('[CONTROLLER] dimmer set to', deviceid, value);
    sliderValue = value;
  }

  /**
   * Slider get handler, only used by Pro device
   * @param {string} deviceid
   */
  sliderGet(deviceid) {
    console.log('[CONTROLLER] return current dimmer value', deviceid, sliderValue);
    return BluePromise.resolve(sliderValue);
  }

  /**
   * Shared set switch handler for both devices
   * @param {string} deviceid
   * @param {boolean} value
   */
  switchSet(deviceid, value) {
    console.log('[CONTROLLER] switch set to', deviceid, value);
    switchValue = value;
  }

  /**
   * Shared get switch handler for both devices
   * @param {string} deviceid
   */
  switchGet(deviceid) {
    console.log('[CONTROLLER] return switch value', deviceid, switchValue);
    return BluePromise.resolve(switchValue);
  }

  /**
   * Discovery for the Lite devices,
   * filters out the pro devices from the results.
   */
  discoverLiteDevices() {
    console.log('[CONTROLLER] lite discovery call');
    return sharedDeviceDiscovery()
      .then((discoveryResults) => {
        return discoveryResults
          .filter((device) => device.type === 'lite')
          .map(formatDiscoveryResult);
      });
  }

  /**
   * Discovery for the Pro devices,
   * filters out the lite devices from the results.
   */
  discoverProDevices() {
    console.log('[CONTROLLER] pro discovery call');
    return sharedDeviceDiscovery()
      .then((discoveryResults) => {
        return discoveryResults
          .filter((device) => device.type === 'pro')
          .map(formatDiscoveryResult);
      });
  }
};

/**
 * Since both devices are very similar they can use the same discovery function internally.
 *
 * However we need a way to filter results for the Brain by type. This is because on the Brain
 * they are exposing different functionality.
 * - Adding a lite device as a pro device would result in broken functionality in the UI (pro functions wont work on lite)
 * - Adding a pro device as a lite device would result in missing functionality in the UI (pro functions wont be listed)
 *
 *
 */
function sharedDeviceDiscovery() {
  return BluePromise.resolve([
    {
      id: 'unique-device-id-001',
      name: 'first device',
      type: 'pro'
    },
    {
      id: 'unique-device-id-002',
      name: 'second device, but not reachable',
      reachable: false,
      type: 'pro'
    },
    {
      id: 'unique-device-id-003',
      name: 'third device, unreachable',
      reachable: false,
      type: 'lite'
    },
    {
      id: 'unique-device-id-004',
      name: 'fourth device, unreachable',
      reachable: false,
      type: 'lite'
    }
  ]);
}

function formatDiscoveryResult(device) {
  return {
    id: device.id,
    name: device.name,
    reachable: device.reachable,
  };
}
