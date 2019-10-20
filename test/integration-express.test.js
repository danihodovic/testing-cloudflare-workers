const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { expect } = require('chai');
const express = require('express');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../upstream-worker.js'), 'utf8');

function createApp() {
  const app = express();
  app.get('/', function (request, response) {
    response.json({message: 'Hello from express!'});
  });
  return app;
}

describe('upstream server test', function () {
  this.timeout(60000);
  let serverAddress;
  let worker;

  beforeEach(() => {
    const upstream = createApp().listen();
    serverAddress = `http://localhost:${upstream.address().port}`
    worker = new Cloudworker(workerScript);
  });

  it('uses Express upstream server', async () => {
    const request = new Cloudworker.Request(serverAddress);
    const response = await worker.dispatch(request);
    const body = await response.json();
    expect(response.headers.get('my-header')).to.eql('some token');
    expect(body).to.eql({message: 'Hello from express!'});
  });
});
