# 开发记录

## 2026-05-27

### 项目同步

- 在 `/Users/chenzhuo/Documents/Codex/小学生字练习` 初始化 Git 仓库。
- 创建初始提交：
  - `6b982aa Initial commit`
- 补充提交：
  - `aaff2df Preserve practice route characters`
- 添加 GitHub 远端：
  - `ssh://git@ssh.github.com:443/hhhhh11111221/hanzi-practice.git`
- 已推送 `main` 到 GitHub。
- 创建并推送稳定快照标签：
  - `snapshot-20260527-1146`

### 代理与 GitHub 访问

本机命令行默认没有走代理，直接访问 GitHub 会失败。已确认 FlClash 监听：

```text
127.0.0.1:7890
```

通过代理访问 GitHub 正常。当前项目级 Git 配置使用：

```bash
git config http.proxy http://127.0.0.1:7890
git config https.proxy http://127.0.0.1:7890
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o ProxyCommand='nc -X connect -x 127.0.0.1:7890 %h %p'"
```

因为普通 GitHub SSH 22 端口经代理不稳定，远端改为：

```text
ssh://git@ssh.github.com:443/hhhhh11111221/hanzi-practice.git
```

### SSH Key

本机生成了 GitHub 专用 SSH key：

```text
/Users/chenzhuo/.ssh/id_ed25519_github
/Users/chenzhuo/.ssh/id_ed25519_github.pub
```

公钥已添加到 GitHub 账号。私钥不要提交、不要复制到仓库、不要发给任何人。

### 当前项目状态

- 纯静态网页项目。
- 核心入口：
  - `index.html`
  - `app.js`
  - `styles.css`
- `data/` 目录包含 149 个汉字 JSON 数据文件。
- `app.js` 内有 `CORE_STROKES`，为核心汉字提供内置笔画数据。
- 本地状态使用 IndexedDB：
  - `settings`
  - `records`
  - `mistakes`
  - `customBanks`

### 重要设计决策

- 保持静态网页形态，不引入框架或构建链，降低 iPad Safari 和本地局域网访问的不确定性。
- 书写采集使用 Pointer Events + canvas，适配 Apple Pencil、普通触控笔和手指输入。
- canvas 按 `devicePixelRatio` 设置真实像素尺寸，避免 Retina/HiDPI 下笔迹模糊。
- 练习页和笔顺页都以 Hanzi Writer / Make Me a Hanzi 数据作为标准字源。
- Hanzi Writer 数据包含：
  - `strokes`: SVG 笔画轮廓
  - `medians`: 笔画书写中线
- `data/字.json` 是本地优先数据源，CDN 只作兜底，满足离线能力。
- 田字格里的标准字不再用系统字体渲染，而是用 SVG 笔画轮廓 canvas 渲染。
- 笔顺动画采用“灰色完整字形 + 黑色当前/已完成笔画”的模式，视觉目标参考搜狗汉语/常见笔顺应用。
- 校验前必须加载真实笔画数据，不能用伪造模板校验。
- 反馈页保留“下一个”按钮，提交后不自动跳题，方便查看逐笔错误。

### 踩过的坑

- 早期 `dataFor()` 对未收录字返回默认 3 笔：`横、竖、横`。这导致“输”等所有未收录字都被错误判为 3 笔。这个逻辑已删除，后续不得恢复。
- 早期笔顺动画使用手写路径或字体遮罩，复杂字会出现粗黑画痕、残缺覆盖、一片片显现的问题。现在改为 Hanzi Writer 轮廓 + median。
- CSS 字体层用于田字格标准字时，系统字体基线和 Hanzi Writer 坐标不同，会造成偏右偏下。现在练习页底字主路径已改为 canvas 笔画轮廓；字体绘制只应作为缺少 Hanzi Writer median 时的兜底。
- 笔顺页曾在坐标变换里添加 `+ 66 * scale` 垂直偏移，导致字形偏下。已移除。
- Headless Chrome 截图可能截到“正在加载”状态；优先确认本地 `data/*.json` 是否能通过 HTTP 访问。
- Python `http.server` 有时会空响应 `ERR_EMPTY_RESPONSE`，不是页面代码问题。重启服务后再测试。
- 批量下载 Hanzi Writer 数据时，未编码中文 URL 会导致 curl 解析失败；需要使用 `encodeURIComponent` 或 curl 配置文件。
- 本机网络或沙箱 DNS 偶发失败，单个 `curl` 成功但循环失败时，要区分 URL 编码、DNS 和代理问题。
- “学”第一笔曾被 median 启发式误判为“捺”。短笔画现在优先归为“点”，但笔画类型分类仍需继续打磨。

### 已修复的问题

- iPad 访问方式：通过 Mac 本地服务器和局域网 IP 访问，避免 `file://` 无法跨设备访问。
- 首页词语 chip 曾因为两个字塞进单字宽度而溢出，已改为自适应宽度。
- 混合出题时词语题曾显示 `undefined`，已修复为正确的 word item。
- 提交后自动进入下一题的问题已修复，现在需要点击“下一个 / 查看总结”。
- 笔顺动画播放按钮已移除，进入后自动循环播放。
- 笔顺页不再显示粗线条画痕，改为真实笔画轮廓动画。
- “输”不再显示 3 笔，已能使用 Hanzi Writer 数据显示 13 笔。
- `?view=practice&chars=学习` 已支持指定练习字，方便复现和测试。
- 练习页和笔顺页的标准字渲染已统一到 Hanzi Writer 数据。

### 当前技术状态

- 本地 `data/` 已下载 149 个汉字 JSON，覆盖当前低年级字库和“输”。
- `ensureStrokeData(char)` 的加载顺序：
  1. 已加载到 `app.strokeData`
  2. `localStorage` 缓存
  3. 本地 `./data/字.json`
  4. jsDelivr CDN
- `withHanziTransform()` 是标准字坐标映射核心。当前逻辑按 Make Me a Hanzi / Hanzi Writer 坐标系把 1024-ish 字形映射到 400x400 田字格。
- `drawHanziWriterAnimation()` 负责笔顺页 Hanzi Writer 数据的真实笔画动画。
- `HanziWriter.drawStandard()` 负责练习页灰色标准底字，主路径使用 Hanzi Writer 轮廓。
- `validateChar()` 当前仍是启发式笔画类型/方向校验，不是专业 OCR 或几何评分。

### 已保留的重要修复

练习页路由支持 `chars` 参数：

```text
index.html?view=practice&chars=学习
```

这会创建指定汉字练习 session，而不是总是进入 quick session。后续修改路由或 session 创建逻辑时，要避免破坏这个行为。

### 未来计划

- 完善笔画类型映射：从 Hanzi Writer medians 推断基本笔画仍然比较粗糙，需要更多规则或人工映射表。
- 将校验从“只看笔画类型/方向/数量”升级为：
  - 笔画数量
  - 笔顺
  - 起止点位置
  - 笔画轨迹与标准 median 的距离
  - 字整体结构比例
- 增加“宽松评分”，降低低年级学生因为形状不够准而全部判错的挫败感。
- 自定义字库需要在保存或开始练习时预加载/检查 `data/` 是否有对应 JSON。
- 扩展低年级字库到用户需求中的约 200 字，并确保每个字都有本地 JSON。
- 给 `data/` 增加生成脚本或清单文件，避免以后手动下载数据不可复现。
- 优化 pinyin 数据来源。当前很多字来自 Hanzi Writer 数据时没有拼音，仍依赖内置小表。
- 为 iPad Safari 做真机回归：触控书写、Apple Pencil 压力、离开画布边缘、撤销、提交反馈。
- 加入更稳定的本地服务器方案，减少 Python `http.server` 偶发空响应对测试的干扰。
- 补充自动化测试或轻量自检页面，至少验证 `data/学.json`、`data/牛.json`、`data/输.json` 能加载并绘制。

### 换电脑继续开发

新电脑建议流程：

```bash
git clone ssh://git@ssh.github.com:443/hhhhh11111221/hanzi-practice.git
cd hanzi-practice
git status --short --branch
```

如果新电脑也需要代理，根据实际代理端口配置 Git。若使用同样的 `127.0.0.1:7890`，可参考：

```bash
git config http.proxy http://127.0.0.1:7890
git config https.proxy http://127.0.0.1:7890
git config core.sshCommand "ssh -o StrictHostKeyChecking=accept-new -o ProxyCommand='nc -X connect -x 127.0.0.1:7890 %h %p'"
```

继续开发前对 Codex 说：

```text
请先阅读 README.md、AGENTS.md、DEVELOPMENT_NOTES.md，然后继续开发。
```

### 自动化版本提交流程

已新增项目级版本提交约定：

- 触发语：`版本提交` 或同义短句。
- Codex 需要先提炼本轮会话和代码改动，更新 `README.md`、`AGENTS.md`、`DEVELOPMENT_NOTES.md`。
- 然后运行 `./scripts/finalize.sh "Commit message"`。
- 脚本负责：
  - 检查可能误提交的密钥文件。
  - `git add -A`
  - 创建提交。
  - 创建 `snapshot-YYYYMMDD-HHMM` 标签。
  - 推送分支和标签到 GitHub。

注意：脚本不能自动读取聊天内容，必须由 Codex 在运行脚本前完成文档提炼。

### 2026-05-27 功能改造：字词库、默写练习、练习库

本轮在 `/Users/Claw/hanzi-practice` 继续开发，完成以下产品改造：

- 自定义字库改为自定义字词库，支持单字和词语条目。
- 用户编辑字词库时，可以用空格、英文逗号、中文逗号、顿号或分号分隔。
- 新字词库数据保存 `entries`，同时保留 `chars` 派生字段，兼容旧版本只保存单字的 `chars` 数据。
- 设置页新增练习类型：
  - `stroke`：笔画练习，显示标准底字。
  - `dictation`：汉字默写练习，只显示拼音和声调，不显示田字格底字。
- `?view=practice&chars=学习&practiceType=dictation` 可直接进入指定汉字的默写练习，方便调试和复现。
- “错题 / 错题集”产品命名改为“练习库”，表示孩子还不熟练的字。
- 练习库按 `libraryType` 分为笔画练习库和默写练习库。
- IndexedDB store 仍沿用 `mistakes`，避免破坏已有本地数据；启动时会把旧 `id=字` 数据迁移成 `stroke:字`。

实现要点：

- `normalizeBankEntries(text)` 负责解析字词条目。
- `bankEntries(bank)` 兼容新 `entries` 和旧 `chars`。
- `itemsFromEntries(entries)` 把单字转为 char item，把词语转为 word item。
- `createSession()` 会把当前 `app.settings.practiceType` 写入 session；复习练习库时使用对应库的练习类型。
- `HanziWriter.drawStandard()` 在 `dictation` 模式下直接跳过标准底字绘制。
- `markReview()` 写入 `libraryType`，同一个字在笔画练习库和默写练习库中可以独立记录。

验证记录：

- 运行 `node --check app.js` 通过。
- 使用 Chrome DevTools 设备工具栏切到 iPad Air，确认当前页面在 `820 × 1180` 视口下可用。
- 使用 Chrome headless 按 `820 × 1180` 生成并检查截图：
  - `/private/tmp/hanzi-practice-settings-ipad.png`
  - `/private/tmp/hanzi-practice-practice-ipad.png`
  - `/private/tmp/hanzi-practice-dictation-ipad.png`
  - `/private/tmp/hanzi-practice-custom-ipad.png`
  - `/private/tmp/hanzi-practice-library-ipad.png`
- iPad 视口下调整了练习页响应式顺序，让田字格优先显示，逐笔反馈和提示卡片位于书写区下方。

后续注意：

- 默写练习目前仍用笔画类型/方向/顺序启发式校验，不是真正的汉字形状 OCR。
- 后续如果扩展练习库数据结构，应继续兼容 IndexedDB 的旧 `mistakes` store。
- 若未来给自定义字词库增加删除、排序或批量导入，需要同步考虑 `entries` 与旧 `chars` 字段兼容。

### 2026-05-27 iPad 横屏、词语笔顺和逐笔校验修复

本轮根据 iPad 实测反馈继续打磨书写练习和笔顺动画，主要修改 `app.js` 与 `styles.css`。

产品与交互改动：

- 词语模式点击“查看笔顺”时，不再只进入词语第一个字的孤立笔顺页。
- 笔顺页会携带词语中的全部汉字，默认播放第一个字，并在“换一个字”区域显示词语所有字；点击其它字会切换并重新播放对应笔顺。
- 笔画练习田字格整体缩小：普通单字最大约 340px，iPad 横屏约 280px；词语多字模式更小，方便低龄儿童持笔书写。
- iPad 横屏下练习页和笔顺页压缩顶部区域，练习主体和反馈区尽量保持在一屏内。
- 复杂字提交后，逐笔反馈区改为内部滚动，避免“输”等多笔画反馈把整个页面撑到很下面。
- 增加基础防手掌误触逻辑：`pointerType=pen` 优先；检测到 Apple Pencil / pen 后忽略后续 touch；大面积 touch 视为手掌；同一时间只允许一个田字格接收书写输入。

校验逻辑改动：

- 修复“山”第二笔标准笔画被 Hanzi Writer median 启发式误判为“横”的问题。核心字表已有人工笔画时，优先使用人工笔画名；没有人工表时再用 median 推断。
- `strokeTypeFromMedian()` 和 `classifyStroke()` 不再只取极短的起止片段判断方向，改为沿路径走到足够距离后判断，减少复合笔画误判。
- 对“整体方向一致但有弧度”的笔画，优先归为撇/捺/横/竖等基础笔画，避免弯一点的撇被误判成“折”。
- 增加“飞”的人工标准笔画：`横斜钩、撇、点`，并补充横斜钩相关容错。
- `validateChar()` 增加 `strokePositionOk()`：除了笔画类型，还比较用户笔画与标准 median 的中心、起点/终点位置，减少同类型笔画调换顺序仍被判对的问题。
- 逐笔反馈新增“笔顺或位置错误”原因，用于区分笔画类型正确但位置/顺序不对的情况。

踩坑与注意：

- 单纯按“第 N 笔类型”比对不够。像“山”左右两竖、“火”的两个撇，类型可能一样，但顺序错了也必须判错。
- Hanzi Writer median 是中线，不是人工笔画名称库；复杂折笔或弧线用几何启发式推断会有偏差，核心常用字仍需要人工表兜底。
- “飞”的第二笔 median 有弧度，旧逻辑因转角过大误判为“折”。后续改分类器时要继续测试“飞”。
- 防手掌误触无法在网页里做到绝对可靠。普通电容笔若被 Safari/Chrome 当成 touch，网页无法完全区分笔尖和手掌，只能通过触点面积、pen 优先和单活跃书写格降低误触。

验证记录：

- `node --check app.js` 通过。
- `curl -I http://127.0.0.1:4173/index.html` 返回 200。
- Chrome headless 按 iPad 横屏 `1180 × 820` 截图检查：
  - `/private/tmp/ipad-landscape-real-word-practice.png`
  - `/private/tmp/ipad-landscape-real-word-animation.png`
  - `/private/tmp/ipad-landscape-real-word-animation-water.png`
  - `/private/tmp/ipad-landscape-feedback-shu-2.png`
- 自动化运行时验证：
  - 词语“山水”练习页为两个田字格。
  - “查看笔顺”进入后 `app.animation.chars` 为 `山水`，默认播放“山”，点击“水”后切换为“水”。
  - “输”提交后横屏页面 `scrollHeight === innerHeight`，`body` 为 `overflow: hidden`，反馈列表内部滚动。
  - “飞”标准轨迹判定正确，标准笔画为 `横斜钩、撇、点`。
  - “山”左右竖错序、“火”同类型笔画错序会判为错误，并给出“笔顺或位置错误”。

后续计划：

- 为 `validateChar()` 增加更系统的自动化测试脚本，覆盖常用易误判字：山、飞、火、水、马、鸟、输、学。
- 将核心常用字的人工笔画表扩展到完整低年级字库，减少依赖 median 启发式推断。
- 后续真机 iPad + Apple Pencil 继续验证防误触策略，必要时提供“仅 Apple Pencil 书写”设置。
