'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "discoverableLightDevice"');
console.log('------------------------------------------');

/*
 * Adapter - an Adapter contains one or more DEVICES. The idea of supporting
 * multiple devices in one adapter is, that you can support multiple similar
 * devices (think a full version or a lite version).
 * This allows not only supporting multiple of the same device, but also similar
 * devices.
 */

const discoveryInstructions = {
  headerText: 'HELLO HEADER',
  description: 'ADD SOME ADDITIONAL INFORMATION HOW TO PREPARE YOUR DEVICE,' +
    ' FOR EXAMPLE PRESS A BUTTON TO ENABLE THE DISCOVERY MODE'
};

const complexDeviceLite = neeoapi.buildDevice('Complex Device')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('lite')
  .setType('light')

  .addSlider(
    { name: 'power-slider', label: 'Dimmer', range: [0,200], unit: '%' },
    { setter: controller.sliderSet, getter: controller.sliderGet }
  )

  .enableDiscovery(discoveryInstructions, controller.discoverLiteDevices);


const complexDeviceFull = neeoapi.buildDevice('Complex Device Pro')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('pro')
  .setType('light')

  .addSlider({ name: 'power-slider', label: 'Dimmer', range: [0,200], unit: '%' },
    { setter: controller.sliderSet, getter: controller.sliderGet })

  .addSwitch({ name: 'pro-switch', label: 'Pro power-saving mode' },
    { setter: controller.switchSet, getter: controller.switchGet })

  .addButton({ name: 'pro-button', label: 'Pro Bonus Button' })
  .addButton({ name: 'pro-button2', label: 'Pro Bonus Button2' })
  .addButtonHander(controller.button)

  .enableDiscovery(discoveryInstructions, controller.discoverProDevices)

  .registerSubscriptionFunction(controller.registerStateUpdateCallback);



function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'simple-adapter-one',
    devices: [complexDeviceLite, complexDeviceFull]
  })
  .then(() => {
    console.log('# READY, use the mobile app to search for your newly added adapter!');
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
