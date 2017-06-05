'use strict';

const BluePromise = require('bluebird');
const fs = require('fs');
const path = require('path');

const SerialFactory = require('./serialFactory');
const IrFactory = require('./irFactory');
const ContactClosureFactory = require('./contactClosureFactory');


module.exports = class GlobalCacheFactory {
    constructor(neeoapi, dirPath) {
        this._neeoapi = neeoapi;
        this._dirPath = dirPath ? dirPath : "./definitions";
    }

    buildDevices() {
        let devices = new IrFactory(this._neeoapi, this._dirPath).buildDevices();
        devices = devices.concat(new SerialFactory(this._neeoapi, this._dirPath).buildDevices());
        devices = devices.concat(new ContactClosureFactory(this._neeoapi).buildDevices());
        return devices;
    }
};