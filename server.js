const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
    }
    console.error('Server error:', error);
    res.status(500).json({ error: '服务器内部错误' });
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('只支持Excel文件格式'), false);
        }
    }
});

// Price data storage
let priceData = {};

// Load price data from Excel file with inheritance logic
async function loadPriceData() {
    try {
        // Check if Excel file exists
        const excelPath = path.join(__dirname, 'data', 'price_data.xlsx');
        if (fs.existsSync(excelPath)) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(excelPath);
            const worksheet = workbook.worksheets[0];
            
            priceData = [];
            let currentLevel1 = null;
            let currentLevel2 = null;
            
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                
                const level1 = row.getCell(2).value;  // Category-1
                const level2 = row.getCell(4).value;  // Category-2
                const level3 = row.getCell(6).value;  // Category-3
                const price = row.getCell(24).value;  // 含税价格/单位
                const unit = row.getCell(8).value || row.getCell(10).value;
                
                // 继承逻辑：空值继承前一个非空值
                if (level1 && typeof level1 === 'string' && level1.trim() !== '') {
                    currentLevel1 = level1;
                }
                if (level2 && typeof level2 === 'string' && level2.trim() !== '') {
                    currentLevel2 = level2;
                }
                
                // 只处理有项目名称的行
                if (level3 && typeof level3 === 'string' && level3.trim() !== '' && 
                    currentLevel1 && currentLevel2 && price && typeof price === 'number') {
                    const laborPrice = row.getCell(18).value;  // 总人工价格/单位
                    const materialPrice = row.getCell(19).value;  // 总材料价/单位
                    
                    priceData.push({
                        category: currentLevel1,      // 一级分类
                        subCategory: currentLevel2,   // 二级分类
                        item: level3,                // 项目名称
                        unit: unit,                  // 单位
                        price: price,                // 含税价格/单位
                        laborPrice: laborPrice || 0, // 人工价格
                        materialPrice: materialPrice || 0, // 材料价格
                        description: level3          // 描述
                    });
                }
            });
            
            console.log('Price data loaded successfully with inheritance logic');
        } else {
            console.log('Excel file not found, using default data');
            // Load default price data
            await loadDefaultPriceData();
        }
    } catch (error) {
        console.error('Error loading price data:', error);
        await loadDefaultPriceData();
    }
}

// Load default price data from Excel file
async function loadDefaultPriceData() {
    try {
        const defaultExcelPath = path.join(__dirname, 'data', 'price_data.xlsx');
        if (fs.existsSync(defaultExcelPath)) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(defaultExcelPath);
            const worksheet = workbook.worksheets[0];
            
            priceData = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    const headerCell = worksheet.getCell(1, colNumber);
                    const header = headerCell.value;
                    if (header) {
                        rowData[header] = cell.value;
                    }
                });
                
                if (Object.keys(rowData).length > 0) {
                    priceData.push(rowData);
                }
            });
            
            console.log('Default price data loaded successfully from Excel file');
        } else {
            console.error('Default Excel file not found, using empty data');
            priceData = [];
        }
    } catch (error) {
        console.error('Error loading default price data:', error);
        priceData = [];
    }
}

// API Routes

// Get all price data
app.get('/api/prices', (req, res) => {
    res.json(priceData);
});

// Get level 1 categories
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(priceData.map(item => item.category))];
    res.json(categories);
});

// Get level 2 categories by level 1 category
app.get('/api/subcategories/:category', (req, res) => {
    const category = req.params.category;
    const subCategories = [...new Set(priceData
        .filter(item => item.category === category)
        .map(item => item.subCategory)
    )];
    res.json(subCategories);
});

// Get items by level 1 category
app.get('/api/items/:category', (req, res) => {
    const category = req.params.category;
    const items = priceData.filter(item => item.category === category);
    res.json(items);
});

// Get items by level 1 and level 2 categories
app.get('/api/items/:category/:subcategory', (req, res) => {
    const category = req.params.category;
    const subCategory = req.params.subcategory;
    const items = priceData.filter(item => 
        item.category === category && item.subCategory === subCategory
    );
    res.json(items);
});

// Calculate quote
app.post('/api/calculate', (req, res) => {
    try {
        const { items, projectInfo } = req.body;
        
        let totalAmount = 0;
        const calculatedItems = [];
        
        items.forEach(item => {
            const priceItem = priceData.find(p => p.item === item.name);
            if (priceItem) {
                // Calculate subtotal based on individual item's material inclusion
                const includeMaterials = item.includeMaterials !== false; // 默认为true
                const subtotal = includeMaterials ? 
                    priceItem.price * item.quantity : 
                    priceItem.laborPrice * item.quantity;
                totalAmount += subtotal;
                
                calculatedItems.push({
                    ...item,
                    unitPrice: includeMaterials ? priceItem.price : priceItem.laborPrice,
                    subtotal: subtotal,
                    unit: priceItem.unit,
                    description: priceItem.description,
                    laborPrice: priceItem.laborPrice,
                    materialPrice: priceItem.materialPrice,
                    includeMaterials: includeMaterials
                });
            }
        });
        
        const quote = {
            projectInfo,
            items: calculatedItems,
            totalAmount,
            generatedAt: new Date().toISOString()
        };
        
        res.json(quote);
    } catch (error) {
        res.status(500).json({ error: '计算报价时出错' });
    }
});

// Generate PDF
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const quote = req.body;
        
        // Generate HTML content
        const html = generateQuoteHTML(quote);
        
        // Generate PDF using Puppeteer
        let browser;
        let pdfBuffer;
        
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            });
            
            const page = await browser.newPage();
            
            // 设置页面视口
            await page.setViewport({ width: 1200, height: 800 });
            
            // 设置内容并等待
            await page.setContent(html, { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });
            
            // 等待一下确保内容完全加载
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 生成PDF
            pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'
                },
                preferCSSPageSize: true
            });
            
        } catch (puppeteerError) {
            console.error('Puppeteer error:', puppeteerError);
            throw puppeteerError;
        } finally {
            // 确保浏览器被正确关闭
            if (browser) {
                try {
                    await browser.close();
                } catch (closeError) {
                    console.error('Browser close error:', closeError);
                }
            }
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="quote.pdf"');
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: '生成PDF时出错',
            details: error.message 
        });
    }
});

// Note: Excel upload functionality removed - using built-in data only

// Generate HTML for PDF
function generateQuoteHTML(quote) {
    const { projectInfo, items, totalAmount, generatedAt } = quote;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>装修报价单</title>
        <style>
            body {
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #007bff;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #007bff;
                margin: 0;
                font-size: 28px;
            }
            .project-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .project-info h3 {
                margin-top: 0;
                color: #007bff;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
            }
            .info-label {
                font-weight: bold;
                color: #666;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .items-table th,
            .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #007bff;
                color: white;
                font-weight: bold;
            }
            .items-table tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            .total-section {
                text-align: right;
                font-size: 18px;
                font-weight: bold;
                color: #007bff;
                border-top: 2px solid #007bff;
                padding-top: 15px;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>装修项目报价单</h1>
        </div>
        
        <div class="project-info">
            <h3>项目信息</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">客户姓名:</span>
                    <span>${projectInfo.customerName || '未填写'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">联系电话:</span>
                    <span>${projectInfo.phone || '未填写'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">项目地址:</span>
                    <span>${projectInfo.address || '未填写'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">房屋面积:</span>
                    <span>${projectInfo.area ? projectInfo.area + ' 平方米' : '未填写'}</span>
                </div>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>项目名称</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>单价(€)</th>
                    <th>小计(€)</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.unit}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unitPrice.toFixed(2)}</td>
                        <td>${item.subtotal.toFixed(2)}</td>
                        <td>${item.description || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            实际总价: €${totalAmount.toFixed(2)}
        </div>
        
        <div class="footer">
            <p>报价单生成时间: ${new Date(generatedAt).toLocaleString('zh-CN')}</p>
            <p>此报价单仅供参考，最终价格以实际施工为准</p>
        </div>
    </body>
    </html>
    `;
}

// Initialize server
async function startServer() {
    await loadPriceData();
    
    app.listen(PORT, () => {
        console.log(`装修报价器服务器运行在 http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
