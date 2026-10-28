/* ============================================================
   story.js — Interactive 5-Scene Data Storytelling Engine
   ============================================================ */

let currentScene = 1;
let storyChartInstance = null;

const SCENE_CONFIGS = {
  1: {
    badge: 'Scene 01 Analytics',
    title: 'Category Market Share Distribution',
    caption: 'SUVs and Sedans account for over 85% of total electric vehicle deliveries worldwide.',
    type: 'doughnut',
    getData: () => ({
      labels: ['SUV', 'Sedan', 'Hatchback', 'Truck'],
      datasets: [{
        data: [2140000, 1240000, 450000, 76000],
        backgroundColor: ['#2563eb', '#7c3aed', '#16a34a', '#ea580c']
      }]
    }),
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } }
      }
    }
  },
  2: {
    badge: 'Scene 02 Analytics',
    title: 'Top OEM Annual Delivery Volume',
    caption: 'Tesla and BYD lead the global hierarchy, delivering over 2 million combined units annually.',
    type: 'bar',
    getData: () => ({
      labels: ['Tesla', 'BYD', 'Volkswagen', 'Hyundai', 'Kia', 'BMW', 'Mercedes', 'NIO'],
      datasets: [{
        label: 'Annual Units Sold',
        data: [1163695, 842000, 304000, 207000, 129000, 89000, 61000, 98000],
        backgroundColor: '#2563eb',
        borderRadius: 6
      }]
    }),
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => (v / 1000) + 'k' } }
      }
    }
  },
  3: {
    badge: 'Scene 03 Analytics',
    title: 'Average Driving Range by Battery Chemistry',
    caption: 'Solid-State battery chemistry breaks through previous boundaries, achieving 1,000 km range capability.',
    type: 'bar',
    getData: () => ({
      labels: ['Solid-State', 'NCA', 'NMC', 'LFP'],
      datasets: [{
        label: 'Average Range (km)',
        data: [1000, 634, 538, 568],
        backgroundColor: ['#7c3aed', '#2563eb', '#0891b2', '#16a34a'],
        borderRadius: 6
      }]
    }),
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: 'Kilometers (km)' } }
      }
    }
  },
  4: {
    badge: 'Scene 04 Analytics',
    title: 'Range (km) vs Price ($USD) by Class',
    caption: 'Mid-range champions like BYD Seal deliver 700km at $42,000, outperforming far costlier luxury platforms in range efficiency.',
    type: 'scatter',
    getData: () => ({
      datasets: [
        {
          label: 'Sedans',
          data: [
            { x: 42990, y: 576 }, { x: 89990, y: 652 }, { x: 45000, y: 605 },
            { x: 38615, y: 614 }, { x: 52000, y: 1000 }, { x: 104400, y: 857 },
            { x: 138000, y: 837 }, { x: 42000, y: 700 }
          ],
          backgroundColor: '#2563eb'
        },
        {
          label: 'SUVs',
          data: [
            { x: 52990, y: 531 }, { x: 109990, y: 560 }, { x: 38000, y: 480 },
            { x: 55000, y: 700 }, { x: 43995, y: 522 }, { x: 43450, y: 508 },
            { x: 78000, y: 516 }, { x: 62990, y: 530 }
          ],
          backgroundColor: '#16a34a'
        }
      ]
    }),
    options: {
      scales: {
        x: { title: { display: true, text: 'Price (USD)' }, ticks: { callback: v => '$' + (v / 1000) + 'k' } },
        y: { title: { display: true, text: 'Driving Range (km)' } }
      }
    }
  },
  5: {
    badge: 'Scene 05 Analytics',
    title: 'Annual CO₂ Emissions Avoided by Category',
    caption: 'Due to volume leadership, electric SUVs prevent over 4.5 billion kg of greenhouse emissions annually.',
    type: 'bar',
    getData: () => ({
      labels: ['SUV', 'Sedan', 'Hatchback', 'Truck'],
      datasets: [{
        label: 'CO₂ Avoided (Million kg/yr)',
        data: [4520, 2740, 830, 168],
        backgroundColor: '#16a34a',
        borderRadius: 6
      }]
    }),
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: 'Million kg CO₂/Year' } }
      }
    }
  }
};

async function ensureChartJs() {
  if (typeof Chart !== 'undefined') return true;
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await ensureChartJs();
  renderSceneVisual(1);
});

function switchScene(sceneNum) {
  currentScene = sceneNum;

  // Update button active state
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.scene) === sceneNum);
  });

  // Update narrative active state
  document.querySelectorAll('.scene-content').forEach(content => {
    content.classList.toggle('active', content.id === `scene-${sceneNum}`);
  });

  // Update stepper buttons
  document.getElementById('prevSceneBtn').disabled = sceneNum === 1;
  document.getElementById('nextSceneBtn').textContent = sceneNum === 5 ? 'Restart Story ↺' : 'Next Scene →';

  // Render chart
  renderSceneVisual(sceneNum);
}

function stepScene(direction) {
  let next = currentScene + direction;
  if (next > 5) next = 1;
  if (next < 1) next = 5;
  switchScene(next);
}

function renderSceneVisual(sceneNum) {
  const cfg = SCENE_CONFIGS[sceneNum];
  if (!cfg) return;

  document.getElementById('sceneVizBadge').textContent = cfg.badge;
  document.getElementById('sceneVizTitle').textContent = cfg.title;
  document.getElementById('sceneVizCaption').textContent = cfg.caption;

  const canvas = document.getElementById('storySceneChart');
  if (!canvas) return;

  if (storyChartInstance) {
    storyChartInstance.destroy();
  }

  storyChartInstance = new Chart(canvas, {
    type: cfg.type,
    data: cfg.getData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650 },
      ...cfg.options
    }
  });
}
