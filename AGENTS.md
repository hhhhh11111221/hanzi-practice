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
- 保持 `?view=practice&chars=...&practiceType=dictation` 调试路由支持，方便直接复现默写练习。
- 如果新增练习入口或路由，必须确认刷新页面后仍能恢复到正确视图。
- 修改 UI 后要检查 iPad/移动端宽度下是否有文字重叠、按钮挤压、内容溢出。
- 数据文件名使用汉字，例如 `data/学.json`；不要把这些文件名转成拼音或 ASCII。
- `.gitignore` 已忽略 `.DS_Store`、`node_modules/`、`.env*`、`dist/`、`build/`，不要提交密钥或本机缓存。

## 版本提交触发指令

当用户说“版本提交”或意思相近的简短指令时，Codex 必须自动执行本节流程。

1. 运行 `git status --short --branch`，查看当前改动。
2. 阅读 `README.md`、`AGENTS.md`、`DEVELOPMENT_NOTES.md`，恢复项目背景。
3. 总结本轮会话和代码改动，把重要内容写入项目文档：
   - `README.md`：只更新运行方式、项目结构、用户需要知道的变化。
   - `AGENTS.md`：更新给后续 Codex 的开发约定、高风险区域、验证路径、不要重复犯的坑。
   - `DEVELOPMENT_NOTES.md`：追加今天的开发记录、已修复问题、踩坑、当前技术状态、未来计划。
4. 检查是否有 `.env`、私钥、token、本机缓存、临时截图等不应提交的内容。
5. 根据改动风险做必要验证；若无法验证，要在最终回复里说明。
6. 运行 `./scripts/finalize.sh "Commit message"` 完成提交、创建 `snapshot-YYYYMMDD-HHMM` 标签并推送。
7. 最终回复必须包含提交号、标签名、`git status --short --branch` 结果、是否推送成功。

不要跳过第 3 步。脚本只能提交、打标签和推送，不能替代 Codex 对会话内容的提炼。

## 产品与实现决策

- 主要目标设备是 iPad + Apple Pencil，所有书写交互优先考虑触控、低延迟和 HiDPI canvas 清晰度。
- 项目保持无构建、无框架的静态网页形态，方便本地 HTTP 服务和 iPad 局域网访问。
- 田字格底字与笔顺动画必须使用同一套标准字形数据，不要再用 CSS 字体层模拟标准字。
- 标准字形与笔顺数据优先来自 `data/*.json` 的 Hanzi Writer / Make Me a Hanzi 数据；每个 JSON 包含 `strokes` 轮廓和 `medians` 中线。
- `app.js` 内的 `CORE_STROKES` 只作为极早期兜底和拼音/基础笔画参考，不应再作为主要字库来源。
- 笔顺动画的正确模型是：灰色显示全部未写笔画轮廓，黑色显示已写笔画，当前笔画根据 median 逐步揭示。
- 练习页标准字预览也应使用 Hanzi Writer 轮廓 canvas，避免系统字体基线造成偏右、偏下、大小不一致。
- 书写校验应先加载真实笔画数据，再比较笔画数量、类型、顺序和位置；绝不能退回默认“三笔模板”。
- 提交答案后必须停留在逐笔反馈，用户点击“下一个 / 查看总结”后再推进题目。
- 练习类型分为 `stroke` 和 `dictation`。默写练习只隐藏田字格底字，仍沿用真实笔画数据做笔画数量、类型和顺序校验。
- 旧“错题集”产品文案已改为“练习库”，并按 `libraryType` 分为笔画练习库和默写练习库；IndexedDB store 仍沿用 `mistakes` 以兼容旧数据。
- 自定义字词库保存 `entries`，支持单字和词语；旧数据的 `chars` 字段需要继续兼容。
- 词语模式下点击“查看笔顺”必须带上词语中的全部汉字，默认播放第一个字，并允许点其它字切换笔顺动画。
- iPad 横屏练习页应尽量保持一屏内完成；复杂字逐笔反馈要在反馈区域内部滚动，不要撑开整个页面。
- 防手掌误触只能做启发式过滤：Apple Pencil / `pointerType=pen` 优先，大面积 touch 和 pen 后续 touch 忽略；普通电容笔若被浏览器识别为 touch，无法完全区分笔尖和手掌。

## 高风险区域

- `dataFor()`、`ensureStrokeData()`、`createSession()`、`validateChar()`、`strokePositionOk()`、`drawAnimationFrame()` 是当前最容易引入回归的地方。
- `normalizeBankEntries()`、`itemsFromEntries()`、`bankEntries()`、`markReview()` 也属于高风险区域，分别影响自定义字词解析、旧字库兼容和练习库分类。
- 不要恢复“未收录字默认横/竖/横”的逻辑。这个旧逻辑会导致所有未录入字被错误判为 3 笔。
- 不要用 `STKaiti` / `KaiTi` / 普通 DOM 文本作为田字格内标准字的主渲染路径。系统字体与 Hanzi Writer 坐标不一致，会出现偏移；代码中保留的字体绘制只能作为缺少 Hanzi Writer median 时的兜底。
- 不要在 Hanzi Writer 坐标变换里随意加垂直偏移。曾经的 `+ 66 * scale` 会让笔顺页字形偏下。
- 如果修改 `withHanziTransform()`，必须同时检查练习页和笔顺页同一个字在田字格里的位置。
- 如果修改 `strokeTypeFromMedian()`、`classifyStroke()`、`compatible()` 或 `strokePositionOk()`，必须测试“山”的第二笔竖折、“飞”的横斜钩，以及同类型笔画调换顺序是否能被判错。
- 不要只按笔画类型判断正确性。同类型笔画换顺序时，如果位置与标准 median 不符，应显示“笔顺或位置错误”。
- 远程 CDN 只能作为补充；iPad 离线能力依赖 `data/` 本地 JSON。
- 本地 Python `http.server` 偶发出现 `ERR_EMPTY_RESPONSE`，遇到空响应先重启服务再判断页面问题。

## 推荐验证路径

每次改书写、笔顺或字形位置后，至少检查：

```text
http://127.0.0.1:4173/index.html?view=practice&chars=牛
http://127.0.0.1:4173/index.html?view=practice&chars=牛&practiceType=dictation
http://127.0.0.1:4173/index.html?view=animation&char=牛
http://127.0.0.1:4173/index.html?view=practice&chars=输
http://127.0.0.1:4173/index.html?view=animation&char=输
http://127.0.0.1:4173/index.html?view=practice&chars=学习
http://127.0.0.1:4173/index.html?view=practice&chars=飞
http://127.0.0.1:4173/index.html?view=animation&char=山&chars=山水
http://127.0.0.1:4173/index.html?view=custom
http://127.0.0.1:4173/index.html?view=mistakes
```

重点看：

- 练习页和笔顺页同字位置、大小是否一致。
- 标准字是否居中，是否偏右、偏下。
- 笔顺动画是否一笔一划，不是一片片遮罩或残缺覆盖。
- “输”等复杂字是否显示真实笔画数。
- 提交后逐笔反馈是否停留，是否需要点击“下一个”才继续。
- 复杂字提交后逐笔反馈是否在内部滚动，横屏页面整体是否不被撑高。
- 词语模式点击“查看笔顺”后是否出现词语全部汉字，并可点选切换播放。
- “山”第二笔是否显示标准“竖折”，“飞”写对时是否不被误判。
- 同类型笔画调换顺序时是否显示“笔顺或位置错误”。
- 默写练习田字格内是否没有标准底字，田字格上方是否显示拼音和声调。
- iPad Air 820×1180 视口下，设置页、练习页、自定义字词库和练习库是否没有文字重叠或按钮挤压。

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
