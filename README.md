# 久坐提醒 · Stand-up Reminder

一个面向久坐电脑前人群的 DeepSeek Harness 插件：按你设定的间隔提醒你站起来走动一下。
提醒文字内置了一整套（可直接用），也支持完全自定义。

A DeepSeek Harness plugin for people who sit at a desk all day: it nudges you to get up and
move on an interval you choose, with built-in wording or entirely your own.

---

## 功能

| | |
|---|---|
| **间隔可设置** | 15 / 30 / 45 / 60 / 90 / 120 分钟一键切换，也可以填 1–480 之间的任意分钟数。 |
| **提醒文字** | 内置 19 条中/英文文案，按「走动 / 眼睛 / 姿势 / 习惯」轮播，且不会连续重复同一条。 |
| **自定义文案** | 可添加最多 50 条自己的文字，并选择只用自己的、只用内置的、或两者混合轮播。 |
| **提醒形式** | 右下角浮出提醒卡片（带「我起来了 / 推迟 / 先不管」按钮）＋ 右下角常驻倒计时胶囊。 |
| **系统通知** | 可选，窗口最小化或切到后台也能收到（浏览器通知，需要授权）。 |
| **提示音** | 可选，用 Web Audio 合成，不加载任何音频文件。 |
| **自动关闭** | 可选，提醒出现 N 秒后自动消失，不打断你的思路。 |
| **屏幕常亮** | 可选，提醒期间请求 Screen Wake Lock，避免锁屏吞掉提醒。 |
| **暂停与统计** | 可暂停一整轮；记录今日起身次数与推迟次数，按本地日期自动清零。 |
| **隐私** | 纯前端，设置只存在本机浏览器的 localStorage 里，不联网、不上报。 |

## 内置提醒文字示例

中文（节选）：

- 坐满一段时间了，站起来走两步吧，哪怕只到窗边打个转。
- 起来动一动：接杯水，顺便把肩和脖子转一圈。
- 让眼睛下班二十秒，看看六米外的东西。
- 肩膀是不是又耸起来了？站起来放松，再坐回去。
- 注意坐姿：别跷腿，双脚放平。再站起来动一动。

英文（excerpt）：`You have been sitting a while — stand up and take a few steps.` /
`Give your eyes twenty seconds off — look at something twenty feet away.` /
`Shoulders creeping up again? Stand, let them drop, then sit back down.`

完整文案见 [`src/core/messages.js`](src/core/messages.js)。

## 安装

让 Agent 调用 `plugin_manager`（`install_bundle`），目标填空仓库地址：

```
install_bundle  target = github:sunnycreate/dsh-plugin-stand-reminder
```

也可以直接在 profile 目录手工操作：

```powershell
cd $env:DSH_PROFILE_DIR
npm install "github:sunnycreate/dsh-plugin-stand-reminder"
```

装完还要把包名记进 profile 的组合包清单（`install_bundle` 会自动做）：

```jsonc
// $env:DSH_PROFILE_DIR/package.json
"dependencies": {
  "dsh-plugin-stand-reminder": "github:sunnycreate/dsh-plugin-stand-reminder"
},
"dsh": { "profile": { "bundles": ["...", "dsh-plugin-stand-reminder"] } }
```

几点经验：

- **安装过程不跑任何构建脚本。** `client/client.js` 和 `lib/index.js` 都是提交进仓库的构建产物，
  仓库里也没有 `prepare` / `postinstall`，所以不会触发 pnpm 的 `allowBuilds` 构建授权弹窗。
  代价是改完源码要自己跑 `npm run build` 并提交产物。
- **同一个 `.tgz` 路径重复安装时 pnpm 会说 `Already up to date`** 而不重新抓取；
  GitHub 地址则被解析成一个**固定 commit**，所以 push 之后必须重新安装才会拿到新版本。
- **从 `link:` 切换到 GitHub 安装前，必须先删掉 `node_modules` 里那个目录联接**，
  否则 pnpm 会在改名时失败：

  ```
  [ERR_PNPM_EPERM] operation not permitted, rename
  '...\node_modules\dsh-plugin-stand-reminder_tmp_40200_1' -> '...\node_modules\dsh-plugin-stand-reminder'
  ```

  这不是权限问题——Windows 不允许用改名覆盖一个已存在的 junction。断开链接不会动到源码：

  ```powershell
  cmd /c "rmdir `"$env:DSH_PROFILE_DIR\node_modules\dsh-plugin-stand-reminder`""
  ```

- **`install_bundle` 会校验 `cordis.patch.yml` 能否解析**；失败时它把 `package.json`、
  `pnpm-lock.yaml` 和 `node_modules` 一起回滚（插件会变成未安装状态）。YAML 注释必须是 `#`，
  不能写 `//`——`tests/package.test.js` 专门守住这条。

装完不需要重启：插件页/管理服务会热加载，`shell.overlay` 与 `settings.section`
两个条目会立即出现在运行中的会话里。

## 使用

1. 打开 **设置 → 久坐提醒**。
2. 选一个间隔（默认 20 分钟），保持「启用久坐提醒」打开。
3. 需要自己的话术时，在「我的提醒文字」里添加，再选「只用我写的文案」或「内置 + 我写的」。
4. 到点后右下角会浮出提醒卡片：

   | 按钮 | 作用 |
   |---|---|
   | 我起来了 | 记一次起身，倒计时重新开始 |
   | 5 分钟后再说 | 推迟，不计入起身次数 |
   | 先不管 | 关掉这一条提醒，下一个间隔照常计时 |

右下角的小胶囊一直显示距离下次提醒还有多久，点击它可以跳到设置页。

## 项目结构

```
src/core/         纯逻辑，无 DOM、无框架（可被 node --test 直接测）
  messages.js     内置文案
  settings.js     设置与运行状态的结构定义、校验、持久化键
  engine.js       计时、到点触发、推迟、暂停、每日清零
src/client/       浏览器侧
  index.jsx       Slot 注册与生命周期（shell.overlay + settings.section）
  notice.js       提醒卡片与倒计时胶囊（原生 DOM，避免逐秒 React 重渲染）
  settings.jsx    设置页（React）
  locale.js       中英文案与 language store
  storage.js      localStorage 适配器（失败即降级到内存）
  notify.js       系统通知 + 提示音
  wake-lock.js    Screen Wake Lock
src/host/index.js Host 半边（有意为空：提醒完全是前端行为）
scripts/build.mjs 构建：ESM host + __ModuleLoader__ 格式的 client bundle
tests/            37 个单元/集成测试
```

## 开发

```powershell
npm install        # 安装 esbuild / jsdom / react（prepare 会自动构建一次）
npm run build      # 重新生成 lib/index.js 与 client/client.js
npm test           # 40 个测试
npm run check      # test + build
```

测试分五层：

| 文件 | 覆盖 |
|---|---|
| `engine.test.js` | 调度、到点、推迟、暂停、跨天清零、存储失败降级 |
| `locale.test.js` | 语言探测（`{ active }` 快照）、插值、订阅、中英键对齐 |
| `bundle.test.js` | 按宿主协议真实加载构建产物，驱动提醒卡片与倒计时 |
| `render.test.js` | 用 jsdom + 真 React 渲染设置页，断言页面非空、无 React 报错、控件能改设置 |
| `package.test.js` | `cordis.patch.yml` 是合法 YAML、清单声明的路径都存在 |

`client/client.js` 是构建产物，但**必须一起提交**：DSH 按 package.json 的
`exports`/`dsh.client` 直接读取它，不会在安装时为你构建。

### 写这个插件时踩到的坑（给后来者）

1. **`ctx.slots.register(options, component)` 的第二个参数是 React 组件本身，不是返回组件的工厂。**
   写成 `() => SettingsPage` 会让宿主把 `SettingsPage` 当元素类型渲染，
   于是它被当成无 props 组件调用，闭包里的 `engine` / `locale` 全变 `undefined`，
   结果是**设置页空白**，而注册类断言全部照常通过。不需要 owner props 时直接传组件：
   `register(options, SettingsSlot)`，其中 `SettingsSlot = () => <SettingsPage engine={...} />`。
2. **YAML 注释只能是 `#`。** `cordis.patch.yml` 里写 `//` 会让安装被拒绝并整包回滚。
3. **语言快照的字段是 `active`，不是 `language` / `id`。** 读错不会报错，只会静默变英文。
4. **不要假设 `globalThis.addEventListener` 存在**，用 `globalThis.window?.addEventListener`。
5. **一个地址只能对应一种安装方式。** `github:owner/repo` 会被解析成固定 commit，
   push 之后必须重新安装；重复用同一个 `.tgz` 路径装，pnpm 会说 `Already up to date`
   而不重新抓取。而且从 `link:` 切换过去之前要先删掉 `node_modules` 里的 junction，
   否则一定 EPERM（见上面「安装」一节）。

### 设计要点

- **时间可注入。** `ReminderEngine` 接收 `now()`，所以「到点触发 / 推迟 / 每日清零 / 跨天」
  这些时序逻辑都能在 Node 里确定性地测，不需要等待真实时间。
- **页面重载不会立刻弹提醒。** 只有「本次会话里真正到点」的 deadline 才会触发；
  刚打开的页面会从当前时刻重新计时。
- **错过的时间点不会消失。** 如果页面在后台待过了 deadline，回到前台后的第一次 tick 就会提醒。
- **提醒文字在出现时定格。** 一条提醒的措辞在它消失前不会变，避免重渲染时措辞跳变。
- **存储失败不影响提醒。** localStorage 被禁用时自动降级为内存态，插件照常工作。
- **提醒卡片与倒计时用原生 DOM。** 逐秒刷新的倒计时如果走 React，会每秒重渲染整棵子树；
  这里两种状态都在同一个 `shell.overlay` 条目里用原生 DOM 维护，只有设置页是 React。

## 兼容性

- DSH Web / Desktop，`@deepseek-ai/dsh-client-locale` 可用。
- 只使用官方 Slot：`shell.overlay`（新增条目，不替换任何内置 UI）与 `settings.section`。
- 不注册 Host 服务、工具或后台任务；卸载插件时定时器、DOM、监听器都会一并清理。

## License

MIT
