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
    let x = window.innerWidth * 0.7;
    let y = window.innerHeight * 0.28;
    let tx = x;
    let ty = y;

    window.addEventListener("pointermove", (event) => {
      tx = event.clientX;
      ty = event.clientY;
    }, { passive: true });

    const follow = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      orb.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ─── scroll reveal ─── */
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    // If motion is reduced, show everything immediately
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Assign stagger delays — group siblings under the same parent
    const groups = new Map();
    reveals.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach((children) => {
      children.forEach((child, i) => {
        child.setAttribute("data-delay", String(Math.min(i, 8)));
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
    const count = Math.round((width * height) / 12000);
    for (let i = 0; i < count; i += 1) {
      const isHero = Math.random() < 0.03;
      const isMedium = !isHero && Math.random() < 0.1;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: isHero ? 1.8 + Math.random() * 0.5 : isMedium ? 1.1 + Math.random() * 0.3 : Math.random() * 0.85 + 0.2,
        base: isHero ? 0.5 + Math.random() * 0.3 : Math.random() * 0.45 + 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: isHero ? 0.3 + Math.random() * 0.3 : Math.random() * 0.6 + 0.25,
        gold: isHero ? true : Math.random() > 0.78,
        isHero,
      });
    }
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    const t = time * 0.001;
    for (const star of stars) {
      const twinkle = reduceMotion ? 1 : 0.55 + Math.sin(t * star.speed + star.phase) * 0.45;
      const alpha = star.base * twinkle;
      ctx.beginPath();

      if (star.isHero) {
        // Hero stars get a soft glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
        gradient.addColorStop(0, `rgba(212, 180, 131, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(212, 180, 131, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(212, 180, 131, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = star.gold
          ? `rgba(212, 180, 131, ${alpha})`
          : `rgba(236, 231, 222, ${alpha})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
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
