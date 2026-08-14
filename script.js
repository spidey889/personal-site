/* Copy feedback: a small, temporary snackbar that does not disturb the reading layout. */
const emailButton = document.querySelector(".email-copy");
const copyToast = document.querySelector(".copy-toast");
let toastTimer;

const fallbackCopy = (value) => {
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
};

const showToast = (copied) => {
  if (!copyToast) return;

  copyToast.querySelector(".copy-toast-mark").textContent = copied ? "✓" : "!";
  copyToast.querySelector(".copy-toast-text").textContent = copied ? "email copied" : "copy failed";
  copyToast.classList.remove("is-visible");
  void copyToast.offsetWidth;
  copyToast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1900);
};

if (emailButton) {
  emailButton.addEventListener("click", async () => {
    const email = emailButton.dataset.email;
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else {
        copied = fallbackCopy(email);
      }
    } catch {
      copied = fallbackCopy(email);
    }

    showToast(copied);
    emailButton.setAttribute("aria-label", copied ? "Email copied" : "Could not copy email");
    window.setTimeout(() => {
      emailButton.setAttribute("aria-label", "Copy Vinit's email address");
    }, 1900);
  });
}
