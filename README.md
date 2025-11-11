## 开发

```bash
# 克隆项目
git clone https://gitee.com/nanchang-xuanye/lty-ui.git

# 进入项目目录
cd lty-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

# Git 提交规范
参考 [AngularJS 的 commit 规范](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略

## Header

Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和 subject（必需）

### type

用来标识 commit 的类型，总共有以下 11 个标识：

- feat：新功能（feature）
- fix：修补 bug
- docs：文档发生修改 (documentation)
- style：不影响代码运行的更改（空格，格式，缺少分号等，没有改变代码逻辑）
- refactor：重构代码（即不是新增功能，也不是修改 bug 的代码变动）
- test：添加或修改测试用例
- revert：回滚某个更早之前的提交
- perf：性能, 体验优化
- ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交
- build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- chore：除上述之外的修改

### scope

用来标识改动所影响的范围，视项目而定

### subject

改动的简短描述，不超过 50 字符长度

## Body

本次 commit 的详细描述

## Footer

主要用于两种情况：

- 重大的不兼容改动: 用于给出改动说明及解决方案。
- 关联 issues: 用于关闭相应 issues