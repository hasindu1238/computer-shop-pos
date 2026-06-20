// Product data
const products = [
    { id: 1, name: "Mango Juice", price: 500, defaultDiscount: 0, category: "Beverages", icon: "fa-glass-water" },
    { id: 2, name: "Apple Juice", price: 450, defaultDiscount: 0, category: "Beverages", icon: "fa-apple-whole" },
    { id: 3, name: "Orange Juice", price: 480, defaultDiscount: 0, category: "Beverages", icon: "fa-citrus" },
    { id: 4, name: "Potato Chips", price: 120, defaultDiscount: 5, category: "Snacks", icon: "fa-bowl-food" },
    { id: 5, name: "Chocolate Bar", price: 85, defaultDiscount: 0, category: "Snacks", icon: "fa-candy" },
    { id: 6, name: "Fresh Milk", price: 280, defaultDiscount: 0, category: "Dairy", icon: "fa-cow" },
    { id: 7, name: "Yogurt", price: 150, defaultDiscount: 0, category: "Dairy", icon: "fa-wheat-awn" },
    { id: 8, name: "Banana", price: 150, defaultDiscount: 0, category: "Fruits", icon: "fa-banana" },
    { id: 9, name: "Apple", price: 200, defaultDiscount: 0, category: "Fruits", icon: "fa-apple-whole" },
    { id: 10, name: "Carrot", price: 80, defaultDiscount: 0, category: "Vegetables", icon: "fa-carrot" },
    { id: 11, name: "Bread", price: 180, defaultDiscount: 0, category: "Bakery", icon: "fa-bread-slice" },
    { id: 12, name: "Croissant", price: 220, defaultDiscount: 0, category: "Bakery", icon: "fa-cookie" },
];

// Cart state
let cart = [];
let currentCategory = 'All';

// Render products
function renderProducts(filteredProducts = products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-box-open" style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                No products found
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToCart(products.find(p => p.id === ${product.id}))">
            <div class="product-image">
                <i class="fas ${product.icon || 'fa-box'}"></i>
            </div>
            <p class="product-name">${product.name}</p>
            <p class="product-value">Rs.${product.price.toFixed(2)}</p>
        </div>
    `).join('');
}

// Category filter
function setupCategoryFilter() {
    const categories = document.querySelectorAll('.category-name');
    categories.forEach(cat => {
        cat.addEventListener('click', function() {
            const category = this.dataset.category;
            currentCategory = category;
            
            // Update active state
            categories.forEach(c => c.classList.remove('active-category'));
            this.classList.add('active-category');
            
            // Filter products
            if (category === 'All') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Get current category products
        let baseProducts = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);
        
        if (searchTerm === '') {
            renderProducts(baseProducts);
            return;
        }
        
        const filtered = baseProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });
    
    // Clear search on Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.blur();
            const baseProducts = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);
            renderProducts(baseProducts);
        }
    });
}

// Add to cart
function addToCart(product) {
    if (!product) return;
    
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
        showToast(`${product.name} quantity updated!`, 'success');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            discountPercent: product.defaultDiscount || 0
        });
        showToast(`${product.name} added to cart!`, 'success');
    }
    
    recalcAndRender();
}

// Remove from cart
function removeCartItem(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        showToast(`${item.name} removed from cart`, 'info');
    }
    cart = cart.filter(item => item.id !== productId);
    recalcAndRender();
}

// Change quantity
function changeQuantity(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        const newQty = cart[index].quantity + delta;
        
        if (newQty <= 0) {
            const item = cart[index];
            cart.splice(index, 1);
            showToast(`${item.name} removed from cart`, 'info');
        } else {
            cart[index].quantity = newQty;
        }
        
        recalcAndRender();
    }
}

// Recalculate and render everything
function recalcAndRender() {
    const updatedCart = cart.map(item => {
        const itemDiscountPercent = item.discountPercent || 0;
        const originalItemPrice = item.price;
        
        const discountAmountPerItem = (originalItemPrice * itemDiscountPercent) / 100;
        const priceAfterItemDiscount = originalItemPrice - discountAmountPerItem;
        const lineTotalAfterDiscount = priceAfterItemDiscount * item.quantity;
        const lineTotalBeforeDiscount = originalItemPrice * item.quantity;
        const lineDiscountTotal = lineTotalBeforeDiscount - lineTotalAfterDiscount;
        
        return {
            ...item,
            lineTotalAfterDiscount,
            effectiveUnitPrice: priceAfterItemDiscount,
            lineTotalBeforeDiscount,
            lineDiscountTotal
        };
    });
    
    // Subtotal before discounts
    const subTotalBeforeDiscount = updatedCart.reduce(
        (sum, item) => sum + item.lineTotalBeforeDiscount, 0
    );
    
    // Subtotal after item discounts
    const subTotalAfterDiscount = updatedCart.reduce(
        (sum, item) => sum + item.lineTotalAfterDiscount, 0
    );
    
    // Total item savings
    const totalItemSave = updatedCart.reduce(
        (sum, item) => sum + item.lineDiscountTotal, 0
    );
    
    // Global discount
    const discountInput = document.getElementById("discountPercentInput");
    const globalDiscountPercent = discountInput ? parseFloat(discountInput.value) || 0 : 0;
    const globalDiscountValue = (subTotalAfterDiscount * globalDiscountPercent) / 100;
    const finalTotal = subTotalAfterDiscount - globalDiscountValue;
    const totalSaved = totalItemSave + globalDiscountValue;
    
    // Update summary
    document.getElementById("totalSave").innerText = `Rs.${totalSaved.toFixed(2)}`;
    document.getElementById("subTotal").innerText = `Rs.${subTotalBeforeDiscount.toFixed(2)}`;
    document.getElementById("stat-total").innerText = `Rs.${finalTotal.toFixed(2)}`;
    
    renderBillTable(updatedCart);
}

// Render bill table
function renderBillTable(cartItems) {
    const tbody = document.getElementById("billTableBody");
    
    if (!cartItems.length) {
        tbody.innerHTML = `
            <tr class="empty-cart-row">
                <td colspan="5" style="text-align:center;padding:2rem;color:#999;">
                    <i class="fas fa-shopping-cart" style="font-size: 32px; display: block; margin-bottom: 10px;"></i>
                    No items added
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = "";
    
    cartItems.forEach(item => {
        const row = tbody.insertRow();
        
        // Remove button
        const actionCell = row.insertCell(0);
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-item";
        removeBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        removeBtn.title = "Remove item";
        removeBtn.addEventListener("click", () => removeCartItem(item.id));
        actionCell.appendChild(removeBtn);
        
        // Name
        const nameCell = row.insertCell(1);
        nameCell.innerText = item.name;
        nameCell.className = "item-name-cell";
        
        // Quantity
        const qtyCell = row.insertCell(2);
        const qtyWrapper = document.createElement("div");
        qtyWrapper.className = "qty-control";
        
        const minusBtn = document.createElement("button");
        minusBtn.innerHTML = "−";
        minusBtn.className = "qty-btn minus";
        minusBtn.addEventListener("click", e => {
            e.stopPropagation();
            changeQuantity(item.id, -1);
        });
        
        const qtySpan = document.createElement("span");
        qtySpan.className = "qty-number";
        qtySpan.innerText = item.quantity;
        
        const plusBtn = document.createElement("button");
        plusBtn.innerHTML = "+";
        plusBtn.className = "qty-btn plus";
        plusBtn.addEventListener("click", e => {
            e.stopPropagation();
            changeQuantity(item.id, 1);
        });
        
        qtyWrapper.appendChild(minusBtn);
        qtyWrapper.appendChild(qtySpan);
        qtyWrapper.appendChild(plusBtn);
        qtyCell.appendChild(qtyWrapper);
        
        // Discount
        const discCell = row.insertCell(3);
        const discSpan = document.createElement("span");
        discSpan.className = "discount-badge";
        discSpan.innerText = `${item.discountPercent || 0}%`;
        discCell.appendChild(discSpan);
        
        // Price
        const priceCell = row.insertCell(4);
        priceCell.innerText = `Rs.${item.lineTotalAfterDiscount.toFixed(2)}`;
        priceCell.style.fontWeight = "600";
    });
}

// Toast notifications
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const colors = {
        success: '#119965',
        error: '#dc3545',
        info: '#17a2b8'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 14px 28px;
        border-radius: 12px;
        color: white;
        background: ${colors[type] || colors.success};
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add icon
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    toast.innerHTML = `${icons[type] || '✅'} ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Bill actions
function cancelBill() {
    if (cart.length === 0) {
        showToast('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to cancel this bill?')) {
        cart = [];
        document.getElementById('discountPercentInput').value = 0;
        recalcAndRender();
        showToast('Bill cancelled successfully', 'info');
    }
}

function holdBill() {
    if (cart.length === 0) {
        showToast('Cart is empty. Add items first.', 'error');
        return;
    }
    
    const billData = {
        items: cart,
        total: document.getElementById('stat-total').innerText,
        date: new Date().toLocaleString()
    };
    
    // Save to localStorage for demo
    const heldBills = JSON.parse(localStorage.getItem('heldBills') || '[]');
    heldBills.push(billData);
    localStorage.setItem('heldBills', JSON.stringify(heldBills));
    
    cart = [];
    document.getElementById('discountPercentInput').value = 0;
    recalcAndRender();
    showToast('Bill held successfully! You can retrieve it later.', 'success');
}

function processPayment() {
    if (cart.length === 0) {
        showToast('Cart is empty! Add items before payment.', 'error');
        return;
    }
    
    const total = document.getElementById('stat-total').innerText;
    if (confirm(`Proceed with payment of ${total}?`)) {
        // Print receipt simulation
        showToast(`Payment successful! Total: ${total}`, 'success');
        
        // Reset cart
        cart = [];
        document.getElementById('discountPercentInput').value = 0;
        recalcAndRender();
        
        // Open print dialog after short delay
        setTimeout(() => {
            window.print();
        }, 500);
    }
}

// Global discount input handler
document.addEventListener('DOMContentLoaded', function() {
    const discountInput = document.getElementById('discountPercentInput');
    discountInput.addEventListener('input', recalcAndRender);
    discountInput.addEventListener('change', function() {
        let val = parseFloat(this.value);
        if (isNaN(val) || val < 0) this.value = 0;
        if (val > 100) this.value = 100;
        recalcAndRender();
    });
});

// Sidebar toggle integration
function initializeSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    const itemSection = document.getElementById('itemSection');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Adjust main content when sidebar toggles
            if (mainWrapper) {
                if (sidebar.classList.contains('collapsed')) {
                    mainWrapper.style.paddingLeft = '0';
                } else {
                    mainWrapper.style.paddingLeft = '0';
                }
            }
        });
    }
}

// Load sidebar
fetch('../../components/sidebar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;

        initializeNavbar();
    });
    
function initializeNavbar() {
    document.querySelector('.sidebar-toggle')
        ?.addEventListener('click', () => {
            document.querySelector('.sidebar')
                .classList.toggle('collapsed');
        });
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      if(this.innerText.includes('Products')) alert('You are already on Product Management view.');
      else alert(`Demo: ${this.innerText} section (Product Management remains active).`);
    });
  });
    
}

// Initialize products and filters
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    setupCategoryFilter();
    setupSearch();
    recalcAndRender();
});