/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById('header');
  if (window.scrollY >= 50) {
    header.classList.add('shadow-header');
  } else {
    header.classList.remove('shadow-header');
  }
};
window.addEventListener('scroll', shadowHeader);

/*=============== CHECKOUT PAGE ===============*/
import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";

// عناصر DOM
const checkoutItemsContainer = document.querySelector(".js-checkout-items");
const subtotalEl = document.querySelector(".js-subtotal-price");
const totalEl = document.querySelector(".js-total-price");
let shippingRadios = document.querySelectorAll('input[name="Livraison"]');

// حساب Subtotal
function calculateSubtotal() {
  let subtotal = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    const price = parseFloat(product.price.replace(/,/g, ""));
    subtotal += price * item.quantity;
  });
  return subtotal;
}

// تحديث Totals
function updateTotals() {
  const subtotal = calculateSubtotal();
  const shipping = getSelectedShipping();
  subtotalEl.innerHTML = subtotal.toLocaleString() + " DA";
  totalEl.innerHTML = (subtotal + shipping).toLocaleString() + " DA";
}

// عرض عناصر Checkout
function renderCheckout() {
  let html = "";

  const checkoutTable = document.querySelector('.cart-table');
  const cartTotals = document.querySelector('.cart-totals');
  const emptyCheckout = document.getElementById('empty-checkout');

  // ✅ إذا السلة فارغة
  if (cart.length === 0) {
    checkoutTable.style.display = 'none';
    cartTotals.style.display = 'none';
    emptyCheckout.classList.remove('hidden');

    checkoutItemsContainer.innerHTML = "";
    updateTotals();
    return;
  }

  // ❌ إذا السلة غير فارغة
  emptyCheckout.classList.add('hidden');
  checkoutTable.style.display = '';
  cartTotals.style.display = '';

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const priceNumber = parseFloat(product.price.replace(/,/g, ""));
    const itemSubtotal = priceNumber * item.quantity;

    html += `
      <tr>
        <!-- PRODUCT -->
        <td class="product" data-label="PRODUCT">
          <div class="product-box">
            <img src="${product.image}" alt="${product.titleInfo}">

            <div class="product-info">
              <div class="product-text">
                <div class="product-title-row">
                  <span class="product-name">${product.titleInfo}</span>

                  <button class="remove-btn"
                    data-id="${item.productId}"
                    data-size="${item.selectedSize}"
                    data-color="${item.selectedColor}">
                    ✕
                  </button>
                </div>

                <span class="product-variant">
                  Size: ${item.selectedSize} | Color: ${item.selectedColor}
                </span>
              </div>
            </div>
          </div>
        </td>

        <!-- PRICE -->
        <td data-label="PRICE">${priceNumber.toLocaleString()} DA</td>

        <!-- QUANTITY -->
        <td data-label="QUANTITY">
          <div class="qty">
            <button class="decrease"
              data-id="${item.productId}"
              data-size="${item.selectedSize}"
              data-color="${item.selectedColor}">-</button>

            <span>${item.quantity}</span>

            <button class="increase"
              data-id="${item.productId}"
              data-size="${item.selectedSize}"
              data-color="${item.selectedColor}">+</button>
          </div>
        </td>

        <!-- SUBTOTAL -->
        <td data-label="SUBTOTAL">${itemSubtotal.toLocaleString()} DA</td>
      </tr>
    `;
  });

  checkoutItemsContainer.innerHTML = html;
  updateTotals();
  updateHeaderCart(); // ✅ تحديث الهيدر
}




// التعامل مع حذف أو تعديل الكمية
checkoutItemsContainer.addEventListener("click", (e) => {
  const target = e.target;

  // 1️⃣ زر الحذف
  if (target.classList.contains("remove-btn")) {
    const productId = target.dataset.id;
    const size = target.dataset.size;
    const color = target.dataset.color;

    removeFromCart(productId, size, color); // حذف من cart
    renderCheckout(); // إعادة العرض بعد الحذف
    updateHeaderCart(); // ✅ تحديث الهيدر
    return;
  }

  // 2️⃣ زيادة الكمية
  if (target.classList.contains("increase")) {
    const productId = target.dataset.id;
    const size = target.dataset.size;
    const color = target.dataset.color;

    const cartItem = cart.find(i => i.productId === productId && i.selectedSize === size && i.selectedColor === color);
    if (!cartItem) return;

    cartItem.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
    updateHeaderCart(); // ✅ تحديث الهيدر
    return;
  }

  // 3️⃣ نقص الكمية
  if (target.classList.contains("decrease")) {
    const productId = target.dataset.id;
    const size = target.dataset.size;
    const color = target.dataset.color;

    const cartItem = cart.find(i => i.productId === productId && i.selectedSize === size && i.selectedColor === color);
    if (!cartItem) return;

    cartItem.quantity -= 1;
    if (cartItem.quantity <= 0) {
      removeFromCart(productId, size, color); // حذف إذا الكمية صفر
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
    updateHeaderCart(); // ✅ تحديث الهيدر
    return;
  }
});

const headerCartQuantity = document.querySelector(".js-cart-quantity");
const headerCartPrice = document.getElementById("price");

function updateHeaderCart() {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const priceNumber = parseFloat(product.price.replace(/,/g, ""));
    totalPrice += priceNumber * item.quantity;
    totalQuantity += item.quantity;
  });

  headerCartQuantity.textContent = totalQuantity;
  headerCartPrice.textContent = totalPrice.toLocaleString() + " DA";
}

// 📦 أسعار التوصيل حسب الولاية
const shippingPrices = {
  Adrar: { home: 900, office: 500 },
  Alger: { home: 400, office: 200 },
  Oran: { home: 500, office: 250 },
  Constantine: { home: 600, office: 300 }
};

let currentWilaya = "Adrar";

// عناصر
const changeAddressBtn = document.getElementById("changeAddress");
const addressModal = document.getElementById("addressModal");
const wilayaSelect = document.getElementById("wilayaSelect");
const confirmAddress = document.getElementById("confirmAddress");
const closeAddress = document.getElementById("closeAddress");
const currentWilayaEl = document.getElementById("currentWilaya");

// فتح المودال
changeAddressBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addressModal.classList.remove("hidden");
});

closeAddress.addEventListener("click", () => {
  addressModal.classList.add("hidden");
});

// تأكيد تغيير العنوان
confirmAddress.addEventListener("click", () => {
  currentWilaya = wilayaSelect.value;
  currentWilayaEl.textContent = currentWilaya;

  // تحديث نص الشحن وإعادة تعيين الراديوهات
  shippingRadios = updateShippingLabels();

  // حفظ الولاية وسعر الشحن المحدد في localStorage
  const prices = shippingPrices[currentWilaya];
  let shipping = 0;
  shippingRadios.forEach(r => {
    if (r.checked) {
      shipping = r.nextSibling.textContent.includes("المنزل")
        ? prices.home
        : prices.office;
    }
  });

  localStorage.setItem("selectedWilaya", currentWilaya);
  localStorage.setItem("shippingPrice", shipping);

  // إعادة حساب المجموع بعد تغيير سعر الشحن
  updateTotals();

  addressModal.classList.add("hidden");
});


// تحديث نصوص الشحن حسب الولاية
function getSelectedShipping() {
  const prices = shippingPrices[currentWilaya];
  let shipping = 0;

  shippingRadios.forEach(r => {
    if (r.checked) {
      shipping = r.nextSibling.textContent.includes("المنزل")
        ? prices.home
        : prices.office;
    }
  });

  return shipping;
}

function updateShippingLabels() {
  const prices = shippingPrices[currentWilaya];

  shippingRadios[0].parentElement.innerHTML = `
    <input type="radio" name="Livraison" checked>
    توصيل إلى المنزل - ${prices.home.toLocaleString()} DA
  `;

  shippingRadios[1].parentElement.innerHTML = `
    <input type="radio" name="Livraison">
    الاستلام من المكتب - ${prices.office.toLocaleString()} DA
  `;

  // إعادة الحصول على عناصر الراديو بعد تغيير HTML
  const newShippingRadios = document.querySelectorAll('input[name="Livraison"]');
  newShippingRadios.forEach(r => r.addEventListener("change", updateTotals));

  return newShippingRadios; // نعيد المتغير الجديد
}



// فتح المودال
changeAddressBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addressModal.classList.add("show");
});

// إغلاق المودال
closeAddress.addEventListener("click", () => {
  addressModal.classList.remove("show");
});

// إغلاق المودال عند الضغط على Confirm
confirmAddress.addEventListener("click", () => {
  // هنا يمكنك وضع أي كود لتغيير الولاية أو تحديث السعر
  addressModal.classList.remove("show");
});

// إغلاق المودال عند الضغط على زر Close
closeAddress.addEventListener("click", () => {
  addressModal.classList.remove("show");
});

// إغلاق المودال عند الضغط خارج الصندوق
addressModal.addEventListener("click", (e) => {
  if (e.target === addressModal) {
    addressModal.classList.remove("show");
  }
});


// تحديث عند تغيير الشحن
shippingRadios.forEach(r => r.addEventListener("change", updateTotals));

renderCheckout();
updateHeaderCart(); // ✅ تحديث الهيدر
