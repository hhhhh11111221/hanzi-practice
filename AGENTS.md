# Codex 开发指南

这个文件写给 Codex/AI 助手。开始继续开发前，请先阅读 `README.md`、`DEVELOPMENT_NOTES.md` 和本文件，再修改代码。

## 项目定位

这是一个给小学低年级学生使用的生字练习网页应用。界面应清晰、安静、适合儿童和家长反复使用；优先保证可读性、触控友好、笔顺/练习体验稳定。

## 技术边界

- 当前是纯静态项目：`index.html`、`app.js`、`styles.css`、`data/`。
- 不要随意引入构建工具、框架或复杂依赖，除非用户明确要求。
- 数据主要来自 `app.js` 的内置核心笔画数据和 `data/*.json` 的 Hanzi Writer 风格数据。
- 浏览器本地状态保存在 IndexedDB，数据库名是 `hanzi-practice-db`。

## 重要约定

- 修改前先运行 `git status --short --branch`，确认当前工作区状态。
- 不要删除或重写用户已有改动；如果发现未提交改动，先理解差异。
- 保持 `?view=practice&chars=...` 路由参数支持，这是之前已修复过的点。
- 如果新增练习入口或路由，必须确认刷新页面后仍能恢复到正确视图。
- 修改 UI 后要检查 iPad/移动端宽度下是否有文字重叠、按钮挤压、内容溢出。
- 数据文件名使用汉字，例如 `data/学.json`；不要把这些文件名转成拼音或 ASCII。
- `.gitignore` 已忽略 `.DS_Store`、`node_modules/`、`.env*`、`dist/`、`build/`，不要提交密钥或本机缓存。

## 已知开发环境

- 本机项目路径：`/Users/chenzhuo/Documents/Codex/小学生字练习`
- GitHub 仓库：`ssh://git@ssh.github.com:443/hhhhh11111221/hanzi-practice.git`
- 本机代理：FlClash，`127.0.0.1:7890`
- Git SSH 使用 `ssh.github.com:443`，通过 `nc -X connect -x 127.0.0.1:7890` 走代理。
- 当前稳定标签：`snapshot-20260527-1146`

## 验证建议

静态服务器：

```bash
python3 -m http.server 4173
```

手动检查这些 URL：

```text
http://127.0.0.1:4173/index.html
http://127.0.0.1:4173/index.html?view=practice
http://127.0.0.1:4173/index.html?view=practice&chars=学习
http://127.0.0.1:4173/index.html?view=animation&char=学
http://127.0.0.1:4173/index.html?view=animation&char=输
```

重点确认：

- 首页能正常加载。
- 练习页能创建 session。
- `chars` 参数能限制练习字。
- 笔顺动画页能显示目标字。
- 浏览器控制台没有明显运行时错误。

## 给后续 Codex 的提醒

用户希望换电脑后能继续开发，不想重复讲背景。请优先从这些文档和 Git 历史恢复上下文，不要假设聊天历史一定可用。若要做较大改动，先简短说明你读到的项目状态，再继续实现。

