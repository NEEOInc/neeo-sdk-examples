# NEEO SDK Examples

You can find the SDK documentation at https://github.com/NEEOInc/neeo-sdk.

To find out more about NEEO, the Brain and "The Thinking Remote" checkout https://neeo.com/.

## Prerequisite

* You must have Node.js v6 installed, see http://nodejs.org

## Working with NEEO Brain Recipes

One way to use the SDK is to trigger Recipes and fetch information about the Recipes.

For example:
* Find the nearest Brain
* Get a list of recipes
* Find out which recipes are currently powered on

You can run this example via `npm run recipe`, the sample code is located in [recipe/listAllRecipes.js](recipe/listAllRecipes.js).

## Creating custom devices

Another way to use the SDK is to add support for custom devices. There's 2 main steps:

__1. the adapter__: the adapter defines what the custom device can do. We use a factory to simplify the creation of a device, set the handlers and register it with a running Brain.

__2. the controller__: we use a controller for event handling of the device after it's registered.

### Simple example

The "Simple sample" code is located in the [device/simpleDevice](device/simpleDevice) directory.

This example device has:
* 2 buttons
* 1 switch (say on/off)
* 1 slider (say a dimmer)

1. Start up the device via `npm run server:simple`
2. Connect to your NEEO Brain in the NEEO app
3. Go to add device
4. You should be able to find the example by searching for _NEEO Simple Buttons_

### Complex example

The "Complex sample" code is located in the [device/discoverableLightDevice](device/discoverableLightDevice) directory.

If the device requires a manual action before registering it (for example enable the discovery of the device), it's covered with a discovery step.

1. Start up the device via `npm run server:complex`
2. Connect to your NEEO Brain in the NEEO app
3. Go to add device
4. You should be able to find and add the example by searching for _NEEO Complex Device_

When you add that device you can display instructions for that step before it is added on the Brain.
