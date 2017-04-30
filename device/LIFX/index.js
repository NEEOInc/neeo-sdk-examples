/*
 * Quick example for an LIFX light wrote by Geert Wille
 */

'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "LIFX" adapter');
console.log('---------------------------------------------');

/*
 * Adapter - simple LIFX integration.
 */

// first we set the device info, used to identify it on the Brain
const simpleLIFXLight = neeoapi.buildDevice('Smart Light') // LIFX LIFX looked weird in the app so I just named it Smart Light
  .setManufacturer('LIFX')
  .addAdditionalSearchToken('light')
  .setType('LIGHT')
  .enableDiscovery({
    headerText: 'Ready to discover LIFX lights',
    description: 'Make sure you create a new accessToken on https://cloud.lifx.com/settings so we can retrieve your lights'
  }, controller.discoverLIFX)
  // Then we add the capabilities of the LIFX bulb
  .addSlider({ name: 'power-slider', label: 'Dimmer', range: [0, 100], unit: '%' }, { setter: controller.sliderSet, getter: controller.sliderGet })
  .addSwitch({ name: 'toggle', label: 'Toggle ON/OFF' }, { setter: controller.switchSet, getter: controller.switchGet })
  .addButton({ name: 'pulse', label: 'Pulse' })
  .addButtonHander(controller.onPulse);

console.log('- discover one NEEO Brain...');
neeoapi.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeoapi.startServer({
      brain,
      port: 6336,
      name: 'simple-lifx',
      devices: [simpleLIFXLight]
    });
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "LIFX".');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  });
