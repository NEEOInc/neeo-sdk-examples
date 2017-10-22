'use strict';

const debug = require('debug');
const BluePromise = require('bluebird');
const fs = require('fs')
const readline = require('readline')
const os = require('os');
const net = require('net');
const dgram = require('dgram');

const PORT_NUMBER = 9;
const DEFAULT_IPADDRESS = '255.255.255.255';

let wolMap = "wol.map";

/**
 * Sets the path to the 'wol.map' file
 */
module.exports.setMapPath = (mapPath) => {
    wolMap = mapPath;
}

/**
 * Handles button presses for WOL
 */
module.exports.onButtonPressed = (deviceid, name) => {
    console.log(`WOL button pressed for ${name}`);

    const addr = parseAddr(name);
    const macAddr = getMacBuffer(addr.macAddress);

    if (macAddr) {
        let magic = Buffer.alloc(102, 0xff);
        for (let i = 6; i < magic.length; i+=6) {
            macAddr.copy(magic, i, 0);
        }

        debug("Sending WOL packet");
        sendPacket(addr.ipAddress, magic)
            .catch((err) => {
                console.error("Error occurred writing WOL packet. ", err || err.message);
            });

    } else {
        debug('MAC address was invalid and is ignored - %s', addr.macAddress);
    }
}

/**
 * Returns a promise to send the magic packet to the specified IP address
 * @param {any} ipAddress the ipaddress to send to 
 * @param {any} magic the magic packet to send
 */
function sendPacket(ipAddress, magic) {
    return new BluePromise((resolve, reject) => {
        const socket = dgram.createSocket(net.isIPv6(ipAddress) ? 'udp6' : 'udp4')
            .on('error', (err) => {
                socket.close();
                reject(err);
            })
            .once('listening', () => {
                socket.setBroadcast(true);
            });

        socket.send(magic, 0, magic.length, PORT_NUMBER, ipAddress, (err, res) => {
            socket.close();
            if (err) {
                reject(new Error("Exception writing the magic packet: " + err));
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Discovers devices from the wolMap file.  Please note that validation of the
 * address field is not 
 */
module.exports.discoverWolDevices = () => {
    debug('WOL discovery using %s', wolMap);

    return new BluePromise((resolve, reject) => {
        const devices = [];

        readline.createInterface({ input: fs.createReadStream(wolMap) })
            .on('line', (line) => {
                const parsedLine = parseLine(line);
                if (parsedLine) {
                    var parsedAddr = parseAddr(parsedLine.addr);
                    const macAddr = getMacBuffer(parsedAddr.macAddress);
                    if (macAddr) {
                        debug('WOL discovery call - found %s at %s', parsedLine.name, parsedLine.addr);
                        devices.push({
                            id: parsedLine.addr,
                            name: parsedLine.name,
                            reachable: true
                        });
                    } else {
                        debug("MAC address is invalid and will be ignored: %s", parsedAddr.macAddress);
                    }
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('close', () => {
                resolve(devices);
            });
    });
}

/**
 * Parses a line from the map file and returns undefined (if the line can't be parsed
 * or an object containing a name and addr field.
 * @param {any} line the line to parse
 */
function parseLine(line) {
    if (!line.startsWith("#")) {
        const idx = line.indexOf("=");
        if (idx >= 0) {
            return {
                name : line.substring(0, idx).trim(),
                addr : line.substring(idx + 1).trim().replace(/ /g, '/')
            }
        }
    }
    return undefined;
}

/**
 * Parses the string address (found in the wol.map file) to a macAddress/ipAddress
 * @param {any} addr the address field to parse
 */
function parseAddr(addr) {
    const idx = addr.indexOf("/");
    return {
        macAddress: (idx < 0 ? addr : addr.substring(0, idx)).trim(),
        ipAddress: (idx < 0 ? DEFAULT_IPADDRESS : addr.substring(idx + 1)).trim(),
    };
}

/**
 * Parses the String (hex) MAC address to a byte array of integers
 * @param {any} macAddress the max address
 */
function getMacBuffer(macAddress) {
    const hexArray = macAddress.split(/[-:]+/);
    if (hexArray.length === 6) {
        const buffer = Buffer.alloc(6);
        for (let i = 0; i < 6; i++) {
            buffer[i] = parseInt(hexArray[i], 16);
        }
        return buffer;
    } 

    return undefined;
}

