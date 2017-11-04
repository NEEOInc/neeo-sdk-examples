'use strict';

const neeoapi = require('neeo-sdk');
const devices = require('./devices');

console.log('NEEO SDK Example "multipleDevices" adapter');
console.log('------------------------------------------');


function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'multidevice-adapter',
    devices: devices
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Multiple Devices".');
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
