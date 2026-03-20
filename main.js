// Basra Cinema Club — main.js
// Mobile-first GSAP animations

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth < 768;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- HERO ENTRANCE ----
const heroTl = gsap.timeline({ delay: prefersReduced ? 0 : 0.4 });

if (prefersReduced) {
  gsap.set(['.hero-label','.hero-title','.hero-arabic','.hero-desc','.hero-cta','.hero-img','.scroll-hint'], { opacity: 1, y: 0, scale: 1 });
} else {
  heroTl
    .to('.hero-label',    { opacity: 1, duration: 0.7, ease: 'power2.out' })
    .to('.hero-title',    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.4')
    .to('.hero-arabic',   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.7')
    .to('.hero-desc',     { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('.hero-cta',      { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    .to('.hero-img',      { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, '-=1.2')
    .to('.scroll-hint',   { opacity: 1, duration: 0.5 }, '-=0.3');
}

// ---- HERO PARALLAX (desktop only) ----
if (!isMobile && !prefersReduced) {
  gsap.to('.hero-img', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    y: '15%',
    ease: 'none',
  });
}

// ---- NAV compact on scroll ----
ScrollTrigger.create({
  start: 'top -60px',
  onUpdate: (self) => {
    document.querySelector('.nav').style.padding =
      self.direction === 1 ? '10px var(--pad)' : '16px var(--pad)';
  }
});

// ---- ABOUT CARDS ----
gsap.to('.about-card', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 82%' },
  opacity: 1, y: 0,
  duration: isMobile ? 0.6 : 0.8,
  stagger: isMobile ? 0.1 : 0.15,
  ease: 'power2.out',
});

// ---- STATEMENT ----
gsap.to('.statement-quote', {
  scrollTrigger: { trigger: '.statement-section', start: 'top 82%' },
  opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
});
gsap.to('.value-prop', {
  scrollTrigger: { trigger: '.statement-section', start: 'top 75%' },
  opacity: 1, y: 0, duration: 0.75, delay: 0.15, ease: 'power2.out',
});

// ---- GALLERY CAROUSEL (mobile) ----
if (typeof Swiper !== 'undefined') {
  const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    centeredSlides: true,
    grabCursor: true,
    loop: true,
    speed: 500,
    touchStartPreventDefault: false,
    touchMoveStopPropagation: false,
    passiveListeners: true,
    threshold: 10,
    freeMode: { enabled: true, momentum: true, momentumRatio: 0.5, momentumBounce: false },
    on: {
      slideChange(swiper) {
        const total = swiper.slides.length - (swiper.loopedSlides || 0) * 2;
        const real = swiper.realIndex + 1;
        const cur = document.querySelector('.gallery-current');
        if (cur) cur.textContent = real;
        const bar = document.querySelector('.gallery-progress-bar');
        if (bar) bar.style.width = ((real / total) * 100) + '%';
      },
      init(swiper) {
        const total = swiper.slides.length;
        const tot = document.querySelector('.gallery-total');
        if (tot) tot.textContent = total > 20 ? 10 : Math.min(total, 10);
      }
    }
  });
}

// ---- GALLERY MASONRY (desktop) ----
if (!isMobile) {
  // Staggered column reveal
  document.querySelectorAll('.gallery-col').forEach((col, colIdx) => {
    const items = col.querySelectorAll('.gallery-item');
    gsap.from(items, {
      scrollTrigger: {
        trigger: '.gallery-masonry',
        start: 'top 85%',
      },
      opacity: 0,
      y: 32,
      duration: 0.7,
      stagger: 0.12,
      delay: colIdx * 0.08,
      ease: 'power2.out',
    });
  });

  // Parallax scrub per column
  if (!prefersReduced) {
    document.querySelectorAll('.gallery-col').forEach((col, i) => {
      gsap.to(col, {
        scrollTrigger: {
          trigger: '.gallery-masonry',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8 + i * 0.2,
        },
        y: i % 2 === 0 ? -40 : 40,
        ease: 'none',
      });
    });
  }
}

// ---- ROADMAP ----
gsap.to('.roadmap-item', {
  scrollTrigger: { trigger: '.roadmap', start: 'top 82%' },
  opacity: 1, x: 0,
  duration: 0.7,
  stagger: 0.12,
  ease: 'power3.out',
});

// ---- HISTORY YEAR ----
gsap.to('.history-year', {
  scrollTrigger: { trigger: '.history-section', start: 'top 82%' },
  opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
});

// Parallax year text
if (!prefersReduced) {
  gsap.to('.history-year', {
    scrollTrigger: {
      trigger: '.history-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: isMobile ? 0.5 : 1,
    },
    y: isMobile ? -30 : -60,
  });
}

// ---- JOIN SECTION ----
gsap.to('.join-title', {
  scrollTrigger: { trigger: '.join-section', start: 'top 82%' },
  opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
});
gsap.to('.join-sub', {
  scrollTrigger: { trigger: '.join-section', start: 'top 78%' },
  opacity: 1, duration: 0.7, delay: 0.2, ease: 'power2.out',
});
gsap.to('.join-btn', {
  scrollTrigger: { trigger: '.join-section', start: 'top 74%' },
  opacity: 1, duration: 0.6, delay: 0.35, ease: 'power2.out',
});

// ---- SECTION TITLES generic ----
document.querySelectorAll('.section-title').forEach(el => {
  if (el.closest('.hero') || el.closest('.join-section')) return;
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    y: 28, opacity: 0, duration: 0.75, ease: 'power2.out',
  });
});

// ---- TOUCH: ambient amber glow follows touch on hero ----
if (isMobile) {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      const rect = hero.getBoundingClientRect();
      const x = ((t.clientX - rect.left) / rect.width) * 100;
      const y = ((t.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--glow-x', x + '%');
      hero.style.setProperty('--glow-y', y + '%');
    }, { passive: true });
  }
}

// ---- MOBILE: pulse amber border on section entry ----
if (isMobile && !prefersReduced) {
  document.querySelectorAll('.about-card').forEach(card => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(card, { borderTopColor: 'rgba(200,90,0,0)' }, {
          borderTopColor: 'rgba(200,90,0,1)',
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });
  });
}
