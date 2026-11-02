async function renderFeaturedProducts() {
  const mount = document.getElementById("featured-products");
  if (!mount) return;

  const products = await window.Sip2SipApp.fetchProducts();
  const featured = products.filter((product) => product.featured).slice(0, 4);

  mount.innerHTML = featured.map((product) => {
    const image = product.image;
    const price = window.Sip2SipApp.formatPrice(product.price);
    return `
      <article class="product-card">
        <div class="product-media">
          <span class="product-badge">Featured</span>
          <img class="product-image" src="${image}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.flavor}</span>
          </div>
          <h3 class="product-name">
            <a href="pages/product.html?slug=${encodeURIComponent(product.slug)}">${product.name}</a>
          </h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-rate">★ ${product.rating} <span>(${product.reviews})</span></div>
          <div class="product-row">
            <div class="product-price">${price}</div>
            <button class="product-add" data-add-to-cart="${product.id}" type="button">Add</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
});
