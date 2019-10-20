const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { expect } = require('chai');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../simple-worker.js'), 'utf8');

describe('unit test', function () {
  this.timeout(60000);
  let worker;

  beforeEach(() => {
    worker = new Cloudworker(workerScript);
  });

  it('uses worker.dispatch() to test requests', async () => {
    const req = new Cloudworker.Request('https://mysite.com/api')
    const res = await worker.dispatch(req);
    const body = await res.json();
    expect(body).to.eql({message: 'Hello mocha!'});
  });
});
