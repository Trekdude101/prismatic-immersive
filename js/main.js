/**
 * Prismatic Immersive — Main JavaScript
 * Mobile nav toggle, scroll effects, reveal animations, active nav link
 */
(function () {
  'use strict';

  // ── DOM references ──────────────────────────────────────
  const header    = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav__link');
  const sections  = document.querySelectorAll('section[id]');
  const reveals   = document.querySelectorAll('.reveal');

  // ── 1. Mobile nav toggle ────────────────────────────────
  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleNav);

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleNav();
      navToggle.focus();
    }
  });

  // ── 2. Nav background on scroll ─────────────────────────
  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load
  header.classList.toggle('scrolled', window.scrollY > 50);

  // ── 3. Scroll reveal animations ─────────────────────────
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    reveals.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ── 4. Hero slideshow ────────────────────────────────────
  var slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    var current = 0;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var interval = prefersReducedMotion ? null : setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // ── 5. Active nav link based on scroll position ─────────
  function updateActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      var top    = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      var id     = section.getAttribute('id');

      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
        }
      });
    });
  }

  updateActiveLink();
})();
