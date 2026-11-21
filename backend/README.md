# Backend

这是只服务山海水戏微信小程序的只读内容 API，故事数据位于 `content/`，不读取其他仓库或 Web 文件。

```bash
npm run dev
```

环境变量：`HOST`、`PORT`，以及可选的逗号分隔 `CORS_ORIGINS`。小程序请求通常不携带浏览器 Origin。
