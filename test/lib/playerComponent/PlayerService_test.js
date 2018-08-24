'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const requireHelper = require('../../require_helper.js');
const PlayerService = requireHelper('lib/playerComponent/PlayerService');

describe('./lib/playerComponent/PlayerService.js', function() {
  let playerService;

  const initialStateExpectation = {
    PLAYING: false,
    MUTE: false,
    SHUFFLE: false,
    REPEAT: false,

    VOLUME: 50,
    COVER_ART_SENSOR: 'https://neeo-sdk.neeo.io/kitten.jpg',
    TITLE_SENSOR: 'A Kitten',
    DESCRIPTION_SENSOR: 'This is the description...',
  };

  beforeEach(function() {
    playerService = PlayerService.build();
  });

  describe('build', function() {
    it('should set initial state', function() {
      expect(playerService.playerState).to.deep.equal(initialStateExpectation);
    });
  });

  describe('getState', function() {
    it('should get state', function() {
      const initialPlayingStateExpectation = {
        PLAYING: false,
      };
      const element = {
        key: 'PLAYING',
      };

      const playingState = playerService.getState(element);

      expect(playingState).to.deep.equal(initialPlayingStateExpectation.PLAYING);
    });
  });

  describe('updateState', function() {
    it('should update state - SWITCH_PLAYING', function() {
      const element = {
        key: PlayerService.SWITCH_PLAYING,
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SWITCH_MUTE', function() {
      const element = {
        key: PlayerService.SWITCH_MUTE,
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SWITCH_MUTE', function() {
      const element = {
        key: PlayerService.SWITCH_MUTE,
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SWITCH_SHUFFLE', function() {
      const element = {
        key: PlayerService.SWITCH_SHUFFLE,
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SWITCH_REPEAT', function() {
      const element = {
        key: PlayerService.SWITCH_REPEAT,
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SLIDER_VOLUME', function() {
      const element = {
        key: PlayerService.SLIDER_VOLUME,
        value: 100,
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SENSOR_COVERART', function() {
      const element = {
        key: PlayerService.SENSOR_COVERART,
        value: 'https://example.com/image.jpg',
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SENSOR_TITLE', function() {
      const element = {
        key: PlayerService.SENSOR_TITLE,
        value: 'Other Title',
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should update state - SENSOR_DESCRIPTION', function() {
      const element = {
        key: PlayerService.SENSOR_DESCRIPTION,
        value: 'Some description',
      };

      playerService.updateState(element);

      expect(playerService.playerState[element.key]).to.equal(element.value);
    });

    it('should not change anything if unknown key', function() {
      const element = {
        key: 'I_DONT_EXIST',
        value: true,
      };

      playerService.updateState(element);

      expect(playerService.playerState).to.deep.equal(initialStateExpectation);
    });
  });
});
