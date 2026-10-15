"use strict";

const products = [
  { id: 1, name: "Studio Wireless Headphones", category: "electronics", price: 2499, image: "photos/headphone.jpg", tone: "lilac", tag: "BESTSELLER", detail: "Sound, your way" },
  { id: 2, name: "Everyday Smart Watch", category: "electronics", price: 3999, image: "photos/watches.jpg", tone: "sand", tag: "JUST IN", detail: "A little more in sync" },
  { id: 3, name: "The Sunday Tee", category: "fashion", price: 799, image: "photos/tshirt.jpg", tone: "rose", tag: "EASY FAVOURITE", detail: "Your new go-to" },
  { id: 4, name: "Cloudwalk Sneakers", category: "shoes", price: 2499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", tone: "peach", tag: "LIGHT ON YOUR FEET", detail: "Made to move" },
  { id: 5, name: "Daytrip Canvas Pack", category: "accessories", price: 1599, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", tone: "sage", tag: "READY WHEN YOU ARE", detail: "Room for the good stuff" },
  { id: 6, name: "Golden Hour Shades", category: "accessories", price: 999, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", tone: "blue", tag: "SUNNY SIDE UP", detail: "A brighter outlook" },
  { id: 7, name: "Soft Days Hoodie", category: "fashion", price: 1299, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85", tone: "cream", tag: "FEEL-GOOD LAYER", detail: "Stay in a little longer" },
  { id: 8, name: "Weekend Runner", category: "shoes", price: 2999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", tone: "mint", tag: "READY FOR ANYTHING", detail: "Take the long way" }
];

const formatPrice = amount => Number(amount).toLocaleString("en-IN");
const readStorage = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
};
let cart = readStorage("novacart-cart", []).filter(item => products.some(product => product.id === item.id) && Number(item.quantity) > 0).map(item => ({ ...item, quantity: Math.floor(Number(item.quantity)) }));
let wishlist = new Set(readStorage("novacart-wishlist", []));
let activeCategory = "all";
let toastTimer;

const productContainer = document.getElementById("productContainer");
const cartOverlay = document.getElementById("cartOverlay");

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function updateProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const sort = document.getElementById("sortSelect").value;
  let visible = products.filter(product => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(query));
  if (sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (sort === "price-high") visible.sort((a, b) => b.price - a.price);
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById("resultCount").textContent = `${visible.length} ${visible.length === 1 ? "piece" : "pieces"}`;
  if (!visible.length) {
    productContainer.innerHTML = `<div class="no-results"><span>⌕</span><h3>No finds this time.</h3><p>Try another search or browse everything.</p><button type="button" onclick="resetFilters()">See all products</button></div>`;
    return;
  }
  productContainer.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="--card-delay:${index * 55}ms">
      <div class="product-image ${product.tone}"><img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.hidden=true;this.parentElement.classList.add('image-fallback')"><span class="fallback-mark" aria-hidden="true">✳</span><span class="product-tag">${product.tag}</span>
        <button class="wishlist ${wishlist.has(product.id) ? "selected" : ""}" type="button" onclick="toggleWishlist(${product.id})" aria-label="${wishlist.has(product.id) ? "Remove from" : "Add to"} wishlist" aria-pressed="${wishlist.has(product.id)}">${wishlist.has(product.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info"><div class="product-title-row"><h3>${product.name}</h3><span class="product-price">₹${formatPrice(product.price)}</span></div><p>${product.detail}</p><button class="add-btn" type="button" onclick="addToCart(${product.id})"><span>＋</span> Add to bag</button></div>
    </article>`).join("");
}

function resetFilters() {
  activeCategory = "all";
  document.getElementById("searchInput").value = "";
  document.querySelectorAll(".category-btn").forEach(button => button.classList.toggle("active", button.dataset.category === "all"));
  updateProducts();
}

function persistCart() { localStorage.setItem("novacart-cart", JSON.stringify(cart)); }
function addToCart(id) {
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity += 1;
  else cart.push({ id, quantity: 1 });
  persistCart(); updateCart(); showToast(`${products.find(product => product.id === id).name} added to your bag`);
}
function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  cart = cart.filter(entry => entry.quantity > 0);
  persistCart(); updateCart();
}
function removeFromCart(id) { cart = cart.filter(item => item.id !== id); persistCart(); updateCart(); }
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartHeaderCount").textContent = `(${count})`;
  document.getElementById("cartTotal").textContent = formatPrice(total);
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `<article class="cart-item"><div class="cart-thumb ${product.tone}"><img src="${product.image}" alt="" onerror="this.hidden=true"></div><div class="cart-item-info"><h3>${product.name}</h3><p>₹${formatPrice(product.price)}</p><div class="quantity"><button type="button" onclick="changeQuantity(${item.id},-1)" aria-label="Decrease ${product.name} quantity">−</button><span>${item.quantity}</span><button type="button" onclick="changeQuantity(${item.id},1)" aria-label="Increase ${product.name} quantity">＋</button></div></div><button class="remove-btn" type="button" onclick="removeFromCart(${item.id})" aria-label="Remove ${product.name}">×</button></article>`;
  }).join("") : `<div class="empty-cart"><span>♡</span><h3>Your bag is taking a breather.</h3><p>Find something lovely to bring home.</p><button type="button" onclick="closeCart();document.getElementById('products').scrollIntoView({behavior:'smooth'})">Explore the collection ↗</button></div>`;
}
function openCart() { cartOverlay.classList.add("open"); cartOverlay.setAttribute("aria-hidden", "false"); document.body.classList.add("cart-open"); document.getElementById("closeCartBtn").focus(); }
function closeCart() { cartOverlay.classList.remove("open"); cartOverlay.setAttribute("aria-hidden", "true"); document.body.classList.remove("cart-open"); document.getElementById("openCartBtn").focus(); }
function toggleWishlist(id) {
  if (wishlist.has(id)) wishlist.delete(id); else wishlist.add(id);
  localStorage.setItem("novacart-wishlist", JSON.stringify([...wishlist]));
  updateProducts();
}

document.querySelectorAll(".category-btn").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-btn").forEach(entry => entry.classList.toggle("active", entry === button));
  updateProducts();
}));
document.getElementById("searchInput").addEventListener("input", updateProducts);
document.getElementById("sortSelect").addEventListener("change", updateProducts);
document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("overlayDismiss").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", () => showToast(cart.length ? "Checkout is coming soon — your bag is saved." : "Your bag is empty for now."));
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("formStatus").textContent = "Thanks for reaching out! Your note is ready for our team.";
  event.currentTarget.reset();
});
document.getElementById("themeBtn").addEventListener("click", event => {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("novacart-theme", dark ? "dark" : "light");
  event.currentTarget.textContent = dark ? "☼" : "☾";
  event.currentTarget.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartOverlay.classList.contains("open")) closeCart();
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); document.getElementById("searchInput").focus(); }
});

const savedTheme = localStorage.getItem("novacart-theme") || "light";
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeBtn").textContent = "☼";
  document.getElementById("themeBtn").setAttribute("aria-label", "Switch to light theme");
}
updateProducts();
updateCart();
