'use strict';

const expect = require('chai').expect;
const requireHelper = require('../../../require_helper.js');
const Subscriptions = requireHelper('lib/devices/lifx-local/subscriptions');

describe('./lib/devices/lifx-local/subscriptions', function() {
  let subscriptions;

  beforeEach(function() {
    subscriptions = Subscriptions.build();
  });

  describe('static build()', function() {
    it('should initialize with 0 subscriptions', function() {
      // THEN
      expect(subscriptions.count()).to.equal(0);
    });
  });

  describe('add', function() {
    it('should add deviceId to subscriptions', function() {
      // GIVEN
      const deviceId = '42';

      // WHEN
      subscriptions.add(deviceId);

      // THEN
      expect(subscriptions.count()).to.equal(1);
      expect(subscriptions.isSubscribed(deviceId)).to.equal(true);
    });

    it('should allow adding the same deviceId multiple times', function() {
      // GIVEN
      const deviceId = '42';

      // WHEN
      subscriptions.add(deviceId);
      subscriptions.add(deviceId);

      // THEN
      expect(subscriptions.count()).to.equal(2);
      expect(subscriptions.isSubscribed(deviceId)).to.equal(true);
    });
  });

  describe('remove', function() {
    it('should do nothing if id not found', function() {
      // GIVEN
      const deviceId = '42';

      // WHEN
      subscriptions.remove(deviceId);

      // THEN
      expect(subscriptions.count()).to.equal(0);
      expect(subscriptions.isSubscribed(deviceId)).to.equal(false);
    });

    it('remove deviceId from subscriptions', function() {
      // GIVEN
      const deviceId = '42';
      subscriptions.add(deviceId);

      // WHEN
      subscriptions.remove(deviceId);

      // THEN
      expect(subscriptions.count()).to.equal(0);
      expect(subscriptions.isSubscribed(deviceId)).to.equal(false);
    });

    it('remove only first occurence if deviceId exists multiple times', function() {
      // GIVEN
      const deviceId = '42';
      subscriptions.add(deviceId);
      subscriptions.add(deviceId);

      // WHEN
      subscriptions.remove(deviceId);

      // THEN
      expect(subscriptions.count()).to.equal(1);
      expect(subscriptions.isSubscribed(deviceId)).to.equal(true);
    });
  });

  describe('resetWith', function() {
    it('should override previous subscriptions', function() {
      // GIVEN
      subscriptions.add('42');
      subscriptions.add('41');

      // WHEN
      subscriptions.resetWith(['43']);

      // THEN
      expect(subscriptions.count()).to.equal(1);
      expect(subscriptions.isSubscribed('43')).to.equal(true);
      expect(subscriptions.isSubscribed('42')).to.equal(false);
      expect(subscriptions.isSubscribed('41')).to.equal(false);
    });

    it('should allow multiple time same ids', function() {
      // WHEN
      subscriptions.resetWith(['43', '43', '43']);

      // THEN
      expect(subscriptions.count()).to.equal(3);
      expect(subscriptions.isSubscribed('43')).to.equal(true);
    });

    it('should ignore falsy values', function() {
      // WHEN
      subscriptions.resetWith([false, '43', undefined, '43', null]);

      // THEN
      expect(subscriptions.count()).to.equal(2);
      expect(subscriptions.isSubscribed('43')).to.equal(true);
    });
  });

});
