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


/*=============== HOME SLIDER ===============*/

// عناصر DOM
const slides = document.querySelectorAll(".slide");
const slidesContainer = document.querySelector(".slides");
const dotsContainer = document.querySelector(".slider-nav");

// حالة السلايدر
let index = 0;
let rafId = null;
let lastTime = 0;
const SLIDE_DELAY = 5000; // 5 ثواني

/*=============== CREATE DOTS ===============*/
slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.classList.add("slider-dot");

  if (i === 0) dot.classList.add("active");

  dot.addEventListener("click", () => {
    index = i;
    updateSlider();
    resetAutoSlide();
  });

  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".slider-dot");

/*=============== UPDATE SLIDER ===============*/
function updateSlider() {
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;

  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

/*=============== AUTO SLIDE (requestAnimationFrame) ===============*/
function animateSlider(time) {
  if (!lastTime) lastTime = time;

  const elapsed = time - lastTime;

  if (elapsed >= SLIDE_DELAY) {
    index = (index + 1) % slides.length;
    updateSlider();
    lastTime = time;
  }

  rafId = requestAnimationFrame(animateSlider);
}

function startAutoSlide() {
  cancelAnimationFrame(rafId);
  lastTime = 0;
  rafId = requestAnimationFrame(animateSlider);
}

function resetAutoSlide() {
  startAutoSlide();
}

/*=============== INIT ===============*/
updateSlider();
startAutoSlide();


// Swipe support
let startX = 0, endX = 0;
const swipeThreshold = 50;

slidesContainer.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
slidesContainer.addEventListener("touchmove", (e) => endX = e.touches[0].clientX);
slidesContainer.addEventListener("touchend", () => {
    const diff = startX - endX;
    if (Math.abs(diff) < swipeThreshold) return;
    index = diff > 0 ? (index + 1) % slides.length : (index - 1 + slides.length) % slides.length;
    updateSlider();
    resetAutoSlide();
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
  const scrollUp = document.getElementById('scroll-up')
  window.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp);

/*=================================== PRODUCTS WITH JS ====================================*/ 
import { products } from "./data/products.js"; 
import { cart, addToCart, removeFromCart } from './data/cart.js';

let productHTML = "";

products.forEach((product) => {
  productHTML += `
  <div class="product-card" data-product-id="${product.id}">
    <div class="product-img">
      <img src="${product.image}" alt="Product" loading="lazy">

      <!-- SHEET -->
      <div class="product-sheet">
        <button class="sheet-close">✕</button>
        <p>Color :</p>
        <div class="color-options">
          <span class="color" data-color="Gold" style="background-color: gold;"></span>
          <span class="color" data-color="Red" style="background-color: red;"></span>
          <span class="color" data-color="Brown" style="background-color: brown;"></span>
          <span class="color" data-color="Black" style="background-color: black;"></span>
        </div>
        <p>Size :</p>
        <select class="size-select">
          <option value="">Choose an option</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>
        <button class="confirm-add">ADD TO CART</button>
      </div>

      <div class="product-actions">
        <button class="action-btn js-add-to-cart" data-product-id="${product.id}">
          <i class="ri-shopping-bag-line"></i>
        </button>
        <button class="action-btn"><i class="ri-eye-line"></i></button>
      </div>
    </div>

    <div class="product-info">
      <h3>${product.titleInfo}</h3>
      <span class="category">${product.category}</span>
      <span class="price">${product.price} DA</span>
    </div>
  </div>
  `;
});

document.querySelector(".js-products-grid").innerHTML = productHTML;

// CLICK AND GO TO PRODUCT SHEET

document.querySelectorAll(".product-card .action-btn:nth-child(2)").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // منع حدث النقر من الانتقال للـ card
    const card = btn.closest(".product-card");
    const productId = card.dataset.productId;
    window.location.href = `product.html?id=${productId}`;
  });
});


/*=============== PRODUCT SHEET ===================*/
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const card = button.closest(".product-card");
    document.querySelectorAll(".product-card.active").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
  });
});

// Close sheet
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".sheet-close");
  if (!closeBtn) return;
  closeBtn.closest(".product-card").classList.remove("active");
});

// Select color
document.addEventListener("click", (e) => {
  const color = e.target.closest(".color");
  if (!color) return;
  color.parentElement.querySelectorAll(".color").forEach(c => c.classList.remove("active"));
  color.classList.add("active");
});

// Confirm add to cart
document.addEventListener("click", (e) => {
  const confirmBtn = e.target.closest(".confirm-add");
  if (!confirmBtn) return;

  const card = confirmBtn.closest(".product-card");
  const productId = card.dataset.productId; // ✅ مهم: كنص
  const selectedColor = card.querySelector(".color.active")?.dataset.color;
  const selectedSize = card.querySelector(".size-select").value;

  if (!selectedColor || !selectedSize) {
    alert("Please choose color and size");
    return;
  }
  
  const product = products.find(p => p.id === productId);
  const numericPrice = Number(product.price.replace(/,/g, ""));

  addToCart(productId, selectedSize, selectedColor, 1, numericPrice);
  updateCartQuantity();
  renderCart();
  updateHeaderPrice();

  card.classList.remove("active");
  document.body.classList.add("cart-open");
  overlay.classList.add("show");
});

/*=============== CART SIDE BAR ===================*/
const cartItemsContainer = document.querySelector(".js-cart-items");
const cartFooter = document.querySelector(".js-cart-footer");

// رسالة سلة فارغة
const emptyCartMessage = document.createElement("div");
emptyCartMessage.className = "cart-empty-message";
emptyCartMessage.innerHTML = `
  <p>Votre panier est vide</p>
  <a href="store.html" class="shop-now-btn">Aller au shopping</a>
`;
emptyCartMessage.style.display = "none";
cartItemsContainer.parentElement.appendChild(emptyCartMessage);

emptyCartMessage.querySelector(".shop-now-btn").addEventListener("click", () => {
  window.location.href = "#store";
});

// Render cart
function renderCart() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) return;

    cartSummaryHTML += `
      <div class="cart-item js-cart-item-${product.id}">
        <img src="${product.image}" loading="lazy">
        <div class="cart-item-info">
          <p class="title">${product.titleInfo}</p>
          <span class="details">
            Qty: ${cartItem.quantity} <br>
            Size: ${cartItem.selectedSize} <br>
            Color: ${cartItem.selectedColor}
          </span>
          <span class="price">${product.price} DA</span>
        </div>
        <button 
          class="remove js-remove-btn"
          data-product-id="${cartItem.productId}"
          data-size="${cartItem.selectedSize}"
          data-color="${cartItem.selectedColor}">
          ✕
        </button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = cartSummaryHTML;

  if (cart.length === 0) {
    cartFooter.style.display = "none";
    emptyCartMessage.style.display = "block";
  } else {
    cartFooter.style.display = "block";
    emptyCartMessage.style.display = "none";
  }

   // ✅ تحديث subtotal في sidebar
  const subtotalEl = document.querySelector(".js-subtotal-price");
  if (subtotalEl) {
    subtotalEl.innerHTML = calculateSubtotal().toLocaleString() + " DA";
  }

  updateHeaderPrice();
}

// Update cart quantity
export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach(item => cartQuantity += item.quantity);
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

// Calculate subtotal
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

// Update header price
export function updateHeaderPrice() {
  const priceEl = document.getElementById("price");
  priceEl.innerHTML = cart.length === 0 ? "0.00 DA" : calculateSubtotal().toLocaleString() + " DA";
}

// Remove from cart
cartItemsContainer.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".js-remove-btn");
  if (!removeBtn) return;

  const productId = removeBtn.dataset.productId;
  const size = removeBtn.dataset.size;
  const color = removeBtn.dataset.color;

  removeFromCart(productId, size, color);
  renderCart();
  updateCartQuantity();
  updateHeaderPrice();
});

// Init
updateCartQuantity();
renderCart();
updateHeaderPrice();
