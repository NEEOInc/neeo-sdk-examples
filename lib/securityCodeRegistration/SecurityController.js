'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:securityCodeRegistration:controller');

const THE_ANSWER = '42';

module.exports = class SecurityController {
  constructor() {
    /*
     * This example only stores the registration in memory. A real driver
     * should persist the registration data, otherwise registration
     * will be needed after each restart of the driver.
     */
    this._registered = false;
    this._securityCode = 'unknown';
  }

  static build() {
    return new SecurityController();
  }

  /**
   * Allows validating the credentials sent by the Brain. The error from
   * the rejection will be forwarded to the UI as the error message.
   * @param {securityCode: String} credentials an object with the credentials
   * @return {Promise} reject with an error message if the code isn't correct,
   *                   resolve otherwise
   */
  register(credentials) {
    return new BluePromise((resolve, reject) => {
      debug('register', credentials);

      if (!credentials || !credentials.securityCode) {
        const error = new Error('INVALID_PAYLOAD_DATA');
        error.status = 400;
        throw error;
      }

      if (credentials.securityCode === THE_ANSWER) {
        this._registered = true;
        this._securityCode = credentials.securityCode;
        resolve();
      }

      const invalidCodeError = new Error('This cannot be the answer.');

      reject(invalidCodeError);
    });
  }

  /**
   * isRegistered is used by the Brain to skip the registration if already
   * complete.
   * @returns {Promise<boolean>} to a boolean, true if registered already.
   */
  isRegistered() {
    debug('isRegistered', this._registered);
    return BluePromise.resolve(this._registered);
  }

  discoverDevices() {
    debug('discovering devices');
    const devices = [{
      id: THE_ANSWER,
      name: 'Security Code Device',
      reachable: true,
    }];
    return BluePromise.resolve(devices);
  }

  getTextLabelValue() {
    debug('getting label value', this._securityCode);
    return BluePromise.resolve(this._securityCode);
  }
};
