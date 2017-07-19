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
const customLightDevice = neeoapi.buildDevice('Simple Device')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('foo')
  .setType('TV')

  // Then we add the capabilities of the device
  .addButton({ name: 'button-a', label: 'Button A' })
  .addButton({ name: 'button-b', label: 'Button B' })
  .addButton({ name: 'INPUT HDMI 1' })

  .addButtonGroup('Power')
  .addButtonGroup('volume')
  .addButtonGroup('Menu and Back')
  .addButtonGroup('Controlpad')
  .addButtonGroup('Channel Zapper')

  //HINT: the next four lines are just to demonstrate how to manually add buttons, you could also use .addButtonGroup('Color Buttons')
  .addButton({ name: 'FUNCTION RED' })
  .addButton({ name: 'FUNCTION GREEN' })
  .addButton({ name: 'FUNCTION YELLOW' })
  .addButton({ name: 'FUNCTION BLUE' })

  .addTextLabel({ name: 'wizard', label: 'Wizard' }, controller.getWizardLabelText)

  .addImageUrl({ name: 'small-kitten-image', label: 'Small Kitten', size: 'small' }, controller.getSmallKittenImageUri)
  .addImageUrl({ name: 'large-kitten-image', label: 'Large Kitten', size: 'large' }, controller.getLargeKittenImageUri)

  .addButtonHander(controller.onButtonPressed);

function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'simple-adapter-one',
    devices: [customLightDevice]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Simple Device".');
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
