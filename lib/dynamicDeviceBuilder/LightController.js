'use strict';

const BluePromise = require('bluebird');
const neeoapi = require('neeo-sdk');
const CONSTANTS = require('./constants');

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

  buildProDevice() {
    //NOTE the device name must match the "root" name of the driver!
    return neeoapi.buildDevice(CONSTANTS.UNIQUE_DEVICE_NAME)
      .setSpecificName('PRO LIGHT')
      .setManufacturer('NEEO')
      .setType('light')
      .addCapability('dynamicDevice')
      // Here we add the power switch like the lite device
      .addSwitch(
        CONSTANTS.POWER_SWITCH,
        this.switchHandlers
      )
      // And the slider a feature not available on the lite device
      .addSlider(
        CONSTANTS.DIMMER,
        this.sliderHandlers
      );
  }

  buildLightDevice() {
    return neeoapi.buildDevice(CONSTANTS.UNIQUE_DEVICE_NAME)
      .setSpecificName('LIGHT LIGHT')
      .setManufacturer('NEEO')
      .setType('light')
      .addCapability('dynamicDevice')
      // Here we add the power switch like the lite device
      .addSwitch(
        CONSTANTS.POWER_SWITCH,
        this.switchHandlers
      );
  }

  /**
   * if the discover function requests a specific device (optionalDeviceId is set), this means:
   * - the device has enabled the enableDynamicDeviceBuilder feature
   * - first time the NEEO Brain want to use this device, the driver is responsible to build
   *   it and return that driver.
   */
  discoverDevices(optionalDeviceId) {
    console.log('[CONTROLLER] discovery call', optionalDeviceId);
    return sharedDeviceDiscovery(optionalDeviceId)
      .then((discoveryResults) => {
        return discoveryResults
          .map((device) => {
            return {
              id: device.id,
              name: device.name,
              room: device.room,
              reachable: device.reachable,
              device: device.pro ? this.buildProDevice() : this.buildLightDevice(),
            };
          });
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
function sharedDeviceDiscovery(deviceIdFilter) {
  const MOCKED_DISCOVER_RESULTS = [
    {
      id: 'unique-device-id-001',
      name: 'PRO: 1st device',
      room: 'I live in ROOM A',
      pro: true,
    },
    {
      id: 'unique-device-id-002',
      name: 'PRO: 2nd device, but not reachable',
      room: 'I live in ROOM A',
      reachable: false,
      pro: true,
    },
    {
      id: 'unique-device-id-003',
      name: 'LIGHT: 3rd device, unreachable',
      room: 'I live in ROOM B',
      reachable: false,
      pro: false,
    },
    {
      id: 'unique-device-id-004',
      name: 'LIGHT: 4th device, unreachable',
      room: 'I live in ROOM B',
      reachable: false,
      pro: false,
    },
  ];
  const noFilter = deviceIdFilter === undefined;
  const discoveredDevices = MOCKED_DISCOVER_RESULTS.filter((entry) => entry.id === deviceIdFilter || noFilter);
  return BluePromise.resolve(discoveredDevices);
}
