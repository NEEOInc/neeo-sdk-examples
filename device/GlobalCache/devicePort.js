'use strict';

module.exports = DevicePort;

function DevicePort(device, module, port, type) {
    this.device = device;
    this.module = module;
    this.port = port;
    this.type = type;
}

DevicePort.prototype.getDevice = function() {
    return this.device;
}

DevicePort.prototype.getModule = function() {
    return this.module;
}

DevicePort.prototype.getPort = function() {
    return this.port;
}

DevicePort.prototype.getType = function() {
    return this.type;
}
