'use strict';

const BluePromise = require('bluebird');
const net = require('net');
const rl = require('readline');
const util = require('util');

const constants = require('./constants');
const DevicePort = require('./devicePort');

module.exports = Device;

function Device(beacon) {
    this.beacon = beacon;
    this.created = Date.now();
}

Device.prototype.getUUID = function() {
    return this.beacon[constants.BEACON_UUID];
}

Device.prototype.getModel = function() {
    return this.beacon[constants.BEACON_MODEL];
}

Device.prototype.getUrl = function() {
    return this.beacon[constants.BEACON_URL];
}

Device.prototype.getIpAddress = function() {
    const url = this.beacon[constants.BEACON_URL];
    const idx = url.indexOf('://');
    if (idx >= 0) {
        return url.substring(idx + 3);
    } else {
        return url;
    }
}

Device.prototype.getCreated = function() {
    return this.created;
}

Device.prototype.getModulePorts = function() {
    const device = this;
    return new BluePromise((resolve, reject) => {
        const socket = net.createConnection(constants.PORT_NUMBER, device.getIpAddress());
        socket
            .on('connect', function () {
                const devices = [];
                const cmd = util.format('%s', constants.COMMAND_GETDEVICES);

                rl.createInterface(socket, socket).on('line', line => {
                    console.log('Received (%s): %s', cmd, line);
                    if (line === 'endlistdevices') {
                        resolve(devices);
                        socket.destroy();
                    } else {
                        const args = line.split(',');
                        if (args.length === 3 && args[0] === 'device') {
                            if (args[1] !== '0') { // ignore the root module (ethernet/wifi)
                                switch (args[2]) {
                                    case constants.LINK_TYPE_3RELAY:
                                        devices.push(new DevicePort(device, args[1], 1, constants.BEACON_TYPE_CC));
                                        devices.push(new DevicePort(device, args[1], 2, constants.BEACON_TYPE_CC));
                                        devices.push(new DevicePort(device, args[1], 3, constants.BEACON_TYPE_CC));
                                        break;
                                    case constants.LINK_TYPE_1SERIAL:
                                        devices.push(new DevicePort(device, args[1], args[1], constants.BEACON_TYPE_SR));
                                        break;
                                    case constants.LINK_TYPE_1IR:
                                    case constants.LINK_TYPE_1IRBLASTER:
                                        devices.push(new DevicePort(device, args[1], 1, constants.BEACON_TYPE_IR));
                                        break;
                                    case constants.LINK_TYPE_3IR:
                                    case constants.LINK_TYPE_1IRTRIPORT:
                                    case constants.LINK_TYPE_1IRTRIPORTBLASTER:
                                        devices.push(new DevicePort(device, args[1], 1, constants.BEACON_TYPE_IR));
                                        devices.push(new DevicePort(device, args[1], 2, constants.BEACON_TYPE_IR));
                                        devices.push(new DevicePort(device, args[1], 3, constants.BEACON_TYPE_IR));
                                        break;
                                    default:
                                        console.error('Unknown port type: ' + line);
                                        break;
                                }
                            }
                        } else {
                            reject('Unknown response: ' + line);
                            socket.destroy();
                        }
                    }
                });
                console.log('Sending %s', cmd);
                socket.write(cmd + '\r');
            })
            .on('error', err => {
                socket.destroy();
                reject(err);
            });
    });
};

Device.prototype.setState = function (module, port, state) {
    const device = this;
    return new BluePromise((resolve, reject) => {
        const socket = net.createConnection(constants.PORT_NUMBER, device.getIpAddress());
        socket
            .on('connect', function() {
                const cmd = util.format('%s,%s:%s,%s', constants.COMMAND_SETSTATE, module, port, state);

                rl.createInterface(socket, socket).on('line', line => {
                    console.log('Received (%s): %s', cmd, line);
                    const args = line.split(',');
                    if (args.length === 3 && (args[0] === constants.RESPONSE_STATE || args[0] === constants.RESPONSE_SETSTATE)) {
                        resolve(args[2]);
                    } else {
                        reject('Unknown response: ' + line);
                    }
                    socket.destroy();
                });
                console.log('Sending %s', cmd);
                socket.write(cmd + '\r');
            })
            .on('error', err => {
                socket.destroy();
                reject(err);
            });
    });
};

Device.prototype.getState = function (module, port) {
    const device = this;
    return new BluePromise((resolve, reject) => {
        const socket = net.createConnection(constants.PORT_NUMBER, device.getIpAddress());
        socket
            .on('connect', function() {
                const cmd = util.format('%s,%s:%s', constants.COMMAND_GETSTATE, module, port);

                rl.createInterface(socket, socket).on('line', line => {
                    console.log('Received (%s): %s', cmd, line);
                    const args = line.split(',');
                    if (args.length === 3 && args[0] === constants.RESPONSE_STATE) {
                        resolve(args[2]);
                    } else {
                        reject('Unknown response: ' + line);
                    }
                    socket.destroy();
                });
                console.log('Sending %s', cmd);
                socket.write(cmd + '\r');
            })
            .on('error', err => {
                socket.destroy();
                reject(err);
            });
    });
};

Device.prototype.sendIR = function (module, port, state) {
    const device = this;
    return new BluePromise((resolve, reject) => {
        const socket = net.createConnection(constants.PORT_NUMBER, device.getIpAddress());
        socket
            .on('connect', function() {
                const cmd = util.format('%s,%s:%s,%s', constants.COMMAND_SENDIR, module, port, state);

                rl.createInterface(socket, socket).on('line', line => {
                    console.log('Received (%s): %s', cmd, line);
                    const args = line.split(',');
                    if (args.length === 3 && (args[0] === constants.RESPONSE_IR)) {
                        resolve(args[2]);
                    } else {
                        reject('Unknown response: ' + line);
                    }
                    socket.destroy();
                });
                console.log('Sending %s', cmd);
                socket.write(cmd + '\r');
            })
            .on('error', err => {
                socket.destroy();
                reject(err);
            });
    });
};

Device.prototype.sendSerial = function (module, serial) {
    const device = this;
    return new BluePromise((resolve, reject) => {
        const socket = net.createConnection(constants.PORT_NUMBER + module, device.getIpAddress());
        socket
            .on('connect', function() {
                console.log('Sending %s', serial);
                socket.write(serial);
                socket.destroy();
            })
            .on('error', err => {
                socket.destroy();
                reject(err);
            });
    });
};


