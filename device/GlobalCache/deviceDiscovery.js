'use strict';

const BluePromise = require('bluebird');

const net = require('net');
const dgram = require('dgram');
const constants = require('./constants');
const Device = require('./device');

const ITACH_BROADCAST_ADDR = '239.255.250.250';
const ITACH_BROADCAST_PORT = 9131;
const BEACON_TIMEOUT = 1000 * 60 * 5;

const knownDevices = {};

const server = dgram.createSocket(net.isIPv6(ITACH_BROADCAST_ADDR) ? 'udp6' : 'udp4')
    .on('listening', () => {
        const address = server.address();
        console.log('GlobalCache/ITACH beacon listener started on ' + address.port);
        server.addMembership(ITACH_BROADCAST_ADDR);
    })
    .on('message', (message, remote) => {
        checkStaleBeacons();
        if (message.toString().startsWith("AMXB")) {
            parseBeacon(message.toString());
        }
    })
    .on('error', err => {
        console.error("Error creating beach listener. ", err);
    })
    .bind(ITACH_BROADCAST_PORT);

module.exports.getDevice = uuid => {
    return new BluePromise((resolve, reject) => {
        const device = knownDevices[uuid];
        if (device === undefined) {
            reject("Unknown device UUID: " + uuid);
        } else {
            resolve(device);
        }
    });
}

module.exports.getDevicePorts = type => {
    const devicePorts = [];
    for (let uuid in knownDevices) {
        if (knownDevices.hasOwnProperty(uuid)) {
            const device = knownDevices[uuid];
            devicePorts.push(device.getModulePorts());
        }
    }

    return BluePromise.all(devicePorts).then(ports => {
        return [].concat.apply([], ports)
            .filter( port => { return port.type === type; });
    });
}

function parseBeacon(message) {
    //console.log("Potential beacon found " + message);
    const msgParts = message.replace(/>/g, '').substring(4).split("<-");
    const max = msgParts.length;

    const beacon = { created: Date.now() };
    for (let i = 0; i < max; i++) {
        const idx = msgParts[i].indexOf("=");
        if (idx >= 0) {
            beacon[msgParts[i].substring(0, idx).trim()] = msgParts[i].substring(idx + 1).trim();
        }
    }

    const device = new Device(beacon);

    // purposely used '==' to catch null/undefined/empty
    if (device.getModel() == undefined || device.getUrl() == undefined) {
        //console.log("Beacon message is invalid or incomplete %s", message);
        return;
    }

    if (knownDevices.hasOwnProperty(device.getUUID())) {
        //console.log("Beacon %s being refreshed: %s at %s", device.getUUID(), device.getModel(), device.getUrl());
    } else {
        console.log("New Beacon %s found: %s at %s", device.getUUID(), device.getModel(), device.getUrl());
    }
    knownDevices[device.getUUID()] = device;
}

function checkStaleBeacons() {
    for (let uuid in knownDevices) {
        if (knownDevices.hasOwnProperty(uuid)) {
            const device = knownDevices[uuid];
            if (device.getCreated() + BEACON_TIMEOUT < Date.now()) {
                console.log("Beacon %s has expired and is being removed", device.getUUID());
                delete knownDevices[uuid];
            }
        }
    }
}

