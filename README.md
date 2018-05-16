# NEEO SDK Examples [![Build Status](https://travis-ci.org/NEEOInc/neeo-sdk-examples.svg?branch=master)](https://travis-ci.org/NEEOInc/neeo-sdk-examples)

You can find the SDK documentation at https://github.com/NEEOInc/neeo-sdk.

To find out more about NEEO, the Brain and "The Thinking Remote" checkout https://neeo.com/.

## Prerequisite

* You must have Node.js v6 (or greater) installed, see http://nodejs.org

## Getting started

* Run `npm install` to install needed dependencies.

## Working with NEEO Brain Recipes

One way to use the SDK is to trigger Recipes and fetch information about the Recipes.

For example:
* Find the nearest Brain
* Get a list of recipes
* Find out which recipes are currently powered on

You can run this example via `npm run recipe`, the sample code is located in [lib/recipe/listAllRecipes.js](lib/recipe/listAllRecipes.js).

## Creating custom devices

Another way to use the SDK is to add support for custom devices. There's 2 main steps:

__1. the adapter__: the adapter defines what the custom device can do. We use a factory to simplify the creation of a device, set the handlers and register it with a running Brain.

__2. the controller__: we use a controller for event handling of the device after it's registered.

### Simple example

The "Simple sample" code is located in the [lib/device/simpleAccessory](lib/device/simpleAccessory) directory.

### Complex example

The "Complex sample" code is located in the [lib/device/discoverableLightDevice](lib/device/discoverableLightDevice) directory.

If the device requires a manual action before registering it (for example enable the discovery of the device), it's covered with a discovery step.

__This example has 2 devices:__
* First device has:
  * 1 slider
* Second device has:
  * 1 slider
  * 1 switch
  * 2 buttons
  * 1 text label  

### Multi Device example
This example demonstrates how to run multiple devices inside a single SDK server instance.  
The "Multiple Devices sample" code is located in the [lib/device/multipleDevices](lib/device/multipleDevices) directory.

__This example has:__
* Multiple devices with their own controllers

## Running the examples

The devices are listed and exported in the file `lib/devices/index.js`. They are exported through a `devices` Array in order for them to be available to the CLI. You can change it to remove the devices you don't want to see running or add your own ones.
To start the SDK instance using the CLI, and register the devices to the first Brain found on the network, run the command:

```
npm run cli:devices
```
