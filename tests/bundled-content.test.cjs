'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadHome, loadStory } = require('../backend/content.cjs');
const bundled = require('../miniprogram/data/content.js');
const root = path.resolve(__dirname, '../miniprogram');
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));

function runtime(version) {
  const cache = new Map();
  let definition;
  const wx = {
    getAccountInfoSync: () => ({ miniProgram: { envVersion: version } }),
    getWindowInfo: () => ({ windowWidth: 812, windowHeight: 375 }),
    request: () => { throw new Error('Competition build must not request a server'); }
  };
  function load(relative) {
    const filename = path.resolve(root, /\.js$/.test(relative) ? relative : relative + '.js');
    assert.ok(filename.startsWith(root + path.sep), 'client dependency must stay inside miniprogram/');
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
      module, exports: module.exports, wx,
      require: name => load(path.relative(root, path.resolve(path.dirname(filename), name))),
      Page: page => { definition = page; },
      setTimeout: () => 1, clearTimeout() {}, console
    }, { filename, timeout: 1000 });
    return module.exports;
  }
  function page(value) {
    const instance = Object.assign({}, value, { data: plain(value.data) });
    instance.setData = function(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); };
    return instance;
  }
  return { load, page, home() { load('pages/home/index'); return page(definition); } };
}

test('committed client content exactly matches the included backend', () => {
  assert.deepEqual(bundled.home, loadHome());
  for (const summary of bundled.home.stories) assert.deepEqual(bundled.stories[summary.id], loadStory(summary.id));
});

test('home and every story load without HTTP in development, trial and release builds', async () => {
  for (const version of ['develop', 'trial', 'release']) {
    const rt = runtime(version);
    const home = rt.home();
    home.onLoad();
    await flush();
    assert.equal(home.data.error, '');
    assert.equal(home.data.stories.length, 9);
    home.openCatalog();
    assert.equal(home.data.screen, 'catalog');
    for (const summary of home.data.stories) {
      const reader = rt.page(rt.load('shared/story-reader-page')(summary.id, '/story-packages/story-' + String(summary.id).padStart(2, '0')));
      reader.onLoad({});
      await flush();
      assert.equal(reader.data.loading, false);
      assert.equal(reader.data.error, '');
      assert.equal(reader.data.story.id, summary.id);
      assert.ok(reader.data.story.classicLines.length);
      const theatre = rt.page(rt.load('shared/story-stage-page')(summary.id, '/story-packages/story-' + String(summary.id).padStart(2, '0')));
      theatre.onLoad();
      await flush();
      assert.equal(theatre.data.loading, false);
      assert.equal(theatre.data.error, '');
      assert.ok(theatre.data.puppetLayers.length > 0);
      for (const layer of theatre.data.puppetLayers) assert.ok(fs.existsSync(path.join(root, layer.src)));
    }
  }
});

test('bundled requests preserve cancellation, unknown-story errors and independent response objects', async () => {
  const rt = runtime('release');
  const home = rt.load('services/home');
  const cancelled = home.requestHome(); cancelled.abort();
  await assert.rejects(cancelled.promise, { code: 'ABORTED' });
  await assert.rejects(rt.load('services/story').requestStory(999).promise, { code: 'STORY_NOT_FOUND' });
  await assert.rejects(rt.load('services/story').requestStory(0).promise, { code: 'INVALID_ID' });
  const first = await home.requestHome().promise;
  first.data.stories.length = 0;
  assert.equal((await home.requestHome().promise).data.stories.length, 9);
});

test('root folder can be imported directly in WeChat DevTools', () => {
  const config = JSON.parse(fs.readFileSync(path.resolve(root, '../project.config.json'), 'utf8'));
  assert.equal(config.miniprogramRoot, 'miniprogram/');
  assert.equal(config.setting.urlCheck, true);
});
