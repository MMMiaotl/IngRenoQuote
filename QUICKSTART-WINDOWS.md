# Windows用户快速入门指南

## 🚀 5分钟快速开始

### 前置要求

确保已安装以下软件：

```powershell
# 检查Node.js版本（需要 >= v14）
node --version

# 检查npm版本
npm --version
```

如果未安装Node.js，请访问：https://nodejs.org/

**推荐**：下载并安装LTS（长期支持）版本。

### 步骤1: Clone项目

```powershell
git clone <repository-url>
cd IngRenoQuote
```

### 步骤2: 安装依赖

```powershell
# 直接安装
npm install
```

**注意**：首次安装会下载Chromium（~170MB），请耐心等待。

**如果下载失败**，使用国内镜像：
```powershell
$env:PUPPETEER_DOWNLOAD_HOST="https://registry.npmmirror.com/-/binary/chromium-browser-snapshots"
npm install
```

### 步骤3: 启动服务器

```powershell
npm start
```

浏览器会自动打开 http://localhost:3000

### 步骤4: 开始使用

1. **报价页面**: http://localhost:3000/
2. **数据管理**: http://localhost:3000/admin.html

## 🛠️ 开发模式

如果需要修改代码并实时查看效果：

```powershell
npm run dev
```

服务器会在代码修改后自动重启。

## 📦 构建可执行文件

```powershell
# 构建Windows版本
npm run build

# 构建Mac版本（在Windows上也可以！）
npm run build:mac

# 构建所有版本
npm run build:all
```

构建产物在 `dist\` 目录中。

## 🐛 常见问题

### 问题1: PowerShell执行策略限制

如果遇到 "无法加载文件，因为在此系统上禁止运行脚本" 错误：

```powershell
# 以管理员身份运行PowerShell，然后执行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 或临时允许（只对当前会话有效）：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### 问题2: npm install失败

```powershell
# 清除缓存
npm cache clean --force

# 删除旧文件
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 重新安装
npm install
```

### 问题3: Puppeteer下载失败

**方法1**：使用国内镜像
```powershell
$env:PUPPETEER_DOWNLOAD_HOST="https://registry.npmmirror.com/-/binary/chromium-browser-snapshots"
npm install puppeteer
```

**方法2**：手动安装Chromium
```powershell
npx puppeteer browsers install chrome
```

**方法3**：跳过Puppeteer下载（稍后手动安装）
```powershell
$env:PUPPETEER_SKIP_DOWNLOAD="true"
npm install
```

### 问题4: 端口3000被占用

```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（替换<PID>为实际的进程ID）
taskkill /PID <PID> /F
```

### 问题5: 防病毒软件阻止

某些防病毒软件可能会阻止Node.js或Puppeteer：

1. 将项目目录添加到防病毒软件的白名单
2. 将 `node.exe` 添加到信任程序列表
3. 将 `QuoteGenerator.exe` 添加到信任程序列表

推荐防病毒软件白名单路径：
- `C:\workspace_git\IngRenoQuote\`
- `C:\Program Files\nodejs\`
- `%APPDATA%\npm\`

### 问题6: 中文路径问题

如果项目路径包含中文字符，可能导致问题：

❌ 错误路径：`C:\用户\张三\项目\IngRenoQuote`
✅ 正确路径：`C:\projects\IngRenoQuote` 或 `C:\workspace_git\IngRenoQuote`

### 问题7: 权限不足

如果遇到权限错误：

1. **以管理员身份运行PowerShell或CMD**
2. 或修改项目目录权限：
   - 右键项目文件夹 → 属性 → 安全
   - 确保当前用户有"完全控制"权限

## 💡 提示

### 使用国内镜像加速

**永久设置npm镜像**：
```powershell
npm config set registry https://registry.npmmirror.com
```

**永久设置Puppeteer镜像**：
```powershell
npm config set puppeteer_download_host https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
```

**查看当前配置**：
```powershell
npm config list
```

### 推荐工具

**PowerShell 7+**（更强大的终端）：
```powershell
winget install Microsoft.PowerShell
```

**Windows Terminal**（更好的终端体验）：
```powershell
winget install Microsoft.WindowsTerminal
```

**Git for Windows**（如果还没安装）：
```powershell
winget install Git.Git
```

### 推荐IDE设置

**VS Code**（推荐）：
- 下载：https://code.visualstudio.com/
- 安装扩展：ESLint, Prettier, GitLens
- 设置自动格式化

**WebStorm**：
- 自带Node.js支持
- 启用代码检查

## 📚 更多信息

- **完整文档**: 查看 [README.md](README.md)
- **分发指南**: 查看 [DISTRIBUTION.md](DISTRIBUTION.md)
- **Windows使用说明**: 查看 [dist/使用说明.txt](dist/使用说明.txt)

## 🆘 需要帮助？

1. 查看[常见问题](#常见问题)部分
2. 查看完整的 [README.md](README.md#故障排除)
3. 提交Issue（附带系统信息和错误日志）

---

**系统信息**（提交Issue时请附上）：
```powershell
# 查看Windows版本
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# 查看Node.js版本
node --version

# 查看npm版本
npm --version

# 查看PowerShell版本
$PSVersionTable.PSVersion
```

## 🎯 快速命令参考

```powershell
# 开发相关
npm start              # 启动服务器
npm run dev            # 开发模式（自动重启）
npm run build          # 构建Windows可执行文件

# 故障排除
npm cache clean --force                 # 清除npm缓存
npm install                             # 安装/更新依赖
tasklist | findstr node                 # 查找Node进程
taskkill /IM node.exe /F               # 强制结束所有Node进程

# 端口管理
netstat -ano | findstr :3000           # 查找占用3000端口的进程
taskkill /PID <PID> /F                 # 结束特定进程
```

