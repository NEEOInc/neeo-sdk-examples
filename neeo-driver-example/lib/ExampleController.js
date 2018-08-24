'use strict';

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class ExampleController {
  constructor() {
  }

  static build() {
    return new ExampleController();
  }

  onButtonPressed(name, deviceId) {
    // TODO implement the actions for your device here
    console.log(`[CONTROLLER] ${name} button pressed for device ${deviceId}`);
  }
};
