'use strict';

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onButtonPressed = function onButtonPressed(name, deviceId) {
  console.log(`[CONTROLLER] ${name} button pressed for device ${deviceId}`);
  // TODO implement the actions for your device here
};
