/* Midnight Signal: restrained interaction, direct wayfinding, reduced-motion friendly. */
const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#site-nav");

const setScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
window.addEventListener("scroll", setScrolled, { passive: true });
setScrolled();

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  nav.classList.toggle("is-open", !open);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  nav.classList.remove("is-open");
}));
