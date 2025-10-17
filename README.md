# 装修项目报价器

一个专为内部使用设计的装修项目报价单生成器，支持Excel价格数据导入和PDF报价单生成。

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

> 🚀 **快速开始**：
> - **Mac用户**：查看 [Mac快速入门指南](QUICKSTART-MAC.md)
> - **Windows用户**：查看 [Windows快速入门指南](QUICKSTART-WINDOWS.md)

## 📑 目录

- [功能特点](#功能特点)
- [系统要求](#系统要求)
- [快速开始](#快速开始)
  - [Clone项目](#1-clone-项目)
  - [安装依赖](#2-安装依赖)
  - [启动服务器](#3-启动开发服务器)
- [生产环境部署](#生产环境部署)
- [使用说明](#使用说明)
- [故障排除](#故障排除)
  - [Mac特定问题](#mac特定问题)
  - [Windows特定问题](#windows特定问题)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)
- [更新日志](#更新日志)

## 功能特点

- 🏠 **项目信息管理** - 完整的客户和项目信息录入
- 📊 **价格数据管理** - 支持Excel文件导入价格数据
- 🛠️ **项目选择** - 按分类选择装修项目
- 💰 **自动计算** - 实时计算项目总价
- 📄 **PDF生成** - 生成专业的PDF报价单
- 👀 **预览功能** - 生成前可预览报价单内容

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + Bootstrap 5 + JavaScript
- **PDF生成**: Puppeteer
- **Excel处理**: ExcelJS (安全版本)
- **文件上传**: Multer 2.x
- **样式**: Bootstrap + Font Awesome

## 系统要求

- **Node.js**: v14.0.0 或更高版本
- **npm**: v6.0.0 或更高版本
- **操作系统**: 
  - Windows 10/11 (x64)
  - macOS 10.15+ (Intel 或 Apple Silicon)
  - Linux (通过源码运行)

## 快速开始

### 1. Clone 项目

```bash
git clone <repository-url>
cd IngRenoQuote
```

### 2. 安装依赖

**所有平台通用**：
```bash
npm install
```

**Mac用户特别注意**：
- 首次安装会自动下载Puppeteer的Chromium浏览器（~170MB）
- 如果网络较慢，可以设置国内镜像：
  ```bash
  export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
  npm install
  ```

**Windows用户特别注意**：
- 如遇到权限问题，请以管理员身份运行PowerShell或CMD
- 如果安装失败，尝试清除npm缓存：
  ```bash
  npm cache clean --force
  npm install
  ```

### 3. 启动开发服务器

```bash
npm start
```

开发模式（自动重启）：
```bash
npm run dev
```

### 4. 访问应用

浏览器会自动打开，或手动访问：
- **本地访问**: http://localhost:3000
- **报价页面**: http://localhost:3000/
- **数据管理**: http://localhost:3000/admin.html

## 生产环境部署

### 打包为可执行文件

#### 在Windows上构建

**构建Windows版本**：
```bash
npm run build
```
输出：`dist/QuoteGenerator.exe`

**构建Mac Intel版本**（可以在Windows上构建）：
```bash
npm run build:mac
```
输出：`dist/QuoteGenerator-mac`

**注意**：Windows上无法构建Mac ARM版本，如需ARM版本请使用方案2或3。

#### 在Mac上构建

**构建所有版本**（推荐）：
```bash
# 在Mac上可以构建所有平台的版本
npm run build        # Windows版本
npm run build:mac    # Mac Intel版本
npm run build:all    # 所有版本
```

**Mac用户的优势**：
- ✅ 可以在Mac上构建Windows版本
- ✅ 可以在Mac上构建Mac Intel版本
- ✅ 可以原生测试Mac版本

#### 跨平台构建说明

| 构建平台 | 可构建目标 | 说明 |
|---------|-----------|------|
| Windows | Windows ✅<br>Mac Intel ✅<br>Mac ARM ❌ | 无法交叉编译ARM |
| Mac Intel | Windows ✅<br>Mac Intel ✅<br>Mac ARM ⚠️ | ARM理论可行但未测试 |
| Mac ARM | Windows ✅<br>Mac Intel ✅<br>Mac ARM ✅ | 可构建所有平台 |

### Mac版本兼容性说明

我们提供的 `QuoteGenerator-mac` (Intel版本) 可以在所有Mac上运行：
- **Intel Mac**: 原生运行，性能最佳
- **Apple Silicon Mac (M1/M2/M3)**: 通过Rosetta 2运行
  - 首次运行会提示安装Rosetta 2
  - 性能略有损失（约10-15%）但完全可用

### 分发包准备

#### Windows用户
1. 确保 `dist/` 目录包含以下文件：
   ```
   QuoteGenerator.exe
   start.bat
   使用说明.txt
   data/
   public/
   puppeteer/
   ```
2. 打包为ZIP：
   ```powershell
   Compress-Archive -Path "dist\*" -DestinationPath "QuoteGenerator-Windows-v2.4.0.zip"
   ```

#### Mac用户
1. 确保 `dist/` 目录包含以下文件：
   ```
   QuoteGenerator-mac
   start-mac.sh
   README-MAC.md
   data/
   public/
   puppeteer/
   ```
2. 打包为ZIP：
   ```bash
   cd dist
   zip -r ../QuoteGenerator-Mac-v2.4.0.zip QuoteGenerator-mac start-mac.sh README-MAC.md data/ public/ puppeteer/
   ```

详细分发说明请参考 `DISTRIBUTION.md`

## 使用说明

### 1. 项目信息填写
- 填写必填字段：项目名称、客户姓名、联系电话、房屋面积
- 可选字段：装修风格、预计工期

### 2. 价格数据管理
- **上传Excel文件**：点击上传区域选择Excel文件（.xlsx格式）
- **使用默认数据**：点击"使用默认价格数据"按钮

### 3. 项目选择
- 选择分类（如：基础工程、水电工程等）
- 选择具体项目
- 调整数量
- 可添加多个项目

### 4. 生成报价单
- **预览**：点击"预览报价单"查看格式
- **生成PDF**：点击"生成报价单PDF"下载文件

## Excel数据格式

Excel文件应包含以下列：
- `category`: 分类名称
- `item`: 项目名称
- `unit`: 单位
- `price`: 单价
- `description`: 描述（可选）

示例：
```
category    | item      | unit | price | description
基础工程    | 拆墙      | 平方米 | 50   | 拆除墙体
水电工程    | 水电改造  | 平方米 | 120  | 水电线路改造
```

## 文件结构

```
IngRenoQuote/
├── server.js              # 服务器主文件
├── package.json           # 项目配置
├── public/                # 前端文件
│   ├── index.html        # 主页面
│   └── script.js         # 前端逻辑
├── data/                 # 数据文件
│   └── price_data.xlsx   # 价格数据文件
└── README.md             # 说明文档
```

## API接口

### GET /api/prices
获取所有价格数据

### GET /api/categories
获取所有分类

### GET /api/items/:category
获取指定分类的项目列表

### POST /api/calculate
计算报价
```json
{
  "items": [
    {
      "name": "拆墙",
      "quantity": 10,
      "unit": "平方米"
    }
  ],
  "projectInfo": {
    "projectName": "测试项目",
    "customerName": "张三",
    "phone": "13800138000",
    "area": 100
  }
}
```

### POST /api/generate-pdf
生成PDF报价单

### POST /api/upload-excel
上传Excel价格文件

## 故障排除

### 开发环境常见问题

#### 所有平台

**问题1: npm install 失败**
```bash
# 清除缓存后重试
npm cache clean --force
rm -rf node_modules package-lock.json  # Mac/Linux
# 或
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows PowerShell
npm install
```

**问题2: Puppeteer下载Chromium失败**
```bash
# Mac/Linux - 使用国内镜像
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
npm install puppeteer

# Windows PowerShell
$env:PUPPETEER_DOWNLOAD_HOST="https://registry.npmmirror.com/-/binary/chromium-browser-snapshots"
npm install puppeteer
```

**问题3: 端口3000被占用**
```bash
# 查找占用端口的进程
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Mac特定问题

**问题1: 权限被拒绝**
```bash
# 授予执行权限
chmod +x QuoteGenerator-mac
chmod +x start-mac.sh
```

**问题2: "无法验证开发者"错误**
```bash
# 方法1: 右键点击 → 打开
# 方法2: 系统设置 → 安全性与隐私 → 仍要打开

# 方法3: 移除隔离属性
xattr -d com.apple.quarantine QuoteGenerator-mac
```

**问题3: Apple Silicon Mac上性能问题**
```bash
# 检查是否通过Rosetta 2运行
file QuoteGenerator-mac
# 输出应包含 "Mach-O 64-bit executable x86_64"

# 确认Rosetta 2已安装
softwareupdate --install-rosetta
```

**问题4: Chromium启动失败（Apple Silicon）**
```bash
# 重新安装Puppeteer
npm rebuild puppeteer

# 或者手动安装Chromium
npx puppeteer browsers install chrome
```

#### Windows特定问题

**问题1: PowerShell执行策略限制**
```powershell
# 临时允许脚本执行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 然后运行
npm start
```

**问题2: 防病毒软件阻止**
- 将项目目录添加到防病毒软件的白名单
- 将 `QuoteGenerator.exe` 添加到信任列表

**问题3: 中文路径问题**
- 确保项目路径不包含中文字符
- 推荐路径: `C:\projects\IngRenoQuote`

### 生产环境（可执行文件）问题

**问题1: PDF生成失败**
- 确保 `puppeteer/` 目录和Chromium文件完整
- 检查磁盘空间是否充足（至少500MB）

**问题2: 数据文件找不到**
- 确保 `data/price_data.xlsx` 存在
- 检查文件权限是否正确

**问题3: 浏览器不自动打开**
- 手动访问: http://localhost:3000
- 检查是否有防火墙阻止

### 获取帮助

如果以上方法都无法解决问题：

1. **查看日志**：
   - 开发模式：查看终端输出
   - 生产模式：查看浏览器控制台（F12）

2. **检查版本**：
   ```bash
   node --version   # 应该 >= v14.0.0
   npm --version    # 应该 >= v6.0.0
   ```

3. **完全重置**：
   ```bash
   # 删除所有依赖和缓存
   rm -rf node_modules package-lock.json dist/
   npm cache clean --force
   
   # 重新安装
   npm install
   npm start
   ```

## 开发指南

### 项目结构

```
IngRenoQuote/
├── server.js                 # Express服务器主文件
├── package.json              # 项目配置和依赖
├── .gitignore               # Git忽略文件
├── README.md                # 项目说明文档
├── DISTRIBUTION.md          # 分发指南
├── public/                  # 前端资源
│   ├── index.html          # 报价主页面
│   ├── script.js           # 报价页面逻辑
│   ├── admin.html          # 数据管理页面
│   └── admin.js            # 数据管理逻辑
├── data/                    # 数据文件
│   ├── price_data.xlsx     # 价格数据（主文件）
│   └── price_data_backup.xlsx  # 自动备份
├── dist/                    # 构建输出目录
│   ├── QuoteGenerator.exe  # Windows可执行文件
│   ├── QuoteGenerator-mac  # Mac可执行文件
│   ├── start.bat           # Windows启动脚本
│   ├── start-mac.sh        # Mac启动脚本
│   ├── README-MAC.md       # Mac使用说明
│   └── 使用说明.txt        # Windows使用说明
└── scripts/                 # 构建脚本
    └── copy-dist-files.js  # 复制文件到dist

```

### 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发和测试**
   ```bash
   npm run dev  # 启动开发服务器（自动重启）
   ```

3. **测试构建**
   ```bash
   npm run build      # 测试Windows构建
   npm run build:mac  # 测试Mac构建
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### 代码规范

- **后端（Node.js）**：
  - 使用ES6+语法
  - 异步操作使用async/await
  - 错误处理使用try-catch
  - 添加详细的注释（中文）

- **前端（JavaScript）**：
  - 使用现代JavaScript特性
  - 保持代码可读性
  - 函数命名使用驼峰命名法
  - 注释使用英文

- **Excel数据**：
  - 使用ExcelJS处理，不要使用xlsx
  - 始终验证数据格式
  - 保持备份机制

### 测试建议

在提交代码前，请测试以下功能：

- [ ] 价格数据加载正常
- [ ] 套餐明细展开/折叠正常
- [ ] 数量修改后计算正确
- [ ] PDF生成成功
- [ ] 数据管理页面保存正常
- [ ] Windows可执行文件运行正常
- [ ] Mac可执行文件运行正常（如有Mac设备）

### 调试技巧

**后端调试**：
```bash
# 查看详细日志
DEBUG=* npm start

# 或在server.js中添加console.log
console.log('调试信息:', variable);
```

**前端调试**：
- 打开浏览器开发者工具（F12）
- 查看Console标签的日志输出
- 使用Network标签检查API请求

**Excel数据调试**：
```javascript
// 在server.js的loadPriceData()中添加
console.log('加载的数据:', priceData);
```

## 安全特性

- ✅ 使用ExcelJS替代有安全漏洞的xlsx库
- ✅ 文件上传大小限制（10MB）
- ✅ 文件类型验证
- ✅ 安全HTTP头设置
- ✅ 输入数据验证
- ✅ 错误处理中间件

## 贡献指南

欢迎提交Issue和Pull Request！

### 提交Issue

- 使用清晰的标题描述问题
- 提供详细的复现步骤
- 包含系统信息（OS、Node版本）
- 附上错误截图或日志

### 提交Pull Request

1. Fork本项目
2. 创建功能分支
3. 提交清晰的commit信息
4. 确保所有测试通过
5. 更新相关文档
6. 提交PR并描述改动内容

### Commit消息规范

使用约定式提交（Conventional Commits）：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: 添加批量导入功能
fix: 修复套餐价格计算错误
docs: 更新Mac安装说明
```

## 更新日志

### v1.0.0
- 初始版本发布
- 基础报价功能
- PDF生成功能
- Excel数据导入功能
