'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const requireHelper = require('../../require_helper.js');
const browserService = requireHelper('lib/playerComponent/browserService');
const directory = requireHelper('lib/playerComponent/directory');

describe('./lib/playerComponent/browserService.js', function () {
  const sandbox = sinon.createSandbox();

  const listItems = [{
    title: 'Title 1',
    actionIdentifier: 'DO SOMETHING',
  }, {
    title: 'Title 2',
    browseIdentifier: 'BROWSE!',
  }];

  const rootListItems = [listItems[0]];

  beforeEach(function () {
    sandbox.stub(directory, 'browse').resolves(listItems);
    sandbox.stub(directory, 'getRootItems').returns(rootListItems);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('browse', function () {
    it('should get root list model', function () {
      const listOptions = {
        showRoot: true,
        params: {
          browseIdentifier: '',
          limit: 0,
          offset: 0,
        },
      };
      const expectedList = {
        title: 'Player',
        totalMatchingItems: 1,
        limit: 0,
        offset: 0,
        browseIdentifier: '',
        items: [{
            'isHeader': true,
            'title': 'My favorite entries',
          },
          {
            'tiles': [{
              'actionIdentifier': 'Puppy!',
              'isQueueable': false,
              'isTile': true,
              'thumbnailUri': 'https://neeo-sdk.neeo.io/puppy.jpg',
            }, {
              'actionIdentifier': 'Kitten!',
              'isQueueable': false,
              'isTile': true,
              'thumbnailUri': 'https://neeo-sdk.neeo.io/kitten.jpg',
            }],
          },
          {
            'isHeader': true,
            'title': 'Browse Artists',
          }, {
            'actionIdentifier': 'DO SOMETHING',
            'browseIdentifier': undefined,
            'isQueueable': false,
            'label': undefined,
            'thumbnailUri': undefined,
            'title': 'Title 1',
          },
        ],
        _meta: {
          totalItems: 4,
          totalMatchingItems: 1,
          current: {
            offset: 0,
            limit: 0,
            browseIdentifier: '',
          },
        },
      };

      return browserService.browse(listOptions)
        .then((list) => {
          expect(list).to.deep.equal(expectedList);
        });
    });

    it('should browse directory', function () {
      const listOptions = {
        params: {
          browseIdentifier: '..',
          limit: 0,
          offset: 0,
        },
      };
      const expectedList = {
        title: 'Browsing ..',
        totalMatchingItems: 0,
        limit: 0,
        offset: 0,
        browseIdentifier: '..',
        items: [{
            buttons: [],
          }, {
            actionIdentifier: 'DO SOMETHING',
            browseIdentifier: undefined,
            isQueueable: false,
            label: undefined,
            thumbnailUri: undefined,
            title: 'Title 1',
          },
          {
            actionIdentifier: undefined,
            browseIdentifier: 'BROWSE!',
            isQueueable: false,
            label: undefined,
            thumbnailUri: undefined,
            title: 'Title 2',
          },
        ],
        _meta: {
          totalItems: 3,
          totalMatchingItems: 0,
          current: {
            offset: 0,
            limit: 0,
            browseIdentifier: '..',
          },
        },
      };

      return browserService.browse(listOptions)
        .then((list) => {
          expect(list).to.deep.equal(expectedList);
        });
    });
  });
});
