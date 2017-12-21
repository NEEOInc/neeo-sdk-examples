'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "simpleAccessory" adapter');
console.log('------------------------------------------');

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use a single very
 * simple device.
 */

// first we set the device info, used to identify it on the Brain
const customLightDevice = neeoapi.buildDevice('Simple Accessory')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('foo')
  .setType('ACCESSORY')

  // Then we add the capabilities of the device
  .addButton({ name: 'button-a', label: 'Button A' })
  .addButton({ name: 'button-b', label: 'Button B' })
  .addButtonGroup('Color Buttons')
  .addButtonHandler(controller.onButtonPressed);

function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'simple-accessory-one',
    devices: [customLightDevice]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Accessory".');
  })
  .catch((error) => {
    //if there was any error, print message out to console
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

const brainIp = process.env.BRAINIP;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startSdkExample(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startSdkExample(brain);
    });
}
