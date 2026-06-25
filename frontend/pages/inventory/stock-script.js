// Stock Management System - JavaScript

// ============ DATA MANAGEMENT ============
// Load products from localStorage or use sample data
let products = JSON.parse(localStorage.getItem('products')) || [];
let stockHistory = JSON.parse(localStorage.getItem('stockHistory')) || [];

// Initialize with sample data if empty
if (products.length === 0) {
    products = [
        { id: 1, sku: 'PROD-001', name: 'Wireless Mouse', category: 'Electronics', stock: 45, minStock: 10, lastUpdated: new Date().toISOString() },
        { id: 2, sku: 'PROD-002', name: 'USB-C Cable', category: 'Electronics', stock: 120, minStock: 20, lastUpdated: new Date().toISOString() },
        { id: 3, sku: 'PROD-003', name: 'Laptop Stand', category: 'Office', stock: 8, minStock: 5, lastUpdated: new Date().toISOString() },
        { id: 4, sku: 'PROD-004', name: 'Coffee Mug', category: 'Kitchen', stock: 0, minStock: 15, lastUpdated: new Date().toISOString() },
        { id: 5, sku: 'PROD-005', name: 'Desk Lamp', category: 'Office', stock: 3, minStock: 10, lastUpdated: new Date().toISOString() },
        { id: 6, sku: 'PROD-006', name: 'Notebook', category: 'Stationery', stock: 200, minStock: 50, lastUpdated: new Date().toISOString() },
        { id: 7, sku: 'PROD-007', name: 'Water Bottle', category: 'Kitchen', stock: 15, minStock: 20, lastUpdated: new Date().toISOString() }
    ];
    saveProducts();
}

// Save data to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveStockHistory() {
    localStorage.setItem('stockHistory', JSON.stringify(stockHistory));
}

// ============ UI INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    populateCategoryFilter();
    populateProductDropdowns();
    displayProducts();
    updateStockCounts();
    updateSummary();
});

// ============ PRODUCT DISPLAY ============
function displayProducts(filteredProducts = null) {
    const productList = filteredProducts || products;
    const tbody = document.getElementById('stockTableBody');
    const noResults = document.getElementById('noResults');
    
    if (productList.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    tbody.innerHTML = productList.map(product => {
        const stockStatus = getStockStatus(product);
        const statusClass = getStatusClass(stockStatus);
        
        return `
            <tr>
                <td><strong>${product.sku}</strong></td>
                <td>${product.name}</td>
                <td>${product.category || 'Uncategorized'}</td>
                <td>
                    <strong class="${parseInt(product.stock) === 0 ? 'text-danger' : ''}">
                        ${product.stock}
                    </strong>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${stockStatus}
                    </span>
                </td>
                <td>${formatDate(product.lastUpdated)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="quickAddStock(${product.id})" title="Quick Add Stock">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="quickAdjustStock(${product.id})" title="Adjust Stock">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="viewStockHistory(${product.id})" title="View History">
                            <i class="fas fa-history"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============ STOCK STATUS FUNCTIONS ============
function getStockStatus(product) {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= product.minStock) return 'Low Stock';
    return 'In Stock';
}

function getStatusClass(status) {
    switch(status) {
        case 'In Stock': return 'status-in-stock';
        case 'Low Stock': return 'status-low-stock';
        case 'Out of Stock': return 'status-out-of-stock';
        default: return '';
    }
}

// ============ FILTER FUNCTIONS ============
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filtered = products;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply stock status filter
    if (stockFilter !== 'all') {
        filtered = filtered.filter(product => {
            const status = getStockStatus(product).toLowerCase().replace(' ', '-');
            return status === stockFilter;
        });
    }
    
    displayProducts(filtered);
}

function filterByStatus(status) {
    document.getElementById('stockFilter').value = status;
    filterProducts();
}

function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

// ============ STOCK COUNTS ============
function updateStockCounts() {
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
    const inStock = products.filter(p => p.stock > p.minStock).length;
    
    document.getElementById('outOfStockCount').textContent = outOfStock;
    document.getElementById('lowStockCardCount').textContent = lowStock;
    document.getElementById('inStockCount').textContent = inStock;
}

function updateSummary() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('lowStockCount').textContent = 
        products.filter(p => p.stock <= p.minStock).length;
}

// ============ MODAL FUNCTIONS ============
function openAddStockModal() {
    document.getElementById('addStockModal').classList.add('show');
    populateProductDropdowns();
    document.getElementById('addProduct').value = '';
    document.getElementById('addQuantity').value = 1;
    document.getElementById('addReference').value = '';
    document.getElementById('addNotes').value = '';
    document.getElementById('addProductPreview').style.display = 'none';
}

function closeAddStockModal() {
    document.getElementById('addStockModal').classList.remove('show');
}

function openAdjustStockModal() {
    document.getElementById('adjustStockModal').classList.add('show');
    populateProductDropdowns();
    document.getElementById('adjustProduct').value = '';
    document.getElementById('adjustQuantity').value = 1;
    document.getElementById('adjustReference').value = '';
    document.getElementById('adjustNotes').value = '';
    document.getElementById('adjustProductPreview').style.display = 'none';
    document.getElementById('newStockPreview').style.display = 'none';
    document.getElementById('adjustmentType').value = 'add';
    document.getElementById('adjustQuantityLabel').textContent = 'Quantity *';
}

function closeAdjustStockModal() {
    document.getElementById('adjustStockModal').classList.remove('show');
}

function populateProductDropdowns() {
    const addSelect = document.getElementById('addProduct');
    const adjustSelect = document.getElementById('adjustProduct');
    
    const options = products.map(product => 
        `<option value="${product.id}">${product.name} (${product.sku}) - Stock: ${product.stock}</option>`
    ).join('');
    
    addSelect.innerHTML = '<option value="">Choose a product...</option>' + options;
    adjustSelect.innerHTML = '<option value="">Choose a product...</option>' + options;
}

// ============ PRODUCT INFO UPDATE ============
function updateProductInfo(type) {
    const selectId = type === 'add' ? 'addProduct' : 'adjustProduct';
    const productId = parseInt(document.getElementById(selectId).value);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById(`${type}ProductPreview`).style.display = 'none';
        if (type === 'adjust') {
            document.getElementById('newStockPreview').style.display = 'none';
        }
        return;
    }
    
    document.getElementById(`${type}ProductPreview`).style.display = 'flex';
    document.getElementById(`${type}CurrentStock`).textContent = product.stock;
    document.getElementById(`${type}ProductSku`).textContent = product.sku;
    
    if (type === 'adjust') {
        updateNewStockPreview();
    }
}

// ============ QUANTITY FUNCTIONS ============
function changeQuantity(inputId, delta) {
    const input = document.getElementById(inputId);
    let value = parseInt(input.value) || 0;
    value = Math.max(1, value + delta);
    input.value = value;
    
    if (inputId === 'adjustQuantity') {
        updateNewStockPreview();
    }
}

function handleAdjustmentType() {
    const type = document.getElementById('adjustmentType').value;
    const label = document.getElementById('adjustQuantityLabel');
    const maxStockInfo = document.getElementById('maxStockInfo');
    const productId = parseInt(document.getElementById('adjustProduct').value);
    const product = products.find(p => p.id === productId);
    
    switch(type) {
        case 'add':
            label.textContent = 'Quantity to Add *';
            maxStockInfo.style.display = 'none';
            break;
        case 'remove':
            label.textContent = 'Quantity to Remove *';
            if (product) {
                maxStockInfo.style.display = 'block';
                document.getElementById('maxStockValue').textContent = product.stock;
            }
            break;
        case 'set':
            label.textContent = 'New Quantity *';
            maxStockInfo.style.display = 'none';
            break;
    }
    
    document.getElementById('adjustQuantity').value = 1;
    updateNewStockPreview();
}

function updateNewStockPreview() {
    const productId = parseInt(document.getElementById('adjustProduct').value);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById('newStockPreview').style.display = 'none';
        return;
    }
    
    const type = document.getElementById('adjustmentType').value;
    const quantity = parseInt(document.getElementById('adjustQuantity').value) || 0;
    let newStock = product.stock;
    
    switch(type) {
        case 'add':
            newStock = product.stock + quantity;
            break;
        case 'remove':
            newStock = Math.max(0, product.stock - quantity);
            break;
        case 'set':
            newStock = quantity;
            break;
    }
    
    document.getElementById('newStockPreview').style.display = 'block';
    document.getElementById('newStockLevel').textContent = newStock;
}

// ============ STOCK OPERATIONS ============
function addStock(event) {
    event.preventDefault();
    
    const productId = parseInt(document.getElementById('addProduct').value);
    const quantity = parseInt(document.getElementById('addQuantity').value);
    const reference = document.getElementById('addReference').value.trim();
    const notes = document.getElementById('addNotes').value.trim();
    
    // Validation
    if (!productId) {
        showToast('Please select a product', 'error');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showToast('Please enter a valid quantity', 'error');
        return;
    }
    
    // Update product stock
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    const oldStock = product.stock;
    product.stock += quantity;
    product.lastUpdated = new Date().toISOString();
    
    // Add to history
    addStockHistory(productId, 'ADD', quantity, oldStock, product.stock, reference, notes);
    
    // Save and refresh
    saveProducts();
    saveStockHistory();
    displayProducts();
    updateStockCounts();
    updateSummary();
    closeAddStockModal();
    
    showToast(`Successfully added ${quantity} units to ${product.name}`, 'success');
}

function adjustStock(event) {
    event.preventDefault();
    
    const productId = parseInt(document.getElementById('adjustProduct').value);
    const type = document.getElementById('adjustmentType').value;
    const quantity = parseInt(document.getElementById('adjustQuantity').value);
    const reference = document.getElementById('adjustReference').value.trim();
    const notes = document.getElementById('adjustNotes').value.trim();
    
    // Validation
    if (!productId) {
        showToast('Please select a product', 'error');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showToast('Please enter a valid quantity', 'error');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    const oldStock = product.stock;
    let newStock = oldStock;
    let changeQuantity = 0;
    let historyType = 'ADJUST';
    
    switch(type) {
        case 'add':
            newStock = oldStock + quantity;
            changeQuantity = quantity;
            historyType = 'ADD';
            break;
            
        case 'remove':
            if (quantity > oldStock) {
                showToast(`Cannot remove ${quantity} units. Only ${oldStock} available.`, 'error');
                return;
            }
            newStock = oldStock - quantity;
            changeQuantity = -quantity;
            historyType = 'REMOVE';
            break;
            
        case 'set':
            if (quantity === oldStock) {
                showToast('New quantity is same as current stock', 'warning');
                return;
            }
            newStock = quantity;
            changeQuantity = newStock - oldStock;
            break;
    }
    
    // Update product
    product.stock = newStock;
    product.lastUpdated = new Date().toISOString();
    
    // Add to history
    addStockHistory(productId, historyType, changeQuantity, oldStock, newStock, reference, notes);
    
    // Save and refresh
    saveProducts();
    saveStockHistory();
    displayProducts();
    updateStockCounts();
    updateSummary();
    closeAdjustStockModal();
    
    showToast(`Stock adjusted successfully. New stock: ${newStock}`, 'success');
}

// ============ QUICK ACTIONS ============
function quickAddStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = prompt(`Add stock for ${product.name}\nCurrent stock: ${product.stock}\nEnter quantity to add:`);
    
    if (quantity === null) return; // Cancelled
    
    const qtyNum = parseInt(quantity);
    if (!qtyNum || qtyNum <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const oldStock = product.stock;
    product.stock += qtyNum;
    product.lastUpdated = new Date().toISOString();
    
    addStockHistory(productId, 'ADD', qtyNum, oldStock, product.stock, '', 'Quick add');
    
    saveProducts();
    saveStockHistory();
    displayProducts();
    updateStockCounts();
    updateSummary();
    
    showToast(`Added ${qtyNum} units to ${product.name}`, 'success');
}

function quickAdjustStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const action = confirm(
        `Adjust stock for ${product.name}\n` +
        `Current stock: ${product.stock}\n\n` +
        `Click OK to set new quantity, Cancel to go back`
    );
    
    if (!action) return;
    
    const newStock = prompt(`Enter new stock quantity for ${product.name}:`, product.stock);
    
    if (newStock === null) return; // Cancelled
    
    const newStockNum = parseInt(newStock);
    if (isNaN(newStockNum) || newStockNum < 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const oldStock = product.stock;
    product.stock = newStockNum;
    product.lastUpdated = new Date().toISOString();
    
    const change = newStockNum - oldStock;
    addStockHistory(productId, 'ADJUST', change, oldStock, newStockNum, '', 'Quick adjustment');
    
    saveProducts();
    saveStockHistory();
    displayProducts();
    updateStockCounts();
    updateSummary();
    
    showToast(`Stock adjusted from ${oldStock} to ${newStockNum}`, 'success');
}

// ============ STOCK HISTORY ============
function addStockHistory(productId, type, quantityChange, oldStock, newStock, reference, notes) {
    stockHistory.push({
        id: Date.now(),
        productId,
        type,
        quantityChange,
        oldStock,
        newStock,
        reference: reference || '',
        notes: notes || '',
        timestamp: new Date().toISOString()
    });
}

function viewStockHistory(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productHistory = stockHistory
        .filter(h => h.productId === productId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10); // Last 10 transactions
    
    if (productHistory.length === 0) {
        alert(`No stock history for ${product.name}`);
        return;
    }
    
    let historyText = `Stock History for ${product.name}\n`;
    historyText += `${'─'.repeat(50)}\n\n`;
    
    productHistory.forEach(entry => {
        const date = new Date(entry.timestamp).toLocaleString();
        const typeIcon = entry.type === 'ADD' ? '📥' : entry.type === 'REMOVE' ? '📤' : '🔄';
        const changeText = entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange;
        
        historyText += `${typeIcon} ${entry.type} | ${date}\n`;
        historyText += `   ${entry.oldStock} → ${entry.newStock} (${changeText})\n`;
        if (entry.reference) historyText += `   Ref: ${entry.reference}\n`;
        if (entry.notes) historyText += `   Note: ${entry.notes}\n`;
        historyText += '\n';
    });
    
    alert(historyText);
}

// ============ UTILITY FUNCTIONS ============
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    // Update toast style based on type
    toast.style.borderLeftColor = type === 'error' ? '#DC3545' : 
                                   type === 'warning' ? '#FFC107' : '#28A745';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', function(e) {
    // Ctrl+N to open Add Stock modal
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openAddStockModal();
    }
    
    // Ctrl+E to open Adjust Stock modal
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        openAdjustStockModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAddStockModal();
        closeAdjustStockModal();
    }
});

// ============ LIVE SEARCH ============
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterProducts();
    }, 300);
});

// ============ REFRESH DATA PERIODICALLY ============
setInterval(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (savedProducts && JSON.stringify(savedProducts) !== JSON.stringify(products)) {
        products = savedProducts;
        displayProducts();
        updateStockCounts();
        updateSummary();
    }
}, 5000); // Check every 5 seconds for changes from other tabs/windows

console.log('📦 Stock Management System Ready');
console.log('Features:');
console.log('✓ Add Stock - Increase product quantities');
console.log('✓ Adjust Stock - Add/Remove/Set quantities');
console.log('✓ Stock History - Track all changes');
console.log('✓ Quick Actions - Fast stock adjustments');
console.log('✓ Search & Filter - Find products easily');
console.log('✓ Stock Alerts - Low stock & out of stock warnings');
console.log('✓ Real-time Updates - Auto-refresh data');
console.log('⌨ Shortcuts: Ctrl+N (Add Stock), Ctrl+E (Adjust Stock)');