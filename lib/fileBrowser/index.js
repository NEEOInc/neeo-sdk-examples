'use strict';

const neeoapi = require('neeo-sdk');
const BrowseController = require('./BrowseController');

const VISIBLE_NAME_ON_NEEO_BRAIN = 'Browse Example';

/*
 * fileBrowser
 * This example shows how to use the list functionality to expose directories
 * and lists to the Brain.
 */
const controller = BrowseController.build();
const customFileBrowserDevice = neeoapi.buildDevice('File Browser SDK Example')
  .setManufacturer('NEEO')
  .setType('ACCESSORY')
  .setSpecificName('Browse List Example')
  .addAdditionalSearchToken('SDK')
  .addAdditionalSearchToken('directories')
  .addAdditionalSearchToken('list')
  /*
   * Directories expose lists to the Brain. Each directory has a unique name,
   * a label describing it, and a controller function for event handling.
   */
  .addRootDirectory({
    name: 'BROWSE_DIRECTORY',
    label: VISIBLE_NAME_ON_NEEO_BRAIN,
  }, controller.browse); // This will forward events to the browse handler

/*
 * The last step is to export the driver, this makes it available to the
 * to tools like the CLI to start running the driver.
 */
module.exports = {
  devices: [
    customFileBrowserDevice,
  ],
};
