# Transformer 工坊：手搓大模型

一个面向 MTI 翻译硕士和零代码基础学习者的中文像素风教育游戏。项目用“搭积木”和翻译工作流类比，帮助学习者理解 Transformer 中的 Token、Embedding、Position Encoding、Q/K/V、Self-Attention、Multi-Head Attention、Add & Norm、Feed Forward 和 Output 等核心概念。

本项目不是机器学习框架，也不会训练或调用真实大模型。它的目标是把抽象概念拆成可点击、可连线、可复盘的教学体验。

## 功能概览

- 像素风中文学习界面
- 闯关模式：5 个循序渐进的 Transformer 流程关卡
- 自由练习：按模块自由练习和复盘
- 可视化工坊：基于 React Flow 的节点连接与路径校验
- 学习图鉴：用翻译类比解释核心概念
- 句子实验室：模拟“句子进入 Transformer”的处理过程
- 测验、错题复盘、成就、学习进度页面
- Supabase Auth 登录、个人资料和云端学习进度保存
- Tauri 桌面应用构建配置

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- @xyflow/react
- Supabase Auth / Database
- Tauri 2
- 纯 CSS 像素风样式

## 项目边界

本项目用于教学演示：

- 不包含真实 AI 推理
- 不调用真实 AI API
- 不实现真实机器学习训练
- Attention 权重和模型输出均为教学模拟
- 前端只允许使用 Supabase anon / publishable key，不要使用 service_role key

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填写你的 Supabase 项目配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
VITE_SUPABASE_PUBLISHABLE_KEY=
```

`VITE_SUPABASE_ANON_KEY` 和 `VITE_SUPABASE_PUBLISHABLE_KEY` 二选一即可。不要把 Supabase `service_role` key 放进任何前端环境变量。

### 3. 初始化 Supabase 数据库

在 Supabase Dashboard 的 SQL Editor 中执行：

```text
supabase/schema.sql
```

该脚本会创建：

- `profiles`：用户资料表
- `game_progress`：学习进度表
- Row Level Security 策略
- 新用户注册后自动创建 profile 的触发器

### 4. 启动 Web 开发服务器

```bash
npm run dev
```

默认访问：

```text
http://localhost:5173/
```

### 5. 构建 Web 版本

```bash
npm run build
```

### 6. 预览生产构建

```bash
npm run preview
```

## Tauri 桌面版

桌面版需要先安装 Rust 和 Tauri 所需系统依赖。

启动桌面开发模式：

```bash
npm run tauri:dev
```

构建桌面安装包：

```bash
npm run tauri:build
```

构建产物会生成在 `src-tauri/target/` 下，该目录不应提交到 GitHub。

## 游戏关卡

1. 文本进入模型
   - Token -> Embedding -> Position Encoding
   - 类比译前处理：切分原文、形成语义表示、保留语序。

2. 注意力三件套
   - Query -> Key -> Value
   - 类比译员查上下文：提出问题、匹配线索、取回信息。

3. 自注意力机制
   - Query -> Key -> Value -> Self-Attention
   - 类比给上下文划重点：判断哪些词会影响当前片段的理解。

4. Transformer 核心模块
   - Multi-Head Attention -> Add & Norm -> Feed Forward -> Add & Norm
   - 类比一轮审校：多角度看上下文、保留原意、再加工表达。

5. 完整 Transformer 流程
   - Token -> Embedding -> Position Encoding -> Multi-Head Attention -> Add & Norm -> Feed Forward -> Add & Norm -> Output
   - 类比从原文切分到输出预测的一条简化大模型理解路线。

## 目录结构

```text
src/
  auth/                  Supabase 登录状态与认证上下文
  components/            通用组件、游戏组件和可视化工坊组件
  data/                  关卡、题目、图鉴、成就等教学数据
  i18n/                  中英文界面文案
  lib/                   Supabase 客户端
  pages/                 页面级组件
  services/              资料和进度读写服务
  styles/                全局样式
  types/                 TypeScript 类型
  utils/                 本地存储、校验和教学工具函数
src-tauri/               Tauri 桌面应用配置和 Rust 入口
supabase/schema.sql      Supabase 数据库初始化脚本
```

## 开源发布注意事项

应该提交：

- `src/`
- `src-tauri/src/`
- `src-tauri/icons/`
- `src-tauri/capabilities/`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`
- `src-tauri/build.rs`
- `src-tauri/tauri.conf.json`
- `supabase/schema.sql`
- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig*.json`
- `.gitignore`
- `.env.example`
- `README.md`
- `LICENSE`

不要提交：

- `node_modules/`
- `dist/`
- `src-tauri/target/`
- `src-tauri/gen/schemas/`
- `.env.local`
- `.env`
- `*.log`
- 打包后的安装包，例如 `.exe`、`.msi`、`.dmg`
- 私钥、证书、签名文件，例如 `*.pem`、`*.key`、`*.pfx`

更多发布前检查见 [docs/OPEN_SOURCE_CHECKLIST.md](docs/OPEN_SOURCE_CHECKLIST.md)。

## 许可证

本项目使用 MIT License，详见 [LICENSE](LICENSE)。
