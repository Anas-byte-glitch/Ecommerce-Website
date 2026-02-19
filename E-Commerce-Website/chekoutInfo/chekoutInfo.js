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

/*============================== CHEKOUT WITH JS ==============================*/
import { products } from "../data/products.js";


const orderItemsEl = document.getElementById("order-items");
const subtotalEl = document.getElementById("order-subtotal");
const shippingEl = document.getElementById("order-shipping");
const totalEl = document.getElementById("order-total");

// قراءة السلة
const cart = JSON.parse(localStorage.getItem("cart")) || [];

let subtotal = 0;

const shippingPrice = parseFloat(localStorage.getItem("shippingPrice")) || 0;
const selectedWilaya = localStorage.getItem("selectedWilaya") || "";


orderItemsEl.innerHTML = "";

// عرض المنتجات
cart.forEach(item => {
  const product = products.find(p => p.id === item.productId);

  if (!product) return;

  const price = parseFloat(product.price.replace(/,/g, ""));
  const itemTotal = price * item.quantity;
  subtotal += itemTotal;

  orderItemsEl.innerHTML += `
    <div class="order-row">
      <span>
        ${product.titleInfo}
        ${item.selectedColor ? `– ${item.selectedColor}` : ""}
        ${item.selectedSize ? `, ${item.selectedSize}` : ""}
        ×${item.quantity}
      </span>
      <span>${itemTotal.toLocaleString()} DA</span>
    </div>
  `;
});


// حساب الأسعار
subtotalEl.textContent = `${subtotal.toLocaleString()} DA`;
shippingEl.textContent = `${shippingPrice.toLocaleString()} DA${selectedWilaya ? " (" + selectedWilaya + ")" : ""}`;
totalEl.textContent = `${(subtotal + shippingPrice).toLocaleString()} DA`;


// تحديث الهيدر: الكمية والسعر الكلي
const updateHeaderCart = () => {
  const cartQuantityEl = document.querySelector(".js-cart-quantity"); // span الكمية
  const cartPriceEl = document.getElementById("price"); // span السعر الكلي
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // حساب مجموع الكميات والسعر الكلي
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalQuantity += item.quantity;

    // الحصول على سعر المنتج من البيانات (تأكد من استيراد products)
    const product = products.find(p => p.id === item.productId);
    if (product) {
      const price = parseFloat(product.price.replace(/,/g, "")); // إزالة الفواصل وتحويل لرقم
      totalPrice += price * item.quantity;
    }
  });

  // تحديث الهيدر
  cartQuantityEl.textContent = totalQuantity;
  cartPriceEl.textContent = totalPrice.toLocaleString() + " DA";
};

// استدعاء الدالة عند تحميل الصفحة
updateHeaderCart();
