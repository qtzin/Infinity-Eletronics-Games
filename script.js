/**
 * ============================================================
 * INFINITY ELECTRONICS & GAMES  –  script.js
 * Funcionalidades:
 *  1. Loading screen
 *  2. Header scroll effect
 *  3. Menu mobile
 *  4. Scroll suave
 *  5. Reveal animations (IntersectionObserver)
 *  6. Filtro de catálogo por categoria
 * ============================================================
 */

'use strict';

/* ── 1. LOADING SCREEN ────────────────────────────────── */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  // Aguarda 1.6s (duração da barra de carregamento) e oculta
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1700);
});


/* ── 2. HEADER SCROLL EFFECT ──────────────────────────── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


/* ── 3. MENU MOBILE ───────────────────────────────────── */
const burger  = document.getElementById('burger');
const mobNav  = document.getElementById('mobNav');

burger.addEventListener('click', () => {
  const open = mobNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Fecha ao clicar em link
mobNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobNav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Fecha ao clicar fora
document.addEventListener('click', e => {
  if (mobNav.classList.contains('open') &&
      !mobNav.contains(e.target) &&
      !burger.contains(e.target)) {
    mobNav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ── 4. SCROLL SUAVE ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 5. REVEAL ANIMATIONS ─────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.revealDelay || 0, 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.1 });

  // Elementos individuais [data-reveal]
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // Grids com delay escalonado
  const staggerSelectors = [
    '.pcard', '.acard', '.rcard', '.unit-card'
  ];
  staggerSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.dataset.revealDelay = i * 70;
      io.observe(el);
    });
  });

  // Elementos únicos sem [data-reveal]
  document.querySelectorAll('.rev-score, .contact-box, .insta-grid').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);


/* ── 6. FILTRO DE CATÁLOGO ────────────────────────────── */
const filterBtns = document.querySelectorAll('.cf-btn');
const prodCards  = document.querySelectorAll('.pcard');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualiza botão ativo
    filterBtns.forEach(b => b.classList.remove('cf-active'));
    btn.classList.add('cf-active');

    const cat = btn.dataset.cat;

    prodCards.forEach(card => {
      const cardCat = card.dataset.cat;
      const match   = cat === 'all' || cardCat === cat;

      if (match) {
        card.classList.remove('cat-hidden');
        // Re-anima ao aparecer
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
        setTimeout(() => card.classList.add('revealed'), 80);
      } else {
        card.classList.add('cat-hidden');
      }
    });
  });
});
