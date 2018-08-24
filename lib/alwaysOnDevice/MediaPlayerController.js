'use strict';

module.exports = class MediaPlayerController {
  constructor() {
  }

  static build() {
    return new MediaPlayerController();
  }

  onButtonPressed(name, deviceId) {
    /*
     * Since we added 4 button groups in index:
     * Volume, Numpad, Menu and Back, Controlpad
     *
     * We need to handle all of the buttons these groups define here:
     * - DIGIT 0 though DIGIT 9
     * - CURSOR ENTER
     * - CURSOR UP
     * - CURSOR DOWN
     * - CURSOR LEFT
     * - CURSOR RIGHT
     * - MENU
     * - BACK
     * - VOLUME UP
     * - VOLUME DOWN
     * - optionally MUTE TOGGLE
     *
     * See https://github.com/NEEOInc/neeo-sdk#neeo-macro-names for more details
     * on button groups.
     */
    console.log(`[CONTROLLER] ${name} button pressed for device ${deviceId}`);
  }
};
