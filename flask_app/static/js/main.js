/* ============================================================
   main.js — Shared utilities: counter animations, KPI fetch
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCounterAnimations();
  if (document.getElementById('kpiRow')) fetchKPIs();
});


// ── Animated counter for hero metric cards ──────────────────
function initCounterAnimations() {
  const cards = document.querySelectorAll('.metric-value[data-target]');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(card => observer.observe(card));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix  || '';
  const decimals = parseInt(el.dataset.decimal || 0);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = (target * eased).toFixed(decimals);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


// ── Fetch KPIs from Flask API ────────────────────────────────
async function fetchKPIs() {
  try {
    const res  = await fetch('/api/kpis');
    const data = await res.json();

    const fmt = (n) => n >= 1e9 ? (n/1e9).toFixed(1)+'B'
                     : n >= 1e6 ? (n/1e6).toFixed(1)+'M'
                     : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : n;

    setText('kpi-models',  data.Total_Models);
    setText('kpi-brands',  data.Total_Brands);
    setText('kpi-sales',   fmt(data.Total_Sales));
    setText('kpi-rating',  data.Avg_Rating + ' ⭐');
    setText('kpi-range',   data.Max_Range_km + ' km');
    setText('kpi-co2',     fmt(data.Total_CO2_Saved_kg));
  } catch (e) {
    console.warn('KPI fetch failed (DB may not be initialized yet):', e.message);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
