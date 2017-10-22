'use strict';

const neeoapi = require('neeo-sdk');

console.log('NEEO SDK Example "WakeOnLan"');
console.log('------------------------------------------');

const controller = require('./controller');

/**
 * Uncomment the following line to set the path to the wol map file
 */
//controller.setMapPath("device/WakeOnLan/wol.map");

const wolDevice = neeoapi.buildDevice('WakeOnLan')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('WOL')
    .setType('ACCESSOIRE')
    .addButton({ name: 'wol', label: 'Wake Up' })
    .addButtonHander(controller.onButtonPressed)
    .enableDiscovery({
        headerText: 'WOL Instructions',
        description: 'Please make sure you add devices to wol.map'
    }, controller.discoverWolDevices);

function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'wake-on-lan',
    devices: [wolDevice]
  })
  .then(() => {
    console.log('# READY, use the mobile app to search for "WakeOnLan"');
  })
  .catch((error) => {
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

const brainIp = process.env.BRAINIP;
//const brainIp = '192.168.1.29';
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
