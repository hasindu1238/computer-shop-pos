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