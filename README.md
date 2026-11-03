# 卡片待办清单

移动端优先的卡片式待办清单，纯静态实现（HTML + CSS + 原生 JS），无构建步骤、无后端依赖。已配置 PWA，可在手机上「添加到主屏幕」当作原生 App 使用。

## 在线访问

- **Demo**：https://wcmsues.github.io/TodoListV1
- **仓库地址**：https://github.com/wcmsues/TodoListV1


## 功能

- **列表分组**：自定义名称、颜色、图标，卡片式排列
- **所属列表**：新建 / 编辑待办时从已有列表中选择，不支持临时输入新列表
- **入口分工**：首页右上角 + 只用来新建列表；待办在各列表卡片或列表详情里添加
- **待办卡片**：标题、备注、截止日期、进度、完成状态
- **多个日期**：一条待办可添加多个日期，每个日期独立完成、各自带时间；列表里每个日期占一行，日历里按日期分别出现
- **进度展示**：每个列表显示完成进度，右侧「已完成」页汇总所有完成项
- **排序模式**：长按列表菜单进入排序模式，上下移动调整待办顺序
- **双栏 / 单栏**：主页右上角一键切换卡片布局（手机单栏、平板双栏）
- **设置面板**：管理列表、隐藏空列表开关、加载示例数据、导出 / 导入 JSON、清空全部数据
- **离线可用**：所有数据存于浏览器 `localStorage`，断网也能打开使用

## 本地运行

不要直接双击 `index.html`（`file://` 协议下 manifest 与图标会失效），起一个静态服务器：

```bash
cd TodoListV1
python3 -m http.server 5173
```

然后打开 http://localhost:5173

其他等价方式：

```bash
npx serve .        # 或
npx http-server -p 5173
```

## 目录结构

```
TodoListV1/
├── index.html            # 页面骨架（视图 / 弹层 / 图标 sprite）
├── css/
│   └── styles.css        # 卡片式 UI 与移动端适配
├── js/
│   └── app.js            # 数据模型、渲染与交互逻辑
├── icons/                # 图标与 PWA 资源
│   ├── icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── favicon-32.png
│   └── apple-touch-icon.png
├── manifest.json         # PWA 清单
├── _headers              # 静态托管的缓存响应头
├── README.md
└── .gitignore
```

## 数据存储

| Key | 说明 |
| --- | --- |
| `todolist.v2` | 全部业务数据（列表、待办） |
| `todolist.v2.ui` | 界面偏好（如栏数） |
| `todolist.v1` | 旧版本数据，首次加载时自动迁移 |

数据仅保存在当前浏览器，换设备 / 清理站点数据会丢失。请定期在「设置 → 导出 JSON」备份，需要时用「导入 JSON」恢复（支持追加或覆盖）。

## 部署

推送到 `main` 分支后 GitHub Pages 会自动重新发布：

```bash
git add -A
git commit -m "描述你的改动"
git push
```

## 开发说明

- 无第三方依赖，改完代码刷新页面即可生效；改样式注意清缓存（或 DevTools 勾选 Disable cache）
- 新增列表的配色取自 `js/app.js` 中的 `PALETTE` 常量
- 提交前请确认 `.DS_Store`、`.codebuddy/` 等本地文件不会被纳入版本控制（已在 `.gitignore` 中排除）
