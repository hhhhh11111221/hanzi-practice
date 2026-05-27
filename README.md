# 小学生字练习

一个面向小学低年级生字学习的本地静态网页应用。项目当前由原生 HTML、CSS 和 JavaScript 组成，不依赖构建工具；直接用浏览器打开 `index.html` 或启动一个静态文件服务器即可运行。

## 功能概览

- 生字练习：支持按课程、生字数量和练习模式生成练习。
- 笔顺动画：可查看单字笔顺和描红/书写区域。
- 拼音与朗读：使用浏览器语音能力辅助识字。
- 错题与记录：使用 IndexedDB 在本机保存设置、练习记录、错题和自定义字库。
- 本地字形数据：`data/` 目录保存外部汉字笔画数据，`app.js` 中也有核心汉字的内置数据兜底。

## 项目结构

```text
.
├── index.html
├── app.js
├── styles.css
├── data/
├── README.md
├── AGENTS.md
└── DEVELOPMENT_NOTES.md
```

## 本地运行

最简单方式是直接打开：

```bash
open index.html
```

更推荐用本地静态服务器，避免浏览器对本地文件读取的限制：

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/index.html
```

常用调试地址：

```text
http://127.0.0.1:4173/index.html?view=practice
http://127.0.0.1:4173/index.html?view=practice&chars=学习
http://127.0.0.1:4173/index.html?view=animation&char=学
```

## 同步到云端

仓库地址：

```text
ssh://git@ssh.github.com:443/hhhhh11111221/hanzi-practice.git
```

当前项目已经配置为通过本机代理访问 GitHub：

```bash
git config http.proxy http://127.0.0.1:7890
git config https.proxy http://127.0.0.1:7890
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o ProxyCommand='nc -X connect -x 127.0.0.1:7890 %h %p'"
```

如果另一台电脑也使用 FlClash 或兼容代理，并且代理端口也是 `127.0.0.1:7890`，可以使用类似配置。若端口不同，请以实际代理端口为准。

## 常用 Git 命令

开始开发前同步云端：

```bash
git pull
```

开发完成后提交并推送：

```bash
git add .
git commit -m "Describe the change"
git push
```

查看本地和云端是否一致：

```bash
git fetch
git status --short --branch
```

当前稳定快照标签：

```text
snapshot-20260527-1146
```

## 版本提交

开发结束后，可以直接对 Codex 说：

```text
版本提交
```

Codex 会按 `AGENTS.md` 的版本提交流程，先把本轮会话中的重要决策、踩坑、修复和后续计划更新到 `README.md`、`AGENTS.md`、`DEVELOPMENT_NOTES.md`，再运行脚本提交、打标签并推送。

手动运行机械收尾脚本：

```bash
./scripts/finalize.sh "Commit message"
```

脚本会创建格式为 `snapshot-YYYYMMDD-HHMM` 的标签并推送到 GitHub。
