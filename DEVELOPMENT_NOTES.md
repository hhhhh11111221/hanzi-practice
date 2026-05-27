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

### 已保留的重要修复

练习页路由支持 `chars` 参数：

```text
index.html?view=practice&chars=学习
```

这会创建指定汉字练习 session，而不是总是进入 quick session。后续修改路由或 session 创建逻辑时，要避免破坏这个行为。

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

