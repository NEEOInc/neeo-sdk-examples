'use strict';

const BluePromise = require('bluebird');
const fs = require('fs');
const path = require('path');

const SerialController = require('./serialController');

module.exports = class SerialFactory {
    constructor(neeoapi, dirPath, ext) {
        this._neeoapi = neeoapi;
        this._dirPath = dirPath ? dirPath : "./definitions";
        this._ext = ext ? ext : ".ser";
    }

    buildDevices() {
        const devices = [];

        const files = fs.readdirSync(this._dirPath);
        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) === this._ext) {
                devices.push(new SerialController(this._neeoapi, path.format({ dir: this._dirPath, base: files[i] })).buildDevice());
            }
        }

        return devices;
    }
};