// Season Page — GSAP + Swiper (Mobile-first)
gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth < 768;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- PAGE HERO ENTRANCE ----
const heroTl = gsap.timeline({ delay: prefersReduced ? 0 : 0.35 });

if (prefersReduced) {
  gsap.set(['.page-hero-title','.page-hero-desc','.seasons-nav'], { opacity: 1, y: 0 });
} else {
  heroTl
    .to('.page-hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .to('.page-hero-desc',  { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('.seasons-nav',     { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
}

// ---- SEASON TITLES + DESCS ----
document.querySelectorAll('.season-title').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  });
});
document.querySelectorAll('.season-desc').forEach(el => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 1, duration: 0.7, delay: 0.15, ease: 'power2.out',
  });
});

// ---- SWIPER CONFIG ----
const filmSwiperConfig = {
  slidesPerView: 'auto',
  spaceBetween: 3,
  grabCursor: true,
  keyboard: { enabled: true },
  a11y: { enabled: true },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // Momentum scrolling on mobile
  freeMode: {
    enabled: isMobile,
    momentum: true,
    momentumRatio: 0.7,
  },
};

new Swiper('.swiper1', filmSwiperConfig);
new Swiper('.swiper2', filmSwiperConfig);
new Swiper('.swiper3', filmSwiperConfig);
new Swiper('.swiper4', filmSwiperConfig);

// ---- DIRECTOR RETROSPECTIVE SWIPER ----
const retroSwiper = new Swiper('.swiper5', {
  slidesPerView: 1,
  spaceBetween: 0,
  grabCursor: true,
  keyboard: { enabled: true },
  effect: 'fade',
  fadeEffect: { crossFade: true },
  speed: 600,
  navigation: {
    nextEl: '.retro-section .swiper-button-next',
    prevEl: '.retro-section .swiper-button-prev',
  },
  on: {
    slideChange: function () {
      updateRetroProgress(this.activeIndex, this.slides.length);
    },
    init: function () {
      buildRetroProgress(this.slides.length);
    }
  }
});

function buildRetroProgress(total) {
  const retro = document.querySelector('.retro-section');
  if (!retro) return;
  const wrap = document.createElement('div');
  wrap.className = 'retro-progress';
  for (let i = 0; i < total; i++) {
    const bar = document.createElement('div');
    bar.className = 'retro-progress-bar' + (i === 0 ? ' active' : '');
    bar.addEventListener('click', () => retroSwiper.slideTo(i));
    bar.style.cursor = 'pointer';
    wrap.appendChild(bar);
  }
  retro.appendChild(wrap);
}

function updateRetroProgress(activeIdx, total) {
  document.querySelectorAll('.retro-progress-bar').forEach((bar, i) => {
    bar.classList.toggle('active', i === activeIdx);
  });
}

// ---- NAV compact ----
ScrollTrigger.create({
  start: 'top -60px',
  onUpdate: (self) => {
    document.querySelector('.nav').style.padding =
      self.direction === 1 ? '10px var(--pad)' : '16px var(--pad)';
  }
});

// ---- SEASONS NAV active on scroll ----
const sections = document.querySelectorAll('.season-section');
sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 45%',
    onToggle: self => {
      if (!self.isActive) return;
      document.querySelectorAll('.sn-item').forEach((l, j) => {
        l.classList.toggle('active', j === i);
      });
      // Scroll the nav pill into view on mobile
      if (isMobile) {
        const pill = document.querySelectorAll('.sn-item')[i];
        if (pill) pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  });
});

// ---- MOBILE: swipe gesture feedback on film slides ----
if (isMobile) {
  document.querySelectorAll('.film-slide').forEach(slide => {
    slide.addEventListener('touchstart', () => {
      slide.style.transform = 'scale(0.97)';
    }, { passive: true });
    slide.addEventListener('touchend', () => {
      slide.style.transform = '';
    }, { passive: true });
  });
}
