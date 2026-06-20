// ---------- DATA ----------
let products = [];
let editingId = null;

function generateProductId(){
    let lastId = parseInt(localStorage.getItem('lastProductId') || '0');

    lastId++;

    localStorage.setItem('lastProductId', lastId);

    return `PRD-${String(lastId).padStart(6,'0')}`;
}

const initialProducts = [
    { id: generateProductId(), name: "Premium Espresso Beans", category: "Beverages", unit: "500g", brand: "RoastMaster", costPrice: 8.50, sellingPrice: 14.99, barcode: "490123456789", status: "Active", imageIcon: "fa-mug-hot" },
    { id: generateProductId(), name: "Wireless Noise Cancelling Headphones", category: "Electronics", unit: "pcs", brand: "SoundWave", costPrice: 45.00, sellingPrice: 89.99, barcode: "880123456789", status: "Active", imageIcon: "fa-headphones" },
    { id: generateProductId(), name: "Men's Running Shoes", category: "Apparel", unit: "pair", brand: "Athletix", costPrice: 32.00, sellingPrice: 69.99, barcode: "570123456789", status: "Inactive", imageIcon: "fa-shoe-prints" }
  ];

function initData(){
    products = initialProducts.map( p =>  ({
        ...p,
        id: p.id || generateProductId()
    }));
    renderTable();
}

function escapeHtml(str){
    if(!str) return '';

    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderTable(){
    const tbody = document.getElementById('tableBody');

    //Show message if products exist
    if (!products.length){
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="11">
                    No products found.Click "Add New Item" to create product.
                </td>
            </tr>`;
        return;
    }

    //Generate table rows
    tbody.innerHTML = products.map(product =>`
        <tr>
            <td>
                <span class="brand-chip" style="background: #e9fff0;">
                    ${escapeHtml(product.id)}
                </span>
            </td>
            <td><div class="product-img-placeholder"><i class="fas ${product.imageIcon || 'fa-image'}"></i></div></td>
            <td><strong>${escapeHtml(product.name)}</strong></td>
            <td>${escapeHtml(product.category)}</td>
            <td>${escapeHtml(product.unit || '-')}</td>
            <td>${escapeHtml(product.brand || '-')}</td>
            <td>Rs.${parseFloat(product.costPrice || 0).toFixed(2)}</td>
            <td>Rs.${parseFloat(product.sellingPrice || 0).toFixed(2)}</td>
            <td><span style="font-family: monospace;">${escapeHtml(product.barcode || '-')}</span></td>
            <td><span class="status-badge" style="${product.status === 'Inactive' ? 'background:#fee2e2; color:#b91c1c;' : ''}">${product.status}</span></td>
            <td class="action-icons">
            <i class="fas fa-edit" data-id="${product.id}" title="Edit"></i>
            <i class="fas fa-trash-alt" data-id="${product.id}" title="Delete"></i>
            </td>
        </tr>`).join('');
        document.querySelectorAll('.fa-edit').forEach(icon =>{
            icon.addEventListener('click', (e) => {
                const id = icon.getAttribute('data-id');
                openEditModal(id);
            })
        })
        document.querySelectorAll('.fa-trash-alt').forEach(icon => {
            icon.addEventListener('click', (e) => {
                 const id = icon.getAttribute('data-id');
                deleteProductById(id); });
    });

}

function deleteProductById(id){
    if (confirm('Delete this product?')){
        products = products.filter(p => p.id !== id);
        renderTable();
    }
}

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').innerText = 'Add New Item';
    document.getElementById('productName').value = '';
    document.getElementById('category').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('costPrice').value = '';
    document.getElementById('sellingPrice').value = '';
    document.getElementById('barcode').value = '';
    document.getElementById('status').value = 'Active';
    document.getElementById('productModal').style.display = 'flex';
  }

function openEditModal(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;
    editingId = id;
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('category').value = product.category || '';
    document.getElementById('unit').value = product.unit || '';
    document.getElementById('brand').value = product.brand || '';
    document.getElementById('costPrice').value = product.costPrice ?? '';
    document.getElementById('sellingPrice').value = product.sellingPrice ?? '';
    document.getElementById('barcode').value = product.barcode || '';
    document.getElementById('status').value = product.status || 'Active';
    document.getElementById('productModal').style.display = 'flex';
  }

function saveProductFromModal() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value.trim();
    const unit = document.getElementById('unit').value.trim();
    const brand = document.getElementById('brand').value.trim();
    let costPrice = parseFloat(document.getElementById('costPrice').value);
    let sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const barcode = document.getElementById('barcode').value.trim();
    const status = document.getElementById('status').value;
    if(!name || !category) { alert('Product Name and Category are required!'); return; }
    if(isNaN(costPrice)) costPrice = 0;
    if(isNaN(sellingPrice)) sellingPrice = 0;
    const imageIconsList = ['fa-box', 'fa-cube', 'fa-archive', 'fa-tag', 'fa-apple', 'fa-mobile-alt', 'fa-laptop', 'fa-tshirt'];
    const randomIcon = imageIconsList[Math.floor(Math.random() * imageIconsList.length)];
    if(editingId === null) {
      const newProduct = { id: generateProductId(), name, category, unit: unit || 'pcs', brand: brand || 'Generic', costPrice, sellingPrice, barcode: barcode || 'N/A', status, imageIcon: randomIcon };
      products.unshift(newProduct);
    } else {
      const index = products.findIndex(p => p.id === editingId);
      if(index !== -1) {
        products[index] = { ...products[index], name, category, unit: unit || products[index].unit, brand: brand || products[index].brand, costPrice, sellingPrice, barcode: barcode || products[index].barcode, status };
      }
    }
    renderTable();
    closeModal();
  }

function closeModal() { 
    document.getElementById('productModal').style.display = 'none';
    editingId = null; }

// ----- SIDEBAR TOGGLE (HIDE / UNHIDE) -----
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




// modal event listeners
document.getElementById('openAddModalBtn').addEventListener('click', openAddModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
document.getElementById('saveProductBtn').addEventListener('click', saveProductFromModal);
window.addEventListener('click', (e) => { 
    const modal = document.getElementById('productModal');
    if(e.target === modal) closeModal(); });

// Sidebar navigation highlight, plus demo message (non-destructive)


initData();