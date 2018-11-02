'use strict';

const accountRegistration = require('../lib/accountRegistration');
const alwaysOnDevices = require('../lib/alwaysOnDevice');
const fileBrowser = require('../lib/fileBrowser');
const lifxLocal = require('../lib/lifxLocal');
const playerComponent = require('../lib/playerComponent');
const securityCodeRegistration = require('../lib/securityCodeRegistration');
const dynamicDeviceBuilder = require('../lib/dynamicDeviceBuilder');
const simpleAccessory = require('../lib/simpleAccessory');
const updateableDevice = require('../lib/updateableDevice');

module.exports = {
  devices: [
    ...accountRegistration.devices,
    ...alwaysOnDevices.devices,
    ...fileBrowser.devices,
    ...securityCodeRegistration.devices,
    ...lifxLocal.devices,
    ...playerComponent.devices,
    ...dynamicDeviceBuilder.devices,
    ...simpleAccessory.devices,
    ...updateableDevice.devices,
  ],
};
