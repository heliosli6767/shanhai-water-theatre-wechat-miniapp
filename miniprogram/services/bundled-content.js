'use strict';
var content = require('../data/content');

function request(data, validate, missingMessage) {
  var aborted = false;
  var promise = Promise.resolve().then(function() {
    if (aborted) { var cancelled = new Error('读取已取消。'); cancelled.code = 'ABORTED'; throw cancelled; }
    if (!data) { var missing = new Error(missingMessage); missing.code = 'STORY_NOT_FOUND'; throw missing; }
    // Give each page its own data, just like an HTTP JSON response.
    var response = { data: JSON.parse(JSON.stringify(data)), requestId: 'bundled-' + content.home.contentVersion };
    if (!validate(response)) { var invalid = new Error('内置内容格式不匹配，请重新构建。'); invalid.code = 'INVALID_RESPONSE'; throw invalid; }
    return response;
  });
  return { promise: promise, abort: function() { aborted = true; } };
}

module.exports = {
  home: function(validate) { return request(content.home, validate, '首页内容未生成。'); },
  story: function(id, validate) { return request(content.stories[id], validate, '没有找到这卷故事。'); }
};
