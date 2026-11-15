/* PULO MART - SHOPPING SYSTEM */

// IMPORTANT:
// Replace with your WhatsApp Business number.
// Format: country code + number, without + or spaces.
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

// Demo prices only. Replace with verified selling prices
// before accepting real orders.
const products = [
  {id:1, name:"Premium Rice", category:"Rice & Atta", weight:"1 kg", price:demoPrice(90), image:""},
  {id:2, name:"Wheat Atta", category:"Rice & Atta", weight:"1 kg", price:demoPrice(45), image:""},
  {id:3, name:"Moong Dal", category:"Pulses", weight:"1 kg", price:demoPrice(120), image:""},
  {id:4, name:"Chana Dal", category:"Pulses", weight:"1 kg", price:demoPrice(85), image:""},
  {id:5, name:"Turmeric Powder", category:"Spices", weight:"100 g", price:demoPrice(35), image:""},
  {id:6, name:"Red Chilli Powder", category:"Spices", weight:"100 g", price:demoPrice(40), image:""},
  {id:7, name:"Cooking Oil", category:"Oils & Masala", weight:"1 L", price:demoPrice(150), image:""},
  {id:8, name:"Almonds", category:"Dry Fruits", weight:"250 g", price:demoPrice(220), image:""}
];

function demoPrice(value) {
  return value;
}

let cart = [];

// ELEMENTS
const productList = document.getElementById("product-list");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");
const cartButton = document.querySelector(".header-actions button:nth-child(2)");
const cartCount = document.getElementById("cart-count");
const whatsappButton = document.getElementById("whatsapp-order");

// DISPLAY PRODUCTS
function displayProducts(items = products) {
  productList.innerHTML = "";

  if (!items.length) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-placeholder">🛒</div>
      <h3>${product.name}</h3>
      <p>${product.weight}</p>
      <p><strong>₹${product.price}</strong></p>
      <button class="add-button">Add to Cart</button>
    `;

    card.querySelector(".add-button").addEventListener("click", () => {
      addToCart(product.id);
    });

    productList.appendChild(card);
  });
}

// SEARCH
function searchProducts() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  displayProducts(filtered);
}

searchInput.addEventListener("input", searchProducts);
searchButton.addEventListener("click", searchProducts);

// ADD TO CART
function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({id, quantity:1});
  }

  updateCart();
  alert("Product added to cart!");
}

// CART COUNT
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// CART PANEL
const cartPanel = document.createElement("div");
cartPanel.id = "cart-panel";
cartPanel.className = "cart-panel";
cartPanel.hidden = true;

cartPanel.innerHTML = `
  <div class="cart-header">
    <h2>Your Shopping Cart</h2>
    <button id="close-cart">✕</button>
  </div>
  <div id="cart-items"></div>
  <h3 id="cart-total">Total: ₹0</h3>
  <button id="checkout-button">Order on WhatsApp</button>
`;

document.body.appendChild(cartPanel);

const cartItems = document.getElementById("cart-items");

cartButton.addEventListener("click", () => {
  renderCart();
  cartPanel.hidden = false;
});

document.getElementById("close-cart").addEventListener("click", () => {
  cartPanel.hidden = true;
});

// RENDER CART
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.textContent = "Your cart is empty.";
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <strong>${product.name}</strong>
      <p>₹${product.price} × ${item.quantity}</p>
      <div class="quantity-controls">
        <button class="minus">−</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
        <button class="remove">Remove</button>
      </div>
    `;

    row.querySelector(".minus").addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });

    row.querySelector(".plus").addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });

    row.querySelector(".remove").addEventListener("click", () => {
      cart = cart.filter(p => p.id !== item.id);
      updateCart();
      renderCart();
    });

    cartItems.appendChild(row);
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cart-total").textContent =
    `Total: ₹${total.toLocaleString("en-IN")}`;
}

// CHANGE QUANTITY
function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
  renderCart();
}

// WHATSAPP CHECKOUT
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!/^91[0-9]{10}$/.test(WHATSAPP_NUMBER)) {
    alert("Please configure your WhatsApp Business number first.");
    return;
  }

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  let message = "Hello PULO MART! I want to place an order.\n\n";

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    message += `${product.name} (${product.weight}) × ${item.quantity} = ₹${product.price * item.quantity}\n`;
  });

  message += `\nSubtotal: ₹${total}\n`;
  message += "\nPlease confirm availability, delivery charges and final amount.";

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

document.getElementById("checkout-button")
  .addEventListener("click", checkoutWhatsApp);

whatsappButton.addEventListener("click", event => {
  event.preventDefault();
  cartPanel.hidden = false;
  renderCart();
});

// INITIALIZE
displayProducts();
updateCart();
