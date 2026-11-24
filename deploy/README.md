# Backend 部署

默认比赛版使用内置数据，无需部署 backend。如切换至在线 API 模式，微信小程序需要可公开访问的 HTTPS API。仓库根目录的 `Dockerfile` 可以部署到支持容器的云平台。

部署后：

1. 验证 `https://你的域名/api/v1/home` 返回九个故事。
2. 将 `miniprogram/services/config.js` 的 `dataSource` 改为 `'api'`，域名写入 `trial` 和 `release`。
3. 在微信公众平台配置 request 合法域名。
4. 重新编译并上传小程序。

不要把 AppSecret 或云平台密钥写入 GitHub。
