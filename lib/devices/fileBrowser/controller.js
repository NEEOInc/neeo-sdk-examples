'use strict';

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */

const BrowserService = require('./browserService');

module.exports = {
  browse: {
    getter,
    action,
  }
};

function getter(deviceId, params) {
  console.log('browse called with', {
    deviceId,
    params,
  });

  return BrowserService.browse(params)
    .catch((error) => {
      console.error('FILEBROWSER_LIST_BUILD_ERROR', {
        function: '_browse',
        error
      });

      throw error;
    });
}

function action(deviceId, params) {
  console.log('action called with', {
    deviceId,
    params,
  });

  if (params.actionIdentifier === 'SHOW_TILES') {
    return BrowserService.setOptions({ showTiles: true });
  }

  if (params.actionIdentifier === 'HIDE_TILES') {
    return BrowserService.setOptions({ showTiles: false });
  }

  if (params.actionIdentifier === 'SHOW_THUMBNAILS') {
    return BrowserService.setOptions({ showThumbnails: true });
  }

  if (params.actionIdentifier === 'HIDE_THUMBNAILS') {
    return BrowserService.setOptions({ showThumbnails: false });
  }
}
