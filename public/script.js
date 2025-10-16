// Global variables
let priceData = [];
let selectedItems = [];
let detailedSelectedItems = [];
let currentQuote = null;
let currentMode = 'quick'; // 'quick' or 'detailed'

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPriceData();
});

// Switch between quick and detailed mode
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.getElementById('quickModeBtn').classList.toggle('active', mode === 'quick');
    document.getElementById('detailedModeBtn').classList.toggle('active', mode === 'detailed');
    
    // Show/hide calculators
    document.getElementById('quickCalculator').style.display = mode === 'quick' ? 'block' : 'none';
    document.getElementById('detailedCalculator').style.display = mode === 'detailed' ? 'block' : 'none';
    
    // Load categories for detailed mode if needed
    if (mode === 'detailed') {
        loadDetailedCategories();
    }
    
    // Update quote options visibility
    updateQuoteOptionsVisibility();
}

// Load price data from server
async function loadPriceData() {
    try {
        const response = await fetch('/api/prices');
        priceData = await response.json();
        console.log('Price data loaded:', priceData.length, 'items');
        loadCategories();
    } catch (error) {
        console.error('Error loading price data:', error);
        showError('加载价格数据失败');
    }
}

// Load level 1 categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = '<option value="">请选择一级分类</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('加载分类失败');
    }
}

// Load detailed categories
async function loadDetailedCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categorySelect = document.getElementById('detailedCategorySelect');
        categorySelect.innerHTML = '<option value="">请选择一级分类</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading detailed categories:', error);
        showError('加载分类失败');
    }
}

// Load level 2 categories (subcategories)
async function loadSubCategories() {
    const categorySelect = document.getElementById('categorySelect');
    const subCategorySelect = document.getElementById('subCategorySelect');
    const itemSelect = document.getElementById('itemSelect');
    const category = categorySelect.value;
    
    // Reset subcategory and item selects
    subCategorySelect.innerHTML = '<option value="">请先选择一级分类</option>';
    itemSelect.innerHTML = '<option value="">请先选择二级分类</option>';
    
    if (category) {
        try {
            const response = await fetch(`/api/subcategories/${encodeURIComponent(category)}`);
            const subCategories = await response.json();
            
            subCategorySelect.innerHTML = '<option value="">请选择二级分类</option>';
            subCategories.forEach(subCategory => {
                const option = document.createElement('option');
                option.value = subCategory;
                option.textContent = subCategory;
                subCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading subcategories:', error);
            showError('加载子分类失败');
        }
    }
}

// Load detailed subcategories
async function loadDetailedSubCategories() {
    const categorySelect = document.getElementById('detailedCategorySelect');
    const subCategorySelect = document.getElementById('detailedSubCategorySelect');
    const itemSelect = document.getElementById('detailedItemSelect');
    const category = categorySelect.value;
    
    // Reset subcategory and item selects
    subCategorySelect.innerHTML = '<option value="">请先选择一级分类</option>';
    itemSelect.innerHTML = '<option value="">请先选择二级分类</option>';
    
    if (category) {
        try {
            const response = await fetch(`/api/subcategories/${encodeURIComponent(category)}`);
            const subCategories = await response.json();
            
            subCategorySelect.innerHTML = '<option value="">请选择二级分类</option>';
            subCategories.forEach(subCategory => {
                const option = document.createElement('option');
                option.value = subCategory;
                option.textContent = subCategory;
                subCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading detailed subcategories:', error);
            showError('加载子分类失败');
        }
    }
}

// Load items by level 1 and level 2 categories
async function loadItems() {
    const categorySelect = document.getElementById('categorySelect');
    const subCategorySelect = document.getElementById('subCategorySelect');
    const itemSelect = document.getElementById('itemSelect');
    const category = categorySelect.value;
    const subCategory = subCategorySelect.value;
    
    itemSelect.innerHTML = '<option value="">请先选择二级分类</option>';
    
    if (category && subCategory) {
        try {
            const response = await fetch(`/api/items/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`);
            const items = await response.json();
            
            itemSelect.innerHTML = '<option value="">请选择具体项目</option>';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = JSON.stringify(item);
                option.textContent = `${item.item} (${item.unit} - €${item.price.toFixed(2)})`;
                itemSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading items:', error);
            showError('加载项目列表失败');
        }
    }
}

// Load detailed items
async function loadDetailedItems() {
    const categorySelect = document.getElementById('detailedCategorySelect');
    const subCategorySelect = document.getElementById('detailedSubCategorySelect');
    const itemSelect = document.getElementById('detailedItemSelect');
    const category = categorySelect.value;
    const subCategory = subCategorySelect.value;
    
    itemSelect.innerHTML = '<option value="">请先选择二级分类</option>';
    
    if (category && subCategory) {
        try {
            const response = await fetch(`/api/items/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`);
            const items = await response.json();
            
            itemSelect.innerHTML = '<option value="">请选择具体项目</option>';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = JSON.stringify(item);
                option.textContent = `${item.item} (${item.unit} - €${item.price.toFixed(2)})`;
                itemSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading detailed items:', error);
            showError('加载项目列表失败');
        }
    }
}

// Add item to selection
function addItem() {
    const itemSelect = document.getElementById('itemSelect');
    const selectedValue = itemSelect.value;
    
    if (selectedValue) {
        const item = JSON.parse(selectedValue);
        
        // Check if item already exists
        const existingItem = selectedItems.find(i => i.name === item.item);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            selectedItems.push({
                name: item.item,
                quantity: 1,
                unit: item.unit,
                description: item.description || item.item,
                category: item.category,
                subCategory: item.subCategory,
                price: item.price,  // 总价
                laborPrice: item.laborPrice,  // 人工费
                materialPrice: item.materialPrice,  // 材料费
                includeMaterials: true  // 默认包含材料费
            });
        }
        
        updateSelectedItemsDisplay();
        updateQuoteSummary();
        
        // Reset selection
        itemSelect.value = '';
    }
}

// Add detailed item to selection
function addDetailedItem() {
    const itemSelect = document.getElementById('detailedItemSelect');
    const selectedValue = itemSelect.value;
    
    if (selectedValue) {
        const item = JSON.parse(selectedValue);
        
        // Check if item already exists
        const existingItem = detailedSelectedItems.find(i => i.name === item.item);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            detailedSelectedItems.push({
                name: item.item,
                quantity: 1,
                unit: item.unit,
                description: item.description || item.item,
                category: item.category,
                subCategory: item.subCategory,
                price: item.price,  // 总价
                laborPrice: item.laborPrice,  // 人工费
                materialPrice: item.materialPrice,  // 材料费
                includeMaterials: true  // 默认包含材料费
            });
        }
        
        updateDetailedSelectedItemsDisplay();
        updateDetailedQuoteSummary();
        
        // Reset selection
        itemSelect.value = '';
    }
}

// Update selected items display
function updateSelectedItemsDisplay() {
    const container = document.getElementById('selectedItems');
    
    if (selectedItems.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">暂无选择项目</p>';
        return;
    }
    
    container.innerHTML = selectedItems.map((item, index) => {
        const unitPrice = item.price || 0;
        const laborPrice = item.laborPrice || 0;
        const materialPrice = item.materialPrice || 0;
        const includeMaterials = item.includeMaterials !== false; // 默认为true
        
        const laborSubtotal = item.quantity * laborPrice;
        const materialSubtotal = item.quantity * materialPrice;
        const subtotal = includeMaterials ? 
            item.quantity * unitPrice : 
            laborSubtotal;
        
        return `
        <div class="item-row">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">${item.category} > ${item.subCategory}</small>
                    <br><small class="text-muted">${item.unit}</small>
                </div>
                <div class="col-md-1">
                    <label class="form-label">数量:</label>
                    <input type="number" class="form-control form-control-sm" 
                           value="${item.quantity}" min="0" step="0.1"
                           onchange="updateItemQuantity(${index}, this.value)">
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">人工费</div>
                        <div class="price-value">€${laborPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${laborSubtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">
                            材料费
                            <div class="form-check form-check-inline d-inline-block ms-2">
                                <input class="form-check-input" type="checkbox" 
                                       id="includeMaterials_${index}" 
                                       ${includeMaterials ? 'checked' : ''}
                                       onchange="toggleItemMaterials(${index}, this.checked)">
                                <label class="form-check-label" for="includeMaterials_${index}">
                                    <small>包含</small>
                                </label>
                            </div>
                        </div>
                        <div class="price-value">€${materialPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${materialSubtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">${includeMaterials ? '总价' : '人工费'}</div>
                        <div class="price-value">€${includeMaterials ? unitPrice.toFixed(2) : laborPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${subtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-1 d-flex justify-content-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Update item quantity
function updateItemQuantity(index, quantity) {
    const newQuantity = parseFloat(quantity) || 0;
    if (newQuantity <= 0) {
        removeItem(index);
    } else {
        selectedItems[index].quantity = newQuantity;
        updateSelectedItemsDisplay();
        updateQuoteSummary();
    }
}

// Toggle materials inclusion for a specific item
function toggleItemMaterials(index, includeMaterials) {
    selectedItems[index].includeMaterials = includeMaterials;
    updateSelectedItemsDisplay();
    updateQuoteSummary();
}

// Remove item
function removeItem(index) {
    selectedItems.splice(index, 1);
    updateSelectedItemsDisplay();
    updateQuoteSummary();
}


// Update quote summary
function updateQuoteSummary() {
    let totalAmount = 0;
    let totalLaborAmount = 0;
    let totalMaterialAmount = 0;
    let actualTotal = 0; // 实际总价（考虑每个项目的材料费包含状态）
    
    selectedItems.forEach(item => {
        const unitPrice = item.price || 0;
        const laborPrice = item.laborPrice || 0;
        const materialPrice = item.materialPrice || 0;
        const quantity = item.quantity || 0;
        const includeMaterials = item.includeMaterials !== false;
        
        totalAmount += unitPrice * quantity;
        totalLaborAmount += laborPrice * quantity;
        totalMaterialAmount += materialPrice * quantity;
        
        // 根据每个项目的材料费包含状态计算实际总价
        actualTotal += includeMaterials ? 
            unitPrice * quantity : 
            laborPrice * quantity;
    });
    
    const summaryElement = document.getElementById('quickPriceSummary');
    summaryElement.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="total-section" style="background: #e3f2fd;">
                    人工费总计: €${totalLaborAmount.toFixed(2)}
                </div>
            </div>
            <div class="col-md-4">
                <div class="total-section" style="background: #f3e5f5;">
                    材料费总计: €${totalMaterialAmount.toFixed(2)}
                </div>
            </div>
            <div class="col-md-4">
                <div class="total-section" style="background: #e8f5e8;">
                    实际总价: €${actualTotal.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    // Update quote options visibility
    updateQuoteOptionsVisibility();
}

// Show quote form
function showQuoteForm() {
    document.getElementById('quoteForm').style.display = 'block';
    document.getElementById('quoteOptions').style.display = 'none';
    
    // Scroll to quote form
    document.getElementById('quoteForm').scrollIntoView({ behavior: 'smooth' });
}

// Hide quote form
function hideQuoteForm() {
    document.getElementById('quoteForm').style.display = 'none';
    document.getElementById('quoteOptions').style.display = 'block';
}

// Reset calculator
function resetCalculator() {
    if (currentMode === 'quick') {
        selectedItems = [];
        updateSelectedItemsDisplay();
        updateQuoteSummary();
        
        // Reset all selects
        document.getElementById('categorySelect').value = '';
        document.getElementById('subCategorySelect').innerHTML = '<option value="">请先选择一级分类</option>';
        document.getElementById('itemSelect').innerHTML = '<option value="">请先选择二级分类</option>';
    } else {
        detailedSelectedItems = [];
        updateDetailedSelectedItemsDisplay();
        updateDetailedQuoteSummary();
        
        // Reset all selects
        document.getElementById('detailedCategorySelect').value = '';
        document.getElementById('detailedSubCategorySelect').innerHTML = '<option value="">请先选择一级分类</option>';
        document.getElementById('detailedItemSelect').innerHTML = '<option value="">请先选择二级分类</option>';
    }
    
    // Hide quote options
    document.getElementById('quoteOptions').style.display = 'none';
    document.getElementById('quoteForm').style.display = 'none';
}

// Generate quote
async function generateQuote() {
    // Validate required fields
    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!customerName || !phone || !address) {
        showError('请填写所有必填字段（客户姓名、联系电话、项目地址）');
        return;
    }
    
    // Get items based on current mode
    const items = currentMode === 'quick' ? selectedItems : detailedSelectedItems;
    
    if (items.length === 0) {
        showError('请至少选择一个项目');
        return;
    }
    
    try {
        showLoading('正在生成报价单...');
        
        const projectInfo = {
            customerName,
            phone,
            address,
            area: document.getElementById('area').value ? parseFloat(document.getElementById('area').value) : null,
            includeMaterials: true // 生成报价单时使用默认值，实际计算基于每个项目的设置
        };
        
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: items,
                projectInfo: projectInfo
            })
        });
        
        const quote = await response.json();
        currentQuote = quote;
        
        // Generate PDF
        await generatePDF();
        
    } catch (error) {
        console.error('Error generating quote:', error);
        showError('生成报价单时发生错误');
    } finally {
        hideLoading();
    }
}

// Generate PDF
async function generatePDF() {
    if (!currentQuote) {
        showError('没有可用的报价数据');
        return;
    }
    
    try {
        showLoading('正在生成PDF文件...');
        
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentQuote)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `装修报价单_${currentQuote.projectInfo.customerName}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showSuccess('PDF文件生成成功！');
        } else {
            const error = await response.json();
            showError(error.error || '生成PDF失败');
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        showError('生成PDF时发生错误');
    } finally {
        hideLoading();
    }
}

// Preview quote
async function previewQuote() {
    // Validate required fields
    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!customerName || !phone || !address) {
        showError('请填写所有必填字段（客户姓名、联系电话、项目地址）');
        return;
    }
    
    // Get items based on current mode
    const items = currentMode === 'quick' ? selectedItems : detailedSelectedItems;
    
    if (items.length === 0) {
        showError('请至少选择一个项目');
        return;
    }
    
    try {
        showLoading('正在生成预览...');
        
        const projectInfo = {
            customerName,
            phone,
            address,
            area: document.getElementById('area').value ? parseFloat(document.getElementById('area').value) : null,
            includeMaterials: true // 预览时使用默认值，实际计算基于每个项目的设置
        };
        
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: items,
                projectInfo: projectInfo
            })
        });
        
        const quote = await response.json();
        currentQuote = quote;
        
        // Generate preview HTML
        const previewHTML = generatePreviewHTML(quote);
        document.getElementById('previewContent').innerHTML = previewHTML;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error generating preview:', error);
        showError('生成预览时发生错误');
    } finally {
        hideLoading();
    }
}

// Generate preview HTML
function generatePreviewHTML(quote) {
    const { projectInfo, items, totalAmount, generatedAt } = quote;
    
    return `
        <div class="container-fluid">
            <div class="text-center mb-4">
                <h2 class="text-primary">装修项目报价单</h2>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <h5 class="text-primary">项目信息</h5>
                    <table class="table table-sm">
                        <tr><td><strong>客户姓名:</strong></td><td>${projectInfo.customerName}</td></tr>
                        <tr><td><strong>联系电话:</strong></td><td>${projectInfo.phone}</td></tr>
                        <tr><td><strong>项目地址:</strong></td><td>${projectInfo.address}</td></tr>
                        <tr><td><strong>房屋面积:</strong></td><td>${projectInfo.area ? projectInfo.area + ' 平方米' : '未填写'}</td></tr>
                    </table>
                </div>
            </div>
            
            <h5 class="text-primary mb-3">项目明细</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
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
                <tfoot class="table-success">
                    <tr>
                        <td colspan="5" class="text-end"><strong>实际总价:</strong></td>
                        <td><strong>€${totalAmount.toFixed(2)}</strong></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="text-center mt-4">
                <small class="text-muted">
                    报价单生成时间: ${new Date(generatedAt).toLocaleString('zh-CN')}
                </small>
            </div>
        </div>
    `;
}

// Utility functions for notifications
function showLoading(message) {
    // Simple loading indicator
    const existingAlert = document.querySelector('.alert-loading');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-info alert-loading position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 200px;';
    alert.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
    document.body.appendChild(alert);
}

function hideLoading() {
    const alert = document.querySelector('.alert-loading');
    if (alert) alert.remove();
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'danger');
}

function showNotification(message, type) {
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-notification position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 200px;';
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Detailed calculator functions

// Update detailed selected items display
function updateDetailedSelectedItemsDisplay() {
    const container = document.getElementById('detailedSelectedItems');
    
    if (detailedSelectedItems.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">暂无选择项目</p>';
        return;
    }
    
    container.innerHTML = detailedSelectedItems.map((item, index) => {
        const unitPrice = item.price || 0;
        const laborPrice = item.laborPrice || 0;
        const materialPrice = item.materialPrice || 0;
        const includeMaterials = item.includeMaterials !== false; // 默认为true
        
        const laborSubtotal = item.quantity * laborPrice;
        const materialSubtotal = item.quantity * materialPrice;
        const subtotal = includeMaterials ? 
            item.quantity * unitPrice : 
            laborSubtotal;
        
        return `
        <div class="item-row">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">${item.category} > ${item.subCategory}</small>
                    <br><small class="text-muted">${item.unit}</small>
                </div>
                <div class="col-md-1">
                    <label class="form-label">数量:</label>
                    <input type="number" class="form-control form-control-sm" 
                           value="${item.quantity}" min="0" step="0.1"
                           onchange="updateDetailedItemQuantity(${index}, this.value)">
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">人工费</div>
                        <div class="price-value">€${laborPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${laborSubtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">
                            材料费
                            <div class="form-check form-check-inline d-inline-block ms-2">
                                <input class="form-check-input" type="checkbox" 
                                       id="detailedIncludeMaterials_${index}" 
                                       ${includeMaterials ? 'checked' : ''}
                                       onchange="toggleDetailedItemMaterials(${index}, this.checked)">
                                <label class="form-check-label" for="detailedIncludeMaterials_${index}">
                                    <small>包含</small>
                                </label>
                            </div>
                        </div>
                        <div class="price-value">€${materialPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${materialSubtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="price-item">
                        <div class="price-label">${includeMaterials ? '总价' : '人工费'}</div>
                        <div class="price-value">€${includeMaterials ? unitPrice.toFixed(2) : laborPrice.toFixed(2)}</div>
                        <div class="price-subtotal">小计: €${subtotal.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-md-1 d-flex justify-content-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeDetailedItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Update detailed item quantity
function updateDetailedItemQuantity(index, quantity) {
    const newQuantity = parseFloat(quantity) || 0;
    if (newQuantity <= 0) {
        removeDetailedItem(index);
    } else {
        detailedSelectedItems[index].quantity = newQuantity;
        updateDetailedSelectedItemsDisplay();
        updateDetailedQuoteSummary();
    }
}

// Toggle detailed materials inclusion for a specific item
function toggleDetailedItemMaterials(index, includeMaterials) {
    detailedSelectedItems[index].includeMaterials = includeMaterials;
    updateDetailedSelectedItemsDisplay();
    updateDetailedQuoteSummary();
}

// Remove detailed item
function removeDetailedItem(index) {
    detailedSelectedItems.splice(index, 1);
    updateDetailedSelectedItemsDisplay();
    updateDetailedQuoteSummary();
}

// Update detailed quote summary
function updateDetailedQuoteSummary() {
    let totalAmount = 0;
    let totalLaborAmount = 0;
    let totalMaterialAmount = 0;
    let actualTotal = 0; // 实际总价（考虑每个项目的材料费包含状态）
    
    detailedSelectedItems.forEach(item => {
        const unitPrice = item.price || 0;
        const laborPrice = item.laborPrice || 0;
        const materialPrice = item.materialPrice || 0;
        const quantity = item.quantity || 0;
        const includeMaterials = item.includeMaterials !== false;
        
        totalAmount += unitPrice * quantity;
        totalLaborAmount += laborPrice * quantity;
        totalMaterialAmount += materialPrice * quantity;
        
        // 根据每个项目的材料费包含状态计算实际总价
        actualTotal += includeMaterials ? 
            unitPrice * quantity : 
            laborPrice * quantity;
    });
    
    const summaryElement = document.getElementById('detailedPriceSummary');
    summaryElement.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="total-section" style="background: #e3f2fd;">
                    人工费总计: €${totalLaborAmount.toFixed(2)}
                </div>
            </div>
            <div class="col-md-4">
                <div class="total-section" style="background: #f3e5f5;">
                    材料费总计: €${totalMaterialAmount.toFixed(2)}
                </div>
            </div>
            <div class="col-md-4">
                <div class="total-section" style="background: #e8f5e8;">
                    实际总价: €${actualTotal.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    // Show quote options if there are selected items
    updateQuoteOptionsVisibility();
}

// Update quote options visibility based on current mode
function updateQuoteOptionsVisibility() {
    const quoteOptions = document.getElementById('quoteOptions');
    const hasQuickItems = selectedItems.length > 0;
    const hasDetailedItems = detailedSelectedItems.length > 0;
    const hasItems = currentMode === 'quick' ? hasQuickItems : hasDetailedItems;
    
    if (hasItems) {
        quoteOptions.style.display = 'block';
    } else {
        quoteOptions.style.display = 'none';
    }
}
