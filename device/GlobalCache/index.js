'use strict';

const neeoapi = require('neeo-sdk');

console.log('NEEO SDK Example "GlobalCache/ITach" adapter');
console.log('---------------------------------------------');

/**
 * The following defines the directory where IR/Serial definitions are found.
 * If undefined - will default to "./definitions"
 */
//const definitionsDirectory = undefined;
const definitionsDirectory = "./device/GlobalCache/definitions";

/**
 * Defines the devices that can be discovered
 */
let devices = [];

/**
 * The following line will define a single contact closure device,
 *    zero to many IR devices (depending on how many ".ir" files are in
 *                             the definitions directory)
 *    zero to many serial devices (depending on how many ".ser" files are
 *                                 in the definitions directory)
 */
const GlobalCacheFactory = require('./globalCacheFactory');
devices = devices.concat(new GlobalCacheFactory(neeoapi, definitionsDirectory).buildDevices());

/**
 * The following lines allow you to use the individual factories with  
 * different definition directories if needed and potentially different
 * file extensions if needed
 */
//const ContactClosureFactory = require('./contactClosureFactory');
//devices = devices.concat(new ContactClosureFactory(neeoapi).buildDevices());

//const IrFactory = require('./irFactory');
//devices = devices.concat(new IrFactory(neeoapi, definitionsDirectory, ".ir").buildDevices());

//const SerialFactory = require('./serialFactory');
//devices = devices.concat(new SerialFactory(neeoapi, definitionsDirectory, ".ser").buildDevices());


/**
 * The following lines allow you to ignore the factories and construct devices directly.
 * The contact closure requires no additional setup but the IR/Serial devices are
 * constructed directly from the specified file
 */
//const ContactClosureController = require('./contactClosureController');
//devices.push(new ContactClosureController(neeoapi).buildDevice());

//const IrController = require('./irController');
//devices.push(new IrController(neeoapi, definitionsDirectory + "/Lutron QED.ir").buildDevice());

//const SerialController = require('./serialController');
//devices.push(new IrController(neeoapi, definitionsDirectory + "/mySerial.txt").buildDevice());

/*****************************************************************
 * SDK server setup - make sure you modify the port to something
 * unique if running multiple version
 ******************************************************************/
function startSdkExample(brain) {
    console.log('- Start server');
    neeoapi.startServer({
        brain,
        port: 6336,
        name: 'global-cache',
        devices: devices
    })
        .then(() => {
            console.log('# READY! use the NEEO app to search for "GlobalCache".');
        })
        .catch((error) => {
            //if there was any error, print message out to console
            console.error('ERROR!', error.message);
            process.exit(1);
        });
}

/*****************************************************************
 * Start the SDK server
 ******************************************************************/
//const brainIp = '192.168.1.29';
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
