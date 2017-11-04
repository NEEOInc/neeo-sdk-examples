'use strict';

const http = require('http');
const url = require('url');
const PORT = 5555;

function handleBrainData(brainEvent) {
  console.log('Brain Action', brainEvent);

  if (brainEvent.action === 'launch' && brainEvent.recipe === 'Sonos') {
    console.log(' >>> Simple Example - Sonos was launched!');
  }
}

function getBody(request) {
  return new Promise((resolve, reject) => {
    const body = [];
    request
      .on('data', (chunk) => { body.push(chunk); })
      .on('end', () => { resolve(JSON.parse(Buffer.concat(body).toString())); })
      .on('error', (error) => { reject(error); });
  });
}

// VERY primitive REST server, method call is ignored (GET/POST)
function handleRequest(request, response){
  response.end();
  const dataPromise = getBody(request);
  const requestUrl = url.parse(request.url);
  switch (requestUrl.pathname) {
    case '/':
    case '/neeo':
      dataPromise
        .then(handleBrainData)
        .catch((error) => {
          console.log('Error', error);
        });
      break;
    default:
      console.log('invalid url:', requestUrl.pathname);
  }
}

console.log('[NEEO] Forward Action example server');
http
  .createServer(handleRequest)
  .listen(PORT, '0.0.0.0', () => {
    console.log('[NEEO] Server listening on: http://0.0.0.0:'+PORT);
  });
