async function renderProductPage() {
  const root = document.getElementById("product-detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get("slug");

  if (!requestedSlug) {
    root.innerHTML = '<div class="empty-state"><h3>No product selected</h3><a class="btn btn-primary" href="shop.html">Back to shop</a></div>';
    return;
  }

  const products = await window.Sip2SipApp.fetchProducts();
  const product = products.find((entry) => entry.slug === requestedSlug);

  if (!product) {
    root.innerHTML = '<div class="empty-state"><h3>Product not found</h3><a class="btn btn-primary" href="shop.html">Go shopping</a></div>';
    return;
  }

  const ingredients = product.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("");
  const benefits = product.benefits.map((benefit) => `<li>${benefit}</li>`).join("");
  const faq = product.faq.map((note) => `<li>${note}</li>`).join("");

  root.innerHTML = `
    <div class="detail-gallery">
      <img src="${product.image}" alt="${product.name}" />
    </div>

    <div class="detail-info">
      <div class="product-tagline">${product.category}</div>
      <h1>${product.name}</h1>
      <div class="detail-price">
        <span class="value">${window.Sip2SipApp.formatPrice(product.price)}</span>
        <span class="muted-text">★ ${product.rating} (${product.reviews} reviews)</span>
      </div>
      <p>${product.description}</p>

      <div class="detail-actions">
        <button class="btn btn-primary" type="button" data-add-to-cart="${product.id}">Add to cart</button>
        <a class="btn btn-secondary" href="shop.html">Continue shopping</a>
      </div>

      <div class="detail-grid">
        <div class="detail-card">
          <h4>Nutrition</h4>
          <ul>
            <li>Caffeine: ${product.nutrition.caffeine}</li>
            <li>Serving: ${product.nutrition.serving}</li>
            <li>Sugar: ${product.nutrition.sugar}</li>
            <li>Calories: ${product.nutrition.calories}</li>
          </ul>
        </div>
        <div class="detail-card">
          <h4>Why people love it</h4>
          <ul>${benefits}</ul>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-card">
          <h4>Ingredients</h4>
          <ul>${ingredients}</ul>
        </div>
        <div class="detail-card">
          <h4>Quick facts</h4>
          <ul>${faq}</ul>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductPage();
});
