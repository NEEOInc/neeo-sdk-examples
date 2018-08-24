'use strict';

/*
 * Required buttons for a player
 */
const buttons = [
  // Power ON/OFF is optional and not needed by the player
  // for example an alwaysOn device doesn't need them.
  { name: 'POWER ON' },
  { name: 'POWER OFF' },

  // The buttons below will be used by the player widget
  { name: 'PLAY' },
  { name: 'PLAY TOGGLE' },
  { name: 'PAUSE' },
  { name: 'VOLUME UP' },
  { name: 'VOLUME DOWN' },
  { name: 'MUTE TOGGLE' },
  { name: 'NEXT TRACK' },
  { name: 'PREVIOUS TRACK' },
  { name: 'SHUFFLE TOGGLE' },
  { name: 'REPEAT TOGGLE' },
  { name: 'CLEAR QUEUE' },
];

/*
 * Note: all switches and sliders below will automatically generate
 * a corresponding ${name}_SENSOR
 */
const switches = [
  {
    name: 'PLAYING',
    // We use the callbackName in addCapabilities to
    callbackName: 'playSwitch',
  },
  {
    name: 'MUTE',
    callbackName: 'muteSwitch',
  },
  {
    name: 'SHUFFLE',
    callbackName: 'shuffleSwitch',
  },
  {
    name: 'REPEAT',
    callbackName: 'repeatSwitch',
  },
];

const sliders = [
  {
    name: 'VOLUME',
    range: [0, 100],
    unit: '%',
    callbackName: 'volumeSlider',
  },
];

/*
 * These sensors are required by the player screen to display information.
 */
const sensors = [
  {
    name: 'COVER_ART_SENSOR',
    type: 'string',
    callbackName: 'coverArtSensor',
  },
  {
    name: 'TITLE_SENSOR',
    type: 'string',
    callbackName: 'titleSensor',
  },
  {
    name: 'DESCRIPTION_SENSOR',
    type: 'string',
    callbackName: 'descriptionSensor',
  },
];

module.exports = {
  buttons,
  switches,
  sliders,
  sensors,
};
