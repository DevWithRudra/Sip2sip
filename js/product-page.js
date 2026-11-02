async function initShopPage() {
  const mount = document.getElementById("shop-products");
  const search = document.getElementById("shop-search");
  const sortSelect = document.getElementById("sort-select");
  const resultsCount = document.getElementById("shop-results-count");
  const categoryContainer = document.getElementById("category-filter");
  const flavorContainer = document.getElementById("flavor-filter");

  if (!mount) return;

  const products = await window.Sip2SipApp.fetchProducts();
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const flavors = ["All", ...new Set(products.map((product) => product.flavor))];

  const state = {
    search: "",
    category: "All",
    flavor: "All",
    sort: "featured",
  };

  function renderFilters() {
    categoryContainer.innerHTML = categories.map((category) => `
      <button type="button" class="chip ${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>
    `).join("");

    flavorContainer.innerHTML = flavors.map((flavor) => `
      <button type="button" class="chip ${state.flavor === flavor ? "active" : ""}" data-flavor="${flavor}">${flavor}</button>
    `).join("");
  }

  function sortProducts(list) {
    const sorted = [...list];

    switch (state.sort) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
  }

  function getFilteredProducts() {
    const query = state.search.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesText = !query ||
        product.name.toLowerCase().includes(query) ||
        product.flavor.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory = state.category === "All" || product.category === state.category;
      const matchesFlavor = state.flavor === "All" || product.flavor === state.flavor;

      return matchesText && matchesCategory && matchesFlavor;
    });

    return sortProducts(filtered);
  }

  function renderProducts() {
    const visibleProducts = getFilteredProducts();
    resultsCount.textContent = `Showing ${visibleProducts.length} product${visibleProducts.length !== 1 ? "s" : ""}`;

    if (!visibleProducts.length) {
      mount.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No matches found</h3>
          <p>Try another search or reset your filters.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-media">
          ${product.featured ? '<span class="product-badge">Featured</span>' : ""}
          <img class="product-image" src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.flavor}</span>
          </div>
          <h3 class="product-name"><a href="product.html?slug=${encodeURIComponent(product.slug)}">${product.name}</a></h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-rate">★ ${product.rating} <span>(${product.reviews})</span></div>
          <div class="product-actions">
            <button class="secondary-btn" type="button" data-view-product="${product.slug}">View</button>
            <button class="product-add" type="button" data-add-to-cart="${product.id}">Add</button>
          </div>
          <div class="product-row">
            <div class="product-price">${window.Sip2SipApp.formatPrice(product.price)}</div>
          </div>
        </div>
      </article>
    `).join("");
  }

  renderFilters();
  renderProducts();

  search.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderProducts();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  categoryContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderFilters();
    renderProducts();
  });

  flavorContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flavor]");
    if (!button) return;
    state.flavor = button.dataset.flavor;
    renderFilters();
    renderProducts();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initShopPage();
});
