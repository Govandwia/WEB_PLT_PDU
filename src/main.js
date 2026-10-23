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
  } else {
    window.location.hash = '#/';
  }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
