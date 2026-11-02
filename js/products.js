const STORAGE_KEY = "sip2sip-cart";

function resolveAssetPath(pathname) {
  return window.location.pathname.includes("/pages/") ? `../${pathname}` : pathname;
}

function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getCartCount() {
  return getCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const normalizedId = Number(productId);
  const existing = cart.find((item) => Number(item.productId) === normalizedId);

  if (existing) {
    existing.quantity += Number(quantity || 1);
  } else {
    cart.push({ productId: normalizedId, quantity: Number(quantity || 1) });
  }

  setCart(cart);
  renderCartBadge();
  return cart;
}

function updateCartItem(productId, quantity) {
  const cart = getCart().map((item) => {
    if (Number(item.productId) === Number(productId)) {
      return { ...item, quantity: Math.max(0, Number(quantity || 0)) };
    }
    return item;
  }).filter((item) => Number(item.quantity) > 0);

  setCart(cart);
  renderCartBadge();
  return cart;
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => Number(item.productId) !== Number(productId));
  setCart(cart);
  renderCartBadge();
  return cart;
}

async function fetchProducts() {
  if (window.__sip2sipProductCache) {
    return window.__sip2sipProductCache;
  }

  const response = await fetch(resolveAssetPath("data/products.json"));
  const products = await response.json();
  window.__sip2sipProductCache = products;
  return products;
}

async function fetchFaq() {
  const response = await fetch(resolveAssetPath("data/faq.json"));
  return response.json();
}

function renderCartBadge() {
  const badge = document.querySelector(".cart-badge");
  const count = getCartCount();

  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "grid" : "none";
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2000);
}

function pathForPage(pageName) {
  return window.location.pathname.includes("/pages/") ? pageName : `pages/${pageName}`;
}

function buildHeaderMarkup() {
  const currentPath = window.location.pathname;
  const rootPage = currentPath.includes("/pages/") ? "../index.html" : "index.html";

  return `
    <header class="site-header">
      <div class="container topbar">
        <a href="${rootPage}" class="brand" aria-label="Sip2Sip home page">
          <span class="brand-mark">S</span>
          <span>Sip2Sip</span>
        </a>

        <nav class="nav-links" aria-label="Main navigation">
          <a href="${pathForPage("shop.html")}">Shop</a>
          <a href="${pathForPage("about.html")}">About</a>
          <a href="${pathForPage("faq.html")}">FAQ</a>
          <a href="${pathForPage("contact.html")}">Contact</a>
        </nav>

        <div class="nav-actions">
          <a class="icon-button cart-pill" href="${pathForPage("cart.html")}" aria-label="View cart">
            🛒
            <span class="cart-badge" style="display: none;">0</span>
          </a>
          <button class="mobile-toggle" type="button" aria-label="Open mobile menu">☰</button>
        </div>
      </div>

      <div class="container mobile-menu">
        <nav class="nav-links" aria-label="Mobile navigation">
          <a href="${pathForPage("shop.html")}">Shop</a>
          <a href="${pathForPage("about.html")}">About</a>
          <a href="${pathForPage("faq.html")}">FAQ</a>
          <a href="${pathForPage("contact.html")}">Contact</a>
          <a href="${pathForPage("cart.html")}">Cart</a>
        </nav>
      </div>
    </header>
  `;
}

function buildFooterMarkup() {
  const currentPath = window.location.pathname;
  const rootPrefix = currentPath.includes("/pages/") ? "../" : "";

  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a href="${rootPrefix}index.html" class="brand" aria-label="Sip2Sip home page">
            <span class="brand-mark">S</span>
            <span>Sip2Sip</span>
          </a>
          <p class="footer-tagline">Energy for your everyday momentum.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="${rootPrefix}pages/shop.html">All Products</a></li>
            <li><a href="${rootPrefix}pages/shop.html">Best Sellers</a></li>
            <li><a href="${rootPrefix}pages/shop.html">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="${rootPrefix}pages/about.html">About</a></li>
            <li><a href="${rootPrefix}pages/contact.html">Contact</a></li>
            <li><a href="${rootPrefix}pages/faq.html">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="${rootPrefix}pages/faq.html">Shipping</a></li>
            <li><a href="${rootPrefix}pages/faq.html">Returns</a></li>
            <li><a href="${rootPrefix}pages/faq.html">Privacy</a></li>
            <li><a href="${rootPrefix}pages/faq.html">Terms</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© 2026 Sip2Sip. All rights reserved.</span>
      </div>
    </footer>
  `;
}

function injectSiteStructure() {
  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");

  if (headerTarget) {
    headerTarget.innerHTML = buildHeaderMarkup();
    const toggle = headerTarget.querySelector(".mobile-toggle");
    const menu = headerTarget.parentElement.querySelector(".mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("open");
      });
    }
  }

  if (footerTarget) {
    footerTarget.innerHTML = buildFooterMarkup();
  }

  renderCartBadge();
}

document.addEventListener("DOMContentLoaded", () => {
  injectSiteStructure();

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const productId = Number(addButton.dataset.addToCart);
      addToCart(productId, 1);
      showToast("Added to cart");
      return;
    }

    const viewButton = event.target.closest("[data-view-product]");
    if (viewButton) {
      const slug = viewButton.dataset.viewProduct;
      const target = pathForPage("product.html") + `?slug=${encodeURIComponent(slug)}`;
      window.location.href = target;
    }
  });
});

window.Sip2SipApp = {
  getCart,
  setCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartCount,
  formatPrice,
  fetchProducts,
  fetchFaq,
  resolveAssetPath,
  pathForPage,
  showToast,
};
