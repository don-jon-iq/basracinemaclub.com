// Season Page — Pure CSS scroll, GSAP animations
// No Swiper — zero touch event interception

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth < 768;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- PAGE HERO ENTRANCE ----
if (prefersReduced) {
  gsap.set(['.page-hero-title', '.page-hero-desc', '.seasons-nav'], { opacity: 1, y: 0 });
} else {
  gsap.timeline({ delay: 0.35 })
    .to('.page-hero-title', { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' })
    .to('.page-hero-desc',  { opacity: 1,       duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('.seasons-nav',     { opacity: 1,       duration: 0.6, ease: 'power2.out' }, '-=0.3');
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

// ---- FILM CARDS: stagger animate in on scroll ----
document.querySelectorAll('.film-track').forEach(track => {
  const cards = track.querySelectorAll('.film-card');
  gsap.from(cards, {
    scrollTrigger: { trigger: track, start: 'top 88%' },
    opacity: 0, x: 30,
    duration: 0.5, stagger: 0.08,
    ease: 'power2.out',
  });
});

// ---- DIRECTOR TRACK: build nav buttons ----
const directorTrack = document.querySelector('.director-track');
if (directorTrack) {
  const cards = directorTrack.querySelectorAll('.director-card');
  const directors = ['Béla Tarr', 'Weerasethakul', 'Mungiu', 'N.B. Ceylan', 'Haneke', 'Wong Kar-wai', 'Herzog'];

  // Build nav
  const navWrap = document.createElement('div');
  navWrap.className = 'director-nav';
  directors.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.className = 'director-nav-btn' + (i === 0 ? ' active' : '');
    btn.textContent = name;
    btn.addEventListener('click', () => {
      const card = cards[i];
      if (!card) return;
      directorTrack.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      document.querySelectorAll('.director-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    navWrap.appendChild(btn);
  });
  directorTrack.after(navWrap);

  // Update active nav on scroll
  directorTrack.addEventListener('scroll', () => {
    const center = directorTrack.scrollLeft + directorTrack.clientWidth / 2;
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    document.querySelectorAll('.director-nav-btn').forEach((b, i) => {
      b.classList.toggle('active', i === closest);
    });
  }, { passive: true });
}

// ---- NAV compact ----
ScrollTrigger.create({
  start: 'top -60px',
  onUpdate: (self) => {
    document.querySelector('.nav').style.padding =
      self.direction === 1 ? '10px var(--pad)' : '16px var(--pad)';
  }
});

// ---- SEASONS NAV: highlight active section ----
document.querySelectorAll('.season-section').forEach((section, i) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 45%',
    onToggle: self => {
      if (!self.isActive) return;
      const links = document.querySelectorAll('.sn-item');
      links.forEach((l, j) => l.classList.toggle('active', j === i));
      if (isMobile) {
        const pill = links[i];
        const nav = document.querySelector('.seasons-nav');
        if (pill && nav) {
          // Only scroll the nav container horizontally, don't touch page scroll
          const navRect = nav.getBoundingClientRect();
          const pillRect = pill.getBoundingClientRect();
          const scrollLeft = nav.scrollLeft + (pillRect.left - navRect.left) - (navRect.width / 2) + (pillRect.width / 2);
          nav.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  });
});
