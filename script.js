const roles = [
  "Hardware Developer",
  "Startup Founder",
  "AI & Embedded Systems Enthusiast",
];

const typingEl = document.getElementById("typingText");
const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");
const particleField = document.getElementById("particleField");
const cursorGlow = document.getElementById("cursorGlow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function runLoader() {
  return new Promise((resolve) => {
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 12 + 6;
      loaderProgress.style.width = `${Math.min(progress, 100)}%`;
      if (progress < 100) {
        setTimeout(tick, 110);
      } else {
        setTimeout(() => {
          loader.classList.add("hide");
          resolve();
        }, 280);
      }
    };
    tick();
  });
}

function typingEffect() {
  if (!typingEl) return;
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const loop = () => {
    const current = roles[roleIndex];
    typingEl.textContent = deleting
      ? current.slice(0, charIndex--)
      : current.slice(0, charIndex++);

    let delay = deleting ? 35 : 62;
    if (!deleting && charIndex > current.length) {
      deleting = true;
      delay = 1100;
    } else if (deleting && charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
      delay = 180;
    }
    setTimeout(loop, delay);
  };
  loop();
}

function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function buildParticles() {
  if (!particleField || reduceMotion) return;
  const count = window.innerWidth < 760 ? 18 : 38;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("span");
    node.className = "particle";
    node.style.left = `${Math.random() * 100}%`;
    node.style.animationDuration = `${10 + Math.random() * 12}s`;
    node.style.animationDelay = `${Math.random() * 7}s`;
    node.style.opacity = String(0.2 + Math.random() * 0.45);
    frag.appendChild(node);
  }
  particleField.appendChild(frag);
}

function syncActiveNav() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const links = Array.from(document.querySelectorAll(".top-nav nav a"));
  const map = new Map(links.map((link) => [link.getAttribute("href")?.slice(1), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("active"));
        const active = map.get(entry.target.id);
        if (active) active.classList.add("active");
      });
    },
    { rootMargin: "-35% 0px -52% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}

function smoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initTiltCards() {
  if (reduceMotion) return;
  const cards = document.querySelectorAll(".tilt");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function magneticButtons() {
  if (reduceMotion) return;
  const magnetic = document.querySelectorAll(".magnetic");
  magnetic.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingCleientRect();
      const strength = 18;
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0,0)";
    });
  });
}

function cursorAmbientGlow() {
  if (!cursorGlow || reduceMotion) return;
  document.addEventListener("mousemove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

function initParallax() {
  if (reduceMotion) return;
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  const onScroll = () => {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = Number(el.getAttribute("data-parallax") || "0");
      el.style.transform = `translateY(${y * speed}px)`;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function cinematicStagger() {
  const targets = document.querySelectorAll(".hero .reveal, .hero-bento .bento-card");
  targets.forEach((el, idx) => {
    el.style.transitionDelay = `${idx * 80}ms`;
  });
}

async function boot() {
  if (reduceMotion) {
    loader.classList.add("hide");
  } else {
    await runLoader();
  }
  typingEffect();
  revealOnScroll();
  buildParticles();
  smoothAnchors();
  syncActiveNav();
  initTiltCards();
  magneticButtons();
  initParallax();
  cursorAmbientGlow();
  cinematicStagger();
}

boot();
