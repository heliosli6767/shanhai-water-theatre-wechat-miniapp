// Only public endpoint addresses belong here. Never put AppSecret/token keys here.
var environments = {
  // The simulator can reach localhost. For real-device debugging, replace it
  // with the Mac's current LAN address or a deployed HTTPS endpoint.
  develop: { apiBaseUrl: 'http://127.0.0.1:4174', timeoutMs: 8000 },
  trial: { apiBaseUrl: '', timeoutMs: 8000 },
  release: { apiBaseUrl: '', timeoutMs: 8000 }
};
function getConfig() {
  var version = 'release';
  try { version = wx.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
  var config = environments[version] || environments.release;
  var base = config.apiBaseUrl.replace(/\/$/, '');
  // Local HTTP is allowed only for a development build; missing production
  // configuration must fail visibly rather than silently using a local server.
  if (!base || (version !== 'develop' && !/^https:\/\//.test(base))) {
    var error = new Error('请先配置此环境的 HTTPS API 地址。'); error.code = 'CONFIG_ERROR'; throw error;
  }
  return { apiBaseUrl: base, timeoutMs: config.timeoutMs };
}
module.exports = { getConfig: getConfig };
