'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

const customFileBrowserDevice = neeoapi.buildDevice('File Browser')
  .setManufacturer('NEEO')
  .addAdditionalSearchToken('browser')
  .addAdditionalSearchToken('directories')
  .setType('ACCESSORY')
  .addDirectory({
    name: 'BROWSE_DIRECTORY',
    label: 'Browse Example',
  }, controller.browse);

module.exports = customFileBrowserDevice;
