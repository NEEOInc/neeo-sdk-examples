'use strict';

const neeoapi = require('neeo-sdk');

console.log('NEEO SDK Example "getAllRecipes"');
console.log('--------------------------------');

function startSdkExample(brain) {
  console.log('- Fetch all recipes...');
  neeoapi.getRecipes(brain)
    .then((recipes) => {
      console.log('- Recipes fetched, number of recipes found:', recipes.length);
      recipes.forEach((recipe) => {
        // HINT: you can call recipe.action.powerOn() / recipe.action.powerOff() to change the state of the Recipe.
        console.log('   RECIPE:', JSON.stringify({
          name: decodeURIComponent(recipe.detail.devicename),
          model: decodeURIComponent(recipe.detail.model),
          manufacturer: decodeURIComponent(recipe.detail.manufacturer),
          roomname: decodeURIComponent(recipe.detail.roomname),
          isPoweredOn: recipe.isPoweredOn,
          powerKey: recipe.powerKey
        }));
      });
      console.log('- Fetch power state of recipes');
      return neeoapi.getRecipesPowerState(brain);
    })
    .then((poweredOnKeys) => {
      console.log('- Power state fetched, powered on recipes:', poweredOnKeys);
      process.exit(0);
    })
    .catch((err) => {
      //if there was any error, print message out to console
      console.error('ERROR!', err);
    });
}

const brainIp = process.env.BRAINIP;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startSdkExample(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startSdkExample(brain);
    });
}