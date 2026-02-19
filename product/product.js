/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  header.classList.toggle("shadow-header", window.scrollY >= 20);
};
window.addEventListener("scroll", shadowHeader);

/*=============== COLOR SELECTION ===============*/
document.querySelectorAll(".colors .color").forEach(color => {
  color.addEventListener("click", () => {
    document.querySelectorAll(".colors .color").forEach(c => c.classList.remove("active"));
    color.classList.add("active");
  });
});

/*=============================== IMPORTS ===============================*/
import { products } from "../data/products.js";
import { cart, addToCart, removeFromCart } from "../data/cart.js";

/*=============================== ELEMENTS ==============================*/
const mainImage = document.querySelector(".main-image img");
const thumbsContainer = document.querySelector(".thumbs");
const titleEl = document.querySelector(".product-title");
const priceEl = document.querySelector(".product-price");
const categoryEl = document.querySelector(".product-meta p:last-child");
const breadcrumbCategory = document.querySelector(".breadcrumb a:nth-child(2)");
const breadcrumbTitle = document.querySelector(".breadcrumb span");

const quantitySpan = document.querySelector(".quantity span");
const qtyButtons = document.querySelectorAll(".quantity button");

const cartItemsContainer = document.querySelector(".js-cart-items");
const cartFooter = document.querySelector(".js-cart-footer");
const emptyCartMessage = document.createElement("div");

let quantity = 1;
let selectedColor = null;
let selectedSize = null;

/*=============================== PRODUCT ID ============================*/
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = products.find(p => p.id === productId);

if (!product) {
  console.error("Product not found");
}

/*=============================== HELPER ================================*/
// تحويل السعر من النص مع الفواصل إلى رقم صالح
function getNumericPrice(priceStr) {
  return Number(priceStr.replace(/,/g, ""));
}

/*=============================== RENDER PRODUCT ========================*/
function renderProduct() {
  titleEl.innerHTML = `${product.titleInfo} <span>🤎 🖤</span>`;
  priceEl.textContent = getNumericPrice(product.price).toLocaleString() + " DA";
  categoryEl.innerHTML = `<strong>Category:</strong> ${product.category}`;
  breadcrumbCategory.textContent = product.category;
  breadcrumbTitle.textContent = product.titleInfo;

  const images = product.images?.length ? product.images : [product.image];
  mainImage.src = images[0];

  thumbsContainer.innerHTML = images
    .map((img, index) => `<img src="${img}" class="${index === 0 ? "active" : ""}">`)
    .join("");
}
renderProduct();

/*=============================== THUMB CLICK ==========================*/
thumbsContainer.addEventListener("click", e => {
  if (e.target.tagName !== "IMG") return;
  mainImage.src = e.target.src;
  thumbsContainer.querySelectorAll("img").forEach(img => img.classList.remove("active"));
  e.target.classList.add("active");
});

/*=============================== QUANTITY ============================*/
qtyButtons[0].onclick = () => {
  if (quantity > 1) quantity--;
  quantitySpan.textContent = quantity;
  updateProductPrice();
};

qtyButtons[1].onclick = () => {
  quantity++;
  quantitySpan.textContent = quantity;
  updateProductPrice();
};

/*=============================== COLOR & SIZE ========================*/
// Color
document.querySelectorAll(".colors .color").forEach(color => {
  color.addEventListener("click", () => {
    document.querySelectorAll(".colors .color").forEach(c => c.classList.remove("active"));
    color.classList.add("active");
    selectedColor = color.dataset.color || color.className;
  });
});

// Size
document.querySelector(".product-option select").addEventListener("change", e => {
  selectedSize = e.target.value;
});

/*=============================== ADD TO CART ==========================*/
document.querySelector(".add-cart").addEventListener("click", () => {
  let errorMessage = "";
  if (!selectedColor) errorMessage += "• Please choose a color\n";
  if (!selectedSize) errorMessage += "• Please choose a size\n";

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  addToCart(product.id, selectedSize, selectedColor, quantity, getNumericPrice(product.price));

  renderCart();
  updateHeader();
  document.body.classList.add("cart-open");
});

/*=============================== BUY NOW ==========================*/
document.querySelector(".buy-now").addEventListener("click", () => {
  let errorMessage = "";

  if (!selectedColor) errorMessage += "• Please choose a color\n";
  if (!selectedSize) errorMessage += "• Please choose a size\n";

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  // إضافة المنتج إلى السلة
  addToCart(
    product.id,
    selectedSize,
    selectedColor,
    quantity,
    getNumericPrice(product.price)
  );

  // تحديث الواجهة
  updateHeader();
  renderCart();

  // التحويل إلى صفحة checkout
  window.location.href = "chekout.html";
});

/*=============================== UPDATE PRODUCT PRICE =================*/
function updateProductPrice() {
  const totalPrice = getNumericPrice(product.price) * quantity;
  priceEl.textContent = totalPrice.toLocaleString() + " DA";
}
updateProductPrice();

/*=============================== CART SIDEBAR ========================*/
// Empty cart message
emptyCartMessage.className = "cart-empty-message";
emptyCartMessage.innerHTML = `
  <p>Votre panier est vide</p>
  <a href="store.html" class="shop-now-btn">Aller au shopping</a>
`;
emptyCartMessage.style.display = "none";
cartItemsContainer.parentElement.appendChild(emptyCartMessage);
emptyCartMessage.querySelector(".shop-now-btn").onclick = () => {
  window.location.href = "index.html#store";
};

/*=============================== RENDER CART ==========================*/
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartFooter.style.display = "none";
    emptyCartMessage.style.display = "block";
    return;
  }

  emptyCartMessage.style.display = "none";
  cartFooter.style.display = "block";

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;

    cartItemsContainer.innerHTML += `
  <div class="cart-item">
    <img src="${product.image}">
    <div class="cart-item-info">
      <p class="title">${product.titleInfo}</p>
      <span class="details">
        Qty: ${cartItem.quantity}<br>
        Size: ${cartItem.selectedSize}<br>
        Color: ${cartItem.selectedColor}
      </span>
      <span class="price">${(cartItem.price * cartItem.quantity).toLocaleString()} DA</span>
    </div>
    <button class="remove js-remove-btn"
      data-id="${cartItem.productId}"
      data-size="${cartItem.selectedSize}"
      data-color="${cartItem.selectedColor}">✕</button>
  </div>
  `;
  });

  updateSubtotalUI();
}

/*=============================== SUBTOTAL ============================*/
function calculateSubtotal() {
  return cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
}

function updateSubtotalUI() {
  const subtotalEl = document.querySelector(".js-subtotal-price");
  if (!subtotalEl) return;
  subtotalEl.textContent = calculateSubtotal().toLocaleString() + " DA";
}

/*=============================== HEADER UPDATE ======================*/
function updateHeader() {
  const priceEl = document.getElementById("price");
  const qtyEl = document.querySelector(".js-cart-quantity");

  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalQty += item.quantity;
    totalPrice += Number(item.price) * item.quantity;
  });

  qtyEl.textContent = totalQty;
  priceEl.textContent = totalPrice.toLocaleString() + " DA";
}

/*=============================== REMOVE ITEM ========================*/
cartItemsContainer.addEventListener("click", e => {
  const btn = e.target.closest(".js-remove-btn");
  if (!btn) return;
  removeFromCart(btn.dataset.id, btn.dataset.size, btn.dataset.color);
  renderCart();
  updateHeader();
});

/*=============================== INIT ==============================*/
renderCart();
updateHeader();
/*=============================== END OF FILE ========================*/