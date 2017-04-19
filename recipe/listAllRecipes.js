'use strict';

const neeoapi = require('neeo-sdk');

console.log('NEEO SDK Example "getAllRecipes"');
console.log('--------------------------------');
console.log('- discover one NEEO Brain...');

let _brain;
neeoapi.discoverOneBrain()
  .then((brain) => {
    _brain = brain;
    console.log('- Brain discovered:', brain.name);
    console.log('- Fetch all recipes...');
    //HINT: you can replace "brain" with a hostname or ip address if you dont want to discover
    return neeoapi.getRecipes(brain);
  })
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
    return neeoapi.getRecipesPowerState(_brain);
  })
  .then((poweredOnKeys) => {
    console.log('- Power state fetched, powered on recipes:', poweredOnKeys);
    process.exit(0);
  })
  .catch((err) => {
    //if there was any error, print message out to console
    console.error('ERROR!', err);
  });
