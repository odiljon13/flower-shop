/* ======= Product Data ======= */
const products = [
  { id: 1, name: "Red Roses Bouquet", price: 25, originalPrice: 35, onSale: true, category: "roses", img: "img/photo_2026-08-06_15-28-30.png" },
  { id: 2, name: "Sunflower Delight", price: 30, originalPrice: 40, onSale: true, category: "bouquet", img: "img/photo_2026-08-06_15-29-21.png" },
  { id: 3, name: "Tulip Mix", price: 20, onSale: false, category: "lilies", img: "img/photo_2026-08-06_15-29-28.png" },
  { id: 4, name: "Orchid Elegance", price: 35, originalPrice: 48, onSale: true, category: "bouquet", img: "img/photo_2026-08-06_15-29-34.png" },
  { id: 5, name: "Lavender Love", price: 28, onSale: false, category: "lilies", img: "img/photo_2026-08-06_15-29-40.png" },
  { id: 6, name: "Pink Roses", price: 27, originalPrice: 38, onSale: true, category: "roses", img: "img/photo_2026-08-06_15-28-30.png" },
  { id: 7, name: "Mixed Bouquet", price: 40, onSale: false, category: "bouquet", img: "img/photo_2026-08-06_15-29-21.png" },
  { id: 8, name: "White Lilies", price: 22, onSale: false, category: "lilies", img: "img/photo_2026-08-06_15-29-28.png" }
];

/* ======= DOM Elements ======= */
const productsDiv = document.getElementById("products");
const saleProductsDiv = document.getElementById("sale-products");
const newProductsDiv = document.getElementById("new-products");
const recommendedProductsDiv = document.getElementById("recommended-products");
const cartDrawer = document.getElementById("cart-drawer");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const searchInput = document.getElementById("search");
const filterBtns = document.querySelectorAll(".filter-btn");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMobileMenu = document.getElementById("close-mobile-menu");
const toastContainer = document.getElementById("toast-container");

/* ======= State ======= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let filteredProducts = [...products];

/* ======= Toast Notification ======= */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  if (toastContainer) {
    toastContainer.appendChild(toast);
  } else {
    document.body.appendChild(toast);
  }

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

/* ======= Render Products ======= */
function renderProducts(list, container = productsDiv) {
  if (!container) return;
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 flex flex-col justify-between relative group";
    
    const saleBadge = p.onSale ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">SALE 🏷️</span>` : "";
    const priceHtml = p.onSale 
      ? `<span class="text-gray-400 line-through text-sm mr-2">$${p.originalPrice}</span><span class="text-pink-600 font-bold">$${p.price}</span>` 
      : `<span class="text-pink-600 font-bold">$${p.price}</span>`;

    card.innerHTML = `
      ${saleBadge}
      <div>
        <div class="w-full h-48 bg-gradient-to-b from-gray-50 to-pink-50/30 rounded-md mb-3 flex items-center justify-center p-2">
          <img src="${p.img}" alt="${p.name}" class="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110" onerror="this.src='img/photo_2026-08-06_15-28-30.png'">
        </div>
        <h3 class="text-lg font-semibold text-gray-800">${p.name}</h3>
        <p class="mt-1">${priceHtml}</p>
      </div>
      <button class="bg-pink-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-pink-600 transition w-full font-medium active:scale-95 shadow-sm" onclick="addToCart(${p.id})">
        Add to Cart 🛒
      </button>
    `;
    container.appendChild(card);
  });
}

/* ======= Cart Functions ======= */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} added to cart!`);
}

function increaseQuantity(index) {
  if (cart[index]) {
    cart[index].quantity += 1;
    saveCart();
    renderCart();
  }
}

function decreaseQuantity(index) {
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  }
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  let total = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p class='text-gray-500 text-center py-4'>Your cart is empty 😢</p>";
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalCount += item.quantity;
      const li = document.createElement("li");
      li.className = "flex justify-between items-center border-b pb-2 pt-2";
      li.innerHTML = `
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">${item.name}</span>
          <span class="text-sm text-gray-500">$${item.price} × ${item.quantity}</span>
        </div>
        <div class="flex items-center space-x-2">
          <button class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-bold" onclick="decreaseQuantity(${index})">-</button>
          <span class="font-semibold px-1">${item.quantity}</span>
          <button class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm font-bold" onclick="increaseQuantity(${index})">+</button>
          <button class="text-red-500 hover:text-red-700 text-sm ml-2 font-medium" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
  }

  if (cartTotalEl) cartTotalEl.textContent = `Total: $${total}`;
  if (cartBtn) cartBtn.textContent = `Cart (${totalCount})`;
}

function goToCheckout() {
  saveCart();
  window.location.href = "checkout.html";
}

/* ======= Search ======= */
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filteredProducts, productsDiv);
  });
}

/* ======= Filter ======= */
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("bg-pink-500", "text-white"));
      btn.classList.add("bg-pink-500", "text-white");

      const category = btn.dataset.category;
      if (category === "all") {
        filteredProducts = [...products];
      } else if (category === "sale") {
        filteredProducts = products.filter(p => p.onSale);
      } else {
        filteredProducts = products.filter(p => p.category === category);
      }
      renderProducts(filteredProducts, productsDiv);
    });
  });
}

/* ======= Cart Drawer Toggle ======= */
if (cartBtn && cartDrawer) {
  cartBtn.addEventListener("click", () => cartDrawer.classList.remove("translate-x-full"));
}
if (closeCartBtn && cartDrawer) {
  closeCartBtn.addEventListener("click", () => cartDrawer.classList.add("translate-x-full"));
}

/* ======= Mobile Menu Toggle ======= */
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.remove("-translate-x-full"));
}
if (closeMobileMenu && mobileMenu) {
  closeMobileMenu.addEventListener("click", () => mobileMenu.classList.add("-translate-x-full"));
}

/* ======= Hero Slideshow ======= */
const slides = document.querySelectorAll(".slideshow");
const dots = document.querySelectorAll(".slide-dot");

if (slides.length > 0) {
  let currentSlide = 0;
  let slideTimer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove("opacity-0", "pointer-events-none");
        slide.classList.add("opacity-100");
      } else {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0", "pointer-events-none");
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.remove("bg-white/40", "w-3");
        dot.classList.add("bg-white", "w-6");
      } else {
        dot.classList.remove("bg-white", "w-6");
        dot.classList.add("bg-white/40", "w-3");
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      startAutoSlide();
    });
  });

  showSlide(0);
  startAutoSlide();
}

/* ======= Testimonials Slider ======= */
const slider = document.getElementById("testimonial-slider");
if (slider) {
  let slideIndex = 0;
  function nextTestimonial() {
    const cards = slider.querySelectorAll(".testimonial-card");
    if (cards.length === 0) return;
    slideIndex = (slideIndex + 1) % cards.length;
    const cardWidth = cards[0].offsetWidth + 16;
    slider.style.transform = `translateX(-${slideIndex * cardWidth}px)`;
  }
  setInterval(nextTestimonial, 4000);
}

/* ======= Initial Render ======= */
document.addEventListener("DOMContentLoaded", () => {
  if (productsDiv) renderProducts(filteredProducts, productsDiv);
  if (saleProductsDiv) renderProducts(products.filter(p => p.onSale), saleProductsDiv);
  if (newProductsDiv) renderProducts(products.slice(0, 4), newProductsDiv);
  if (recommendedProductsDiv) renderProducts(products.slice(4), recommendedProductsDiv);
  renderCart();
});