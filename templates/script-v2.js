/* Nón Lá — Redesign: Interaktionen + i18n */
(function () {
  "use strict";

  /* ---------- i18n ---------- */
  const I18N = {
    en: {
@@en_entries@@
    },
  };

  const langButtons = document.querySelectorAll(".lang__btn");

  // Originaltexte (Deutsch) sichern, damit der Wechsel zurück zu DE funktioniert
  const originalTexts = new Map();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    originalTexts.set(el, el.innerHTML);
  });

  function setLang(lang) {
    const dict = I18N[lang] || {};

    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (lang === "de") {
        const orig = originalTexts.get(el);
        if (orig != null) el.innerHTML = orig;
      } else if (dict[key] != null) {
        el.innerHTML = dict[key];
      }
    });

    langButtons.forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    try { localStorage.setItem("nonla-lang", lang); } catch (e) { /* private mode */ }
    updateOpenStatus(lang);
  }

  langButtons.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));

  let currentLang = "de";
  try { currentLang = localStorage.getItem("nonla-lang") || "de"; } catch (e) { /* ignore */ }
  if (currentLang === "en") setLang("en");

  /* ---------- Sticky nav state ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".nav__burger");
  const mobileMenu = document.getElementById("mobile-menu");

  function toggleMenu(open) {
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) mobileMenu.removeAttribute("hidden");
    else setTimeout(() => mobileMenu.setAttribute("hidden", ""), 400);
  }

  burger.addEventListener("click", () => toggleMenu(!mobileMenu.classList.contains("is-open")));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  // Progressive enhancement: the hidden initial state is only applied when
  // this script runs (html.js). Content stays fully visible without JS.
  document.documentElement.classList.add("js");

  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  function revealInView() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh - 40 && r.bottom > 0) el.classList.add("is-visible");
    });
  }

  let revealTicking = false;
  function onRevealTrigger() {
    if (revealTicking) return;
    revealTicking = true;
    requestAnimationFrame(() => {
      revealInView();
      revealTicking = false;
    });
  }

  window.addEventListener("scroll", onRevealTrigger, { passive: true });
  window.addEventListener("resize", onRevealTrigger);
  window.addEventListener("load", onRevealTrigger);
  revealInView();

  /* ---------- Open-now status (Kitchen Spalenbrunnen) ---------- */
  // [day 0=Sun..6=Sat] -> list of [openMinutes, closeMinutes]
  const HOURS = {
@@hours@@
  };

  function fmt(minutes) {
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  }

  function updateOpenStatus(lang) {
    const wrap = document.getElementById("open-status");
    const text = document.getElementById("open-status-text");
    if (!wrap || !text) return; // Element existiert nur auf der Startseite
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const todays = HOURS[day] || [];

    const current = todays.find(([o, c]) => minutes >= o && minutes < c - 30); // kitchen closes 30 min early
    const upcoming = todays.find(([o]) => minutes < o);

    wrap.classList.remove("is-open", "is-closed");

    if (current) {
      wrap.classList.add("is-open");
      text.textContent = lang === "en"
        ? `Open now · until ${fmt(current[1])}`
        : `Jetzt geöffnet · bis ${fmt(current[1])} Uhr`;
    } else if (upcoming) {
      wrap.classList.add("is-closed");
      text.textContent = lang === "en"
        ? `Closed · opens today at ${fmt(upcoming[0])}`
        : `Geschlossen · öffnet heute um ${fmt(upcoming[0])} Uhr`;
    } else {
      wrap.classList.add("is-closed");
      text.textContent = lang === "en"
        ? "Closed · opens again tomorrow"
        : "Geschlossen · öffnet wieder morgen";
    }
  }

  updateOpenStatus(currentLang);
  setInterval(() => updateOpenStatus(currentLang), 60 * 1000);

  /* ---------- Lightbox: Bilder per Klick vergrössern ---------- */
  (function () {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Bild vergrössert");
    box.innerHTML = '<button class="lightbox__close" aria-label="Schliessen">×</button><img alt="" />';
    document.body.appendChild(box);
    const boxImg = box.querySelector("img");

    function open(src, alt) {
      boxImg.src = src;
      boxImg.alt = alt || "";
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    document.addEventListener("click", function (e) {
      const img = e.target.closest(".dish-row__img, .buffet-intro img, .menu-original__imgs img");
      if (img) open(img.currentSrc || img.src, img.alt);
    });
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();

  /* ---------- Hero-Bildwechsel (Startseite) ---------- */
  (function () {
    const ROTATE = [
      { src: "images/hero-restaurant.jpg", pos: "50% 50%" },
      { src: "images/dish-pho.jpg", pos: "50% 55%" },
      { src: "images/dish-banh-mi.jpg", pos: "50% 60%" },
      { src: "images/dish-goi-cuon.jpg", pos: "50% 50%" },
      { src: "images/dish-bun-bo-nam-bo.jpg", pos: "50% 55%" },
    ];
    const base = document.querySelector(".hero__figure img");
    if (!base || ROTATE.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ROTATE.forEach((item) => { const pre = new Image(); pre.src = item.src; });

    const alt = document.createElement("img");
    alt.className = "hero__fade";
    alt.alt = "";
    alt.setAttribute("aria-hidden", "true");
    base.parentElement.appendChild(alt);

    let current = 0;
    let busy = false;

    function apply(img, item) {
      img.src = item.src;
      img.style.objectPosition = item.pos;
    }

    function next() {
      if (busy || document.hidden) return;
      busy = true;
      const upcoming = ROTATE[(current + 1) % ROTATE.length];
      apply(alt, upcoming);
      requestAnimationFrame(() => { alt.style.opacity = "1"; });
      setTimeout(() => {
        apply(base, upcoming);
        alt.style.opacity = "0";
        current = (current + 1) % ROTATE.length;
        setTimeout(() => { busy = false; }, 1200);
      }, 1600);
    }

    base.style.objectPosition = ROTATE[0].pos;
    setInterval(next, 6000);
  })();
})();
