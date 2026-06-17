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
                <span class="brand-chip" style="background:#eef2ff;">
                    ${escapeHtml(product.id)}
                </span>
            </td>
            <td><div class="product-img-placeholder"><i class="fas ${product.imageIcon || 'fa-image'}"></i></div></td>
            <td><strong>${escapeHtml(product.name)}</strong></td>
            <td>${escapeHtml(product.category)}</td>
            <td>${escapeHtml(product.unit || '-')}</td>
            <td>${escapeHtml(product.brand || '-')}</td>
            <td>$${parseFloat(product.costPrice || 0).toFixed(2)}</td>
            <td>$${parseFloat(product.sellingPrice || 0).toFixed(2)}</td>
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