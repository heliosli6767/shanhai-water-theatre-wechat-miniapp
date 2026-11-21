# Backend 部署

正式微信小程序必须使用可公开访问的 HTTPS API。仓库根目录的 `Dockerfile` 可以部署到支持容器的云平台。

部署后：

1. 验证 `https://你的域名/api/v1/home` 返回九个故事。
2. 将域名写入 `miniprogram/services/config.js` 的 `trial` 和 `release`。
3. 在微信公众平台配置 request 合法域名。
4. 重新编译并上传小程序。

不要把 AppSecret 或云平台密钥写入 GitHub。
