/* ============================================================
   dashboard.js — Executive BI Dashboard Engine
   Guaranteed Zero Infinite Hover Expansions with Strict Bounds
   ============================================================ */

const BRAND_PALETTE = [
  '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
  '#1d4ed8', '#1e40af', '#1e3a8a'
];

const CAT_COLORS = {
  'SUV': '#2563eb',
  'Sedan': '#7c3aed',
  'Hatchback': '#16a34a',
  'Truck': '#ea580c'
};

const BATTERY_COLORS = {
  'NMC': '#2563eb',
  'LFP': '#16a34a',
  'NCA': '#7c3aed',
  'Solid-State': '#ea580c'
};

let rawVehicles = [];
let chartInstances = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    const res = await fetch('/api/vehicles');
    rawVehicles = await res.json();
    renderAllDashboardCharts(rawVehicles);
  } catch (err) {
    console.error('Error fetching dashboard dataset:', err);
  }
}

function filterDashboardData() {
  const cat = document.getElementById('dashCategoryFilter').value;
  const bat = document.getElementById('dashBatteryFilter').value;
  const country = document.getElementById('dashCountryFilter').value;

  const filtered = rawVehicles.filter(v => {
    const matchCat = cat === 'ALL' || v.Category.toLowerCase() === cat.toLowerCase();
    const matchBat = bat === 'ALL' || v.Battery_Tech.toLowerCase() === bat.toLowerCase();
    const matchCountry = country === 'ALL' || v.Manufacturing_Country.toLowerCase() === country.toLowerCase();
    return matchCat && matchBat && matchCountry;
  });

  const statusText = document.getElementById('filterStatusText');
  if (statusText) {
    statusText.textContent = `Showing ${filtered.length} of ${rawVehicles.length} vehicles`;
  }

  renderAllDashboardCharts(filtered);
}

function resetAllFilters() {
  document.getElementById('dashCategoryFilter').value = 'ALL';
  document.getElementById('dashBatteryFilter').value = 'ALL';
  document.getElementById('dashCountryFilter').value = 'ALL';
  filterDashboardData();
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

// 1. Annual Sales Volume by Top Manufacturers
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
      label: 'Units Delivered / Year',
      data: sorted.map(d => d[1]),
      backgroundColor: '#2563eb',
      hoverBackgroundColor: '#1d4ed8',
      borderRadius: 6,
      borderSkipped: false
    }]
  }, {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` Deliveries: ${ctx.raw.toLocaleString()} vehicles`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { callback: v => v >= 1e3 ? (v / 1e3).toLocaleString() + 'k' : v }
      }
    }
  });
}

// 2. Category Share (Doughnut)
function renderCategoryShare(data) {
  const catMap = {};
  data.forEach(v => {
    catMap[v.Category] = (catMap[v.Category] || 0) + v.Annual_Sales;
  });
  const labels = Object.keys(catMap);
  const values = Object.values(catMap);
  const colors = labels.map(c => CAT_COLORS[c] || '#64748b');

  createChart('dashCategoryDist', 'doughnut', {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6
    }]
  }, {
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.raw.toLocaleString()} units`
        }
      }
    }
  });
}

// 3. Battery Chemistry Share (Pie)
function renderBatteryChemistry(data) {
  const batMap = {};
  data.forEach(v => {
    batMap[v.Battery_Tech] = (batMap[v.Battery_Tech] || 0) + 1;
  });
  const labels = Object.keys(batMap);
  const values = Object.values(batMap);
  const colors = labels.map(b => BATTERY_COLORS[b] || '#64748b');

  createChart('dashBatteryDist', 'pie', {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6
    }]
  }, {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, padding: 12, font: { size: 11, family: 'Inter' } }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.raw} models (${Math.round((ctx.raw / data.length) * 100)}%)`
        }
      }
    }
  });
}

// 4. Price vs Driving Range (Scatter)
function renderPriceVsRange(data) {
  const categories = ['Sedan', 'SUV', 'Hatchback', 'Truck'];
  const datasets = categories.map(cat => {
    const items = data.filter(v => v.Category.toLowerCase() === cat.toLowerCase());
    return {
      label: cat,
      data: items.map(v => ({
        x: v.Price_USD,
        y: v.Driving_Range_km,
        model: `${v.Brand} ${v.Model}`,
        battery: v.Battery_Tech
      })),
      backgroundColor: CAT_COLORS[cat] || '#2563eb',
      pointRadius: 5,
      pointHoverRadius: 7
    };
  }).filter(ds => ds.data.length > 0);

  createChart('dashPriceRange', 'scatter', {
    datasets: datasets
  }, {
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { boxWidth: 10, font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.raw.model} (${ctx.raw.battery}): $${ctx.raw.x.toLocaleString()} | ${ctx.raw.y} km range`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Price (USD)', font: { size: 11, weight: '600' } },
        grid: { color: '#f8fafc' },
        ticks: { callback: v => '$' + (v / 1e3) + 'k' }
      },
      y: {
        title: { display: true, text: 'Range (km)', font: { size: 11, weight: '600' } },
        grid: { color: '#f1f5f9' }
      }
    }
  });
}

// 5. Manufacturing Output (Horizontal Bar)
function renderCountryOutput(data) {
  const cMap = {};
  data.forEach(v => {
    cMap[v.Manufacturing_Country] = (cMap[v.Manufacturing_Country] || 0) + v.Annual_Sales;
  });
  const sorted = Object.entries(cMap).sort((a, b) => b[1] - a[1]);

  createChart('dashCountryOutput', 'bar', {
    labels: sorted.map(d => d[0]),
    datasets: [{
      label: 'Deliveries',
      data: sorted.map(d => d[1]),
      backgroundColor: '#0891b2',
      borderRadius: 4,
      borderSkipped: false
    }]
  }, {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: '#f8fafc' },
        ticks: { callback: v => v >= 1e3 ? (v / 1e3) + 'k' : v }
      },
      y: { grid: { display: false } }
    }
  });
}

// 6. Average Driving Range by Category
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
      borderRadius: 4,
      borderSkipped: false
    }]
  }, {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` Average Range: ${ctx.raw} km`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { callback: v => v + ' km' }
      }
    }
  });
}

// 7. Customer Satisfaction & Rating Distribution
function renderCustomerRatings(data) {
  const sortedBySales = [...data].sort((a, b) => b.Annual_Sales - a.Annual_Sales).slice(0, 8);

  createChart('dashCustomerRating', 'line', {
    labels: sortedBySales.map(v => v.Model),
    datasets: [{
      label: 'Rating (1-5 ⭐)',
      data: sortedBySales.map(v => v.Customer_Rating),
      borderColor: '#ea580c',
      backgroundColor: 'rgba(234, 88, 12, 0.08)',
      fill: true,
      tension: 0.35,
      borderWidth: 2,
      pointBackgroundColor: '#ea580c',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }, {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 3.8,
        max: 5.0,
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 0.2, callback: v => v + ' ★' }
      }
    }
  });
}

// ── Ultra-Strict Chart Creation to Eliminate Hover Infinite Resize ──
function createChart(canvasId, type, chartData, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  chartInstances[canvasId] = new Chart(canvas, {
    type: type,
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 150,
      animation: { duration: 400 },
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      ...options
    }
  });
}

// ── Tableau Public Modal & Embed Handlers ──
function toggleTableauPublicModal() {
  const modal = document.getElementById('tableauModal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
}

function saveTableauUrl() {
  const input = document.getElementById('tableauUrlInput');
  const url = input ? input.value.trim() : '';
  if (!url) {
    alert('Please enter a valid Tableau Public URL (e.g., https://public.tableau.com/views/...)');
    return;
  }
  renderTableauEmbed(url);
  toggleTableauPublicModal();
}

function renderTableauEmbed(url) {
  const wrapper = document.getElementById('tableauPublicWrapper');
  const slot = document.getElementById('tableauEmbedSlot');
  let embedUrl = url;
  if (!embedUrl.includes(':embed=yes') && !embedUrl.includes(':embed=true')) {
    embedUrl += (embedUrl.includes('?') ? '&' : '?') + ':showVizHome=no&:embed=true';
  }
  slot.innerHTML = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" style="border-radius: 8px; border: 1px solid #e2e8f0;"></iframe>`;
  wrapper.style.display = 'block';
  document.getElementById('nativeDashboardGrid').style.display = 'none';
}

function closeTableauEmbed() {
  document.getElementById('tableauPublicWrapper').style.display = 'none';
  document.getElementById('nativeDashboardGrid').style.display = 'grid';
}
