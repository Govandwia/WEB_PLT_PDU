import './style.css';
import { renderHome } from './pages/HomePage.js';
import { renderOverview, renderStep } from './pages/ProcessPages.js';
import { renderToolPage } from './pages/ToolPage.js';

let cleanupCurrentPage = null;

function navigate() {
  if (typeof cleanupCurrentPage === 'function') {
    cleanupCurrentPage();
    cleanupCurrentPage = null;
  }

  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');
  if (!app) return;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update navbar active state
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#/' && (hash === '#/' || hash === '')) {
      link.classList.add('active');
    } else if (href !== '#/' && hash.startsWith(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Routing
  if (hash === '#/' || hash === '') {
    cleanupCurrentPage = renderHome(app);
  } else if (hash === '#/cara-kerja') {
    renderOverview(app);
  } else if (hash.startsWith('#/cara-kerja/')) {
    const stepNum = parseInt(hash.replace('#/cara-kerja/', ''), 10);
    cleanupCurrentPage = renderStep(app, isNaN(stepNum) ? 1 : stepNum);
  } else if (hash === '#/alat') {
    renderToolPage(app);
    window.location.hash = '#/';
  }
}

// Navigasi Mobile Menu
function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const navbar = document.querySelector('.pdu-navbar');
  if (!toggle || !navbar) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('menu-open');
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navbar.classList.remove('menu-open');
    }
  });

  navbar.querySelectorAll('.nav-link, .nav-mobile-cta a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
    });
  });
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  navigate();
});
