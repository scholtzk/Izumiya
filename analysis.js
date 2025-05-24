// analysis.js
// This module renders the Analysis tab for the POS system.
// It expects window.firebaseServices and window.firebaseDb to be available.

// Chart.js CDN loader
function loadChartJs(callback) {
    if (window.Chart) {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
}

// Utility: Format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

// Utility: Get start/end of day
function getDayRange(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}

// Utility: Get last N days as array of Date objects
function getLastNDates(n) {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }
    return dates;
}

// Main render function
window.renderAnalysisTab = function renderAnalysisTab() {
    const container = document.querySelector('.analysis-container');
    if (!container) return;
    container.innerHTML = `<div style="padding:20px;max-width:1200px;margin:0 auto;">
        <h2>Analysis</h2>
        <div style="margin-bottom:20px;">
            <label for="analysis-date">Select Day: </label>
            <input type="date" id="analysis-date" value="${formatDate(new Date())}">
        </div>
        <div id="top-items-section"></div>
        <div id="order-frequency-section" style="margin-top:40px;"></div>
        <div id="revenue-section" style="margin-top:40px;"></div>
    </div>`;

    // Load metrics for today by default
    const dateInput = container.querySelector('#analysis-date');
    dateInput.addEventListener('change', () => {
        renderAllMetrics(new Date(dateInput.value));
    });
    renderAllMetrics(new Date(dateInput.value));
};

function renderAllMetrics(selectedDate) {
    renderTopItems(selectedDate);
    renderOrderFrequency(selectedDate);
    renderRevenuePerDay();
}

// Fetch all orders for a given day
async function fetchOrdersForDay(date) {
    const { start, end } = getDayRange(date);
    const ordersRef = window.firebaseServices.collection(window.firebaseDb, 'orders');
    const q = window.firebaseServices.query(
        ordersRef,
        window.firebaseServices.orderBy('timestamp', 'asc')
    );
    const snapshot = await window.firebaseServices.getDocs(q);
    return snapshot.docs
        .map(doc => doc.data())
        .filter(order => {
            if (!order.timestamp) return false;
            const ts = order.timestamp.toDate();
            return ts >= start && ts <= end;
        });
}

// Fetch all orders for a date range (for revenue chart)
async function fetchOrdersForRange(startDate, endDate) {
    const ordersRef = window.firebaseServices.collection(window.firebaseDb, 'orders');
    const q = window.firebaseServices.query(
        ordersRef,
        window.firebaseServices.orderBy('timestamp', 'asc')
    );
    const snapshot = await window.firebaseServices.getDocs(q);
    return snapshot.docs
        .map(doc => doc.data())
        .filter(order => {
            if (!order.timestamp) return false;
            const ts = order.timestamp.toDate();
            return ts >= startDate && ts <= endDate;
        });
}

// Top-selling items table
async function renderTopItems(date) {
    const section = document.getElementById('top-items-section');
    section.innerHTML = '<h3>Top-Selling Items</h3><div>Loading...</div>';
    const orders = await fetchOrdersForDay(date);
    const itemMap = {};
    orders.forEach(order => {
        (order.items || []).forEach(item => {
            const key = item.name; // Always use English name for backend
            if (!itemMap[key]) {
                itemMap[key] = { name: item.name, quantity: 0 };
            }
            itemMap[key].quantity += item.quantity;
        });
    });
    const items = Object.values(itemMap).sort((a, b) => b.quantity - a.quantity);
    if (items.length === 0) {
        section.innerHTML = '<h3>Top-Selling Items</h3><div>No sales for this day.</div>';
        return;
    }
    section.innerHTML = `<h3>Top-Selling Items</h3>
        <table style="width:100%;border-collapse:collapse;">
            <thead><tr><th style="text-align:left;">Item</th><th style="text-align:right;">Quantity Sold</th></tr></thead>
            <tbody>
                ${items.map(item => `<tr><td>${getDisplayName(item.name)}</td><td style="text-align:right;">${item.quantity}</td></tr>`).join('')}
            </tbody>
        </table>`;
}

// Order frequency by 30 min (8am-5pm)
async function renderOrderFrequency(date) {
    const section = document.getElementById('order-frequency-section');
    section.innerHTML = '<h3>Order Frequency (8:00–17:00)</h3><div>Loading...</div>';
    const orders = await fetchOrdersForDay(date);
    // Create 30-min slots from 8:00 to 17:00
    const slots = [];
    for (let h = 8; h < 17; h++) {
        slots.push({ label: `${h}:00`, count: 0 });
        slots.push({ label: `${h}:30`, count: 0 });
    }
    // Assign orders to slots
    orders.forEach(order => {
        if (!order.timestamp) return;
        const ts = order.timestamp.toDate();
        const hour = ts.getHours();
        const min = ts.getMinutes();
        if (hour < 8 || hour >= 17) return;
        const slotIdx = (hour - 8) * 2 + (min >= 30 ? 1 : 0);
        if (slots[slotIdx]) slots[slotIdx].count++;
    });
    // Render chart
    section.innerHTML = `<h3>Order Frequency (8:00–17:00)</h3><canvas id="order-frequency-chart" height="80"></canvas>`;
    loadChartJs(() => {
        const ctx = document.getElementById('order-frequency-chart').getContext('2d');
        if (window.orderFrequencyChart) window.orderFrequencyChart.destroy();
        window.orderFrequencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: slots.map(s => s.label),
                datasets: [{
                    label: 'Orders',
                    data: slots.map(s => s.count),
                    backgroundColor: '#6F4E37'
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true, precision: 0 }
                }
            }
        });
    });
}

// Revenue per day (last 7 days)
async function renderRevenuePerDay() {
    const section = document.getElementById('revenue-section');
    section.innerHTML = '<h3>Revenue Per Day (Last 7 Days)</h3><div>Loading...</div>';
    const dates = getLastNDates(7);
    const start = new Date(dates[0]);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dates[dates.length - 1]);
    end.setHours(23, 59, 59, 999);
    const orders = await fetchOrdersForRange(start, end);
    // Aggregate revenue per day
    const revenueMap = {};
    dates.forEach(d => {
        revenueMap[formatDate(d)] = 0;
    });
    orders.forEach(order => {
        if (!order.timestamp) return;
        const ts = order.timestamp.toDate();
        const day = formatDate(ts);
        if (revenueMap[day] !== undefined) {
            revenueMap[day] += order.total || 0;
        }
    });
    // Render chart
    section.innerHTML = `<h3>Revenue Per Day (Last 7 Days)</h3><canvas id="revenue-chart" height="80"></canvas>`;
    loadChartJs(() => {
        const ctx = document.getElementById('revenue-chart').getContext('2d');
        if (window.revenueChart) window.revenueChart.destroy();
        window.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates.map(d => formatDate(d)),
                datasets: [{
                    label: 'Revenue (¥)',
                    data: dates.map(d => revenueMap[formatDate(d)]),
                    backgroundColor: '#A67C52'
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    });
}

// Helper: getDisplayName (uses global currentLang/menuData)
function getDisplayName(englishName) {
    if (window.menuData && window.currentLang) {
        for (const category of Object.values(window.menuData)) {
            for (const item of category) {
                if (item.name === englishName) {
                    return window.currentLang === 'ja' && item.name_ja ? item.name_ja : item.name;
                }
            }
        }
    }
    return englishName;
} 