'use strict';

class LifxMock {
  init() {}
  on() {}
  destroy() {}
}

function buildLifxClientInstance() {
  return new LifxMock();
}

module.exports = {
  buildLifxClientInstance,
};
