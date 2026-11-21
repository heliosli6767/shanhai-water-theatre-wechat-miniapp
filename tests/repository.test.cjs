'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { once } = require('node:events');
const { loadHome, loadStory } = require('../backend/content.cjs');
const { createServer } = require('../backend/server.cjs');
const { isHomeResponse } = require('../shared/api-contracts/home.js');
const { isStoryResponse } = require('../shared/api-contracts/story.js');

const root = path.resolve(__dirname, '..');
const miniRoot = path.join(root, 'miniprogram');
const size = directory => fs.readdirSync(directory, { withFileTypes: true }).reduce((total, entry) => {
  const filename = path.join(directory, entry.name);
  return total + (entry.isDirectory() ? size(filename) : fs.statSync(filename).size);
}, 0);

test('repository is standalone and excludes unrelated platforms and source libraries', () => {
  for (const name of ['apps', 'assets', '资料库', '图片库']) {
    assert.equal(fs.existsSync(path.join(root, name)), false, name + ' must not exist');
  }
  assert.ok(fs.existsSync(path.join(miniRoot, 'app.json')));
  assert.ok(fs.existsSync(path.join(root, 'backend/content/stories.js')));
  assert.ok(fs.existsSync(path.join(root, 'backend/content/scene-data.js')));
});

test('backend owns all nine stories and 27 scenes', () => {
  const home = loadHome();
  assert.deepEqual(home.stories.map(story => story.id), [1, 2, 3, 7, 8, 9, 10, 16, 20]);
  assert.deepEqual(home.stats, { storyCount: 9, sceneCount: 27 });
  assert.ok(isHomeResponse({ data: home, requestId: 'test' }));
  for (const id of [1, 2, 3, 7, 8, 9, 10, 16, 20]) {
    const story = loadStory(id);
    assert.equal(story.scenes.length, 3);
    assert.ok(isStoryResponse({ data: story, requestId: 'test' }));
  }
});

test('mini program keeps nine subpackages and five compressed water stages', () => {
  const app = JSON.parse(fs.readFileSync(path.join(miniRoot, 'app.json')));
  assert.equal(app.subPackages.length, 9);
  let subpackageBytes = 0;
  for (const pack of app.subPackages) {
    const bytes = size(path.join(miniRoot, pack.root));
    subpackageBytes += bytes;
    assert.ok(bytes < 2 * 1024 * 1024);
  }
  for (let index = 1; index <= 5; index++) {
    const stage = path.join(miniRoot, 'assets/images/stages/stage-' + index + '.jpg');
    assert.ok(fs.existsSync(stage));
    assert.ok(fs.statSync(stage).size > 45 * 1024);
  }
  assert.ok(size(miniRoot) - subpackageBytes < 2 * 1024 * 1024);
  assert.ok(size(miniRoot) < 30 * 1024 * 1024);
  assert.equal(require(path.join(miniRoot, 'shared/build-info.js')).id, 'MINI-CLEAN-20261121-01');
});

test('HTTP API is read-only and serves the mini-program contracts', async t => {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = 'http://127.0.0.1:' + server.address().port;
  const homeResponse = await fetch(base + '/api/v1/home');
  assert.equal(homeResponse.status, 200);
  assert.ok(isHomeResponse(await homeResponse.json()));
  const storyResponse = await fetch(base + '/api/v1/stories/1');
  assert.equal(storyResponse.status, 200);
  assert.ok(isStoryResponse(await storyResponse.json()));
  assert.equal((await fetch(base + '/api/v1/home', { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/stories.js')).status, 404);
});
