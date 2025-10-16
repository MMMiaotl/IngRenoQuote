# 装修项目报价器

一个专为内部使用设计的装修项目报价单生成器，支持Excel价格数据导入和PDF报价单生成。

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

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

开发模式（自动重启）：
```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000

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

## 注意事项

1. 确保已安装Node.js（版本14或以上）
2. PDF生成需要下载Chromium，首次运行可能需要一些时间
3. Excel文件格式必须符合要求的数据结构
4. 建议在内部网络环境中使用

## 故障排除

### 常见问题

1. **PDF生成失败**
   - 检查Puppeteer是否正确安装
   - 确保有足够的磁盘空间

2. **Excel文件无法上传**
   - 检查文件格式是否为.xlsx
   - 确保文件大小不超过限制

3. **价格数据加载失败**
   - 检查Excel文件格式是否正确
   - 查看服务器控制台错误信息

## 安全特性

- ✅ 使用ExcelJS替代有安全漏洞的xlsx库
- ✅ 文件上传大小限制（10MB）
- ✅ 文件类型验证
- ✅ 安全HTTP头设置
- ✅ 输入数据验证
- ✅ 错误处理中间件

## 更新日志

### v1.1.0
- 🔒 修复安全漏洞，使用ExcelJS替代xlsx
- 🚀 升级到Multer 2.x
- 🛡️ 增强安全性和错误处理
- 📊 改进Excel文件验证

### v1.0.0
- 初始版本发布
- 基础报价功能
- PDF生成功能
- Excel数据导入功能
