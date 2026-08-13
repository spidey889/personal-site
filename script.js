(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── clock ─── */
  const clockEl = document.querySelector("[data-clock]");
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const tick = () => {
    if (clockEl) clockEl.textContent = formatter.format(new Date());
  };
  tick();
  window.setInterval(tick, 1000);

  /* ─── cursor orb ─── */
  const orb = document.querySelector(".orb");
  if (orb && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("is-pointer");
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.4;
    let tx = x;
    let ty = y;

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    const follow = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      orb.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ─── hero parallax on scroll ─── */
  const heroContent = document.querySelector(".hero-content");
  const scrollCue = document.querySelector(".scroll-cue");

  if (!reduceMotion && heroContent) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;
          if (scrollY < vh) {
            const p = scrollY / vh;
            heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            heroContent.style.opacity = String(Math.max(0, 1 - p * 1.4));
            if (scrollCue) {
              scrollCue.style.opacity = String(Math.max(0, 1 - p * 4));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── scroll reveal ─── */
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Stagger siblings under the same parent
    const groups = new Map();
    reveals.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach((children) => {
      children.forEach((child, i) => {
        child.setAttribute("data-delay", String(Math.min(i, 6)));
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ─── starfield ─── */
  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const stars = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = false;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const seed = () => {
    stars.length = 0;
    const count = Math.round((width * height) / 10000);
    for (let i = 0; i < count; i++) {
      const isHero = Math.random() < 0.025;
      const isMed = !isHero && Math.random() < 0.1;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: isHero
          ? 1.6 + Math.random() * 0.6
          : isMed
            ? 1.0 + Math.random() * 0.35
            : Math.random() * 0.8 + 0.18,
        base: isHero
          ? 0.45 + Math.random() * 0.35
          : Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: isHero
          ? 0.25 + Math.random() * 0.25
          : Math.random() * 0.55 + 0.2,
        gold: isHero || Math.random() > 0.8,
        isHero,
      });
    }
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    const t = time * 0.001;
    for (const s of stars) {
      const tw = reduceMotion ? 1 : 0.5 + Math.sin(t * s.speed + s.phase) * 0.5;
      const a = s.base * tw;
      ctx.beginPath();

      if (s.isHero) {
        // Hero stars get a soft radial glow
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        g.addColorStop(0, `rgba(212,180,131,${a})`);
        g.addColorStop(0.35, `rgba(212,180,131,${a * 0.35})`);
        g.addColorStop(1, "rgba(212,180,131,0)");
        ctx.fillStyle = g;
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = s.gold
          ? `rgba(212,180,131,${a})`
          : `rgba(232,228,219,${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      }

      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  if (!running) {
    running = true;
    requestAnimationFrame(draw);
  }
})();
