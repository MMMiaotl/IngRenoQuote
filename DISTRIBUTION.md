# 装修项目报价器 - 分发说明

## 📦 构建和分发流程

### 1. 构建可执行文件

#### Windows版本
```bash
npm run build
```
生成：`dist/QuoteGenerator.exe`

#### Mac版本（兼容Intel和Apple Silicon）
```bash
npm run build:mac
```
生成：`dist/QuoteGenerator-mac`

**注意**：Intel版本可以在Apple Silicon Mac上通过Rosetta 2运行，因此只需构建一个Mac版本。

#### 所有平台
```bash
npm run build:all
```
生成：Windows和Mac两个版本

### 2. 分发包内容

#### 必需文件和目录

```
dist/
├── QuoteGenerator.exe              # Windows可执行文件
├── QuoteGenerator-mac              # Mac可执行文件（Intel和Apple Silicon通用）
├── start.bat                       # Windows启动脚本
├── start-mac.sh                    # Mac启动脚本
├── 使用说明.txt                     # Windows使用说明
├── README-MAC.md                   # Mac使用说明
├── data/                           # 数据目录
│   ├── price_data.xlsx             # 价格数据
│   └── price_data_backup.xlsx      # 数据备份（自动生成）
├── public/                         # 网页资源
│   ├── index.html
│   ├── script.js
│   ├── admin.html
│   └── admin.js
└── puppeteer/                      # Chrome浏览器（PDF生成）
    └── .local-chromium/
```

### 3. 分发前检查清单

- [ ] 已运行 `npm run build:all` 成功构建所有平台
- [ ] 确认 `dist/data/price_data.xlsx` 包含最新数据
- [ ] 确认 `dist/public/` 包含所有网页文件
- [ ] 确认 `dist/puppeteer/` 包含Chrome浏览器
- [ ] 测试Windows版本可以正常运行
- [ ] 文档已更新到最新版本

### 4. 创建分发包

#### 为Windows用户
```bash
# 创建Windows分发包
zip -r QuoteGenerator-Windows-v2.4.0.zip dist/QuoteGenerator.exe dist/start.bat dist/使用说明.txt dist/data/ dist/public/ dist/puppeteer/
```

或使用PowerShell：
```powershell
# 创建包含所有必需文件的Windows分发包
Compress-Archive -Path "dist\QuoteGenerator.exe","dist\start.bat","dist\使用说明.txt","dist\data","dist\public","dist\puppeteer" -DestinationPath "QuoteGenerator-Windows-v2.4.0.zip"
```

#### 为Mac用户（Intel和Apple Silicon通用）
```bash
zip -r QuoteGenerator-Mac-v2.4.0.zip dist/QuoteGenerator-mac dist/start-mac.sh dist/README-MAC.md dist/data/ dist/public/ dist/puppeteer/
```

**注意**：同一个可执行文件兼容所有Mac系统（Intel通过原生运行，Apple Silicon通过Rosetta 2运行）

#### 完整包（所有平台）
```bash
zip -r QuoteGenerator-All-Platforms-v2.4.0.zip dist/
```

### 5. 分发渠道

推荐的分发方式：
1. **内部文件服务器** - 最安全
2. **OneDrive/Google Drive** - 方便共享
3. **压缩文件** - 通过邮件发送（注意大小限制）

### 6. 用户安装说明

#### Windows用户
1. 解压缩文件到任意目录
2. 双击 `QuoteGenerator.exe` 或 `start.bat` 启动
3. 浏览器会自动打开
4. 详细说明请阅读 `使用说明.txt`

#### Mac用户
1. 解压缩文件到任意目录
2. 打开终端，进入解压目录
3. 授予执行权限：
   ```bash
   chmod +x QuoteGenerator-mac
   chmod +x start-mac.sh
   ```
4. 双击 `start-mac.sh` 或在终端运行可执行文件
5. 首次运行可能需要在系统设置中允许运行
6. **Apple Silicon用户**：首次运行会提示安装Rosetta 2（如未安装），点击安装即可
7. 详细说明请阅读 `dist/README-MAC.md`

### 7. 常见问题

#### Windows
- **防病毒软件阻止**：添加到信任列表
- **端口被占用**：关闭占用3000端口的程序

#### Mac
- **无法验证开发者**：系统设置 → 安全性与隐私 → 仍要打开
- **权限问题**：确保已运行 `chmod +x`
- **Apple Silicon Mac (M1/M2/M3)**：首次运行会提示安装Rosetta 2，点击安装即可
- **性能说明**：Intel Mac原生运行，Apple Silicon通过Rosetta 2运行（性能略有损失但完全可用）

### 8. 更新现有安装

当发布新版本时：
1. 备份用户的 `data/price_data.xlsx` 文件
2. 用新版本替换可执行文件和 `public/` 目录
3. 恢复用户的数据文件
4. 提醒用户查看更新日志

### 9. 版本命名规范

格式：`QuoteGenerator-[Platform]-v[Version].zip`

示例：
- `QuoteGenerator-Windows-v2.4.0.zip`
- `QuoteGenerator-Mac-v2.4.0.zip`（兼容Intel和Apple Silicon）
- `QuoteGenerator-All-Platforms-v2.4.0.zip`

### 10. 技术支持

提供给用户的支持信息：
- 程序访问地址：http://localhost:3000
- 管理页面：http://localhost:3000/admin.html
- 数据文件位置：`data/price_data.xlsx`
- 日志信息：启动时的命令行窗口

---

**注意**：分发前请确保删除任何敏感信息或测试数据。

