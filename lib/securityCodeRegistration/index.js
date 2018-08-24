'use strict';

const neeoapi = require('neeo-sdk');
const SecurityController = require('./SecurityController');

/*
 * Security Code Registration Example
 *
 * This device is a sample showing how registration can be used.
 * - Registration happens before discovery
 * - Registration is only possible for discovery enabled devices
 */

const discoveryInstructions = {
  headerText: 'NEEO SDK Example Registration',
  description:
    'This example device shows the use of security code registration and discovery',
};

const registrationInstructions = {
  type: 'SECURITY_CODE',
  headerText: 'Enter Security Code',
  description:
    'What is the answer to the Ultimate Question of Life, The Universe, and Everything?',
};

const textLabel = {
  name: 'the-answer',
  label: 'The answer is',
  isLabelVisible: true,
};

const controller = SecurityController.build();

const registrationDevice = neeoapi.buildDevice('Security Code SDK Example')
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
