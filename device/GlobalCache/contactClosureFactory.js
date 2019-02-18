'use strict';

const ContactClosureController = require('./contactClosureController');

module.exports = class ContactClosureFactory {
    constructor(neeoapi) {
        this._device = new ContactClosureController(neeoapi).buildDevice();
    }

    buildDevices() {
        return [
            this._device
        ];
    }
};