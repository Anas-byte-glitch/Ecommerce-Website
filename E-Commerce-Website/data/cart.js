export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, size, color, quantity = 1, price) {
  const matchingItem = cart.find(
    item =>
      item.productId === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
  );

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      selectedSize: size,
      selectedColor: color,
      quantity,
      price
    });
  }

  saveToStorage();
}

export function removeFromCart(productId, size, color) {
  cart = cart.filter(
    item =>
      !(
        item.productId === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      )
  );
  saveToStorage(); 
}
