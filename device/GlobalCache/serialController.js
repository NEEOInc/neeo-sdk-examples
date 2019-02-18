'use strict';

const BluePromise = require('bluebird');
const fs = require('fs');
const path = require('path');

const discovery = require('./deviceDiscovery');
const constants = require('./constants');
const gcUtils = require('./gcUtils');

module.exports =  class SerialController {
    constructor(neeoapi, fullPath) {
        this._fileName = path.parse(fullPath).name;
        this._neeoapi = neeoapi;
        this._cache = {};
        this._mappings = new Map();

        const json = fs.readFileSync(fullPath, 'utf8');
        const mappings = JSON.parse(json.trim());
        for (let i = 0; i < mappings.length; i++) {
            this._mappings.set(mappings[i].name, mappings[i]);
        }
    }

    buildDevice() {
        let device = this._neeoapi.buildDevice('IP2SL (' + this._fileName + ')')
            .setManufacturer('GlobalCache')
            .addAdditionalSearchToken('itach')
            .addAdditionalSearchToken('simple blaster')
            .addButtonHander((deviceId, name) => {
                return this._onButtonPressed(deviceId, name);
            })
            .enableDiscovery({
                headerText: 'Serial Settings',
                description: 'Modify the ' + this._fileName + ' file to include serial commands'
            }, this._discoverDevices)
            .setType('ACCESSOIRE');

        for (const [name, mapping] of this._mappings) {
            device = device.addButton({ name: mapping.name, label: mapping.label });
        }

        return device;
    }

    _onButtonPressed(deviceId, name) {
        return new BluePromise((resolve, reject) => {
            const mapping = this._mappings.get(deviceId);
            if (mapping) {
                const device = gcUtils.parseDeviceId(name)

                return discovery.getDevice(device.uuid)
                    .then(results => {
                        return results.sendSerial(device.module, mapping.cmd);
                    });
            } else {
                reject("unknown deviceid: " + deviceId);
            }
        });
    }

    _discoverDevices() {
        return discovery
            .getDevicePorts(constants.BEACON_TYPE_SR)
            .map(port => {
                return gcUtils.createDeviceDiscovery(port);
            });
    }
};