//product data 
const products = [
    { id: 1, name: "Mango Juice", price: 500, defaultDiscount: 0}
];

//cart state: each entry { id, name, price, quantity, defaultDiscount}
let cart = [];

//helper to reclac everything and render
function recalcAndRender(){
    // 1. calculate item totals, save, subtotal (before global discount)
    let subTotalBeforeGlobal = 0;
    let totalItemDiscount = 0;


    const updatedCart = cart.map(item => {
    const itemDiscountPercent = item.discountPercent || 0;
    const originalItemPrice = item.price;
    const discountAmountPerItem = (originalItemPrice * itemDiscountPercent)/100;
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

    //subTotal before discount 
    let subTotalBeforeDiscount = updatedCart.reduce(
        (sum, i) => sum + i.lineTotalBeforeDiscount,0
    );

    // subtotal AFTER item-level discount (but before global)
    let subTotalAfterDiscount = updatedCart.reduce(
        (sum, i) => sum + i.lineTotalAfterDiscount,0
    );

    //Calculate Total discount saved
    let totalItemSave = updatedCart.reduce(
        (sum, i) => sum + i.lineDiscountTotal,0
    );

    // global discount % from input
    const globalDiscountPercent = parseFloat(document.getElementById('discountPercentInput').value)
    const globalDiscountValue = isNaN(globalDiscountPercent)? 0 
        : (subTotalAfterDiscount * globalDiscountPercent)/100;
    const finalTotal = subTotalAfterDiscount - globalDiscountValue;

    // total saved = item discount + global discount
    const totalSaved = totalItemSave + globalDiscountValue ;

    //update DOM Summary
    document.getElementById('totalSave').innerText = `Rs.${totalSaved.toFixed(2)}`;
    document.getElementById('subTotal').innerText = `Rs.${subTotalBeforeDiscount.toFixed(2)}`;
    document.getElementById('stat-total').innerText = `Rs.${finalTotal.toFixed(2)}`;

    // render bill table rows
    renderBillTable(updatedCart, globalDiscountPercent);
}

function renderBillTable(cartItems, globalDiscountPercentApplied){
    const tbody = document.getElementById('billTableBody');

    if(!cartItems.length){
        tbody.innerHTML = `

        <tr class="empty-cart-row">
        <td colspan="5" style="text-align:center; padding: 2rem;">
        No items added
        </td>
        </tr>
        `;
        return;
    }

    tbody.innerHTML = "";
    cartItems.forEach((item, idx) => {
        const row = tbody.insertRow();
        //remove action
        const actionCell = row.insertCell(0);
        const removeBtn = document.createElement('button');
        removeBtn.innerText = '✕';
        removeBtn.className = 'remove-item';
        removeBtn.addEventListener('click', () => {
            removeCartItem(item.id);
        });
        actionCell.appendChild(removeBtn);

        //name
        
        const nameCell = row.insertCell(1);
        nameCell.innerText = item.name;
        nameCell.className = 'item-name-cell'

        // qty with controls
        const qtyCell = row.insertCell(2);
        const qtyWrapper = document.createElement('div');
        qtyWrapper.className = 'qty-control';

        //minus button
        const minusBtn = document.createElement('button');
        minusBtn.innerText = '-';
        minusBtn.className = 'qty-btn';
        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            changeQuantity(item.id, -1);
        });

        const qtySpan = document.createElement('span');
        qtySpan.className = 'qty-number';
        qtySpan.innerText = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.innerText = '+';
        plusBtn.className = 'qty-btn';
        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            changeQuantity(item.id, 1);
        });

        qtyWrapper.appendChild(minusBtn);
        qtyWrapper.appendChild(qtySpan);
        qtyWrapper.appendChild(plusBtn);
        qtyCell.appendChild(qtyWrapper);

        // discount cell (show item discount %)
        const discCell = row.insertCell(3);
        const discSpan = document.createElement('span');
        discSpan.className = 'discount-badge';
        discSpan.innerHTML = `${item.discountPercent || 0}%`;
        discCell.appendChild(discSpan);

        // price cell: show line total after item discount
        const priceCell = row.insertCell(4);
        const linePrice = (
            item.price *(1 - (item.discountPercent || 10)/100) * item.quantity);
        priceCell.innerText = `Rs.${linePrice.toFixed(2)}`;

        
    });
}

function changeQuantity(productId, delta){
    const index = cart.findIndex(i => i.id === productId);

    if (index !== -1){
        const newQty = cart[index].quantity + delta;
        if (newQty <= 0){
            cart.splice(index, 1);
        }else {
            cart[index].quantity = newQty;
        }
        recalcAndRender();
    }
}

function removeCartItem(productId){
    cart = cart.filter(i => i.id !== productId);
    recalcAndRender();
}

function addToCart(product){
    const existing = cart.find(
        i => i.id === product.id
    );
    if(existing){
        existing.quantity += 1;
    }else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            discountPercent: product.defaultDiscount || 0
        })
    }recalcAndRender();
}


recalcAndRender();