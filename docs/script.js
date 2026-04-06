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

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
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
  const depthElements = Array.from(
    document.querySelectorAll(".hero-content-panel, .hero-monitor-stage, .demo-card-featured")
  );

  if (captureMode) {
    document.body.classList.add("capture-mode");
  }

  const addReveal = (selector, options = {}) => {
    const {
      variant = "scale-soft",
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

  addReveal(".hero-content", { variant: "clip", immediate: true, baseDelay: 40 });
  addReveal(".hero-monitor-stage", { variant: "scale-soft", immediate: true, baseDelay: 180 });
  addReveal(".page-hero .container", { variant: "clip", immediate: true, baseDelay: 60 });
  addReveal(".section-header", { variant: "clip" });
  addReveal(".service-visual-card", { variant: "mask", stagger: true, baseDelay: 30, step: 110 });
  addReveal(".marketing-service-card", { variant: "mask", stagger: true, baseDelay: 30, step: 100 });
  addReveal(".task-card", { variant: "scale-soft", stagger: true, step: 85 });
  addReveal(".step-card", { variant: "scale-soft", stagger: true, step: 85 });
  addReveal(".audience-card", { variant: "scale-soft", stagger: true, step: 85 });
  addReveal(".contact-panel, .contact-card", { variant: "mask", stagger: true, step: 110 });
  addReveal(".premium-gradient, .showcase-card", { variant: "mask" });
  addReveal(".demo-card", { variant: "mask", stagger: true, step: 100 });
  addReveal(".trust-card", { variant: "scale-soft", stagger: true, step: 90 });

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const revealAll = () => {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  };

  if (captureMode || prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
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

  const applyDepth = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    depthElements.forEach((element, index) => {
      const intensity = index === 1 ? 0.045 : 0.018;
      const shift = Math.max(-14, Math.min(14, scrollY * intensity * -1));
      element.classList.add("motion-depth");
      element.style.setProperty("--depth-shift", `${shift.toFixed(2)}px`);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      applyDepth();
      ticking = false;
    });
  };

  applyDepth();
  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener(
    "load",
    () => {
      window.setTimeout(revealAll, 1000);
    },
    { once: true }
  );

  window.setTimeout(revealAll, 1900);
});
