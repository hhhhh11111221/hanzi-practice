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

### 自动化收尾流程

已新增项目级收尾约定：

- 触发语：`项目收尾`、`收尾并同步`、`帮我收尾` 或同义短句。
- Codex 需要先提炼本轮会话和代码改动，更新 `README.md`、`AGENTS.md`、`DEVELOPMENT_NOTES.md`。
- 然后运行 `./scripts/finalize.sh "Commit message"`。
- 脚本负责：
  - 检查可能误提交的密钥文件。
  - `git add -A`
  - 创建提交。
  - 创建 `snapshot-YYYYMMDD-HHMM` 标签。
  - 推送分支和标签到 GitHub。

注意：脚本不能自动读取聊天内容，必须由 Codex 在运行脚本前完成文档提炼。
