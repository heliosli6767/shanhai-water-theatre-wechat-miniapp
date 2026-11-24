# Backend

这是只服务山海水戏微信小程序的只读内容 API，故事数据位于 `content/`，不读取其他仓库或 Web 文件。

原实现位置为旧总仓库 `services/backend/`，本仓库已独立保留。比赛版通过 `npm run build` 把同一份内容生成到 `miniprogram/data/content.js`，评委无需运行服务端即可查看小程序。

```bash
npm run dev
```

环境变量：`HOST`、`PORT`，以及可选的逗号分隔 `CORS_ORIGINS`。小程序请求通常不携带浏览器 Origin。
