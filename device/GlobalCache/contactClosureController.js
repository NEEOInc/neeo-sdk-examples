'use strict';

const BluePromise = require('bluebird');

const discovery = require('./deviceDiscovery');
const constants = require('./constants');
const gcUtils = require('./gcUtils');

module.exports = class ContactClosureController {
    constructor(neeoapi) {
        this._neeoapi = neeoapi;
    }

    buildDevice() {
        return this._neeoapi.buildDevice('IP2CC')
            .setManufacturer('GlobalCache')
            .addAdditionalSearchToken('itach')
            .addAdditionalSearchToken('simple blaster')
            .addSwitch({ name: 'closeContact', label: 'Contact' },
              { setter: this._setSwitch, getter: this._getSwitch }
            )
            .enableDiscovery({
                headerText: 'Contact Closure Settings',
                description: 'No additional setup for contact closure'
            }, this._discoverDevices)
            .setType('ACCESSOIRE');
    }

    _setSwitch(deviceid, value) {
        const valueToSet = value === "true" ? '1' : '0';
        return new BluePromise((resolve, reject) => {
            const device = gcUtils.parseDeviceId(deviceid)

            return discovery.getDevice(device.uuid)
                .then(results => {
                    return results.setState(device.module, device.port, valueToSet)
                })
                .then(rc => {
                    if (rc !== valueToSet) {
                        throw new Error("State was not correctly set on the device - expecting " + valueToSet + " but got " + rc);
                    }
                })
                .catch(e => {
                    console.error("Error setting switch value.  ", e.message);
                });
        });
    }

    _getSwitch(deviceid) {
        return new BluePromise((resolve, reject) => {
            const device = gcUtils.parseDeviceId(deviceid)

            return discovery.getDevice(device.uuid)
                .then(results => {
                    return results.getState(device.module, device.port)
                })
                .then(state => {
                    return state !== '0';
                });
        });
    }

    _discoverDevices() {
        return discovery
            .getDevicePorts(constants.BEACON_TYPE_CC)
            .map(port => {
                return gcUtils.createDeviceDiscovery(port);
            });
    }
};