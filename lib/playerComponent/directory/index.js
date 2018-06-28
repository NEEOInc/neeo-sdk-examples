'use strict';

const BluePromise = require('bluebird');
const images = require('./images');

module.exports = {
  getRootItems,
  getQueueItems,
  browse,
};

const NUMBER_OF_QUEUE_ENTRIES = 10000;

const ROOT_ITEMS = [
  'Artists',
  'Albums',
  'Genres',
];

const BROWSE_ITEMS = [
  {
    title: 'Group A',
    children: [
      { title: 'Item A1', actionIdentifier: 'custom value for Item A1 that will be passed to function' },
      { title: 'Item A2' },
      { title: 'Item A3' },
    ],
  },
  {
    title: 'Group B',
    children: [
      { title: 'Item B1' },
      { title: 'Item B2' },
      { title: 'Item B3' },
    ],
  },
  {
    title: 'Group C',
    children: [
      { title: 'Item C1' },
      { title: 'Item C2' },
      { title: 'Item C3' },
    ],
  },
];

function getRootItems() {
  return ROOT_ITEMS
    .map((title) => {
      return {
        title,
        thumbnailUri: images.folderIcon,
        browseIdentifier: title,
      };
    });
}

function getQueueItems() {
  const entryPrefix = 'Queue Item ';
  return new Array(NUMBER_OF_QUEUE_ENTRIES).fill(1)
    .map((unused, index) => {
      const title = entryPrefix + (index + 1);
      return {
        title,
        thumbnailUri: images.fileIcon,
        // in a real application the identifier might be set to a unique identifier
        actionIdentifier: title,
      };
    });
}

function browse(browseIdentifier) {
  return getBrowseItemsFor(browseIdentifier)
    .then((items) => {
      const preparedList = formatBrowseListModel(items);
      return preparedList;
    });
}

function getBrowseItemsFor(browseIdentifier) {
  // user selected Albums for example
  const isSelectedRootDirectory = ROOT_ITEMS.includes(browseIdentifier);
  if (isSelectedRootDirectory) {
    return BluePromise.resolve(BROWSE_ITEMS);
  }
  const parentCategory = BROWSE_ITEMS.find((group) => {
    return group.title === browseIdentifier;
  });
  if (parentCategory) {
    return BluePromise.resolve(parentCategory.children);
  }
  return BluePromise.resolve([]);
}

function formatBrowseListModel(items) {
  return items.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    return {
      title: item.title,
      thumbnailUri: hasChildren ? images.folderIcon : images.fileIcon,
      browseIdentifier: hasChildren ? item.title : undefined,
      actionIdentifier: hasChildren ? undefined : item.actionIdentifier || item.title,
    };
  });
}
