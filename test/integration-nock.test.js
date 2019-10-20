const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { expect } = require('chai');
const nock = require('nock');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../upstream-worker.js'), 'utf8');

describe('upstream server test', function () {
  this.timeout(60000);
  let worker;

  beforeEach(() => {
    worker = new Cloudworker(workerScript);
  });

  it('uses Nock upstream server', async () => {
    const url = 'http://my-api.test';
    nock(url)
      .get('/')
      .reply(200, {message: 'Hello from Nock!'});

    const request = new Cloudworker.Request(url);
    const response = await worker.dispatch(request);
    const body = await response.json();
    expect(body).to.eql({message: 'Hello from Nock!'});
  });
});
