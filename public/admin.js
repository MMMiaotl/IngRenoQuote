// Global variables
let priceData = [];
let filteredData = [];
let currentEditIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPriceData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', function() {
        loadSubCategoriesForFilter();
        applyFilters();
    });
    
    // Subcategory filter
    document.getElementById('subCategoryFilter').addEventListener('change', applyFilters);
}

// Load price data from server
async function loadPriceData() {
    try {
        showLoading('正在加载价格数据...');
        const response = await fetch('/api/admin/prices');
        priceData = await response.json();
        filteredData = [...priceData];
        
        updateStatistics();
        loadCategoriesForFilter();
        renderDataTable();
        
        console.log('Price data loaded:', priceData.length, 'items');
    } catch (error) {
        console.error('Error loading price data:', error);
        showError('加载价格数据失败');
    } finally {
        hideLoading();
    }
}

// Update statistics
function updateStatistics() {
    const totalItems = priceData.length;
    const categories = [...new Set(priceData.map(item => item.category))];
    const subCategories = [...new Set(priceData.map(item => item.subCategory))];
    const avgPrice = priceData.length > 0 ? 
        priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length : 0;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalSubCategories').textContent = subCategories.length;
    document.getElementById('avgPrice').textContent = `€${avgPrice.toFixed(2)}`;
}

// Load categories for filter
function loadCategoriesForFilter() {
    const categories = [...new Set(priceData.map(item => item.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="">所有分类</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Load subcategories for filter
function loadSubCategoriesForFilter() {
    const category = document.getElementById('categoryFilter').value;
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    
    subCategoryFilter.innerHTML = '<option value="">所有子分类</option>';
    
    if (category) {
        const subCategories = [...new Set(priceData
            .filter(item => item.category === category)
            .map(item => item.subCategory)
        )];
        
        subCategories.forEach(subCategory => {
            const option = document.createElement('option');
            option.value = subCategory;
            option.textContent = subCategory;
            subCategoryFilter.appendChild(option);
        });
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const subCategory = document.getElementById('subCategoryFilter').value;
    
    filteredData = priceData.filter(item => {
        const matchesSearch = !searchTerm || 
            item.item.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.subCategory.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || item.category === category;
        const matchesSubCategory = !subCategory || item.subCategory === subCategory;
        
        return matchesSearch && matchesCategory && matchesSubCategory;
    });
    
    renderDataTable();
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('subCategoryFilter').innerHTML = '<option value="">所有子分类</option>';
    
    filteredData = [...priceData];
    renderDataTable();
}

// Render data table
function renderDataTable() {
    const tbody = document.getElementById('dataTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">没有找到匹配的数据</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, index) => {
        const originalIndex = priceData.findIndex(p => p === item);
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <input type="text" class="form-control form-control-sm editable" 
                           value="${item.category}" 
                           onchange="updateItemField(${originalIndex}, 'category', this.value)">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm editable" 
                           value="${item.subCategory}" 
                           onchange="updateItemField(${originalIndex}, 'subCategory', this.value)">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm editable" 
                           value="${item.item}" 
                           onchange="updateItemField(${originalIndex}, 'item', this.value)">
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm editable" 
                           value="${item.unit}" 
                           onchange="updateItemField(${originalIndex}, 'unit', this.value)">
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm editable" 
                           value="${item.price}" step="0.01" min="0"
                           onchange="updateItemField(${originalIndex}, 'price', this.value)">
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm editable" 
                           value="${item.laborPrice}" step="0.01" min="0"
                           onchange="updateItemField(${originalIndex}, 'laborPrice', this.value)">
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm editable" 
                           value="${item.materialPrice}" step="0.01" min="0"
                           onchange="updateItemField(${originalIndex}, 'materialPrice', this.value)">
                </td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editItem(${originalIndex})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${originalIndex})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update item field
async function updateItemField(index, field, value) {
    if (index >= 0 && index < priceData.length) {
        // Update local data first
        if (field === 'price' || field === 'laborPrice' || field === 'materialPrice') {
            priceData[index][field] = parseFloat(value) || 0;
        } else {
            priceData[index][field] = value;
        }
        
        // Update description if item name changed
        if (field === 'item') {
            priceData[index].description = value;
        }
        
        // Update filtered data as well
        const filteredIndex = filteredData.findIndex(item => item === priceData[index]);
        if (filteredIndex >= 0) {
            if (field === 'price' || field === 'laborPrice' || field === 'materialPrice') {
                filteredData[filteredIndex][field] = parseFloat(value) || 0;
            } else {
                filteredData[filteredIndex][field] = value;
            }
            
            if (field === 'item') {
                filteredData[filteredIndex].description = value;
            }
        }
        
        // Update server data
        try {
            const input = event.target;
            input.classList.add('saving');
            
            const response = await fetch(`/api/admin/prices/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(priceData[index])
            });
            
            if (response.ok) {
                // Show success feedback
                input.classList.remove('saving');
                input.classList.add('saved');
                setTimeout(() => {
                    input.classList.remove('saved');
                }, 2000);
            } else {
                const error = await response.json();
                console.error('Error updating item:', error);
                input.classList.remove('saving');
                showError(`更新失败: ${error.error || '未知错误'}`);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            const input = event.target;
            input.classList.remove('saving');
            showError('更新时发生错误');
        }
    }
}

// Edit item
function editItem(index) {
    const item = priceData[index];
    currentEditIndex = index;
    
    document.getElementById('modalTitle').textContent = '编辑项目';
    document.getElementById('modalCategory').value = item.category;
    document.getElementById('modalSubCategory').value = item.subCategory;
    document.getElementById('modalItem').value = item.item;
    document.getElementById('modalUnit').value = item.unit;
    document.getElementById('modalPrice').value = item.price;
    document.getElementById('modalLaborPrice').value = item.laborPrice;
    document.getElementById('modalMaterialPrice').value = item.materialPrice;
    document.getElementById('modalDescription').value = item.description || '';
    
    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    modal.show();
}

// Show add item modal
function showAddItemModal() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = '添加新项目';
    document.getElementById('itemForm').reset();
    
    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    modal.show();
}

// Save item
async function saveItem() {
    const formData = {
        category: document.getElementById('modalCategory').value.trim(),
        subCategory: document.getElementById('modalSubCategory').value.trim(),
        item: document.getElementById('modalItem').value.trim(),
        unit: document.getElementById('modalUnit').value.trim(),
        price: document.getElementById('modalPrice').value,
        laborPrice: document.getElementById('modalLaborPrice').value || 0,
        materialPrice: document.getElementById('modalMaterialPrice').value || 0,
        description: document.getElementById('modalDescription').value.trim()
    };
    
    // Validate required fields
    if (!formData.category || !formData.subCategory || !formData.item || !formData.price) {
        showError('请填写所有必填字段');
        return;
    }
    
    try {
        showLoading('正在保存...');
        
        let response;
        if (currentEditIndex >= 0) {
            // Update existing item
            response = await fetch(`/api/admin/prices/${currentEditIndex}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Add new item
            response = await fetch('/api/admin/prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess(result.message);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
            modal.hide();
            
            // Refresh data
            await loadPriceData();
        } else {
            showError(result.error || '保存失败');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        showError('保存时发生错误');
    } finally {
        hideLoading();
    }
}

// Delete item
function deleteItem(index) {
    const item = priceData[index];
    
    document.getElementById('confirmMessage').textContent = 
        `确定要删除项目 "${item.item}" 吗？此操作无法撤销。`;
    
    document.getElementById('confirmButton').onclick = async () => {
        try {
            showLoading('正在删除...');
            
            const response = await fetch(`/api/admin/prices/${index}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showSuccess(result.message);
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                modal.hide();
                
                // Refresh data
                await loadPriceData();
            } else {
                showError(result.error || '删除失败');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showError('删除时发生错误');
        } finally {
            hideLoading();
        }
    };
    
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// Save all changes
async function saveAllChanges() {
    try {
        showLoading('正在保存所有更改...');
        
        const response = await fetch('/api/admin/save-excel', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            if (result.fallbackFile) {
                showWarning(`${result.message}<br><small>文件已保存为: ${result.fallbackFile}</small>`);
            } else {
                showSuccess(result.message);
            }
        } else {
            showError(result.error || '保存失败');
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        showError('保存时发生错误');
    } finally {
        hideLoading();
    }
}

// Export to Excel
async function exportToExcel() {
    try {
        showLoading('正在导出Excel文件...');
        
        const response = await fetch('/api/admin/export-excel');
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `price_data_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showSuccess('Excel文件导出成功！');
        } else {
            const error = await response.json();
            showError(error.error || '导出失败');
        }
    } catch (error) {
        console.error('Error exporting Excel:', error);
        showError('导出时发生错误');
    } finally {
        hideLoading();
    }
}

// Refresh data
async function refreshData() {
    try {
        showLoading('正在刷新数据...');
        
        // Reload data from server (which loads from Excel)
        const response = await fetch('/api/admin/prices');
        priceData = await response.json();
        filteredData = [...priceData];
        
        updateStatistics();
        loadCategoriesForFilter();
        renderDataTable();
        
        showSuccess('数据已刷新');
    } catch (error) {
        console.error('Error refreshing data:', error);
        showError('刷新数据失败');
    } finally {
        hideLoading();
    }
}

// Show debug information
function showDebugInfo() {
    const debugInfo = {
        totalItems: priceData.length,
        filteredItems: filteredData.length,
        categories: [...new Set(priceData.map(item => item.category))].length,
        subCategories: [...new Set(priceData.map(item => item.subCategory))].length,
        sampleData: priceData.slice(0, 3).map(item => ({
            category: item.category,
            subCategory: item.subCategory,
            item: item.item,
            price: item.price
        }))
    };
    
    const debugMessage = `
        <strong>调试信息：</strong><br>
        总项目数: ${debugInfo.totalItems}<br>
        筛选后项目数: ${debugInfo.filteredItems}<br>
        一级分类数: ${debugInfo.categories}<br>
        二级分类数: ${debugInfo.subCategories}<br>
        <br><strong>示例数据：</strong><br>
        ${debugInfo.sampleData.map(item => 
            `${item.category} > ${item.subCategory} > ${item.item} (€${item.price})`
        ).join('<br>')}
    `;
    
    showNotification(debugMessage, 'info');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(message) {
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

function showWarning(message) {
    showNotification(message, 'warning');
}

function showNotification(message, type) {
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-notification position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 200px;';
    
    let icon = 'exclamation-circle';
    if (type === 'success') {
        icon = 'check-circle';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
    } else if (type === 'info') {
        icon = 'info-circle';
    }
    
    alert.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    document.body.appendChild(alert);
    
    // Show longer for warnings
    const timeout = type === 'warning' ? 5000 : 3000;
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, timeout);
}
