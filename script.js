/* Copy feedback: keep the interaction obvious without changing the reference layout. */
const emailButton = document.querySelector(".email-copy");

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

    emailButton.classList.remove("is-copied", "is-error");
    void emailButton.offsetWidth;
    emailButton.classList.add(copied ? "is-copied" : "is-error");
    emailButton.setAttribute("aria-label", copied ? "Email copied" : "Could not copy email");

    window.setTimeout(() => {
      emailButton.classList.remove("is-copied", "is-error");
      emailButton.setAttribute("aria-label", "Copy Vinit's email address");
    }, 1800);
  });
}
