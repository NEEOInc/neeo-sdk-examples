'use strict';

const LifxClient = require('node-lifx').Client;

function buildLifxClientInstance() {
  return new LifxClient();
}

module.exports = {
  buildLifxClientInstance
};
