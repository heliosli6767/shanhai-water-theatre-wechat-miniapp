# API

## `GET /api/v1/home`

返回项目标题、故事数量、场景数量和九个故事的目录信息。

## `GET /api/v1/stories/:id`

返回单个故事的白话文、带拼音原文、来源说明、三幕场景和动作步骤。

当前故事 ID：`1, 2, 3, 7, 8, 9, 10, 16, 20`。

所有成功响应均包含 `data` 和 `requestId`；错误响应包含 `error.code`、`error.message` 和 `requestId`。
