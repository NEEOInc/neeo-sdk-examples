# Example of a NEEO Driver package

## Driver export location

The NEEO CLI will look for drivers in the `devices/` folder so it's important to export drivers

This example has `devices/index.js` which exports the example device:
```
module.exports = {
  devices: [
    // Exports listed here will be detected,
    // these are the objects returned by neeo-sdk.buildDevice()
    exampleDriver,
  ],
};
```

__This is the recommended setup for exporting devices__:
* one device per driver module*
* `devices/index.js`

_*In some cases like 2 devices of the same model but different series with slightly different features might share common code, they could then be part of the same module._

## Future versions of the CLI

For future versions the requirement of using the `devices/index.js` path will be removed. The CLI will read the `main` property of the package.json for drivers installed via npm.

in the package.json:
```
  ...
  "main": "index.js",
  ...
```

This would load devices from `./node_modules/neeo-driver-example/index.js`.

## To install drivers:

A driver on npm can be installed by adding it to the package.json or by running:

```
npm install --save neeo-driver-example
```

A driver only on github, not yet published on npm can be installed by adding it to the package.json or by running: 

```
npm install --save git+https://github.com/NEEOInc/neeo-sdk-examples/tree/master/neeo-driver-example
```
