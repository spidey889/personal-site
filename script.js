/* ==========================================================================
   Personal Site Script — Micro-interactions, Keyboard Shortcut & Clipboard
   ========================================================================== */

(function () {
  "use strict";

  const copyTriggers = document.querySelectorAll("[data-email]");
  const copyPrompt = document.querySelector(".copy-prompt");
  const copyToast = document.querySelector(".copy-toast");
  let toastTimer = null;
  const EMAIL_ADDRESS = "vinitrajpurohit09@gmail.com";

  /* --------------------------------------------------------------------------
     Clipboard Copy with Fallback
     -------------------------------------------------------------------------- */
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      success = false;
    }
    textarea.remove();
    return success;
  };

  const showToast = (copied) => {
    if (!copyToast) return;

    const toastMark = copyToast.querySelector(".copy-toast-mark");
    const toastText = copyToast.querySelector(".copy-toast-text");

    if (toastMark) toastMark.textContent = copied ? "✓" : "!";
    if (toastText)
      toastText.textContent = copied ? "email copied" : "copy failed";

    copyToast.classList.remove("is-visible");
    // Trigger reflow to restart CSS animation cleanly
    void copyToast.offsetWidth;
    copyToast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      copyToast.classList.remove("is-visible");
    }, 2200);
  };

  const executeCopy = async (targetEmail) => {
    const email = targetEmail || EMAIL_ADDRESS;
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

    const copyLabel = copied ? "Email copied to clipboard" : "Could not copy email";
    copyTriggers.forEach((item) => item.setAttribute("aria-label", copyLabel));

    if (copyPrompt) {
      copyPrompt.textContent = copied ? "[ copied ✓ ]" : "[ try again ]";
      copyPrompt.classList.toggle("is-copied", copied);

      window.setTimeout(() => {
        copyPrompt.textContent = "[ copy? ]";
        copyPrompt.classList.remove("is-copied");
        copyTriggers.forEach((item) =>
          item.setAttribute("aria-label", "Copy Vinit's email address")
        );
      }, 2000);
    }

    showToast(copied);
  };

  /* Event Listeners */
  copyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      executeCopy(trigger.dataset.email);
    });
  });

  /* Keyboard shortcut: Press 'c' to copy email */
  window.addEventListener("keydown", (e) => {
    const activeTagName = document.activeElement?.tagName.toLowerCase();
    if (activeTagName === "input" || activeTagName === "textarea") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "c" || e.key === "C") {
      executeCopy(EMAIL_ADDRESS);
    }
  });
})();
