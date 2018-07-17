'use strict';

const BluePromise = require('bluebird');
const neeoapi = require('neeo-sdk');
const debug = require('debug')('neeo:player:browserService');
const directory = require('./directory/index');
const images = require('./directory/images');

const ROOT_DIRECTORY = 'PLAYER_ROOT_DIRECTORY';
const QUEUE_DIRECTORY = 'PLAYER_QUEUE_DIRECTORY';

module.exports = {
  browse,
  QUEUE_DIRECTORY,
  ROOT_DIRECTORY,
};

function browse(listOptions) {
  debug('browse called with %o', listOptions);
  const params = listOptions.params;
  const browseIdentifier = params.browseIdentifier;

  //check if a root view should be displayed
  if (listOptions.showRoot) {
    return getRootListModel(listOptions.params);
  }
  if (listOptions.showQueue) {
    return getQueueListModel(listOptions.params);
  }

  //browse the directory, browseIdentifier tells us where we are in our directory
  return directory.browse(browseIdentifier)
    .then((listItems) => {
      const list = buildListModel(listItems, listOptions.params);
      const title = `Browsing ${listOptions.params.browseIdentifier}`;
      list.setListTitle(title);
      return BluePromise.resolve(list);
    });
}

/**
  * returns the root list view
  */
function getRootListModel(listOptions) {
  const rootItems = directory.getRootItems();

  const list = neeoapi.buildBrowseList(listOptions)
    .setListTitle('Player')
    .addListHeader('My favorite entries')
    .addListTiles([{
      thumbnailUri: images.puppy,
      actionIdentifier: 'Puppy!',
    }, {
      thumbnailUri: images.kitten,
      actionIdentifier: 'Kitten!',
    }])
    .addListHeader('Browse Artists')
    .addListItems(rootItems)
    .setTotalMatchingItems(rootItems.length);

  return BluePromise.resolve(list);
}

/**
  * returns the queue list view
  */
function getQueueListModel(listOptions) {
  let listHeaderButtons = [];

  // Only show the Header Buttons on the first page
  const showListButtons = !listOptions.offset;
  if (showListButtons) {
    listHeaderButtons = [{
      title: 'Clear',
      inverse: true,
      actionIdentifier: 'QUEUE_CLEAR',
    }, {
      iconName: 'Repeat',
      actionIdentifier: 'QUEUE_REPEAT',
    }, {
      iconName: 'Shuffle',
      actionIdentifier: 'QUEUE_SHUFFLE',
    }];
  }

  const queueListItems = directory.getQueueItems();
  const list = buildListModel(queueListItems, listOptions, listHeaderButtons);
  // here the total entries of the list is updated
  list.setTotalMatchingItems(queueListItems.length)
    .setListTitle('Player Queue');
  return BluePromise.resolve(list);
}

function buildListModel(listItems, listOptions, listHeaderButtons = []) {
  const list = neeoapi.buildBrowseList(listOptions);

  if (listHeaderButtons) {
    list.addListButtons(listHeaderButtons);
  }

  return list.addListItems(listItems);
}
