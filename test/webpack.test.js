const path = require('path');
const fs = require('fs');
const util = require('util');
const webpack = require('webpack');
const Cloudworker = require('@dollarshaveclub/cloudworker');
const { expect } = require('chai');

const webpackConfig = require('../webpack.config.js')

describe('webpack test', function () {
  this.timeout(60000);
  let workerScript;
  let worker;

  before(async function() {
    workerScript = await compileScript();
  });

  beforeEach(() => {
    worker = new Cloudworker(workerScript);
  });

  it('uses worker.dispatch() to test requests', async () => {
    const req = new Cloudworker.Request('https://mysite.com/api', {
      method: 'POST',
      body: "const x: string  = 'string';"
    })
    const res = await worker.dispatch(req);
    expect(await res.text()).to.eql("var x = 'string';\r\n");
  });
});


async function compileScript() {
  // Make sure that mode is set to 'none' in tests because that way Webpack
  // won't minify the code and remove debugger statements.
  const compiler = webpack({...webpackConfig, ...{mode: 'none'}});
  const runCompiler = util.promisify(compiler.run).bind(compiler);

  const stats = await runCompiler();
  if (stats.hasErrors()) {
    console.error(stats.toString({
      chunks: false,
      colors: true
    }))
    process.exit();
  }

  let filename = 'main.js';
  if (webpackConfig.output && webpackConfig.output.filename) {
    filename = webpackConfig.output.filename;
  }

  const fullpath = path.join(stats.compilation.outputOptions.path, filename);
  return fs.readFileSync(fullpath, 'utf-8');
}
