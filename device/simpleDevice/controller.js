'use strict';

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onButtonPressed = function onButtonPressed(deviceid, name) {
  console.log('[CONTROLLER]', name, 'button was pressed!');
};
