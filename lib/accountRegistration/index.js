'use strict';

const neeoapi = require('neeo-sdk');
const SecurityController = require('./SecurityController');

/*
 * Account Registration Example
 *
 * This device is a sample showing how registration can be used with username & password.
 * - Registration happens before discovery
 * - Registration is only possible for discovery enabled devices
 */

const discoveryInstructions = {
  headerText: 'NEEO SDK Example Registration',
  description:
    'This example device shows the use of a username & password for registration and discovery',
};

const registrationInstructions = {
  type: 'ACCOUNT',
  headerText: 'Enter Credentials',
  description:
    'Use the example username \'sdkuser\' and the example password \'hunter2\' to log in.',
};

const textLabel = {
  name: 'loggedin-user',
  label: 'Logged in as',
  isLabelVisible: true,
};

const controller = SecurityController.build();

const registrationDevice = neeoapi.buildDevice('Security Account SDK Example')
  .setManufacturer('NEEO')
  .setType('ACCESSORY')
  .addAdditionalSearchToken('SDK')
  .addTextLabel(textLabel, () => controller.getTextLabelValue())
  .enableDiscovery(discoveryInstructions, () => controller.discoverDevices())
  .enableRegistration(registrationInstructions, {
    register: (credentials) => controller.register(credentials),
    isRegistered: () => controller.isRegistered(),
  });

module.exports = {
  devices: [
    registrationDevice,
  ],
};
