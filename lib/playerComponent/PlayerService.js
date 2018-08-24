'use strict';

const images = require('./directory/images');

const SWITCH_PLAYING = 'PLAYING';
const SWITCH_MUTE = 'MUTE';
const SWITCH_SHUFFLE = 'SHUFFLE';
const SWITCH_REPEAT = 'REPEAT';
const SLIDER_VOLUME = 'VOLUME';
const SENSOR_COVERART = 'COVER_ART_SENSOR';
const SENSOR_TITLE = 'TITLE_SENSOR';
const SENSOR_DESCRIPTION = 'DESCRIPTION_SENSOR';

module.exports = {
  build,
  SWITCH_PLAYING,
  SWITCH_MUTE,
  SWITCH_SHUFFLE,
  SWITCH_REPEAT,
  SLIDER_VOLUME,
  SENSOR_COVERART,
  SENSOR_TITLE,
  SENSOR_DESCRIPTION,
};

function build() {
  return new PlayerService();
}

class PlayerService {
  constructor() {
    this.playerState = {
      PLAYING: false,
      MUTE: false,
      SHUFFLE: false,
      REPEAT: false,

      VOLUME: 50,
      COVER_ART_SENSOR: images.kitten,
      TITLE_SENSOR: 'A Kitten',
      DESCRIPTION_SENSOR: 'This is the description...',
    };
  }

  updateState(element) {
    switch (element.key) {
      case SWITCH_PLAYING:
      case SWITCH_MUTE:
      case SWITCH_SHUFFLE:
      case SWITCH_REPEAT:
      case SLIDER_VOLUME:
      case SENSOR_COVERART:
      case SENSOR_TITLE:
      case SENSOR_DESCRIPTION:
        this.playerState[element.key] = element.value;
        break;
      default:
        console.log('UNKNOWN ELEMENT', element);
    }
  }

  getState(element) {
    return this.playerState[element.key];
  }

}
