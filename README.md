# 工业 4.0 工厂设备维修管理 MVP

面向马来西亚及东南亚制造企业的设备维修工作流原型。系统围绕操作工报修、维修工程师接单与维修、操作工验收以及管理员分析形成可追踪闭环。

## Cloudflare Workers 部署

仓库根目录的 `wrangler.jsonc` 会把 `admin-dashboard-tester/dist/client` 作为线上静态资源目录，并为前端路由启用 SPA 回退。生产构建文件会一并提交到仓库，因此 Cloudflare 使用默认部署命令 `npx wrangler deploy` 即可发布，不依赖控制台里的额外构建命令。

更新页面后，在本地重新生成生产文件：

```powershell
pnpm --dir admin-dashboard-tester run build
```

提交生成的 `admin-dashboard-tester/dist/client` 文件后，推送到 `main` 即会触发 Cloudflare 自动部署。

## 当前内容

- 管理员端可交互测试页面
- 管理员端与操作工端 Mockup
- 设备维修闭环流程图
- 需求沟通纪要
- 视觉对照与交互测试记录

## 管理员测试页面

测试页面采用 `List → Detail` 架构，支持：

- 当前任务筛选与搜索
- 任务列表和详情联动
- 维修工程师指派
- 状态及成功反馈
- 桌面、平板和手机自适应

### 本地运行

```bash
cd admin-dashboard-tester
pnpm install
pnpm dev
```

打开 `http://localhost:5173/`。

### 构建

```bash
pnpm build
```

## 目录

```text
admin-dashboard-tester/  可交互 React 测试页面
交付文档/                需求纪要、流程图与 Mockup
PRODUCT.md               产品背景与约束
```

> 当前页面使用模拟数据，仅用于产品讨论、交互验证和开发前确认。
