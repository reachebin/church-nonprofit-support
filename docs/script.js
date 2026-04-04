const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    siteNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    const isOpen = siteNav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  const navLinks = siteNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const captureMode = urlParams.get("capture") === "1";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealRegistry = new WeakSet();

  if (captureMode) {
    document.body.classList.add("capture-mode");
  }

  const addReveal = (selector, options = {}) => {
    const {
      variant = "up",
      immediate = false,
      stagger = false,
      baseDelay = 0,
      step = 90,
    } = options;

    const elements = Array.from(document.querySelectorAll(selector));

    elements.forEach((element, index) => {
      if (revealRegistry.has(element)) {
        return;
      }

      revealRegistry.add(element);
      element.classList.add("reveal", `reveal-${variant}`);

      const delay = stagger ? baseDelay + (index % 3) * step : baseDelay;
      if (delay > 0) {
        element.style.setProperty("--reveal-delay", `${delay}ms`);
      }

      if (immediate) {
        element.dataset.revealImmediate = "true";
      }
    });
  };

  addReveal(".hero-content", { variant: "up", immediate: true, baseDelay: 40 });
  addReveal(".hero-image-card", { variant: "right", immediate: true, baseDelay: 140 });
  addReveal(".page-hero .container", { variant: "up", immediate: true, baseDelay: 60 });

  addReveal(".section-header", { variant: "up" });
  addReveal(".service-visual-card", { variant: "up", stagger: true });
  addReveal(".task-card", { variant: "up", stagger: true });
  addReveal(".feature-card", { variant: "up", stagger: true });
  addReveal(".audience-card", { variant: "up", stagger: true });
  addReveal(".marketing-service-card", { variant: "up", stagger: true });
  addReveal(".step-card", { variant: "up", stagger: true });
  addReveal(".note-card", { variant: "up", stagger: true });
  addReveal(".stacked-item", { variant: "up", stagger: true });
  addReveal(".contact-panel, .contact-card", { variant: "up", stagger: true });
  addReveal(".premium-gradient, .showcase-card", { variant: "right" });
  addReveal(".proof-copy", { variant: "left" });
  addReveal(".proof-image-card", { variant: "right" });

  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  if (captureMode || prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => {
    if (element.dataset.revealImmediate === "true") {
      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, 40);
      return;
    }

    observer.observe(element);
  });
});
