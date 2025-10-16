# Excel表格分析总结 - 编程参考文档

## 📋 核心数据结构

### 原始Excel表格结构
- **文件**: `data/price_data.xlsx`
- **工作表**: 1个（"价格数据"）
- **总行数**: 136行（包含表头）
- **总列数**: 24列
- **有效项目**: 107个装修项目

## 📊 关键字段映射

| 列位置 | 字段名 | 数据类型 | 说明 | 编程用途 |
|--------|--------|----------|------|----------|
| 2 | Category-1 | String | 主要分类 | 用于分组显示 |
| 4 | Category-2 | String | 子分类 | 二级分类 |
| 6 | Category-3 | String | 项目名称 | 显示名称 |
| 8/10 | 单位 | String | 计量单位 | 数量单位 |
| 24 | 含税价格/单位 | Number | 最终价格 | 计算总价 |

## 🏷️ 三级分类体系

### 一级分类（6个）
```javascript
const level1Categories = [
    '常见项目', '木工', '水管工', '油工', '瓦工', '电工'
];
```

### 二级分类（14个）
```javascript
const level2Categories = {
    '常见项目': ['厕所', '厨房', '浴室', '花园'],
    '木工': ['吊顶', '楼梯', '铺地板', '隔墙'],
    '水管工': ['改水'],
    '油工': ['批灰刷漆'],
    '瓦工': ['砌墙', '贴砖'],
    '电工': ['插座开关改位', '电表箱改造']
};
```

### 三级项目（107个有效项目）
- **常见项目** (51项)
  - 厕所 (11项): 老厕所洁具拆除、瓷砖拆除、水电线路改造等
  - 厨房 (13项): 橱柜拆除、水电改造、瓷砖、吊顶等
  - 浴室 (16项): 洁具拆除、水电改造、瓷砖、防水等
  - 花园 (8项): 地面清理、铺防草布、填沙子找平等

- **木工** (30项)
  - 吊顶 (5项): 拆老吊顶、全新吊顶、双眼皮吊顶等
  - 楼梯 (6项): 翻新踏面、拆除旧楼梯、安装扶手等
  - 铺地板 (7项): 拆旧地板、铺地板、踢脚线等
  - 隔墙 (8项): 木框架、金属框架、安装门等

- **水管工** (4项)
  - 改水 (4项): 上水管拉线、下水管拉线、阀门安装等

- **油工** (10项)
  - 批灰刷漆 (10项): 墙面批灰、天花板批灰、刷漆等

- **瓦工** (9项)
  - 砌墙 (4项): 空气砖墙、外墙等
  - 贴砖 (4项): 标准瓷砖、小砖、大砖等

- **电工** (12项)
  - 插座开关改位 (7项): 开槽拉线、添加线盒、安装面板等
  - 电表箱改造 (4项): 拆老电表箱、新电表箱、单相改三相等

## 💰 价格统计

```javascript
const priceStats = {
    min: 2.40,        // 最低价格（铺底层底板）
    max: 4452.19,     // 最高价格（水电线路改造-格局变动）
    average: 284.38,  // 平均价格
    totalProjects: 107, // 有效项目总数
    totalRows: 120     // 总数据行数
};
```

## 🔧 编程实现建议

### 1. 数据提取函数（支持继承逻辑）
```javascript
function extractProjectDataWithInheritance(worksheet) {
    let currentLevel1 = null;
    let currentLevel2 = null;
    const projects = [];
    
    for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
        const row = worksheet.getRow(rowNum);
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
            projects.push({
                category: currentLevel1,      // 一级分类
                subCategory: currentLevel2,   // 二级分类
                name: level3,                // 项目名称
                unit: unit,                  // 单位
                price: price                 // 含税价格/单位
            });
        }
    }
    
    return projects;
}
```

### 2. 数据验证规则
```javascript
function isValidProject(rowData) {
    return rowData.name && 
           typeof rowData.name === 'string' && 
           rowData.price && 
           typeof rowData.price === 'number' &&
           rowData.price > 0;
}
```

### 3. 三级分类过滤逻辑
```javascript
// 获取一级分类下的所有二级分类
function getSubCategories(level1Category) {
    return [...new Set(projects
        .filter(p => p.category === level1Category)
        .map(p => p.subCategory)
    )];
}

// 获取二级分类下的所有项目
function getProjectsBySubCategory(level1Category, level2Category) {
    return projects.filter(project => 
        project.category === level1Category && 
        project.subCategory === level2Category &&
        isValidProject(project)
    );
}

// 获取一级分类下的所有项目
function getProjectsByCategory(level1Category) {
    return projects.filter(project => 
        project.category === level1Category && 
        isValidProject(project)
    );
}
```

### 4. 价格计算逻辑
```javascript
function calculateTotal(selectedItems) {
    return selectedItems.reduce((total, item) => {
        const project = findProjectByName(item.name);
        return total + (project.price * item.quantity);
    }, 0);
}
```

## 📝 数据转换需求

### 从复杂Excel结构转换为简单报价器格式
```javascript
// 原始Excel行 → 报价器项目对象
{
    category: "木工",           // 从列2
    item: "木框架",            // 从列6  
    unit: "m2",               // 从列8或10
    price: 86.18,             // 从列24
    description: "木框架"      // 可选，从列6生成
}
```

## ⚠️ 注意事项

1. **继承逻辑**: 空的一级/二级分类继承前一个非空值
2. **数据质量**: 107个有效项目，需要过滤空值和无效数据
3. **编码问题**: 中文分类名称需要正确处理URL编码
4. **价格精度**: 价格保留2位小数
5. **单位统一**: 有些项目单位在列8，有些在列10
6. **三级分类**: 支持三级分类体系（一级→二级→项目）
7. **数据验证**: 确保项目名称、价格、单位都有效

## 🚀 集成步骤

1. **修改server.js**: 更新Excel读取逻辑，实现继承逻辑和三级分类
2. **数据验证**: 添加数据有效性检查
3. **分类处理**: 实现三级分类系统（一级→二级→项目）
4. **前端适配**: 更新分类选择器支持三级分类
5. **价格计算**: 使用含税价格进行总价计算
6. **API更新**: 添加二级分类查询接口

## 📋 完整表头结构

| 列 | 字段名 | 说明 |
|----|--------|------|
| 1 | 编号-1 | 主分类编号 |
| 2 | Category-1 | 主要分类 |
| 3 | 编号-2 | 子分类编号 |
| 4 | Category-2 | 子分类 |
| 5 | 编号-3 | 项目编号 |
| 6 | Category-3 | 项目名称 |
| 7 | 人工 | 人工成本 |
| 8 | 单位 | 人工单位 |
| 9 | 材料 | 材料成本 |
| 10 | 单位 | 材料单位 |
| 11 | 总单位价 | 基础总价 |
| 12 | 固定起始费用 | 固定费用 |
| 13 | 额外运费 | 运输费用 |
| 14 | 人工利润率 | 人工利润率 |
| 15 | 运营费用/单位 | 运营成本 |
| 16 | 材料风险利润率 | 材料风险率 |
| 17 | 材料风险费用 | 风险费用 |
| 18 | 总人工价格/单位 | 含利润人工价 |
| 19 | 总材料价/单位 | 含利润材料价 |
| 20 | 总价/单位 | 不含税总价 |
| 21 | 运输系数 | 运输系数 |
| 22 | 开票收入税补贴 | 税补系数 |
| 23 | 税率 | 税率 |
| 24 | 含税价格/单位 | **最终价格** |

## 🎯 项目示例

### 木工类项目
- 木框架 - m2 - ¥86.18
- 安装平开木门 - 个 - ¥815.24
- 安装平开金属门 - 个 - ¥1141.33
- 安装木移门 - 个 - ¥748.69

### 电工类项目
- 新墙面电力布置 - m2 - ¥30.61
- 墙面/天花板开槽拉线(砖) - m - ¥57.77
- 添加线盒 - 个 - ¥47.45
- 安装面板(带金属面板) - 个 - ¥65.22

### 瓦工类项目
- 标准瓷砖 - m2 - ¥80.39
- 小砖(单边小于10cm) - m2 - ¥97.70
- 大砖(单边超过90cm) - m2 - ¥89.04
- 空气砖墙（单层） - m2 - ¥87.45

---

*此文档为装修项目报价器的Excel数据分析和编程实现参考*
