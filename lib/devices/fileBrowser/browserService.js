'use strict';

const fs = require('fs');
const BluePromise = require('bluebird');
const glob = BluePromise.promisify(require('glob'));
const neeoapi = require('neeo-sdk');
const images = require('./images');

const DEFAULT_PATH = '..';

let globalOptions = {
  persistImages: false,
  hideThumbnails: false,
};

module.exports = {
  browse,
  setOptions,
};

function browse(params) {
  const browseIdentifier = params.browseIdentifier || DEFAULT_PATH;
  const listOptions = {
    limit: params.limit,
    offset: params.offset,
    browseIdentifier,
  };

  const pattern = '*';
  const options = {
    cwd: browseIdentifier
  };

  return glob(pattern, options)
    .then((files) => {
      const preparedList = prepareListModel(files, listOptions);
      return preparedList;
    });
}

function setOptions(params) {
  globalOptions = Object.assign({}, globalOptions, params);
}

function prepareListModel(files, listOptions) {
  const preparedFiles = files.map((name) => {
    const fullPath = listOptions.browseIdentifier + '/' + name;
    const isFileDirectory = fs.lstatSync(fullPath).isDirectory();

    return {
      name,
      path: isFileDirectory ? fullPath : '',
      thumbnailUri: isFileDirectory ? images.folderIcon : images.fileIcon,
      isFileDirectory,
    };
  });

  const options = {
    title: `Browsing ${listOptions.browseIdentifier}`,
    totalMatchingItems: preparedFiles.length,
    browseIdentifier: listOptions.browseIdentifier,
    offset: listOptions.offset,
    limit: listOptions.limit,
  };

  const list = neeoapi.buildBrowseList(options);
  const itemsToAdd = list.prepareItemsAccordingToOffsetAndLimit(preparedFiles);

  const showTiles = globalOptions.showTiles === undefined ? true : globalOptions.showTiles;
  const showThumbnails = globalOptions.showThumbnails === undefined ? true : globalOptions.showThumbnails;

  // Only add the header/tiles if we are at offset 0, otherwise we add it every time
  // we get a further page
  if (!listOptions.offset) {
    // Show images on the first page or if user always wants images
    if (options.browseIdentifier === DEFAULT_PATH || showTiles) {
      list
        .addListHeader('My favorite entries')
        .addListTiles([{
          thumbnailUri: images.puppy,
          actionIdentifier: 'Puppy!'
        }, {
          thumbnailUri: images.kitten,
          actionIdentifier: 'Kitten!'
        }])
        .addListInfoItem({
          title: 'Click me!',
          text: 'Those pictures are cute, right?',
          affirmativeButtonText: 'Definitely!',
          negativeButtonText: 'No..',
          actionIdentifier: 'INFO OK',
        });
    }

    if (showTiles && showThumbnails) {
      list.addListButtons([{
        title: 'Hide Tiles',
        actionIdentifier: 'HIDE_TILES',
      }, {
        title: 'Hide Thumbnails',
        actionIdentifier: 'HIDE_THUMBNAILS',
      }]);
    }

    if (showTiles && !showThumbnails) {
      list.addListButtons([{
        title: 'Hide Tiles',
        actionIdentifier: 'HIDE_TILES',
      }, {
        title: 'Show Thumbnails',
        actionIdentifier: 'SHOW_THUMBNAILS',
      }]);
    }

    if (!showTiles && showThumbnails) {
      list.addListButtons([{
        title: 'Show Tiles',
        actionIdentifier: 'SHOW_TILES',
      }, {
        title: 'Hide Thumbnails',
        actionIdentifier: 'HIDE_THUMBNAILS',
      }]);
    }

    if (!showTiles && !showThumbnails) {
      list.addListButtons([{
        title: 'Show Tiles',
        actionIdentifier: 'SHOW_TILES',
      }, {
        title: 'Show Thumbnails',
        actionIdentifier: 'SHOW_THUMBNAILS',
      }]);
    }

    list.addListHeader('Browse Folders');
  }

  itemsToAdd.map((fileInfo) => {
    const listItem = {
      title: fileInfo.name,
    };

    if (showThumbnails) {
      listItem.thumbnailUri = fileInfo.thumbnailUri;
    }

    if (fileInfo.isFileDirectory) {
      listItem.browseIdentifier = fileInfo.path;
    } else {
      listItem.actionIdentifier = `${fileInfo.name}`;
    }

    list.addListItem(listItem);
  });

  return list;
}
