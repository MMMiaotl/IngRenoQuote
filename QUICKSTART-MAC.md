# Mac用户快速入门指南

## 🚀 5分钟快速开始

### 前置要求

确保已安装以下软件：

```bash
# 检查Node.js版本（需要 >= v14）
node --version

# 检查npm版本
npm --version
```

如果未安装Node.js，请访问：https://nodejs.org/

推荐安装方式（使用Homebrew）：
```bash
# 安装Homebrew（如果还没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Node.js
brew install node
```

### 步骤1: Clone项目

```bash
git clone <repository-url>
cd IngRenoQuote
```

### 步骤2: 安装依赖

```bash
# 如果网络慢，先设置镜像
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots

# 安装依赖
npm install
```

**注意**：首次安装会下载Chromium（~170MB），请耐心等待。

### 步骤3: 启动服务器

```bash
npm start
```

浏览器会自动打开 http://localhost:3000

### 步骤4: 开始使用

1. **报价页面**: http://localhost:3000/
2. **数据管理**: http://localhost:3000/admin.html

## 🛠️ 开发模式

如果需要修改代码并实时查看效果：

```bash
npm run dev
```

服务器会在代码修改后自动重启。

## 📦 构建可执行文件

```bash
# 构建Mac版本
npm run build:mac

# 构建Windows版本（在Mac上也可以！）
npm run build

# 构建所有版本
npm run build:all
```

构建产物在 `dist/` 目录中。

## 🐛 常见问题

### 问题1: 权限被拒绝

```bash
sudo chmod +x QuoteGenerator-mac
sudo chmod +x dist/start-mac.sh
```

### 问题2: "无法验证开发者"

**方法1**（推荐）：
- 右键点击 `QuoteGenerator-mac`
- 选择"打开"
- 点击"打开"确认

**方法2**：
```bash
xattr -d com.apple.quarantine QuoteGenerator-mac
```

### 问题3: Puppeteer下载失败

```bash
# 使用国内镜像
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
npm install puppeteer

# 或手动安装Chromium
npx puppeteer browsers install chrome
```

### 问题4: 端口3000被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 结束进程
kill -9 <PID>
```

### 问题5: Apple Silicon (M1/M2/M3) 特定问题

如果使用Intel版本的可执行文件：

```bash
# 确保Rosetta 2已安装
softwareupdate --install-rosetta

# 检查文件类型
file QuoteGenerator-mac
# 应该显示: Mach-O 64-bit executable x86_64
```

## 💡 提示

### 使用国内镜像加速

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# npm镜像
export NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

# Puppeteer镜像
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
```

然后重新加载配置：
```bash
source ~/.zshrc  # 如果使用zsh
# 或
source ~/.bashrc  # 如果使用bash
```

### 推荐IDE设置

**VS Code**：
- 安装扩展：ESLint, Prettier
- 设置自动格式化

**WebStorm**：
- 自带Node.js支持
- 启用代码检查

## 📚 更多信息

- **完整文档**: 查看 [README.md](README.md)
- **分发指南**: 查看 [DISTRIBUTION.md](DISTRIBUTION.md)
- **Mac使用说明**: 查看 [dist/README-MAC.md](dist/README-MAC.md)

## 🆘 需要帮助？

1. 查看[故障排除](#常见问题)部分
2. 查看完整的 [README.md](README.md#故障排除)
3. 提交Issue（附带系统信息和错误日志）

---

**系统信息**（提交Issue时请附上）：
```bash
# 查看系统版本
sw_vers

# 查看Node.js版本
node --version

# 查看npm版本
npm --version

# 查看CPU架构
uname -m
```

