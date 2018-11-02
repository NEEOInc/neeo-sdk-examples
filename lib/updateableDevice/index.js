'use strict';

const neeoapi = require('neeo-sdk');
const UpdatingDeviceController = require('./UpdatingDeviceController');

const controller = UpdatingDeviceController.build();
const DEVICENAME = 'Device Update SDK Example';

/*
 * Device Update SDK Example
 *
 * This is the definition of the device before we updated it. Run this example with this definition first,
 * and add the Device to the Brain. Then stop the SDK example, comment out this definition and uncomment the
 * definition below it. Once the SDK is run with the new device version it will automatically update the device on the brain.
 *
 * NOTE: Not all properties of a device are updateable. The name, type & manufacturer for example are not updateable as we use them to identify the device.
 * The 'name' of components (e.g.: buttons, sliders, switches, etc.) can also not be updated as we use it to identify the component.
 * If you would like to change those properties, you can still do it, but you will need to remove and re-add the device on the Brain for the changes to take effect.
 */
const updateableDevice = buildVersion0();
//const updateableDevice = buildVersion1();

function buildVersion0() {
  return neeoapi.buildDevice(DEVICENAME)
    .setManufacturer('NEEO')
    .setType('ACCESSORY')
    .addAdditionalSearchToken('SDK')

    .addButton({ name: 'button-a', label: 'Button A' })
    .addButton({ name: 'button-b', label: 'Baton B' })
    .addButton({ name: 'button-c', label: 'Button C' })
    .addButtonHandler((name, deviceId) => controller.onButtonPressed(name, deviceId));
}

// jshint ignore:start
function buildVersion1() {
  return neeoapi.buildDevice(DEVICENAME)
    .setManufacturer('NEEO')
    .setType('ACCESSORY')
    .addAdditionalSearchToken('SDK')

    // This number is checked to determine if an update is available.
    // The device will update if the new number is bigger than the previous one.
    // If no version has been set before it will also update.
    .setDriverVersion(1)

    .addButton({ name: 'button-a', label: 'Button A' }) // This button stayed the same; it will not be changed
    .addButton({ name: 'button-b', label: 'Button B' }) // This button has an updated label and will be changed
    // Button C was removed from this SDK Device but will not be automatically removed from the Brain to prevent unwanted behaviour in recipes.
    .addButton({ name: 'button-d', label: 'Button D' }) // This button is new
    .addButtonHandler((name, deviceId) => controller.onButtonPressed(name, deviceId));
}
// jshint ignore:end

module.exports = {
  devices: [
    updateableDevice,
  ],
};
