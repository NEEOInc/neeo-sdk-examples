'use strict';

/*
 * While the list handling could be done directly in the controller
 * we recommand separating it.
 */
const browserService = require('./browserService');

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports = class BrowseController {
  constructor() {
    /*
     * Here we expose a browse handler object with the required getter and
     * action properties.
     *
     * - getter is used by the Brain to fetch lists
     * - action is called when a list item was clicked
     */
    this.browse = {
      getter: (deviceId, params) => this.fetchList(deviceId, params),
      action: (deviceId, params) => this.handleListAction(deviceId, params),
    };
  }

  static build() {
    return new BrowseController();
  }

  fetchList(deviceId, params) {
    console.log('browse called with', {
      deviceId,
      params,
    });

    return browserService.browse(params)
      .catch((error) => {
        console.error('FILEBROWSER_LIST_BUILD_ERROR', {
          function: '_browse',
          error,
        });

        throw error;
      });
  }

  handleListAction(deviceId, params) {
    console.log('action called with', {
      deviceId,
      params,
    });

    browserService.setOptions(params.actionIdentifier);
  }
};
