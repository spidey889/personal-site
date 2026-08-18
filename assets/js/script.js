/* ==========================================================================
   Personal Site Script — Clipboard Copy & Micro-interactions
   ========================================================================== */

(function () {
  "use strict";

  // DOM references
  const copyTriggers = document.querySelectorAll("[data-email]");
  const copyPrompt   = document.querySelector(".copy-prompt");
  const copyToast    = document.querySelector(".copy-toast");
  const toastMark    = copyToast?.querySelector(".copy-toast-mark");
  const toastText    = copyToast?.querySelector(".copy-toast-text");

  // Timers
  let toastTimer  = null;
  let promptTimer = null;

  const EMAIL = "vinitrajpurohit09@gmail.com";
  const RESET_LABEL = "Copy Vinit's email address";

  /* --------------------------------------------------------------------------
     Clipboard helpers
     -------------------------------------------------------------------------- */

  // Fallback for browsers without navigator.clipboard
  function fallbackCopy(text) {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    Object.assign(el.style, { position: "fixed", top: "-9999px", left: "-9999px", opacity: "0" });
    document.body.appendChild(el);
    el.focus();
    el.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    el.remove();
    return ok;
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return fallbackCopy(text);
    } catch {
      return fallbackCopy(text);
    }
  }

  /* --------------------------------------------------------------------------
     UI feedback
     -------------------------------------------------------------------------- */

  function showToast(ok) {
    if (!copyToast) return;

    if (toastMark) toastMark.textContent = ok ? "✓" : "!";
    if (toastText) toastText.textContent = ok ? "email copied" : "copy failed";

    // Remove then re-add to retrigger the CSS transition
    copyToast.classList.remove("is-visible");
    void copyToast.offsetWidth;
    copyToast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => copyToast.classList.remove("is-visible"), 2200);
  }

  function resetPrompt() {
    if (!copyPrompt) return;
    copyPrompt.textContent = "[ copy? ]";
    copyPrompt.classList.remove("is-copied");
    copyTriggers.forEach((el) => el.setAttribute("aria-label", RESET_LABEL));
  }

  /* --------------------------------------------------------------------------
     Copy action
     -------------------------------------------------------------------------- */

  async function executeCopy(email = EMAIL) {
    const ok = await copyToClipboard(email);

    // Update aria-labels
    const label = ok ? "Email copied to clipboard" : "Could not copy email";
    copyTriggers.forEach((el) => el.setAttribute("aria-label", label));

    // Update copy prompt text
    if (copyPrompt) {
      copyPrompt.textContent = ok ? "[ copied ✓ ]" : "[ try again ]";
      copyPrompt.classList.toggle("is-copied", ok);

      window.clearTimeout(promptTimer);
      promptTimer = window.setTimeout(resetPrompt, 2000);
    }

    showToast(ok);
  }

  /* --------------------------------------------------------------------------
     Event listeners
     -------------------------------------------------------------------------- */

  // Click on any [data-email] element
  copyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      executeCopy(trigger.dataset.email);
    });
  });

  // Keyboard shortcut: press "c" anywhere on the page
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "c" || e.key === "C") executeCopy();
  });
})();
