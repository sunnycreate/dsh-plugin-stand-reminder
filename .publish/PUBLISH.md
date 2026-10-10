# 发布到 DSH 插件市场

> 结论先说：**GitHub topic `dsh-plugin` 不是收录机制**，它只是仓库上的一个标签，用于满足收录要求之一。
> 真正让插件出现在 `dshmarket`（插件市场）里的是 PR 到
> [`awesome-dsh-plugin/awesome-dsh-plugin`](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
> 的 `data/plugins/<owner>__<repo>.yml`。市场**完全按需拉取**那个目录，从不调用 GitHub 的 topic 搜索接口。

依据（在市场客户端源码里核对过）：

| 事实 | 出处 |
|---|---|
| 目录从 `https://awesome-dsh-plugin.com/plugins.json` 或 npm 包 `dsh-plugin-catalog` 读取 | `dshmarket/src/regions.ts` 的 `CATALOG_OFFICIAL` / `CATALOG_PACKAGE` |
| 市场不向 GitHub 查询任何东西，GitHub 数据来自目录侧的每日采集 | `dshmarket/src/changelog.ts` 顶部注释 |
| 讨论区挂在同一个仓库 `awesome-dsh-plugin/awesome-dsh-plugin` | `dshmarket/src/client/comments.ts` 的 `GISCUS.repo` |

---

## 当前状态

| 要求 | 状态 |
|---|---|
| `package.json` 声明 `dsh.bundle.patch` | ✅ 已有 |
| 仓库根有 `cordis.patch.yml` | ✅ 已有 |
| 真实可用的代码（非占位/纯 README） | ✅ 40 个测试全绿 |
| 仓库存在满 1 天 | ⏳ 建仓后自然满足（CI 会查创建时间） |
| 仓库加 `dsh-plugin` topic | ⏳ 建仓后手动加 |
| 存在 Git 仓库 | ⏳ 本次已初始化并提交 |
| 已发布到 npm（可选） | 未发布；不影响收录 |
| GitHub Release 预构建 tarball（可选） | 未做；见下方「为什么建议做」 |

## 你要做的三步

### 1. 建仓库并推上去

仓库名必须是 **`dsh-plugin-stand-reminder`**，因为本地的 `package.json` 已经按
`https://github.com/sunnycreate/dsh-plugin-stand-reminder` 写好了 `repository` 字段，
两者不一致会让 npm 关联失败（收录本身不受影响，但换名字要同步改 `package.json`）。

```powershell
# 在 https://github.com/new 建一个空仓库 sunnycreate/dsh-plugin-stand-reminder（不要勾 README）
cd D:\WS\Study\dsh-plugin
git remote add origin https://github.com/sunnycreate/dsh-plugin-stand-reminder.git
git push -u origin main
```

然后在仓库页面右侧 **About → Topics** 添加 `dsh-plugin`。

### 2. 建议补一个预构建 tarball

原因：本仓库的 `client/client.js` 是构建产物，源码安装时需要跑 esbuild。
而 pnpm 11 默认拦截依赖的安装脚本，用户会撞上 `allowBuilds` 构建授权弹窗。
把预构建 tarball 挂到 Release 上，市场会优先给用户这个链接而不是源码构建命令。

```powershell
npm pack                                   # 生成 dsh-plugin-stand-reminder-1.0.0.tgz
# 到 Releases → Draft a new release → 创建 tag v1.0.0 → 上传这个 .tgz
```

资产名**不要带版本号**，否则用 `latest/download/` 的链接在下次发版后必然 404：

```yaml
tarball: https://github.com/sunnycreate/dsh-plugin-stand-reminder/releases/latest/download/dsh-plugin-stand-reminder.tgz
```

拿到 Release 后，把这一行加到 `.publish/data-plugins-entry.yml` 末尾再提交 PR。

（或者发布到 npm 也一样免构建授权：`npm publish`。收录不依赖它，只是便于展示下载量。）

### 3. 提 PR 到 awesome-dsh-plugin

- fork [`awesome-dsh-plugin/awesome-dsh-plugin`](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- 新建文件 **`data/plugins/sunnycreate__dsh-plugin-stand-reminder.yml`**
- 内容 = `.publish/data-plugins-entry.yml`（若做了第 2 步就加上 `tarball:` 行）
- **不要**手工改 `README.md` / `README.zh.md`，它们由脚本生成
- 一个 PR 最多 3 条；这次只有 1 条

文件名规则：`<owner>__<repo>.yml`，owner 与 repo 的大小写要和 GitHub 上完全一致。

## CI 会依次检查

1. 条目数 ≤ 3
2. 从你的仓库 `package.json` 读 `dsh.bundle` —— 只声明 `dsh.client` 会在这里失败
3. 仓库创建已满 1 天
4. `awesome-lint` + 站点构建（双语一致性等）

失败会在 PR 里指出具体改哪一行，在同一分支补提交即可，不用重开 PR。

## 描述写作要求（容易被打回的地方）

- **描述必须与代码相符**，会逐条对着源码核。所以条目里的数字都是实测的：
  19 条文案 = `builtinMessages('zh').length`，分 4 类（move 8 / eyes 3 / posture 4 / habit 4），
  间隔范围 1–480 分钟 = `LIMITS.intervalMinutes`。改动代码后记得同步改描述。
- 不要营销词、不要最高级。
- 含 `: `（冒号加空格）的英文描述必须加引号，否则 YAML 解析失败——条目里已用单引号包住整行。
- 分类选贴合实际功能的：这里选 `notify`（与已有的 `Laplace-bit/dsh-bell-notify` 同类）。
  选得不够准维护者会直接改，不会因此打回。

## 可选：截图

在市场详情页展示 App Store 风格截图。**不要**往收录仓库的 `data/screenshots.json` 加键
（该文件已停止新增），而是在**本仓库** `package.json` 旁放 `screenshots.json`：

```jsonc
// <repo>/screenshots.json
[
  "screenshots/settings.png",
  "screenshots/reminder.png"
]
```

1–8 张，路径相对该文件且不能跳出插件目录；绝对 URL 必须是 GitHub 托管的 https。
不声明也行——市场会从 README 自动抽取图片。

## 参考

- 贡献指南：<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md>
- 已收录的同类条目：`data/plugins/Laplace-bit__dsh-bell-notify.yml`
- GitHub topic（收录要求之一，不是收录机制）：<https://github.com/topics/dsh-plugin>
