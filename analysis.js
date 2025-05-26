// analysis.js
// This module renders the Analysis tab for the POS system.
// It expects window.firebaseServices and window.firebaseDb to be available.

import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    Timestamp 
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Chart.js CDN loader
function loadChartJs(callback) {
    if (window.Chart) {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        // Load annotation plugin after Chart.js
        const annotationScript = document.createElement('script');
        annotationScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation';
        annotationScript.onload = callback;
        document.head.appendChild(annotationScript);
    };
    document.head.appendChild(script);
}

// Utility: Format currency
function formatCurrency(amount) {
    return `¥${amount.toLocaleString()}`;
}

// Utility: Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

            <!-- Sales Trend -->
            <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:30px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h3 style="margin:0;">${t('Sales Trend')}</h3>
                    <select id="sales-trend-period" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                        <option value="week">${t('This Week')}</option>
                        <option value="month">${t('This Month')}</option>
                        <option value="year">${t('This Year')}</option>
                    </select>
                </div>
                <div style="height:400px;margin-bottom:20px;">
                    <canvas id="sales-trend-chart"></canvas>
                </div>
            </div>

            <!-- Peak Hours Analysis -->
            <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:30px;">
                <h3 style="margin:0 0 20px 0;">${t('Peak Hours (8:00-17:00)')}</h3>
                <div style="height:250px;">
                    <canvas id="peak-hours-chart"></canvas>
                </div>
            </div>

            <!-- Usage Analysis -->
            <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:30px;">
                <h3 style="margin:0 0 20px 0;">${t('Usage Analysis (Past 7 Days)')}</h3>
                <div id="usage-analysis"></div>
            </div>
        </div>
    `;

    // Load Chart.js and initialize charts
    loadChartJs(() => {
        initializeCharts();
        loadAnalysisData('today');
        loadSalesTrendData('week');
        loadUsageAnalysis();
        
        // Load peak hours data
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);
        
        fetchOrders(yesterday, today).then(orders => {
            console.log('Peak hours orders:', orders.length);
            updatePeakHoursChart(orders);
        });
    });

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

    // Sales trend period change handler
    document.getElementById('sales-trend-period').addEventListener('change', (e) => {
        loadSalesTrendData(e.target.value);
    });

    // Custom date range handlers
    document.getElementById('start-date').addEventListener('change', loadCustomDateRange);
    document.getElementById('end-date').addEventListener('change', loadCustomDateRange);
};

// Helper: Get period dates based on selection
function getPeriodDates(period) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch(period) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(now.getDate() - 7);
            break;
        case 'month':
            start.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            start.setFullYear(now.getFullYear() - 1);
            break;
    }
    return { start, end };
}

// Initialize charts
function initializeCharts() {
    // Sales Trend Chart
    const salesTrendCtx = document.getElementById('sales-trend-chart').getContext('2d');
    window.salesTrendChart = new Chart(salesTrendCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Sales',
                data: [],
                backgroundColor: '#6F4E37',
                borderColor: '#6F4E37',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `¥${context.raw.toLocaleString()}`;
                        }
                    }
                },
                annotation: {
                    annotations: {}
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Peak Hours Chart
    const peakHoursCtx = document.getElementById('peak-hours-chart').getContext('2d');
    window.peakHoursChart = new Chart(peakHoursCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 19}, (_, i) => {
                const hour = Math.floor((i + 16) / 2);
                const minute = (i + 16) % 2 === 0 ? '00' : '30';
                return `${hour}:${minute}`;
            }),
            datasets: [{
                label: 'Today',
                data: Array(19).fill(0),
                borderColor: '#6F4E37',
                backgroundColor: 'rgba(111, 78, 55, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }, {
                label: 'Yesterday',
                data: Array(19).fill(0),
                borderColor: '#A67C52',
                backgroundColor: 'rgba(166, 124, 82, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw} orders`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            }
        }
    });
}

// Load analysis data
async function loadAnalysisData(period) {
    const { start, end } = getPeriodDates(period);
    const orders = await fetchOrders(start, end);
    
    // Update quick stats only
    updateQuickStats(orders);
}

// Fetch orders from Firebase
async function fetchOrders(start, end) {
    try {
        console.log('Fetching orders from:', start.toISOString(), 'to:', end.toISOString());
        const ordersRef = collection(window.firebaseDb, 'orders');
        const q = query(
            ordersRef,
            where('timestamp', '>=', Timestamp.fromDate(start)),
            where('timestamp', '<=', Timestamp.fromDate(end)),
            orderBy('timestamp', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched orders:', orders.length);
        return orders;
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

// Update peak hours chart
function updatePeakHoursChart(orders) {
    // Get today's and yesterday's dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Initialize hourly data with zeros
    const todayData = new Array(19).fill(0);
    const yesterdayData = new Array(19).fill(0);

    // Reset chart data
    window.peakHoursChart.data.datasets[0].data = todayData;
    window.peakHoursChart.data.datasets[1].data = yesterdayData;

    // Process orders
    orders.forEach(order => {
        const orderDate = order.timestamp.toDate();
        const hour = orderDate.getHours();
        const minute = orderDate.getMinutes();
        
        // Only process orders between 8:00 and 17:00
        if (hour >= 8 && hour < 17) {
            const index = (hour - 8) * 2 + (minute >= 30 ? 1 : 0);
            if (index >= 0 && index < 19) {
                const orderDateStr = orderDate.toDateString();
                if (orderDateStr === today.toDateString()) {
                    todayData[index]++;
                } else if (orderDateStr === yesterday.toDateString()) {
                    yesterdayData[index]++;
                }
            }
        }
    });

    // Update chart with new data
    window.peakHoursChart.data.datasets[0].data = todayData;
    window.peakHoursChart.data.datasets[1].data = yesterdayData;
    window.peakHoursChart.update();
}

// Load usage analysis for past 7 days
async function loadUsageAnalysis() {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6); // Past 7 days including today
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    console.log('Loading usage analysis from:', start.toISOString(), 'to:', end.toISOString());
    const orders = await fetchOrders(start, end);
    console.log('Orders for usage analysis:', orders.length);

    const usageAnalysis = document.getElementById('usage-analysis');
    const t = (window.t || ((k) => k));

    // Get all dates in the range
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate usage by date and item
    const usageByDate = {};
    dates.forEach(date => {
        usageByDate[formatDate(date)] = {};
    });

    // Initialize with zeros for all items
    const allItems = new Set();
    orders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                if (item && item.name) {
                    allItems.add(item.name);
                }
            });
        }
    });

    // Initialize all dates with zeros for all items
    dates.forEach(date => {
        const dateStr = formatDate(date);
        allItems.forEach(item => {
            usageByDate[dateStr][item] = 0;
        });
    });

    // Fill in actual usage
    orders.forEach(order => {
        if (order.items) {
            const orderDate = order.timestamp.toDate();
            const dateStr = formatDate(orderDate);
            console.log('Processing order for date:', dateStr, 'with items:', order.items.length);
            order.items.forEach(item => {
                if (item && item.name && usageByDate[dateStr]) {
                    usageByDate[dateStr][item.name] = (usageByDate[dateStr][item.name] || 0) + (item.quantity || 0);
                }
            });
        }
    });

    // Calculate averages and totals
    const itemTotals = {};
    const itemAverages = {};

    allItems.forEach(item => {
        itemTotals[item] = 0;
        dates.forEach(date => {
            const dateStr = formatDate(date);
            itemTotals[item] += usageByDate[dateStr][item] || 0;
        });
        itemAverages[item] = itemTotals[item] / dates.length;
    });

    // Sort items by total usage
    const sortedItems = Array.from(allItems)
        .sort((a, b) => itemTotals[b] - itemTotals[a]);

    // Generate HTML
    usageAnalysis.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
            ${sortedItems.map(item => `
                <div style="background:#f8f9fa;padding:15px;border-radius:6px;border-left:4px solid #A67C52;">
                    <div style="font-weight:bold;margin-bottom:10px;">${getDisplayName(item)}</div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                        <div>
                            <div style="color:#666;font-size:0.9em;">${t('Total Usage')}</div>
                            <div style="font-weight:bold;color:#6F4E37;">${itemTotals[item]}</div>
                        </div>
                        <div>
                            <div style="color:#666;font-size:0.9em;">${t('Average per Day')}</div>
                            <div style="font-weight:bold;color:#6F4E37;">${itemAverages[item].toFixed(1)}</div>
                        </div>
                    </div>
                    <div style="margin-top:10px;font-size:0.9em;color:#666;">
                        ${t('Daily Breakdown')}:
                        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:5px;">
                            ${dates.map(date => {
                                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                                const usage = usageByDate[formatDate(date)][item] || 0;
                                return `
                                    <div style="text-align:center;padding:5px;background:${usage > 0 ? '#e9ecef' : '#f8f9fa'};border-radius:4px;">
                                        <div style="font-size:0.8em;">${dayOfWeek}</div>
                                        <div style="font-weight:bold;">${usage}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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

// Update sales trend chart
async function loadSalesTrendData(period) {
    const { start, end } = getPeriodDates(period);
    const orders = await fetchOrders(start, end);
    
    // Get previous period for comparison
    const prevStart = new Date(start);
    const prevEnd = new Date(end);
    const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    prevStart.setDate(prevStart.getDate() - periodDays);
    prevEnd.setDate(prevEnd.getDate() - periodDays);
    const prevOrders = await fetchOrders(prevStart, prevEnd);
    
    // Get all dates in the range
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Initialize sales data with zeros
    const salesByDate = {};
    const prevSalesByDate = {};
    dates.forEach(date => {
        const dateStr = formatDate(date);
        salesByDate[dateStr] = 0;
        prevSalesByDate[dateStr] = 0;
    });

    // Fill in current period sales
    orders.forEach(order => {
        const date = formatDate(order.timestamp.toDate());
        if (salesByDate[date] !== undefined) {
            salesByDate[date] += order.total;
        }
    });

    // Fill in previous period sales
    prevOrders.forEach(order => {
        const date = formatDate(order.timestamp.toDate());
        if (prevSalesByDate[date] !== undefined) {
            prevSalesByDate[date] += order.total;
        }
    });

    // Calculate percentage changes
    const percentageChanges = {};
    Object.keys(salesByDate).forEach(date => {
        const current = salesByDate[date];
        const previous = prevSalesByDate[date];
        if (previous === 0) {
            percentageChanges[date] = current > 0 ? 100 : 0;
        } else {
            percentageChanges[date] = ((current - previous) / previous) * 100;
        }
    });

    // Format labels with date and day of week
    const labels = dates.map(date => {
        const dateStr = formatDate(date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        return [dateStr, dayOfWeek];
    });

    // Update chart
    window.salesTrendChart.data.labels = labels;
    window.salesTrendChart.data.datasets[0].data = Object.values(salesByDate);
    
    // Add percentage changes as annotations
    const annotations = {};
    Object.entries(percentageChanges).forEach(([date, change], index) => {
        annotations[`label${index}`] = {
            type: 'label',
            xValue: index,
            yValue: salesByDate[date],
            content: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
            color: change >= 0 ? '#28a745' : '#dc3545',
            font: {
                size: 12,
                weight: 'bold'
            },
            yAdjust: -20
        };
    });
    
    window.salesTrendChart.options.plugins.annotation.annotations = annotations;
    window.salesTrendChart.update();
} 
