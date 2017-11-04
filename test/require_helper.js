'use strict';

function buildPath(path) {
	return '../' + path;
}

// require_helper.js
module.exports = function (path) {
  const modulePath = buildPath(path);
  return require(modulePath);
};
