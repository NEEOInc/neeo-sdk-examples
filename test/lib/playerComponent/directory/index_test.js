'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const requireHelper = require('../../../require_helper.js');
const directory = requireHelper('lib/playerComponent/directory/index');

describe('./lib/playerComponent/directory/index.js', function () {
  it('should get root items', function () {
    const expectedRootItems = [{
        title: 'Artists',
        thumbnailUri: 'https://neeo-sdk.neeo.io/folder.jpg',
        browseIdentifier: 'Artists',
      },
      {
        title: 'Albums',
        thumbnailUri: 'https://neeo-sdk.neeo.io/folder.jpg',
        browseIdentifier: 'Albums',
      },
      {
        title: 'Genres',
        thumbnailUri: 'https://neeo-sdk.neeo.io/folder.jpg',
        browseIdentifier: 'Genres',
      },
    ];

    const rootItems = directory.getRootItems();

    expect(rootItems).to.deep.equal(expectedRootItems);
  });

  it('should get queue items', function () {
    const queueItems = directory.getQueueItems();

    expect(queueItems.length).to.equal(10000);
    expect(queueItems[0].title).to.equal('Queue Item 1');
    expect(queueItems[9999].title).to.equal('Queue Item 10000');
  });
});
