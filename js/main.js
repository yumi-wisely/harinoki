/* ==========================================================================
   HARINOKI / 鍼ノ木 — main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header: shrink + solidify on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-active');
      mainNav.classList.toggle('is-open');
    });

    // Close mobile nav after tapping a link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-active');
        mainNav.classList.remove('is-open');
      });
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

});
