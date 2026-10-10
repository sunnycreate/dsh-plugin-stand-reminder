# 如果 `.git` 又被削掉了：恢复步骤

**症状**：`git status` 报 `fatal: not a git repository`，但 `.git` 目录还在，里面只剩下
`objects/` 和 `refs/`，缺了 `HEAD`、`config`、`index`。

**判断**：先看一下仓库是不是真的坏了：

```powershell
cd D:\WS\Study\dsh-plugin
git rev-parse --git-dir     # 报 fatal 就是坏了
Test-Path .git\HEAD, .git\config, .git\index   # 看缺哪几个
Test-Path .git\refs\heads\main                 # 这个还在就说明提交没丢
```

只要 `refs/heads/main` 里有 40 位 SHA，**提交本身没丢**（对象库在 `objects/` 里），
而且 GitHub 上那份是完好的，随便重建。

## 前提：先确认工作区文件是好的

`.git` 坏掉不影响工作区文件。恢复前可以先确认代码还在：

```powershell
Get-ChildItem -Force          # 应该看到 src/ client/ tests/ package.json ...
node --test "tests/*.test.js" # 40 个测试应该全绿
```

## 1. 重建 `.git/HEAD`

内容就是一行，指向 main 分支（注意行尾要有换行）：

```powershell
Set-Content -Path .git\HEAD -Value "ref: refs/heads/main" -Encoding ASCII
```

## 2. 重建 `.git/config`

`git config` 这时候用不了（仓库还没被识别），必须手写文件：

```powershell
@'
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
	autocrlf = false
[user]
	name = sunnycreate
	email = sunnycreate@users.noreply.github.com
[remote "origin"]
	url = https://github.com/sunnycreate/dsh-plugin-stand-reminder.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main
'@ | Set-Content -Path .git\config -Encoding UTF8
```

## 3. 重建索引

```powershell
git reset --mixed HEAD
```

这一步按 HEAD 重新生成 `.git/index`，不会动任何工作区文件。

## 4. 验证

```powershell
git status -sb                 # 应该干净，且显示 ## main...origin/main
git log --oneline              # 两个 commit
git rev-list --left-right --count main...origin/main   # 应该输出 0	0
```

`0  0` 表示本地和 GitHub 完全同步。如果显示 `1  0` 之类的，就是本地有没推的提交：

```powershell
git push origin main
```

## 如果连 `refs/heads/main` 也没了

那本地历史就真没了，但 GitHub 上有。重新克隆最省事：

```powershell
cd D:\WS\Study
Rename-Item dsh-plugin dsh-plugin.old
git clone https://github.com/sunnycreate/dsh-plugin-stand-reminder.git dsh-plugin
# 确认新克隆的 tests 全绿、client/client.js 和旧的一致后，再删 dsh-plugin.old
```

⚠️ 注意：profile 里装的是 `link:D:/WS/Study/dsh-plugin`，**不要**在插件被 link 的情况下
删掉这个目录，否则插件会立刻失效。要么先切回 GitHub 安装，要么原地恢复（上面的 1–3 步）。

## 这次是怎么恢复的

实际上就是这样恢复的，并且已经验证过：

```
local HEAD  : 10c32605558d783a42d314c753d63f2b0ee26008
origin/main : 10c32605558d783a42d314c753d63f2b0ee26008
ref file    : 10c32605558d783a42d314c753d63f2b0ee26008
GitHub      : 10c32605558d783a42d314c753d63f2b0ee26008
```

`git fsck` 干净（只有 rebase 留下的 dangling commit，属正常），40 个测试全绿。
