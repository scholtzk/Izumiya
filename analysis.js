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
    const t = (window.t || ((k) => k));

    container.innerHTML = `
        <div style="padding:20px;max-width:1200px;margin:0 auto;">
            <h2>${t('Analysis')}</h2>
            
            <!-- Time Period Selection -->
            <div style="margin-bottom:20px;display:flex;gap:10px;align-items:center;">
                <select id="analysis-period" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                    <option value="today">${t('Today')}</option>
                    <option value="week">${t('This Week')}</option>
                    <option value="month">${t('This Month')}</option>
                    <option value="year">${t('This Year')}</option>
                    <option value="custom">${t('Custom Range')}</option>
                </select>
                <div id="custom-date-range" style="display:none;gap:10px;align-items:center;">
                    <input type="date" id="start-date" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                    <span>${t('to')}</span>
                    <input type="date" id="end-date" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                </div>
            </div>

            <!-- Quick Stats -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px;">
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Total Sales')}</h3>
                    <div id="total-sales" style="font-size:24px;font-weight:bold;color:#6F4E37;">¥0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Orders')}</h3>
                    <div id="total-orders" style="font-size:24px;font-weight:bold;color:#6F4E37;">0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Average Order')}</h3>
                    <div id="avg-order" style="font-size:24px;font-weight:bold;color:#6F4E37;">¥0</div>
                </div>
            </div>

            <!-- Charts Section -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:20px;margin-bottom:30px;">
                <!-- Sales Trend -->
                <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 20px 0;">${t('Sales Trend')}</h3>
                    <canvas id="sales-trend-chart"></canvas>
                </div>
                
                <!-- Top Items -->
                <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 20px 0;">${t('Top Selling Items')}</h3>
                    <canvas id="top-items-chart"></canvas>
                </div>
            </div>

            <!-- Stock Management -->
            <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:30px;">
                <h3 style="margin:0 0 20px 0;">${t('Stock Management')}</h3>
                <div id="stock-alerts" style="margin-bottom:20px;"></div>
                <div id="reorder-suggestions"></div>
            </div>

            <!-- Peak Hours Analysis -->
            <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin:0 0 20px 0;">${t('Peak Hours')}</h3>
                <canvas id="peak-hours-chart"></canvas>
            </div>
        </div>
    `;

    // Initialize charts and load data
    initializeCharts();
    loadAnalysisData('today');

    // Add event listeners
    document.getElementById('analysis-period').addEventListener('change', (e) => {
        const period = e.target.value;
        if (period === 'custom') {
            document.getElementById('custom-date-range').style.display = 'flex';
        } else {
            document.getElementById('custom-date-range').style.display = 'none';
            loadAnalysisData(period);
        }
    });

    // Custom date range handlers
    document.getElementById('start-date').addEventListener('change', loadCustomDateRange);
    document.getElementById('end-date').addEventListener('change', loadCustomDateRange);
};

// Initialize charts
function initializeCharts() {
    // Sales Trend Chart
    const salesTrendCtx = document.getElementById('sales-trend-chart').getContext('2d');
    window.salesTrendChart = new Chart(salesTrendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Sales',
                data: [],
                borderColor: '#6F4E37',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Top Items Chart
    const topItemsCtx = document.getElementById('top-items-chart').getContext('2d');
    window.topItemsChart = new Chart(topItemsCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Quantity Sold',
                data: [],
                backgroundColor: '#A67C52'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Peak Hours Chart
    const peakHoursCtx = document.getElementById('peak-hours-chart').getContext('2d');
    window.peakHoursChart = new Chart(peakHoursCtx, {
        type: 'bar',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Orders',
                data: Array(24).fill(0),
                backgroundColor: '#D4A76A'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Load analysis data
async function loadAnalysisData(period) {
    const { start, end } = getPeriodDates(period);
    const orders = await fetchOrders(start, end);
    
    // Update quick stats
    updateQuickStats(orders);
    
    // Update charts
    updateSalesTrendChart(orders);
    updateTopItemsChart(orders);
    updatePeakHoursChart(orders);
    
    // Update stock management
    updateStockManagement(orders);
}

// Fetch orders from Firebase
async function fetchOrders(start, end) {
    try {
        const ordersRef = collection(window.firebaseDb, 'orders');
        const q = query(
            ordersRef,
            where('timestamp', '>=', Timestamp.fromDate(start)),
            where('timestamp', '<=', Timestamp.fromDate(end)),
            orderBy('timestamp', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Update quick stats
function updateQuickStats(orders) {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('avg-order').textContent = formatCurrency(avgOrder);
}

// Update sales trend chart
function updateSalesTrendChart(orders) {
    const salesByDate = {};
    orders.forEach(order => {
        const date = formatDate(order.timestamp.toDate());
        salesByDate[date] = (salesByDate[date] || 0) + order.total;
    });

    window.salesTrendChart.data.labels = Object.keys(salesByDate);
    window.salesTrendChart.data.datasets[0].data = Object.values(salesByDate);
    window.salesTrendChart.update();
}

// Update top items chart
function updateTopItemsChart(orders) {
    const itemCounts = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const key = item.name;
            itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
        });
    });

    const sortedItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    window.topItemsChart.data.labels = sortedItems.map(([name]) => name);
    window.topItemsChart.data.datasets[0].data = sortedItems.map(([,count]) => count);
    window.topItemsChart.update();
}

// Update peak hours chart
function updatePeakHoursChart(orders) {
    const hourlyOrders = Array(24).fill(0);
    orders.forEach(order => {
        const hour = order.timestamp.toDate().getHours();
        hourlyOrders[hour]++;
    });

    window.peakHoursChart.data.datasets[0].data = hourlyOrders;
    window.peakHoursChart.update();
}

// Update stock management
function updateStockManagement(orders) {
    // Calculate item usage
    const itemUsage = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const key = item.name;
            itemUsage[key] = (itemUsage[key] || 0) + item.quantity;
        });
    });

    // Generate stock alerts and reorder suggestions
    const stockAlerts = document.getElementById('stock-alerts');
    const reorderSuggestions = document.getElementById('reorder-suggestions');

    // Example stock levels (you would need to implement actual stock tracking)
    const stockLevels = {
        'Espresso': 50,
        'Cappuccino': 30,
        'Latte': 25,
        // Add more items as needed
    };

    // Generate alerts
    const alerts = [];
    Object.entries(stockLevels).forEach(([item, level]) => {
        const usage = itemUsage[item] || 0;
        if (level < usage * 0.2) { // Alert if stock is less than 20% of usage
            alerts.push(`${item}: ${t('Low Stock')} (${level} remaining)`);
        }
    });

    stockAlerts.innerHTML = alerts.length > 0 
        ? `<div style="color:#dc3545;margin-bottom:10px;">${alerts.join('<br>')}</div>`
        : `<div style="color:#28a745;">${t('All stock levels are good')}</div>`;

    // Generate reorder suggestions
    const suggestions = Object.entries(itemUsage).map(([item, usage]) => {
        const currentStock = stockLevels[item] || 0;
        const suggestedOrder = Math.ceil(usage * 0.3); // Suggest ordering 30% of usage
        return {
            item,
            suggestedOrder,
            currentStock
        };
    });

    reorderSuggestions.innerHTML = suggestions
        .filter(s => s.suggestedOrder > 0)
        .map(s => `
            <div style="margin-bottom:10px;">
                <strong>${s.item}:</strong> ${t('Suggested Order')}: ${s.suggestedOrder} 
                (${t('Current Stock')}: ${s.currentStock})
            </div>
        `).join('');
}

// Load custom date range
function loadCustomDateRange() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        const orders = fetchOrders(start, end);
        updateQuickStats(orders);
        updateSalesTrendChart(orders);
        updateTopItemsChart(orders);
        updatePeakHoursChart(orders);
        updateStockManagement(orders);
    }
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
