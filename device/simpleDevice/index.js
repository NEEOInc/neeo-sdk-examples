'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "simpleCustomDevice" adapter');
console.log('---------------------------------------------');

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use a single very
 * simple 2 button device.
 */

// first we set the device info, used to identify it on the Brain
const customLightDevice = neeoapi.buildDevice('Simple Buttons')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('foo')
  .setType('ACCESSOIRE')

  // Then we add the capabilities of the device
  .addButton({ name: 'button-a', label: 'Button A' })
  .addButton({ name: 'button-b', label: 'Button B' })
  .addButtonHander(controller.onButtonPressed);

console.log('- discover one NEEO Brain...');
neeoapi.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeoapi.startServer({
      brain,
      port: 6336,
      name: 'simple-adapter-one',
      devices: [customLightDevice]
    });
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Simple Device".');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  });
