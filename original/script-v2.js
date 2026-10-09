/* Nón Lá — Redesign: Interaktionen + i18n */
(function () {
  "use strict";

  /* ---------- i18n ---------- */
  const I18N = {
    en: {
      "nav.brand-sub": "Vietnamese Kitchen",
      "nav.catering": "Catering",
      "nav.about": "About",
      "nav.offer": "Menu",
      "nav.dishes": "Dishes",
      "nav.locations": "Locations",
      "nav.contact": "Contact",
      "nav.reserve": "Reserve a table",
      "hero.eyebrow": "Vietnamese cuisine · Basel",
      "hero.t1": "A piece of",
      "hero.t2": "Vietnam",
      "hero.t3": "in the heart of Basel.",
      "hero.lead": "Fresh, aromatic and homemade — at Nón Lá you enjoy authentic Vietnamese cuisine. At Spalenbrunnen, in the Old Market Hall and at Klara.",
      "hero.cta1": "Reserve a table",
      "hero.cta2": "Explore dishes",
      "hero.fact1": "<strong>Lunch buffet</strong> Mon to Fri",
      "hero.fact2": "<strong>Take away</strong> −10% discount",
      "hero.fact3": "<strong>Delivery</strong> via velogourmet, eat.ch & Uber Eats",
      "hero.card-title": "Three places, one taste",
      "hero.card-text": "Kitchen Spalenbrunnen · Streetfood Markthalle · Corner Klara",
      "mq.1": "Authentic Vietnamese",
      "mq.2": "Lunch buffet Mon to Fri",
      "mq.3": "Take away −10%",
      "mq.4": "Catering for your event",
      "mq.5": "Fresh & homemade",
      "about.eyebrow": "About us",
      "about.title": "Chào & welcome.",
      "about.p1": "Nón Lá is at home in Basel – in the impressive, unique ambience of the Old Market Hall, at Spalenbrunnen and at Klara, between Messe Basel and Claraplatz. At all three locations you will find a wide selection of freshly prepared, authentic Vietnamese dishes.",
      "about.p2": "At lunchtime (Mon to Fri) a varied buffet awaits you. Our popular Fried Noodles can be assembled to your personal taste.",
      "about.hat": "The “Nón Lá” – the traditional conical hat made of bamboo and palm leaves, an icon of Vietnam.",
      "about.quote": "“It is worn by people working outdoors – protecting them from sun and rain.”",
      "about.quote-by": "About the name Nón Lá",
      "offer.eyebrow": "What we offer",
      "offer.title": "Lunch & Dinner",
      "offer.sub": "A quick lunch, a cosy dinner or a night in — Nón Lá is flexible. The kitchen closes half an hour before closing time.",
      "offer.lunch-title": "Lunch menu",
      "offer.lunch-text": "Monday to Friday: a varied buffet of fresh Vietnamese dishes — quick, tasty and filling.",
      "offer.lunch-menu": "See lunch menu",
      "offer.delivery": "Delivery via",
      "offer.dinner-title": "Dinner menu",
      "offer.dinner-text": "In the evening we serve our classics à la carte — and for home there is <strong>10% off</strong> take away.",
      "offer.dinner-menu": "See dinner menu",
      "offer.order": "Order online",
      "offer.order-chip": "Go to order portal",
      "dishes.eyebrow": "Menu",
      "dishes.title": "Our specialities",
      "dishes.sub": "Fresh herbs, vibrant flavours, homemade broths — this is how Vietnam tastes.",
      "dish.1": "Vietnamese noodle soup with beef and fresh herbs.",
      "dish.2": "Crispy rice flour crêpe with prawns, beef or tofu.",
      "dish.3": "Fresh summer rolls — also available vegetarian.",
      "dish.4": "Rice noodles with homemade spring rolls and salad.",
      "dish.5": "Spicy-sour papaya salad with peanuts.",
      "dish.6": "Wok noodles, individually assembled to your taste.",
      "loc.eyebrow": "Locations",
      "loc.title": "Three places in Basel",
      "loc.sub": "Restaurant, street food stall or food corner — Nón Lá is there for you at three central spots in Basel.",
      "loc.1.tag": "Restaurant",
      "loc.1.name": "Vietnamese Kitchen Spalenbrunnen",
      "loc.1.note": "Reservations gladly accepted for evenings and Saturday lunchtime.",
      "loc.1.cta": "Reserve a table",
      "loc.2.tag": "Streetfood",
      "loc.2.name": "Vietnamese Streetfood Old Market Hall",
      "loc.2.min": "3 min from SBB station",
      "loc.2.note": "Reservations directly via the Market Hall. Public holidays according to Market Hall opening hours.",
      "loc.2.cta": "See menu",
      "loc.3.tag": "Corner",
      "loc.3.name": "Vietnamese Corner Klara",
      "loc.3.min": "Inside Klara Basel",
      "loc.3.note": "Public holidays according to Klara opening hours.",
      "loc.3.cta": "See menu",
      "loc.closed": "closed",
      "loc.hint": "The kitchen closes half an hour before closing time.",
      "cat.eyebrow": "Catering",
      "cat.title": "We come to you.",
      "cat.text": "You don't have to miss out on wonderful Vietnamese cuisine at your private or corporate event either. We will gladly prepare a non-binding quote for you.",
      "cat.cta": "Request a quote",
      "ft.tag": "Vietnamese Kitchen · Streetfood · Corner — Basel",
      "ft.contact": "Contact",
      "ft.links": "Quick links",
      "ft.l1": "Spalenbrunnen lunch menu",
      "ft.l2": "Spalenbrunnen dinner menu",
      "ft.l3": "Order online",
      "ft.visit": "Locations",
      "ft.s1": "Kitchen Spalenbrunnen",
      "ft.s2": "Streetfood Markthalle",
      "ft.s3": "Corner Klara",
      "ft.credits": "Photos: Antonio Mollo, fotostudio71.ch · Redesign concept",
      "bo.crumb": "Order online",
      "bo.cutlery": "To protect the environment, cutlery is not included by default. Please select the desired number of cutlery sets in the first category if needed.",
      "bo.del-note": "Also via velogourmet.ch, eat.ch and ubereats.ch – delivery through our partners.",
      "bo.del-text": "In the evenings and all day on Saturdays we deliver our Vietnamese classics to your home:",
      "bo.del-title": "Home delivery",
      "bo.eyebrow": "Take away &amp; delivery",
      "bo.lead": "Have our street food delivered to your home or pick it up conveniently – all take-away dishes already include a 10% discount for collection.",
      "bo.ta-text": "Order directly from us – with a 10% discount for collection. Choose how you would like to order:",
      "bo.ta-title": "Take away · Lunch &amp; dinner",
      "bo.times-day": "Day",
      "bo.times-note": "Collection at Spalenbrunnen, Schützenmattstrasse 1, 4051 Basel.",
      "bo.times-time": "Time",
      "bo.times-title": "Order times Spalenbrunnen",
      "bo.title": "Order online",
      "bo.to-menu": "To the dinner menu",
      "days.disa": "Tue – Sat",
      "days.fr": "Fri",
      "days.mo": "Mon",
      "days.modo": "Mon – Thu",
      "days.mofr": "Mon – Fri",
      "days.sa": "Sat",
      "days.saso": "Sat – Sun",
      "days.so": "Sun",
      "ft.menus": "Menus",
      "kk.cat": "Menu",
      "kk.crumb": "Menu Klara",
      "kk.d1": "Spring rolls<br/>with shrimp and chicken<br/>or vegetables",
      "kk.d1.tags": "vt · vg",
      "kk.d2": "Summer rolls with beef | chicken | shrimp | salmon | tofu | avocado",
      "kk.d3": "Vietnamese baguette<br/>with beef | chicken | duck | tofu",
      "kk.d3.tags": "vt",
      "kk.d4": "Rice noodles with lemongrass and beef | chicken | duck | tofu",
      "kk.d5": "Rice noodles and spring rolls<br/>with shrimp and chicken",
      "kk.d6": "Rice noodles with<br/>shrimp paste on sugar cane",
      "kk.d7": "Vietnamese noodle soup<br/>with beef | chicken | tofu",
      "kk.eyebrow": "Corner · Take away",
      "kk.lead": "Our Vietnamese corner at Klara Basel – fresh Vietnamese cuisine to take away, between Messe Basel and Claraplatz.",
      "kk.title": "Klara",
      "loc.2.name-short": "Market Hall",
      "loc.feedback": "We look forward to your feedback – preferably positive, of course. If something didn't taste right or our service didn't meet your expectations, please let us know:",
      "mk.a1": "Papaya salad with homemade fish sauce<br/>or vegan sauce",
      "mk.a1.tags": "vt · vg",
      "mk.a2": "Mango salad with homemade fish sauce<br/>or vegan sauce",
      "mk.a2.tags": "vt · vg",
      "mk.a3": "Summer rolls with beef | shrimp | tofu",
      "mk.a4": "Spring rolls with meat<br/>or vegetables",
      "mk.all-loc": "All locations",
      "mk.b1": "Rice noodles with beef in hoisin sauce",
      "mk.b2": "Vietnamese noodle soup<br/>with beef | chicken | tofu",
      "mk.b3": "Fried rice noodles<br/>with beef | chicken | shrimp | duck | tofu",
      "mk.b4": "Fried udon noodles with<br/>beef | chicken | shrimp | duck | tofu",
      "mk.b4.tags": "vt",
      "mk.c1": "Rice noodles with lemongrass<br/>and beef | chicken | duck",
      "mk.c1c": "Rice noodles with lemongrass and tofu",
      "mk.c1c.tags": "vegetarian",
      "mk.c2": "Rice noodles with<br/>shrimp paste on sugar cane",
      "mk.c3": "Rice noodles and spring rolls<br/>with meat or vegetables",
      "mk.c4": "Rice noodles with beef in pepper leaves",
      "mk.catA": "Starters &amp; salads",
      "mk.catB": "Phở &amp; fried noodles",
      "mk.catC": "Bún – rice noodles",
      "mk.catD": "Curry",
      "mk.crumb": "Menu Old Market Hall",
      "mk.d1": "Mango curry<br/>with chicken | duck | tofu",
      "mk.d2": "Peanut curry",
      "mk.d3": "Yellow curry<br/>with beef | chicken | duck | tofu",
      "mk.eyebrow": "Streetfood · Take away",
      "mk.lead": "Vietnamese street food classics in the Basel Market Hall – 3 minutes from SBB station. Everything freshly prepared, to take away or enjoy on site in the market hall atmosphere.",
      "mk.legend1": "vegan possible, please let us know if desired.",
      "mk.legend2": "Whenever possible, we are happy to cook gluten-free. Please inform us of any known allergies.",
      "mk.order": "Order online",
      "mk.title": "Old Market Hall",
      "nav.home": "Home",
      "nav.menu1": "Old Market Hall",
      "nav.menu2": "Spalenbrunnen lunch",
      "nav.menu3": "Spalenbrunnen dinner",
      "nav.menu4": "Klara",
      "nav.menus": "Menus <span aria-hidden=\"true\" class=\"caret\">▾</span>",
      "nav.order": "Order",
      "offer.more": "More lunch menus",
      "offer.dinner-more": "More dinner menus",
      "rz.crumb": "Reservation",
      "rz.eyebrow": "Vietnamese Kitchen Spalenbrunnen",
      "rz.fallback": "If the reservation window does not load:",
      "rz.fallback-link": "Open reservation in a new window",
      "rz.lead": "We gladly accept reservations for the evening and Saturday lunchtime. We look forward to your visit.",
      "rz.phone": "Or by phone:",
      "rz.title": "Reserve a table",
      "sa.cat1": "Starters",
      "sa.cat2": "Small soup",
      "sa.cat3": "Salads",
      "sa.cat4": "Rice dishes",
      "sa.cat5": "Noodles",
      "sa.cat6": "Soups",
      "sa.cat7": "Desserts",
      "sa.crumb": "Menu Spalenbrunnen dinner",
      "sa.e1": "Mango cream",
      "sa.e1.tags": "vt",
      "sa.e2": "Panna cotta with passion fruit",
      "sa.e2.tags": "vt",
      "sa.e3": "Sticky rice with banana in coconut milk",
      "sa.e3.tags": "vg",
      "sa.e4": "Deep-fried banana with honey and ice cream of your choice",
      "sa.e4.tags": "vt",
      "sa.e5": "Vietnamese coffee with a scoop of vanilla ice cream",
      "sa.e5.tags": "vt",
      "sa.e6": "Ice cream of your choice",
      "sa.e6.tags": "coconut vt · chocolate vt · vanilla vt · mango vg · lemon vg",
      "sa.eyebrow": "À la carte · evening &amp; Saturday",
      "sa.g1": "Papaya salad",
      "sa.g1.tags": "vg · <span data-i18n=\"sa.g1x\">Papaya salad with shrimp 18.00</span>",
      "sa.g1x": "Papaya salad with shrimp 18.00",
      "sa.g2": "Mango salad",
      "sa.g2.tags": "<span data-i18n=\"sa.g2x\">Mango salad vg · with shrimp 17.50</span>",
      "sa.g2x": "Mango salad vg · with shrimp 17.50",
      "sa.g3": "Beef salad with peppers and various herbs in a mildly spicy lime sauce",
      "sa.lead": "In the evening and all day on Saturdays, our team serves delicious dishes from our kitchen at your table in a cosy atmosphere. We gladly accept reservations online – we look forward to your visit.",
      "sa.n1": "Lukewarm · rice noodles with lemongrass, fresh herbs, garlic, fried shallots, peanuts",
      "sa.n1.v1": "and beef",
      "sa.n1.v2": "and chicken",
      "sa.n1.v3": "and crispy duck",
      "sa.n1.v4": "and tofu · vt, vg",
      "sa.n1.v5": "and Planted Chicken · vt, vg",
      "sa.n2": "Lukewarm · rice noodles with fresh herbs, fried shallots, peanuts and spring rolls",
      "sa.n2.v1": "with shrimp and chicken",
      "sa.n2.v2": "with vegetables · vt, vg",
      "sa.n3": "Lukewarm · rice noodles with fresh herbs, fried shallots, peanuts and skewers in pepper leaves",
      "sa.n3.v1": "beef skewers",
      "sa.n3.v2": "tofu skewers · vt, vg",
      "sa.n4": "Fried flat rice noodles with vegetables, garlic, homemade soy sauce",
      "sa.n4.v1": "and beef",
      "sa.n4.v2": "and crispy chicken",
      "sa.n4.v3": "and shrimp",
      "sa.n4.v4": "and crispy duck",
      "sa.n4.v5": "and tofu and Planted Chicken · vt, vgm",
      "sa.note1": "Whenever possible, we are happy to cook gluten-free. Please inform us of any known allergies. Our service staff will be happy to advise you.",
      "sa.note2": "All prices incl. 8.1% VAT.",
      "sa.note3": "Origin of meat and fish: beef, chicken: Switzerland · duck: Thailand · shrimp: Vietnam.",
      "sa.note4": "Wi-Fi: NonLa Gast · Password: nonla2020",
      "sa.original": "Original menu card as image (front &amp; back)",
      "sa.p1": "Small traditional Vietnamese soup with tomatoes, mushrooms, lemongrass, fresh herbs, dill · slightly spicy",
      "sa.p1.tags": "<span data-i18n=\"sa.p1x\">with salmon 15.00 · with shrimp 14.00 · with tofu 13.50</span>",
      "sa.p1x": "with salmon 15.00 · with shrimp 14.00 · with tofu 13.50",
      "sa.r1": "Vietnamese beef ragout with vegetables and lemongrass, refined with red wine, served with rice",
      "sa.r2": "Red curry Vietnamese style with vegetables",
      "sa.r2.v1": "and crispy chicken",
      "sa.r2.v2": "and beef",
      "sa.r2.v3": "and crispy duck",
      "sa.r2.v4": "and tofu · vt, vg",
      "sa.r2.v5": "and Planted Chicken · vt, vg",
      "sa.r3": "Peanut curry Vietnamese style with vegetables",
      "sa.r3.v1": "and crispy chicken",
      "sa.r3.v2": "and crispy duck",
      "sa.r3.v3": "and tofu · vt, vg",
      "sa.r3.v4": "and Planted Chicken · vt, vg",
      "sa.r4": "Mango curry Vietnamese style with vegetables",
      "sa.r4.v1": "and crispy chicken",
      "sa.r4.v2": "and crispy duck",
      "sa.r4.v3": "and tofu · vt, vg",
      "sa.r4.v4": "and Planted Chicken · vt, vg",
      "sa.reserve": "Reserve a table",
      "sa.s1": "Edamame",
      "sa.s1.tags": "vg",
      "sa.s2": "Spring rolls",
      "sa.s2.v1": "with shrimp and chicken",
      "sa.s2.v2": "with vegetables · vg",
      "sa.s3": "Summer rolls",
      "sa.s3.v1": "with salmon and avocado",
      "sa.s3.v2": "with shrimp",
      "sa.s3.v3": "with beef and lemongrass",
      "sa.s3.v4": "with duck and mango",
      "sa.s3.v5": "with tofu and mango · vt, vgm",
      "sa.s3.v6": "with mango and avocado · vt, vgm",
      "sa.s4": "Chicken skewers with peanut sauce",
      "sa.s5": "Skewers in pepper leaves",
      "sa.s5.v1": "Beef skewers in pepper leaves",
      "sa.s5.v2": "Tofu skewers in pepper leaves · vg",
      "sa.s6": "Steamed homemade dumplings",
      "sa.s6.v1": "with shrimp",
      "sa.s6.v2": "with vegetables · vg",
      "sa.s7": "Fish cake Vietnamese style",
      "sa.s8": "Homemade crispy chicken wings",
      "sa.title": "Spalenbrunnen dinner",
      "sa.to-lunch": "To the lunch menu (Mon–Fri)",
      "sa.u1": "Traditional rice noodle soup",
      "sa.u1.v1": "with beef",
      "sa.u1.v2": "with chicken",
      "sa.u1.v3": "with crispy duck",
      "sa.u1.v4": "with tofu (meat broth)",
      "sa.u1.v5": "with tofu and Planted Chicken (vegetable broth) · vg",
      "sa.u2": "Traditional Vietnamese udon noodle soup with coconut milk",
      "sa.u2.tags": "<span data-i18n=\"sa.u2x\">with shrimp 28.00 · with tofu 26.00</span>",
      "sa.u2x": "with shrimp 28.00 · with tofu 26.00",
      "sm.buffet-legend": "Buffet dishes always with fried or white rice. Price: 17.– or 18.– CHF depending on composition (meat/tofu). All curry and wok dishes with beef, chicken, duck or tofu.",
      "sm.buffet-note": "Our buffet changes daily – a selection from the weekly menu:",
      "sm.buffet-sub": "Choose from today's buffet",
      "sm.buffet-title": "Lunch buffet · weekly menu",
      "sm.changing": "Please note: as our lunch menu changes constantly, this page may not be up to date. We appreciate your understanding.",
      "sm.concept": "Since lunch needs to be quick, the concept is similar to the Market Hall: no table service, but self-service at the counter. Buffet dishes are served immediately; dishes from the small menu are prepared to order and take 5 to 15 minutes (depending on how busy we are). In the evening we pamper you with our à-la-carte table service.",
      "sm.crumb": "Menu Spalenbrunnen lunch",
      "sm.d1": "Papaya salad with homemade fish sauce<br/>or vegan sauce",
      "sm.d1.tags": "vt · vg",
      "sm.d1x": "Papaya salad with shrimp 16.50",
      "sm.d2": "Mango salad with homemade fish sauce<br/>or vegan sauce",
      "sm.d2.tags": "vt · vg",
      "sm.d2x": "Mango salad with shrimp 15.50",
      "sm.d3": "Spring rolls with meat<br/>or vegetables",
      "sm.d4": "Summer rolls with beef | shrimp | tofu",
      "sm.d5": "Rice noodles with lemongrass<br/>and beef | chicken | duck",
      "sm.d5.tags": "vt · vg",
      "sm.d5x": "Rice noodles with lemongrass and tofu",
      "sm.d6": "Rice noodles and spring rolls<br/>with meat or vegetables",
      "sm.d7": "Fried rice noodles<br/>with beef | chicken | shrimp | duck | tofu",
      "sm.d8": "Vietnamese noodle soup<br/>with beef | chicken | crispy duck | tofu",
      "sm.di.day": "Tuesday",
      "sm.di.i1": "Red curry",
      "sm.di.i1s": "with beef, chicken, duck or tofu",
      "sm.di.i2": "Lemongrass curry (spicy)",
      "sm.di.i2s": "with beef, chicken, duck or tofu",
      "sm.di.i3": "Stir-fried vegetables in Thai basil sauce (spicy)",
      "sm.di.i3s": "with beef, chicken, duck or tofu",
      "sm.di.i4": "Stir-fried vegetables in truffle sauce",
      "sm.di.i4s": "with beef, chicken, duck or tofu",
      "sm.di.i5": "Szechuan vegetables Nón Lá style",
      "sm.di.i5s": "with beef, chicken, duck or tofu",
      "sm.do.day": "Thursday",
      "sm.do.i1": "Red curry",
      "sm.do.i1s": "with beef, chicken, duck or tofu",
      "sm.do.i2": "Peanut curry",
      "sm.do.i2s": "with beef, chicken, duck or tofu",
      "sm.do.i3": "Yellow curry (spicy)",
      "sm.do.i3s": "with beef, chicken, duck or tofu",
      "sm.do.i4": "Stir-fried vegetables in Thai basil sauce (spicy)",
      "sm.do.i4s": "with beef, chicken, duck or tofu",
      "sm.do.i5": "Stir-fried vegetables in five-spice sauce",
      "sm.do.i5s": "with beef, chicken, duck or tofu",
      "sm.eyebrow": "Restaurant · Mon to Fri · self-service",
      "sm.fr.day": "Friday",
      "sm.fr.i1": "Red curry",
      "sm.fr.i1s": "with beef, chicken, duck or tofu",
      "sm.fr.i2": "Yellow curry with mango",
      "sm.fr.i2s": "with beef, chicken, duck or tofu",
      "sm.fr.i3": "Lemongrass curry (spicy)",
      "sm.fr.i3s": "with beef, chicken, duck or tofu",
      "sm.fr.i4": "Stir-fried vegetables in XO-Nón Lá sauce (seafood sauce)",
      "sm.fr.i4s": "with beef, chicken, duck or tofu",
      "sm.fr.i5": "Tilapia fish in ginger sauce",
      "sm.fr.i5s": "with beef, chicken, duck or tofu",
      "sm.lead": "From Monday to Friday we offer a varying lunch buffet and a small selection of the dinner menu. All buffet dishes and small-menu dishes are listed or shown below.",
      "sm.mi.day": "Wednesday",
      "sm.mi.i1": "Red curry",
      "sm.mi.i1s": "with beef, chicken, duck or tofu",
      "sm.mi.i2": "Mango curry",
      "sm.mi.i2s": "with beef, chicken, duck or tofu",
      "sm.mi.i3": "Green curry (spicy)",
      "sm.mi.i3s": "with beef, chicken, duck or tofu",
      "sm.mi.i4": "Stir-fried vegetables in hoisin sauce",
      "sm.mi.i4s": "with beef, chicken, duck or tofu",
      "sm.mi.i5": "Stir-fried vegetables in chilli and garlic sauce",
      "sm.mi.i5s": "with beef, chicken, duck or tofu",
      "sm.mo.day": "Monday",
      "sm.mo.i1": "Red curry",
      "sm.mo.i1s": "with beef, chicken, duck or tofu",
      "sm.mo.i2": "Peanut curry",
      "sm.mo.i2s": "with beef, chicken, duck or tofu",
      "sm.mo.i3": "Green curry (spicy)",
      "sm.mo.i3s": "with beef, chicken, duck or tofu",
      "sm.mo.i4": "Stir-fried vegetables in pepper sauce",
      "sm.mo.i4s": "with beef, chicken, duck or tofu",
      "sm.mo.i5": "Stir-fried vegetables in lemongrass sauce",
      "sm.mo.i5s": "with beef, chicken, duck or tofu",
      "sm.served": "Served with fried or white rice · with beef, chicken, duck or tofu",
      "sm.small-title": "The small menu · to order (5–15 min.)",
      "sm.title": "Spalenbrunnen lunch",
      "sm.to-evening": "To the dinner menu",
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
    0: null, // Sunday
    1: [[690, 840], [1080, 1320]],
    2: [[690, 840], [1080, 1320]],
    3: [[690, 840], [1080, 1320]],
    4: [[690, 840], [1080, 1320]],
    5: [[690, 840], [1080, 1350]],
    6: [[720, 1350]],
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
})();
