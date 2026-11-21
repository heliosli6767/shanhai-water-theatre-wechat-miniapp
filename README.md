# 山海水戏 · 微信小程序

中国《山海经》与越南水上木偶戏结合的原生微信小程序。这个仓库只服务微信端，包含完整小程序、九个故事分包、五个水幕舞台、VisionKit 手势管线和独立内容 API。

本仓库不依赖原 Web、iOS、Android、Blender 工程或大型原始素材库。

## 目录

```text
miniprogram/          微信开发者工具直接导入的工程
backend/              只读内容 API 与九个故事源数据
shared/               backend 使用的 API 契约和项目常量
tests/                API、包体与 VisionKit 逻辑测试
deploy/               部署说明
docs/                 接口说明
```

## 本地开发

需要 Node.js 22 或更高版本，无需安装第三方依赖。

```bash
npm test
npm run dev
```

API 默认运行于 `http://127.0.0.1:4174`。随后在微信开发者工具中导入 `miniprogram/`。

## 真机与发布

GitHub 保存的是完整源码，但不会替你运行 Node.js 服务。真机体验版和正式版需要：

1. 将本仓库的 backend 部署到可从微信访问的 HTTPS 域名。
2. 在 `miniprogram/services/config.js` 填入 trial/release API 地址。
3. 在微信公众平台将该域名加入 request 合法域名。

本仓库不应提交 AppSecret、Token 或云平台密钥。部署方式见 `deploy/README.md`。

## 构建标识

首个独立仓库版本标识为 `MINI-CLEAN-20261121-01`，可在小程序版本信息中用于排除旧包缓存。
