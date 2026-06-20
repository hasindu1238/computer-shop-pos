// product data
const products = [
    { id: 1, name: "Mango Juice", price: 500, defaultDiscount: 0 }
];

// cart state
let cart = [];

// helper to recalculate everything and render
function recalcAndRender() {

    const updatedCart = cart.map(item => {
        const itemDiscountPercent = item.discountPercent || 0;
        const originalItemPrice = item.price;

        const discountAmountPerItem =
            (originalItemPrice * itemDiscountPercent) / 100;

        const priceAfterItemDiscount =
            originalItemPrice - discountAmountPerItem;

        const lineTotalAfterDiscount =
            priceAfterItemDiscount * item.quantity;

        const lineTotalBeforeDiscount =
            originalItemPrice * item.quantity;

        const lineDiscountTotal =
            lineTotalBeforeDiscount - lineTotalAfterDiscount;

        return {
            ...item,
            lineTotalAfterDiscount,
            effectiveUnitPrice: priceAfterItemDiscount,
            lineTotalBeforeDiscount,
            lineDiscountTotal
        };
    });

    // subtotal before discounts
    const subTotalBeforeDiscount = updatedCart.reduce(
        (sum, item) => sum + item.lineTotalBeforeDiscount,
        0
    );

    // subtotal after item discounts
    const subTotalAfterDiscount = updatedCart.reduce(
        (sum, item) => sum + item.lineTotalAfterDiscount,
        0
    );

    // total item discounts
    const totalItemSave = updatedCart.reduce(
        (sum, item) => sum + item.lineDiscountTotal,
        0
    );

    // global discount
    const discountInput =
        document.getElementById("discountPercentInput");

    const globalDiscountPercent =
        discountInput ? parseFloat(discountInput.value) || 0 : 0;

    const globalDiscountValue =
        (subTotalAfterDiscount * globalDiscountPercent) / 100;

    const finalTotal =
        subTotalAfterDiscount - globalDiscountValue;

    const totalSaved =
        totalItemSave + globalDiscountValue;

    // update summary
    document.getElementById("totalSave").innerText =
        `Rs.${totalSaved.toFixed(2)}`;

    document.getElementById("subTotal").innerText =
        `Rs.${subTotalBeforeDiscount.toFixed(2)}`;

    document.getElementById("stat-total").innerText =
        `Rs.${finalTotal.toFixed(2)}`;

    renderBillTable(updatedCart);
}

function renderBillTable(cartItems) {

    const tbody =
        document.getElementById("billTableBody");

    if (!cartItems.length) {
        tbody.innerHTML = `
            <tr class="empty-cart-row">
                <td colspan="5" style="text-align:center;padding:2rem;">
                    No items added
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    cartItems.forEach(item => {

        const row = tbody.insertRow();

        // remove button
        const actionCell = row.insertCell(0);

        const removeBtn =
            document.createElement("button");

        removeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="20"
                 height="20"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2">
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M3 6h18"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        `;

        removeBtn.className = "remove-item";

        removeBtn.addEventListener("click", () => {
            removeCartItem(item.id);
        });

        actionCell.appendChild(removeBtn);

        // name
        const nameCell = row.insertCell(1);
        nameCell.innerText = item.name;
        nameCell.className = "item-name-cell";

        // quantity
        const qtyCell = row.insertCell(2);

        const qtyWrapper =
            document.createElement("div");

        qtyWrapper.className = "qty-control";

        const minusBtn =
            document.createElement("button");

        minusBtn.innerHTML = "-";
        minusBtn.className = "qty-btn minus";

        minusBtn.addEventListener("click", e => {
            e.stopPropagation();
            changeQuantity(item.id, -1);
        });

        const qtySpan =
            document.createElement("span");

        qtySpan.className = "qty-number";
        qtySpan.innerText = item.quantity;

        const plusBtn =
            document.createElement("button");

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

        // discount
        const discCell = row.insertCell(3);

        const discSpan =
            document.createElement("span");

        discSpan.className = "discount-badge";
        discSpan.innerText = `${item.discountPercent || 0}%`;

        discCell.appendChild(discSpan);

        // FIXED PRICE CALCULATION
        const priceCell = row.insertCell(4);

        priceCell.innerText =
            `Rs.${item.lineTotalAfterDiscount.toFixed(2)}`;
    });
}

function changeQuantity(productId, delta) {

    const index =
        cart.findIndex(item => item.id === productId);

    if (index !== -1) {

        const newQty =
            cart[index].quantity + delta;

        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }

        recalcAndRender();
    }
}

function removeCartItem(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    recalcAndRender();
}

function addToCart(product) {

    const existing =
        cart.find(item => item.id === product.id);

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            discountPercent: product.defaultDiscount || 0
        });
    }

    recalcAndRender();
}

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

// initial render
recalcAndRender();