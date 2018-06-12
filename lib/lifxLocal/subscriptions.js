'use strict';

const debug = require('debug')('neeo:lifx-local:subscriptions');

module.exports = class Subscriptions {
  constructor() {
    this._subscriptions = [];
  }

  static build() {
    return new Subscriptions();
  }

  add(id) {
    this._subscriptions = [...this._subscriptions, id];
    debug('subscription added, %o', this._subscriptions);
  }

  remove(id) {
    // Note: multiple Brain devices can subscribe the same deviceId
    // so we only remove them one by one.
    const firstOccurence = this._subscriptions.indexOf(id);
    this._subscriptions = this._subscriptions
      .filter((_id, index) => index !== firstOccurence);
    debug('subscription removed, %o', this._subscriptions);
  }

  resetWith(ids) {
    this._subscriptions = ids
      .filter((id) => id);
    debug('subscriptions reset, %o', this._subscriptions);
  }

  isSubscribed(id) {
    return this._subscriptions.includes(id.toString());
  }

  count() {
    return this._subscriptions.length;
  }

};
