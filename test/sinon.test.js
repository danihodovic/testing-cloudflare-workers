const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const fetch = require('@dollarshaveclub/node-fetch');
const sinon = require('sinon');
const nock = require('nock');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../upstream-worker.js'), 'utf8');

describe('unit test', function () {
  this.timeout(60000);
  let worker;
  let fetchMock;

  beforeEach(() => {
    fetchMock = sinon.fake(fetch);
    worker = new Cloudworker(workerScript, {
        // Inject our mocked fetch into the worker script
        bindings: {
          fetch: fetchMock
        }
      }
    );
  });

  it('uses Sinon.js spies to assert calls', async () => {
    const url = 'http://my-api.test';
    nock(url)
      .get('/')
      .reply(200, {message: 'Hello from Nock!'});

    const request = new Cloudworker.Request(url)
    await worker.dispatch(request);

    const expected = new Cloudworker.Request(url);
    sinon.assert.calledWith(fetchMock, expected);
  });
});
