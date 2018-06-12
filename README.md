# NEEO SDK Examples [![Build Status](https://travis-ci.org/NEEOInc/neeo-sdk-examples.svg?branch=master)](https://travis-ci.org/NEEOInc/neeo-sdk-examples)

You can find the SDK documentation at https://github.com/NEEOInc/neeo-sdk.

To find out more about NEEO, the Brain and "The Thinking Remote" checkout https://neeo.com/.

## Prerequisite

* You must have Node.js v6 (or greater) installed, see http://nodejs.org

## Getting started

1. Checkout this repository locally.
2. Open a terminal in the folder of the repository you checked out.
3. Run `npm install` to install needed dependencies.

## Working with NEEO Brain Recipes

One way to use the SDK is to trigger Recipes and fetch information about the Recipes.

For example:
* Find the nearest Brain
* Get a list of recipes
* Find out which recipes are currently powered on

You can run this example via `npm run example:recipe`, the sample code is located in [scripts/recipe/listAllRecipes.js](scripts/recipe/listAllRecipes.js).

Another way is to enable action forwarding to track what is happening on the Brain (power on and power off of recipes and more). You can run that example via `npm run example:forwardaction`, the sample code is located in [scripts/forwardaction/](scripts/forwardaction/).

## Adding custom devices to the NEEO Brain

Another way to use the SDK is to add support for custom devices. 

### Running the example SDK Drivers

The devices are listed and exported in the file `devices/index.js`. They are exported through a `devices` Array in order for them to be available to the CLI. You can change it to remove the devices you don't want to see running or add your own ones.

To start the SDK instance using the CLI, and register the devices to the first Brain found on the network, run the command:

```
npm start
```

To connect to a specific Brain you can configure options for the CLI in the `package.json` file, for example to connect to a Brain with the ip of 10.0.0.42 the brainHost can be defined to an ip:

```
"neeoSdkOptions": {
  "serverName": "neeo-sdk-examples-server",
  "serverPort": 6336,
  "brainHost": "10.0.0.42",
  "brainPort": ""
}
```

### Creating custom devices

There's 2 main parts:

__1. the adapter definition__: the adapter defines what the custom device can do. We use a factory to simplify the creation of a device, set the handlers and register it with a running Brain. This also exports your driver (allowing other tools like the CLI to run your driver)

__2. the controller implementation__: the controller needs to implement all the capabilities defined by the adapter. It then handles the events and interacts with the NEEO Brain when a device is added to the Brain.

You can find all the example devices in the [lib](lib) directory. You can also find some of the drivers implemented by the community on [NPM](https://www.npmjs.com/search?q=neeo-driver).

#### Publishing NEEO Drivers

If you implement a driver and share it with others we currently recommend publishing it to NPM as a module. Using the "neeo-driver-" prefix for the name will make it easy for others to find it.

The [neeo-driver-example](neeo-driver-example) directory shows what a minimal self contained driver might look like.
