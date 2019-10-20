const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { expect } = require('chai');
const axios = require('axios');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../simple-worker.js'), 'utf8');

describe('http client test', function () {
  this.timeout(60000);
  let serverAddress;

  beforeEach(() => {
    const worker = new Cloudworker(workerScript);
    const server = worker.listen();
    serverAddress = `http://localhost:${server.address().port}`
  });

  it('uses axios', async () => {
    const response = await axios.get(serverAddress);
    expect(response.status).to.eql(200);
    expect(response.data).to.eql({message: 'Hello mocha!'});
  });
});
