'use strict';

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class UpdatingDeviceController {
  static build() {
    return new UpdatingDeviceController();
  }

  onButtonPressed(name, deviceId) {
    // TODO implement the actions for your device here
    console.log(`[CONTROLLER] ${name} button pressed for device ${deviceId}`);
  }

  getter() {
    return this._value;
  }

  setter(deviceId, value) {
    this._value = value;
  }
};
