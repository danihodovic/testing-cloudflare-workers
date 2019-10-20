const fs = require('fs');
const path = require('path');
const Cloudworker = require('@dollarshaveclub/cloudworker');

const workerScript = fs.readFileSync(path.resolve(__dirname, '../worker-debug-errors.js'), 'utf8');

describe('unit test', function () {
  this.timeout(60000);
  let worker;

  beforeEach(() => {
    worker = new Cloudworker(workerScript, {
        bindings: {
          // Add a global variable that enables error debugging
          DEBUG_ERRORS: true,
        }
      }
    );
  });

  it('uses worker.dispatch() to test requests', async () => {
    const req = new Cloudworker.Request('https://mysite.com/api')
    await worker.dispatch(req);
  });
});
