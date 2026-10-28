/* ============================================================
   dashboard.js — Chart.js charts for the Dashboard page
   ============================================================ */

const PALETTE = [
  '#2563eb','#7c3aed','#16a34a','#ea580c','#0891b2',
  '#be185d','#854d0e','#4338ca','#065f46','#92400e'
];

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardCharts();
});


async function loadDashboardCharts() {
  try {
    const [brands, cats, battery, countries] = await Promise.all([
      fetch('/api/brands').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/battery-tech').then(r => r.json()),
      fetch('/api/countries').then(r => r.json()),
    ]);

    renderBrandChart(brands);
    renderCategoryChart(cats);
    renderBatteryChart(battery);
    renderCountryChart(countries);
  } catch(e) {
    console.warn('Dashboard charts: DB not ready yet —', e.message);
  }
}


function renderBrandChart(data) {
  const el = document.getElementById('brandChart');
  if (!el) return;
  const top = data.slice(0, 8);
  new Chart(el, {
    type: 'bar',
    data: {
      labels: top.map(d => d.Brand),
      datasets: [{
        label: 'Annual Sales',
        data: top.map(d => d.Total_Sales),
        backgroundColor: PALETTE,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v } }
      }
    }
  });
}


function renderCategoryChart(data) {
  const el = document.getElementById('categoryChart');
  if (!el) return;
  new Chart(el, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.Category),
      datasets: [{
        data: data.map(d => d.Total_Sales),
        backgroundColor: PALETTE,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 } } }
      }
    }
  });
}


function renderBatteryChart(data) {
  const el = document.getElementById('batteryChart');
  if (!el) return;
  new Chart(el, {
    type: 'pie',
    data: {
      labels: data.map(d => d.Battery_Tech),
      datasets: [{
        data: data.map(d => d.Total_Sales),
        backgroundColor: PALETTE.slice(0, data.length),
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 } } }
      }
    }
  });
}


function renderCountryChart(data) {
  const el = document.getElementById('countryChart');
  if (!el) return;
  new Chart(el, {
    type: 'bar',
    data: {
      labels: data.map(d => d.Manufacturing_Country),
      datasets: [{
        label: 'Total Sales',
        data: data.map(d => d.Total_Sales),
        backgroundColor: PALETTE,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { callback: v => v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v } }
      }
    }
  });
}
