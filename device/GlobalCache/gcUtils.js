'use strict';

const BluePromise = require('bluebird');
const util = require('util');
const fs = require('fs');
const readline = require('readline');

module.exports.createDeviceDiscovery = port => {
    const portId = port.getModule() + ":" + port.getPort();
    return {
        id: port.getDevice().getUUID() + "." + portId,
        name: port.getDevice().getModel() + " " + portId + " (" + port.getDevice().getIpAddress() + ")",
        reachable: true
    };
}

module.exports.parseDeviceId = deviceId => {
      const uuidPorts = deviceId.split(".");
      if (uuidPorts.length === 2) {
          const modulePort = uuidPorts[1].split(":");
          if (modulePort.length === 2) {
              return {
                  uuid: uuidPorts[0],
                  module: modulePort[0],
                  port: modulePort[1]
              };
          }
      }

      throw new Error(util.format("DeviceID cannot be parsed: %s", deviceId));
}

module.exports.clearObject = obj => {
    for (var prop in obj) { if (obj.hasOwnProperty(prop)) { delete obj[prop]; } }
}

function fileToObject(fileName) {
    return new BluePromise((resolve, reject) => {
        var lineReader = readline.createInterface({
            input: fs.createReadStream(fileName)
        });

        const returnMap = new Map();
        lineReader
            .on("line", line => {
                if (!line.trim().startsWith("#")) {
                    const idx = line.indexOf("=");
                    if (idx >= 0) {
                        const cmdName = line.substring(0, idx).trim();
                        const irCmd = line.substring(idx + 1).trim();
                        returnMap.set(cmdName, irCmd);
                    }
                }
            })
            .on('close', () => {
                resolve(returnMap);
            });
    });
}

module.exports.fileToObject = fileToObject;

module.exports.getCmdFromFile = (fileName, cmdName, cache) => {
    return fileToObject(fileName, cache)
        .then(cmds => {
            return new BluePromise((resolve, reject) => {
                if (cmds.hasOwnProperty(cmdName)) {
                    resolve(cmds[cmdName]);
                }
                reject("No command defined for " + cmdName);
            });
        })

}