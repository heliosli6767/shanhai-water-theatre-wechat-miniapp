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

## 评委快速打开

1. 下载本仓库并解压。
2. 在微信开发者工具中导入解压后的仓库根目录（也可导入 `miniprogram/`）。根目录已提供 `project.config.json`。
3. 使用有权限的 AppID 或工具支持的测试方式，点击“编译”。

默认运行比赛内置数据模式。首页、九个故事、拼音古文、舞台人物/道具与五个水幕均已放在工程中，无需启动 Node.js、配置 API 域名、执行 npm 构建或连接原仓库。首次使用微信开发者工具仍需微信登录和下载基础库。

VisionKit 手势识别需支持的手机微信及摄像头授权，Mac 模拟器只用于检查页面和舞台显示。本次调整没有重新标定手势算法，实际效果仍需真机验收。

## Server Side 在哪里

完整独立副本在 `backend/server.cjs`、`backend/content.cjs` 和 `backend/content/`。它来自原项目的 `services/backend/`，已经改为只读取本仓库内的故事数据与 `shared/`。

比赛客户端默认读取 `miniprogram/data/content.js`。这个文件由本仓库 backend 导出并提交到 GitHub，内容与服务端完全一致；小程序内部不会启动 Node.js HTTP 服务。

## 修改故事与验证

需要 Node.js 22 或更高版本，无需安装第三方依赖。

```bash
npm test
npm run build
```

修改 `backend/content/stories.js` 或 `scene-data.js` 后执行 `npm run build`，将生成的 `miniprogram/data/content.js` 一并提交。`npm test` 自动重新构建并验证内容一致性、无网络阅读流程、backend 接口、包体和手势逻辑。GitHub Actions 会自动执行同样的构建与测试，但不会自动上传微信。

## 可选：使用 HTTP backend

比赛版和真机可继续使用默认内置数据。若今后需要远程更新故事：

1. 运行 `npm run dev` 启动本机 API，或部署本仓库 backend 到 HTTPS 域名。
2. 在 `miniprogram/services/config.js` 将 `dataSource` 改为 `'api'`，填写相应环境地址。
3. 手机无法通过 `127.0.0.1` 访问电脑；正式在线版须配置微信 request 合法域名。

本仓库不应提交 AppSecret、Token 或云平台密钥。部署方式见 `deploy/README.md`。

## 构建标识

比赛内置数据版本标识为 `MINI-CONTEST-20261124-01`，可在小程序版本信息中用于排除旧包缓存。
