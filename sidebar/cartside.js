/*======== ASIDE BAR CART ========== */
const cartBtn = document.querySelector(".cart");
const cartDrawer = document.getElementById("cart-drawer");
const closeBtn = document.getElementById("cart-close");

cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.add("cart-open");
    overlay.classList.add("show");
});

overlay.addEventListener("click", closeCart);
closeBtn.addEventListener("click", closeCart);

function closeCart(){
    document.body.classList.remove("cart-open");
    overlay.classList.remove("show");
}
