# Example of a NEEO Driver package

## Driver export location

The NEEO CLI will look for drivers installed in the node_module folder (installed via npm) which export their devices using the following format:

1. A single file exporting all devices for example `index.js`:
    ```
    module.exports = {
      devices: [
        // Exports listed here will be detected,
        // these are the objects returned by neeo-sdk.buildDevice()
        exampleDriver,
      ],
    };
    ```
    (for example [index.js](./index.js))
2. Your `package.json` main property points to that file:
    ```
      ...
      "main": "index.js",
      ...
    ```
    (for example [package.json](./package.json))
3. In your package.json use the `neeo-driver-` prefix for the name property.

__This is the recommended setup for exporting devices__:
* one device per driver module*

_*In some cases like 2 devices of the same model but different series with slightly different features might share common code, they could then be part of the same module._

## To install drivers:

A driver on npm can be installed by adding it to the package.json or by running:

```
npm install --save neeo-driver-example
```

A driver only on github, not yet published on npm can be installed by adding it to the package.json or by running: 

```
npm install --save git+https://github.com/NEEOInc/neeo-sdk-examples/tree/master/neeo-driver-example
```
