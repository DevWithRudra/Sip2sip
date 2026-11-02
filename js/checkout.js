function renderCartPage() {
  const root = document.getElementById("cart-root");
  if (!root) return;

  const cart = window.Sip2SipApp.getCart();

  if (!cart.length) {
    root.innerHTML = `
      <div class="empty-state cart-card" style="grid-column: 1 / -1;">
        <h3>Your cart is empty</h3>
        <p>Add a few Sip2Sip favorites and bring more momentum to your day.</p>
        <a class="btn btn-primary" href="shop.html">Browse products</a>
      </div>
    `;
    return;
  }

  window.Sip2SipApp.fetchProducts().then((products) => {
    const items = cart.map((entry) => {
      const product = products.find((item) => Number(item.id) === Number(entry.productId));
      if (!product) return null;

      const quantity = Number(entry.quantity || 1);
      return {
        ...product,
        quantity,
        lineTotal: product.price * quantity,
      };
    }).filter(Boolean);

    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const shipping = subtotal > 0 ? 49 : 0;
    const total = subtotal + shipping;

    root.innerHTML = `
      <div class="cart-card">
        <h2>Cart items</h2>
        <div class="cart-items">
          ${items.map((item) => `
            <div class="cart-item">
              <div class="cart-thumb">
                <div class="product-bottle"><div class="bottle-cap"></div><div class="bottle-label">SIP2SIP</div></div>
              </div>
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-meta">
                  <span>${window.Sip2SipApp.formatPrice(item.price)}</span>
                  <strong>${window.Sip2SipApp.formatPrice(item.lineTotal)}</strong>
                </div>
                <div class="qty-controls">
                  <button class="qty-btn" data-change-qty="${item.id}" data-direction="decrease" type="button">−</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn" data-change-qty="${item.id}" data-direction="increase" type="button">+</button>
                  <button class="remove-item" data-remove-item="${item.id}" type="button">Remove</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <aside class="summary-card">
        <h3>Summary</h3>
        <div class="summary-list">
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>${window.Sip2SipApp.formatPrice(subtotal)}</strong>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <strong>${window.Sip2SipApp.formatPrice(shipping)}</strong>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <strong>${window.Sip2SipApp.formatPrice(total)}</strong>
          </div>
        </div>
        <a class="btn btn-primary" href="checkout.html">Proceed to checkout</a>
      </aside>
    `;

    document.querySelectorAll("[data-remove-item]").forEach((button) => {
      button.addEventListener("click", () => {
        window.Sip2SipApp.removeFromCart(button.dataset.removeItem);
        renderCartPage();
      });
    });

    document.querySelectorAll("[data-change-qty]").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number(button.dataset.changeQty);
        const direction = button.dataset.direction;
        const currentItem = cart.find((entry) => Number(entry.productId) === productId);
        const currentQuantity = Number(currentItem?.quantity || 1);
        const nextQuantity = direction === "increase" ? currentQuantity + 1 : currentQuantity - 1;
        window.Sip2SipApp.updateCartItem(productId, nextQuantity);
        renderCartPage();
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});
