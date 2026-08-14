/* Copy feedback: the prompt follows the email hover target and briefly becomes copied after success. */
const copyTriggers = document.querySelectorAll("[data-email]");
const copyPrompt = document.querySelector(".copy-prompt");
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
  toastTimer = window.setTimeout(() => copyToast.classList.remove("is-visible"), 1900);
};

const copyEmail = async (trigger) => {
  const email = trigger.dataset.email;
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

  if (copyPrompt) {
    copyPrompt.textContent = copied ? "[ copied ]" : "[ try again ]";
    copyPrompt.classList.toggle("is-copied", copied);
    window.setTimeout(() => {
      copyPrompt.textContent = "[ copy? ]";
      copyPrompt.classList.remove("is-copied");
    }, 1900);
  }

  showToast(copied);
  trigger.setAttribute("aria-label", copied ? "Email copied" : "Could not copy email");
  window.setTimeout(() => trigger.setAttribute("aria-label", "Copy Vinit's email address"), 1900);
};

copyTriggers.forEach((trigger) => trigger.addEventListener("click", () => copyEmail(trigger)));
