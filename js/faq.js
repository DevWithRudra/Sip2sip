document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!name || !email) {
      window.Sip2SipApp.showToast("Please fill in your name and email.");
      return;
    }

    const success = document.createElement("div");
    success.className = "success-banner";
    success.textContent = `Thanks ${name}! We’ll get back to you at ${email} soon.`;
    form.insertAdjacentElement("afterend", success);
    form.reset();
  });
});
