'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const requireHelper = require('../../require_helper.js');
const capabilities = requireHelper('lib/playerComponent/capabilities');

describe('./lib/playerComponent/capabilities.js', function() {
  it('should expose buttons', function() {
    expect(capabilities.buttons.length).to.equal(13);
  });

  it('should expose switches', function() {
    expect(capabilities.switches.length).to.equal(4);
    expect(capabilities.switches[0].name).to.equal('PLAYING');
    expect(capabilities.switches[0].callbackName).to.equal('playSwitch');
    expect(capabilities.switches[1].name).to.equal('MUTE');
    expect(capabilities.switches[1].callbackName).to.equal('muteSwitch');
    expect(capabilities.switches[2].name).to.equal('SHUFFLE');
    expect(capabilities.switches[2].callbackName).to.equal('shuffleSwitch');
    expect(capabilities.switches[3].name).to.equal('REPEAT');
    expect(capabilities.switches[3].callbackName).to.equal('repeatSwitch');
  });

  it('should expose sliders', function() {
    expect(capabilities.sliders.length).to.equal(1);
    expect(capabilities.sliders[0].name).to.equal('VOLUME');
    expect(capabilities.sliders[0].callbackName).to.equal('volumeSlider');
  });

  it('should expose sensors', function() {
    expect(capabilities.sensors.length).to.equal(3);
    expect(capabilities.sensors[0].name).to.equal('COVER_ART_SENSOR');
    expect(capabilities.sensors[0].callbackName).to.equal('coverArtSensor');
    expect(capabilities.sensors[0].type).to.equal('string');
    expect(capabilities.sensors[1].name).to.equal('TITLE_SENSOR');
    expect(capabilities.sensors[1].callbackName).to.equal('titleSensor');
    expect(capabilities.sensors[1].type).to.equal('string');
    expect(capabilities.sensors[2].name).to.equal('DESCRIPTION_SENSOR');
    expect(capabilities.sensors[2].callbackName).to.equal('descriptionSensor');
    expect(capabilities.sensors[2].type).to.equal('string');
  });
});
