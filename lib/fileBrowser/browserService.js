'use strict';

const fs = require('fs');
const BluePromise = require('bluebird');
const glob = BluePromise.promisify(require('glob'));
const neeoapi = require('neeo-sdk');
const images = require('./images');

module.exports = {
  browse,
  setOptions,
};

const DEFAULT_PATH = '..';
const ACTION1_BUTTON = {
  title: 'Action 1',
  actionIdentifier: 'ACTION1',
  inverse: false,
};
const ACTION2_BUTTON = {
  title: 'Action 2',
  actionIdentifier: 'ACTION2',
  inverse: false,
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
    cwd: browseIdentifier,
  };

  return glob(pattern, options)
    .then((files) => {
      const preparedList = prepareListModel(files, listOptions);
      return preparedList;
    });
}

function setOptions(params) {
  console.log('CALL_ACTION', params);
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
  const showHeaderAndTiles = !listOptions.offset;

  // Only add the header/tiles if we are at offset 0, otherwise we add it every time
  // we get a further page
  if (showHeaderAndTiles) {
    // Show images on the first page or if user always wants images
    if (options.browseIdentifier === DEFAULT_PATH) {
      list
        .addListHeader('My favorite entries')
        .addListTiles([{
          thumbnailUri: images.puppy,
          actionIdentifier: 'Puppy!',
        }, {
          thumbnailUri: images.kitten,
          actionIdentifier: 'Kitten!',
        }])
        .addListInfoItem({
          title: 'Click me!',
          text: 'Those pictures are cute, right?',
          affirmativeButtonText: 'Definitely!',
          negativeButtonText: 'No..',
          actionIdentifier: 'INFO OK',
        })
        .addListButtons([ ACTION1_BUTTON, ACTION2_BUTTON ]);
    }
    list.addListHeader('Browse Folders');
  }

  // add example list items that have an after call action specified
  list.addListItems([{
    title: 'Reload the list!',
    actionIdentifier: 'SOMETHING_RELOAD',
    uiAction: 'reload',
  }, {
    title: 'Go back to the root!',
    actionIdentifier: 'SOMETHING_ROOT',
    uiAction: 'goToRoot',
  }, {
    title: 'Go back one step!',
    actionIdentifier: 'SOMETHING_GOBACK',
    uiAction: 'goBack',
  }, {
    title: 'Close the list!',
    actionIdentifier: 'SOMETHING_CLOSE',
    uiAction: 'close',
  }]);

  // add directory browsing to list
  itemsToAdd.map((fileInfo) => {
    const listItem = {
      title: fileInfo.name,
      thumbnailUri: fileInfo.thumbnailUri,
    };
    if (fileInfo.isFileDirectory) {
      listItem.browseIdentifier = fileInfo.path;
    } else {
      listItem.actionIdentifier = `${fileInfo.name}`;
    }
    list.addListItem(listItem);
  });
  return list;
}
