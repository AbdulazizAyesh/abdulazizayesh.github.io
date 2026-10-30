// Nav: add shadow/border on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');
burger?.addEventListener('click', () => links.classList.toggle('open'));
links?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

// Scroll reveal
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Project cards + featured box: spotlight follows cursor
document.querySelectorAll('.card, .feature').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Lightbox: open images (single or gallery) inline without leaving the page
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxVideo = document.getElementById('lightboxVideo');
let gallery = [];
let galleryIndex = 0;

const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src);

function renderLightbox() {
  const src = gallery[galleryIndex];
  if (isVideo(src)) {
    lightboxImg.hidden = true;
    lightboxImg.src = '';
    lightboxVideo.hidden = false;
    lightboxVideo.src = src;
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.hidden = true;
    lightboxVideo.removeAttribute('src');
    lightboxImg.hidden = false;
    lightboxImg.src = src;
  }
  const multi = gallery.length > 1;
  lightboxPrev.hidden = !multi;
  lightboxNext.hidden = !multi;
  lightboxCounter.hidden = !multi;
  if (multi) lightboxCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
}
function openLightbox(list, alt) {
  gallery = list;
  galleryIndex = 0;
  lightboxImg.alt = alt || '';
  renderLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  gallery = [];
}
function navLightbox(dir) {
  if (gallery.length < 2) return;
  galleryIndex = (galleryIndex + dir + gallery.length) % gallery.length;
  renderLightbox();
}

document.querySelectorAll('.js-lightbox').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const data = el.getAttribute('data-gallery');
    const list = data ? data.split('|') : [el.getAttribute('href')];
    const img = el.querySelector('img');
    openLightbox(list, img ? img.alt : '');
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(-1); });
lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(1); });
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox(); // click on backdrop closes
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') navLightbox(-1);
  else if (e.key === 'ArrowRight') navLightbox(1);
});
