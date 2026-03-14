# Cookie Jar - 站点 Cookie 查看器

一个简洁的浏览器扩展，在侧边栏中实时查看当前打开站点的 Cookie 信息。

## 功能特性

- 🔍 **实时获取** - 自动获取当前标签页的 Cookie
- 📝 **标准格式** - 以 `name=value; name2=value2` 格式展示
- 🔄 **自动刷新** - 切换标签页时自动更新 Cookie 信息
- 📋 **一键复制** - 快速复制 Cookie 字符串到剪贴板
- 🎯 **轻量简洁** - 侧边栏展示，不干扰正常浏览

## 安装

```bash
# 克隆仓库
git clone <repository-url>
cd cookiejar

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build
```

## 使用方法

1. **打开侧边栏**
   - 点击扩展图标
   - 或右键页面选择"打开 Cookie Jar"

2. **查看 Cookie**
   - 侧边栏自动显示当前站点的 Cookie
   - 显示 Cookie 数量和具体内容

3. **复制 Cookie**
   - 点击"复制 Cookie"按钮
   - Cookie 字符串已复制到剪贴板

4. **自动刷新**
   - 切换浏览器标签页时自动获取新站点的 Cookie
   - 页面加载完成时自动更新

## 权限说明

本扩展需要以下权限：

- `cookies` - 读取浏览器 Cookie
- `tabs` / `activeTab` - 获取当前标签页信息
- `<all_urls>` - 访问所有站点的 Cookie（安装时会提示）
- `sidePanel` - 使用侧边栏面板

## 开发

```
cookiejar/
├── manifest.json          # 扩展配置
├── background.js          # 后台脚本（标签页监听）
├── sidebar/
│   ├── sidebar.jsx        # 侧边栏主界面
│   └── index.html         # 侧边栏 HTML
├── content.js             # 内容脚本
└── options/               # 选项页面
```

## 浏览器支持

- ✅ Chrome / Edge (Chromium 内核)
- ⚠️ Firefox (需要适配)

## 加载扩展

**Chrome:**
1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist/chrome/` 目录

## 作者

pingfury

## License

MIT
