const menuButton = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector("#site-menu");

if (menuButton && siteMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const quoteForm = document.querySelector("[data-quote-form]");

if (quoteForm) {
  const status = quoteForm.querySelector("[data-form-status]");
  const submitButton = quoteForm.querySelector("button[type='submit']");

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    if (status) {
      status.textContent = "Sending your quote request...";
      status.className = "form-status";
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "The request could not be sent.");
      }

      window.location.href = "thanks.html";
    } catch (error) {
      if (status) {
        status.textContent = error.message || "The request could not be sent. Please call 0419 466 148 or email wally@executivehome.com.au.";
        status.classList.add("is-error");
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Quote Request";
      }
    }
  });
}
