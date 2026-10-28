/* ============================================================
   dashboard.js — Executive Dashboard with 7 Visualizations
   ============================================================ */

const PALETTE = [
  '#2563eb', '#7c3aed', '#16a34a', '#ea580c', '#0891b2',
  '#be185d', '#854d0e', '#4338ca', '#065f46', '#92400e',
  '#3b82f6', '#a855f7'
];

let rawVehicles = [];
let chartInstances = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboardData();
  checkSavedTableauUrl();
});

async function loadDashboardData() {
  try {
    const res = await fetch('/api/vehicles');
    rawVehicles = await res.json();
    renderAllDashboardCharts(rawVehicles);
  } catch (err) {
    console.error('Error loading dashboard data:', err);
  }
}

function filterDashboardData() {
  const cat = document.getElementById('dashCategoryFilter').value;
  const bat = document.getElementById('dashBatteryFilter').value;

  const filtered = rawVehicles.filter(v => {
    const matchCat = cat === 'ALL' || v.Category.toLowerCase() === cat.toLowerCase();
    const matchBat = bat === 'ALL' || v.Battery_Tech.toLowerCase() === bat.toLowerCase();
    return matchCat && matchBat;
  });

  renderAllDashboardCharts(filtered);
}

function renderAllDashboardCharts(data) {
  renderBrandSales(data);
  renderCategoryShare(data);
  renderBatteryChemistry(data);
  renderPriceVsRange(data);
  renderCountryOutput(data);
  renderRangeBenchmark(data);
  renderCustomerRatings(data);
}

// 1. Annual Sales Volume by Top Manufacturers (Bar Chart)
function renderBrandSales(data) {
  const brandMap = {};
  data.forEach(v => {
    brandMap[v.Brand] = (brandMap[v.Brand] || 0) + v.Annual_Sales;
  });
  const sorted = Object.entries(brandMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  createChart('dashBrandSales', 'bar', {
    labels: sorted.map(d => d[0]),
    datasets: [{
      label: 'Units Sold / Year',
      data: sorted.map(d => d[1]),
      backgroundColor: PALETTE[0],
      borderRadius: 6
    }]
  }, {
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { callback: v => v >= 1e3 ? (v / 1e3).toLocaleString() + 'k' : v } }
    }
  });
}

// 2. Category Share (Doughnut Chart)
function renderCategoryShare(data) {
  const catMap = {};
  data.forEach(v => {
    catMap[v.Category] = (catMap[v.Category] || 0) + v.Annual_Sales;
  });
  const labels = Object.keys(catMap);
  const values = Object.values(catMap);

  createChart('dashCategoryDist', 'doughnut', {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: PALETTE.slice(0, labels.length)
    }]
  }, {
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
    }
  });
}

// 3. Battery Chemistry Mix (Pie Chart)
function renderBatteryChemistry(data) {
  const batMap = {};
  data.forEach(v => {
    batMap[v.Battery_Tech] = (batMap[v.Battery_Tech] || 0) + 1;
  });
  const labels = Object.keys(batMap);
  const values = Object.values(batMap);

  createChart('dashBatteryDist', 'pie', {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: ['#2563eb', '#16a34a', '#7c3aed', '#ea580c']
    }]
  }, {
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
    }
  });
}

// 4. Price vs Driving Range (Scatter Plot)
function renderPriceVsRange(data) {
  const scatterData = data.map(v => ({
    x: v.Price_USD,
    y: v.Driving_Range_km,
    model: `${v.Brand} ${v.Model}`
  }));

  createChart('dashPriceRange', 'scatter', {
    datasets: [{
      label: 'EV Models',
      data: scatterData,
      backgroundColor: '#2563eb',
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  }, {
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw.model}: $${ctx.raw.x.toLocaleString()} | ${ctx.raw.y} km`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Price (USD)' }, ticks: { callback: v => '$' + (v / 1e3) + 'k' } },
      y: { title: { display: true, text: 'Driving Range (km)' } }
    }
  });
}

// 5. Global Production Hubs (Horizontal Bar Chart)
function renderCountryOutput(data) {
  const cMap = {};
  data.forEach(v => {
    cMap[v.Manufacturing_Country] = (cMap[v.Manufacturing_Country] || 0) + v.Annual_Sales;
  });
  const sorted = Object.entries(cMap).sort((a, b) => b[1] - a[1]);

  createChart('dashCountryOutput', 'bar', {
    labels: sorted.map(d => d[0]),
    datasets: [{
      label: 'Annual Output',
      data: sorted.map(d => d[1]),
      backgroundColor: PALETTE[1],
      borderRadius: 4
    }]
  }, {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { callback: v => v >= 1e3 ? (v / 1e3) + 'k' : v } }
    }
  });
}

// 6. Average Driving Range by Category (Bar Chart)
function renderRangeBenchmark(data) {
  const sums = {};
  const counts = {};
  data.forEach(v => {
    sums[v.Category] = (sums[v.Category] || 0) + v.Driving_Range_km;
    counts[v.Category] = (counts[v.Category] || 0) + 1;
  });
  const labels = Object.keys(sums);
  const avgs = labels.map(c => Math.round(sums[c] / counts[c]));

  createChart('dashRangeByCategory', 'bar', {
    labels: labels,
    datasets: [{
      label: 'Avg Range (km)',
      data: avgs,
      backgroundColor: '#16a34a',
      borderRadius: 4
    }]
  }, {
    plugins: { legend: { display: false } }
  });
}

// 7. Customer Satisfaction & Rating Distribution (Line Chart)
function renderCustomerRatings(data) {
  const sortedBySales = [...data].sort((a, b) => b.Annual_Sales - a.Annual_Sales).slice(0, 10);

  createChart('dashCustomerRating', 'line', {
    labels: sortedBySales.map(v => `${v.Brand} ${v.Model}`),
    datasets: [{
      label: 'Customer Rating (1-5 ⭐)',
      data: sortedBySales.map(v => v.Customer_Rating),
      borderColor: '#ea580c',
      backgroundColor: 'rgba(234, 88, 12, 0.1)',
      fill: true,
      tension: 0.35,
      pointRadius: 5
    }]
  }, {
    scales: {
      y: { min: 3.5, max: 5.0, ticks: { stepSize: 0.5 } }
    }
  });
}

// Helper: safe chart creation / reuse
function createChart(canvasId, type, chartData, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  chartInstances[canvasId] = new Chart(el, {
    type: type,
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...options
    }
  });
}

// ── Tableau Public Modal & Embed Handlers ──
function toggleTableauPublicModal() {
  const modal = document.getElementById('tableauModal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function saveTableauUrl() {
  const input = document.getElementById('tableauUrlInput');
  const url = input.value.trim();
  if (!url) {
    alert('Please enter a valid Tableau Public URL');
    return;
  }
  localStorage.setItem('tableauDashboardUrl', url);
  renderTableauEmbed(url);
  toggleTableauPublicModal();
}

function renderTableauEmbed(url) {
  const wrapper = document.getElementById('tableauPublicWrapper');
  const slot = document.getElementById('tableauEmbedSlot');
  // Format embed url if needed
  let embedUrl = url;
  if (!embedUrl.includes(':embed=yes')) {
    embedUrl += (embedUrl.includes('?') ? '&' : '?') + ':showVizHome=no&:embed=true';
  }
  slot.innerHTML = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" style="border-radius: 8px;"></iframe>`;
  wrapper.style.display = 'block';
  document.getElementById('nativeDashboardGrid').style.display = 'none';
}

function closeTableauEmbed() {
  document.getElementById('tableauPublicWrapper').style.display = 'none';
  document.getElementById('nativeDashboardGrid').style.display = 'grid';
}

function checkSavedTableauUrl() {
  const saved = localStorage.getItem('tableauDashboardUrl');
  if (saved) {
    // Keep native dashboard default visible unless specifically toggled
  }
}
