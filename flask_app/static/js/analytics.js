/* ============================================================
   analytics.js — Full analytics page with filter + table
   ============================================================ */

const COLORS = [
  '#2563eb','#7c3aed','#16a34a','#ea580c','#0891b2',
  '#be185d','#854d0e','#4338ca','#065f46','#92400e',
  '#1d4ed8','#6d28d9'
];

let allVehicles = [];
let chartInstances = {};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllData);
} else {
  loadAllData();
}

async function loadAllData() {
  try {
    const [vehicles, brands, cats, battery, countries] = await Promise.all([
      fetch('/api/vehicles').then(r => r.json()),
      fetch('/api/brands').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/battery-tech').then(r => r.json()),
      fetch('/api/countries').then(r => r.json()),
    ]);

    allVehicles = vehicles;
    renderTable(vehicles);

    try { renderSalesByBrand(brands.slice(0, 12)); } catch(e) { console.error('salesByBrand err', e); }
    try { renderSalesByCategory(cats); } catch(e) { console.error('salesByCategory err', e); }
    try { renderBatteryDist(battery); } catch(e) { console.error('batteryDist err', e); }
    try { renderCountryShare(countries); } catch(e) { console.error('countryShare err', e); }
    try { renderRangeByCategory(cats); } catch(e) { console.error('rangeByCategory err', e); }
  } catch(e) {
    console.warn('Analytics: Failed to fetch API data —', e.message);
    const tbody = document.getElementById('vehicleTableBody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" class="loading">Failed to load data from server. Please refresh.</td></tr>';
    }
  }
}


// ── Filters ─────────────────────────────────────────────────

window.applyFilters = function() {
  const cat   = document.getElementById('filterCategory').value.toLowerCase();
  const brand = document.getElementById('filterBrand').value.toLowerCase().trim();
  const filtered = allVehicles.filter(v => {
    const matchCat   = !cat   || v.Category.toLowerCase() === cat;
    const matchBrand = !brand || v.Brand.toLowerCase().includes(brand);
    return matchCat && matchBrand;
  });
  renderTable(filtered);
};

window.clearFilters = function() {
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterBrand').value    = '';
  renderTable(allVehicles);
};


// ── Table ────────────────────────────────────────────────────

function renderTable(data) {
  const tbody = document.getElementById('vehicleTableBody');
  const count = document.getElementById('tableCount');
  if (count) count.textContent = `${data.length} vehicles`;
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="loading">No vehicles match the selected filters.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(v => `
    <tr>
      <td><strong>${v.Brand}</strong></td>
      <td>${v.Model}</td>
      <td>${v.Category}</td>
      <td>${v.Battery_Tech}</td>
      <td>${v.Driving_Range_km.toLocaleString()}</td>
      <td>$${Number(v.Price_USD).toLocaleString()}</td>
      <td>${Number(v.Annual_Sales).toLocaleString()}</td>
      <td>${v.Market_Share_Percent}%</td>
      <td>${renderStars(v.Customer_Rating)}</td>
    </tr>
  `).join('');
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(full) + half + ` (${rating})`;
}


// ── Charts ───────────────────────────────────────────────────

function makeChart(id, type, labels, datasets, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (chartInstances[id]) chartInstances[id].destroy();
  chartInstances[id] = new Chart(el, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      ...options
    }
  });
}

function renderSalesByBrand(data) {
  makeChart('salesByBrand', 'bar',
    data.map(d => d.Brand),
    [{
      label: 'Annual Sales',
      data: data.map(d => d.Total_Sales),
      backgroundColor: COLORS,
      borderRadius: 6, borderSkipped: false,
    }],
    {
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: v => v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v } } }
    }
  );
}

function renderSalesByCategory(data) {
  makeChart('salesByCategory', 'doughnut',
    data.map(d => d.Category),
    [{ data: data.map(d => d.Total_Sales), backgroundColor: COLORS, hoverOffset: 10 }],
    { plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
  );
}

function renderBatteryDist(data) {
  makeChart('batteryDist', 'pie',
    data.map(d => d.Battery_Tech),
    [{ data: data.map(d => d.Total_Sales), backgroundColor: COLORS, hoverOffset: 8 }],
    { plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
  );
}

function renderCountryShare(data) {
  makeChart('countryShare', 'bar',
    data.map(d => d.Manufacturing_Country),
    [{
      label: 'Total Sales',
      data: data.map(d => d.Total_Sales),
      backgroundColor: COLORS, borderRadius: 6, borderSkipped: false,
    }],
    {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { callback: v => v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v } } }
    }
  );
}

function renderRangeByCategory(data) {
  makeChart('rangeByCategory', 'bar',
    data.map(d => d.Category),
    [{
      label: 'Avg Range (km)',
      data: data.map(d => d.Avg_Range),
      backgroundColor: '#2563eb', borderRadius: 6, borderSkipped: false,
    }],
    { plugins: { legend: { display: false } } }
  );
}
