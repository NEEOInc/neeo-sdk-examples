'use strict';

const alwaysOnDevices = require('../lib/alwaysOnDevice');
const fileBrowser = require('../lib/fileBrowser');
const lifxCloud = require('../lib/lifxCloud');
const lifxLocal = require('../lib/lifxLocal');
const playerComponent = require('../lib/playerComponent');
const securityCodeRegistration = require('../lib/securityCodeRegistration');
const sharedCodeDevices = require('../lib/sharedCodeDevices');
const simpleAccessory = require('../lib/simpleAccessory');

module.exports = {
  devices: [
    ...alwaysOnDevices.devices,
    ...fileBrowser.devices,
    ...securityCodeRegistration.devices,
    ...lifxCloud.devices,
    ...lifxLocal.devices,
    ...playerComponent.devices,
    ...sharedCodeDevices.devices,
    ...simpleAccessory.devices,
  ],
};
