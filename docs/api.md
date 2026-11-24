# API

默认比赛模式不发起 HTTP 请求，直接读取 backend 构建出的内置快照。下列 HTTP 接口完整保留供在线部署使用；返回的数据结构也用于验证内置内容。

## `GET /api/v1/home`

返回项目标题、故事数量、场景数量和九个故事的目录信息。

## `GET /api/v1/stories/:id`

返回单个故事的白话文、带拼音原文、来源说明、三幕场景和动作步骤。

当前故事 ID：`1, 2, 3, 7, 8, 9, 10, 16, 20`。

所有成功响应均包含 `data` 和 `requestId`；错误响应包含 `error.code`、`error.message` 和 `requestId`。
