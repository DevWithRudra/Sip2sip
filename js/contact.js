async function renderCheckout() {
  const root = document.getElementById("checkout-root");
  if (!root) return;

  const cart = window.Sip2SipApp.getCart();
  if (!cart.length) {
    root.innerHTML = `
      <div class="empty-state cart-card" style="grid-column: 1 / -1;">
        <h3>Your cart is empty</h3>
        <p>Add products before proceeding to checkout.</p>
        <a class="btn btn-primary" href="shop.html">Back to shop</a>
      </div>
    `;
    return;
  }

  const products = await window.Sip2SipApp.fetchProducts();
  const orderItems = cart.map((entry) => {
    const product = products.find((item) => Number(item.id) === Number(entry.productId));
    if (!product) return null;
    return { ...product, quantity: Number(entry.quantity || 1), lineTotal: product.price * Number(entry.quantity || 1) };
  }).filter(Boolean);

  const subtotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  root.innerHTML = `
    <div class="checkout-card">
      <h2>Shipping details</h2>
      <form class="checkout-form" id="checkout-form">
        <div class="form-grid">
          <label class="field-group">
            <span>Full name</span>
            <input class="field-input" type="text" name="fullName" required />
          </label>
          <label class="field-group">
            <span>Email</span>
            <input class="field-input" type="email" name="email" required />
          </label>
          <label class="field-group full-width">
            <span>Address</span>
            <input class="field-input" type="text" name="address" required />
          </label>
          <label class="field-group">
            <span>City</span>
            <input class="field-input" type="text" name="city" required />
          </label>
          <label class="field-group">
            <span>Postal code</span>
            <input class="field-input" type="text" name="zip" required />
          </label>
          <label class="field-group">
            <span>State</span>
            <input class="field-input" type="text" name="state" required />
          </label>
          <label class="field-group">
            <span>Phone</span>
            <input class="field-input" type="tel" name="phone" required />
          </label>
        </div>

        <div class="payment-methods">
          <div class="payment-option active">
            <span>UPI / Wallet</span>
            <span class="radio-dot" aria-hidden="true"></span>
          </div>
          <div class="payment-option">
            <span>Cash on delivery</span>
            <span class="radio-dot" aria-hidden="true"></span>
          </div>
          <div class="payment-option">
            <span>Debit / Credit card</span>
            <span class="radio-dot" aria-hidden="true"></span>
          </div>
        </div>

        <button class="btn btn-primary checkout-submit" type="submit">Place order</button>
      </form>
    </div>

    <aside class="summary-card">
      <h3>Order summary</h3>
      <div class="summary-list">
        ${orderItems.map((item) => `
          <div class="summary-row">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${window.Sip2SipApp.formatPrice(item.lineTotal)}</strong>
          </div>
        `).join("")}
      </div>
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
    </aside>
  `;

  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("fullName")?.toString().trim();

    if (!name) {
      window.Sip2SipApp.showToast("Please complete the checkout details.");
      return;
    }

    localStorage.removeItem("sip2sip-cart");
    window.Sip2SipApp.showToast("Order placed successfully!");

    const successBanner = document.createElement("div");
    successBanner.className = "success-banner";
    successBanner.textContent = `Thank you, ${name}. Your Sip2Sip order has been confirmed.`;
    form.replaceWith(successBanner);

    setTimeout(() => {
      window.location.href = "shop.html";
    }, 1500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});
