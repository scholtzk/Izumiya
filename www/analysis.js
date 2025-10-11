// analysis.js
// This module renders the Analysis tab for the POS system.
// It expects window.firebaseServices and window.firebaseDb to be available.

import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    Timestamp,
    setDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getDisplayName } from './menu.js';

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

// Utility: Show/hide loading spinner overlay
function showLoadingSpinner() {
    let spinner = document.getElementById('analysis-loading-spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'analysis-loading-spinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '0';
        spinner.style.left = '0';
        spinner.style.width = '100vw';
        spinner.style.height = '100vh';
        spinner.style.background = 'rgba(255,255,255,0.6)';
        spinner.style.zIndex = '3000';
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.style.alignItems = 'center';
        spinner.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <div class="lds-dual-ring"></div>
                <div style="margin-top:16px;color:#6F4E37;font-weight:bold;">Loading...</div>
            </div>
        `;
        // Spinner CSS
        const style = document.createElement('style');
        style.innerHTML = `
        .lds-dual-ring {
          display: inline-block;
          width: 64px;
          height: 64px;
        }
        .lds-dual-ring:after {
          content: " ";
          display: block;
          width: 46px;
          height: 46px;
          margin: 1px;
          border-radius: 50%;
          border: 6px solid #6F4E37;
          border-color: #6F4E37 transparent #6F4E37 transparent;
          animation: lds-dual-ring 1.2s linear infinite;
        }
        @keyframes lds-dual-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `;
        spinner.appendChild(style);
        document.body.appendChild(spinner);
    } else {
        spinner.style.display = 'flex';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('analysis-loading-spinner');
    if (spinner) spinner.style.display = 'none';
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
                    <option value="last30">${t('Last 30 Days')}</option>
                    <option value="year">${t('This Year')}</option>
                    <option value="custom">${t('Custom Range')}</option>
                </select>
                <div id="custom-date-range" style="display:none;gap:10px;align-items:center;">
                    <input type="date" id="start-date" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                    <span>${t('to')}</span>
                    <input type="date" id="end-date" style="padding:8px;border-radius:4px;border:1px solid #ddd;">
                </div>
                <div id="period-date-range" style="color:#666;font-size:0.9em;"></div>
            </div>

            <!-- Quick Stats -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px;">
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Total Sales')}</h3>
                    <div style="display:flex;align-items:baseline;gap:10px;">
                        <div id="total-sales" style="font-size:24px;font-weight:bold;color:#6F4E37;">¥0</div>
                        <div id="sales-change" style="font-size:24px;font-weight:bold;"></div>
                    </div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Estimated Profit')}</h3>
                    <div id="total-orders" style="font-size:24px;font-weight:bold;color:#6F4E37;">¥0</div>
                </div>
                <div class="stat-card" style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin:0 0 10px 0;color:#666;">${t('Orders')}</h3>
                    <div id="avg-order" style="font-size:24px;font-weight:bold;color:#6F4E37;">0</div>
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

            <!-- Export Sales Button and Month Selector -->
            <div style="display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:30px;">
                <input type="month" id="export-month" style="padding:8px 12px;font-size:16px;border:1px solid #ccc;border-radius:6px;" />
                <button id="export-sales-csv" style="padding:12px 24px;font-size:16px;background:#6F4E37;color:white;border:none;border-radius:6px;cursor:pointer;">
                    ${t('Export Daily Sales (CSV)')}
                </button>
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

    // Set export month selector to current month by default
    const exportMonthInput = document.getElementById('export-month');
    const now = new Date();
    exportMonthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Export sales CSV handler (uses export month selector)
    document.getElementById('export-sales-csv').addEventListener('click', async () => {
        const monthValue = exportMonthInput.value;
        if (!monthValue) {
            showCustomAlert('Please select a month.', 'warning');
            return;
        }
        const [year, month] = monthValue.split('-').map(Number);
        const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const end = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
        // Fetch orders for the month
        const orders = await fetchOrders(start, end);
        // Group sales by day
        const salesByDate = {};
        orders.forEach(order => {
            const date = formatDate(order.timestamp.toDate());
            salesByDate[date] = (salesByDate[date] || 0) + order.total;
        });
        // Prepare CSV content
        let csv = 'Date,Total Sales\n';
        Object.entries(salesByDate).forEach(([date, total]) => {
            csv += `${date},${total}\n`;
        });
        // Download as CSV file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-sales-${year}-${String(month).padStart(2, '0')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
};

// Helper: Get period dates based on selection
function getPeriodDates(period) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch(period) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'week':
            // Set end to end of current day
            end.setHours(23, 59, 59, 999);
            // Set start to 6 days before today
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // Set to first day of current month
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'last30':
            // Set end to end of current day
            end.setHours(23, 59, 59, 999);
            // Set start to 29 days before today (to include today)
            start.setDate(now.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            break;
        case 'year':
            // Set to first day of current year
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
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
                    },
                    suggestedMax: function(context) {
                        const max = context.chart.data.datasets[0].data.reduce((a, b) => Math.max(a, b), 0);
                        return max + 5000;
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
                label: '7 Day Average',
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
    showLoadingSpinner();
    try {
        const t = (window.t || ((k) => k));
        const { start, end } = getPeriodDates(period);
        const orders = await fetchOrders(start, end);
        const itemCosts = await fetchItemCosts();
        
        // Format date range with day of week and month names
        const formatDateRange = (start, end) => {
            const formatDate = (date) => {
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const day = date.getDate();
                return `${dayOfWeek}, ${month} ${day}`;
            };
            
            // If start and end are the same day, just show it once
            if (start.toDateString() === end.toDateString()) {
                return formatDate(start);
            }
            
            return `${formatDate(start)} - ${formatDate(end)}`;
        };

        // Update period date range display
        const periodDateRange = document.getElementById('period-date-range');
        if (period === 'custom') {
            periodDateRange.style.display = 'none';
        } else {
            periodDateRange.style.display = 'block';
            periodDateRange.textContent = formatDateRange(start, end);
        }

        // Calculate total sales and costs
        let totalSales = 0;
        let totalCosts = 0;
        let totalDiscounts = 0;
        
        orders.forEach(order => {
            totalSales += order.total;
            totalDiscounts += order.discount || 0;
            
            // Calculate costs for each item in the order
            if (order.items) {
                order.items.forEach(item => {
                    if (item && item.name) {
                        let itemName = item.name;
                        let quantity = item.quantity || 0;
                        
                        // Handle customizations
                        if (item.name === 'Soft Drink' && item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                const cost = itemCosts[customization] || 0;
                                totalCosts += cost * quantity;
                            });
                        } else if (item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                if (customization.includes('Ice Cream') || customization.includes('Cake')) {
                                    const cost = itemCosts[customization] || 0;
                                    totalCosts += cost * quantity;
                                } else {
                                    const cost = itemCosts[itemName] || 0;
                                    totalCosts += cost * quantity;
                                }
                            });
                        } else {
                            const cost = itemCosts[itemName] || 0;
                            totalCosts += cost * quantity;
                        }
                    }
                });
            }
        });

        const totalOrders = orders.length;
        const estimatedProfit = Math.round(totalSales - totalCosts - totalDiscounts);

        // Calculate previous period for comparison
        const prevStart = new Date(start);
        const prevEnd = new Date(end);
        const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        prevStart.setDate(prevStart.getDate() - periodDays);
        prevEnd.setDate(prevEnd.getDate() - periodDays);
        const prevOrders = await fetchOrders(prevStart, prevEnd);
        
        let prevTotalSales = 0;
        prevOrders.forEach(order => {
            prevTotalSales += order.total;
        });

        // Calculate percentage change
        const percentageChange = prevTotalSales > 0 
            ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 
            : 0;

        // Update UI
        document.getElementById('total-sales').textContent = formatCurrency(totalSales);
        document.getElementById('total-orders').textContent = formatCurrency(estimatedProfit);
        document.getElementById('avg-order').textContent = totalOrders;
        document.getElementById('total-orders').parentElement.querySelector('h3').textContent = t('Estimated Profit');
        document.getElementById('avg-order').parentElement.querySelector('h3').textContent = t('Orders');
        
        // Update percentage change
        const changeElement = document.getElementById('sales-change');
        if (period === 'today') {
            changeElement.style.display = 'none';
        } else {
            changeElement.style.display = 'block';
            if (percentageChange !== 0) {
                const changeText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
                changeElement.textContent = changeText;
                changeElement.style.color = percentageChange >= 0 ? '#28a745' : '#dc3545';
            } else {
                changeElement.textContent = '';
            }
        }
    } finally {
        hideLoadingSpinner();
    }
}

// Keep only the new, parallelized fetchOrders function
async function fetchOrders(start, end) {
    try {
        const orders = [];
        const dateList = [];
        const currentDate = new Date(start);
        const endDate = new Date(end);
        while (currentDate <= endDate) {
            dateList.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // Fetch all daily orders in parallel
        const fetchPromises = dateList.map(date => {
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dailyOrdersRef = doc(window.firebaseDb, 'dailyOrders', dateKey);
            return getDoc(dailyOrdersRef).then(dailyDoc => {
                if (dailyDoc.exists()) {
                    const data = dailyDoc.data();
                    return Object.entries(data.orders || {})
                        .filter(([key, order]) => key !== 'current')
                        .map(([key, order]) => order)
                        .filter(order => {
                            if (!order.timestamp) return false;
                            const orderTime = order.timestamp.toDate();
                            return orderTime >= start && orderTime <= end;
                        });
                }
                return [];
            }).catch(error => {
                console.error(`Error fetching orders for date ${dateKey}:`, error);
                return [];
            });
        });
        const results = await Promise.all(fetchPromises);
        results.forEach(dayOrders => orders.push(...dayOrders));
        // Sort by timestamp
        orders.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
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
async function updatePeakHoursChart(orders) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 7); // Get past 7 days
    start.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    // Get orders for past 7 days
    const pastOrders = await fetchOrders(start, today);
    
    // Initialize hourly data arrays with 30-minute intervals (8:00-17:00)
    const todayData = new Array(19).fill(0); // 19 slots for 8:00-17:00 in 30-min intervals
    const pastWeekData = new Array(19).fill(0); // Same for past week average
    const pastWeekDays = 7; // Number of days to average

    // Get today's date at midnight for comparison
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Process today's orders
    orders.forEach(order => {
        const orderTime = order.timestamp.toDate();
        // Only process orders from today
        if (orderTime >= todayMidnight) {
            const hour = orderTime.getHours();
            const minute = orderTime.getMinutes();
            
            // Only process orders between 8:00 and 17:00
            if (hour >= 8 && hour < 17) {
                const index = (hour - 8) * 2 + (minute >= 30 ? 1 : 0);
                if (index >= 0 && index < 19) {
                    todayData[index]++;
                }
            }
        }
    });

    // Process past week's orders (excluding today)
    pastOrders.forEach(order => {
        const orderTime = order.timestamp.toDate();
        // Skip today's orders for past week average
        if (orderTime < todayMidnight) {
            const hour = orderTime.getHours();
            const minute = orderTime.getMinutes();
            
            // Only process orders between 8:00 and 17:00
            if (hour >= 8 && hour < 17) {
                const index = (hour - 8) * 2 + (minute >= 30 ? 1 : 0);
                if (index >= 0 && index < 19) {
                    pastWeekData[index]++;
                }
            }
        }
    });

    // Calculate average for past week
    for (let i = 0; i < pastWeekData.length; i++) {
        pastWeekData[i] = Math.round((pastWeekData[i] / pastWeekDays) * 10) / 10;
    }

    // Update chart labels to show half-hour intervals
    const labels = [];
    for (let hour = 8; hour < 17; hour++) {
        labels.push(`${hour}:00`);
        labels.push(`${hour}:30`);
    }

    // Update chart with new data and labels
    window.peakHoursChart.data.labels = labels;
    window.peakHoursChart.data.datasets[0].data = todayData;
    window.peakHoursChart.data.datasets[1].data = pastWeekData;
    window.peakHoursChart.update();
}

// Load usage analysis for past 7 days
async function loadUsageAnalysis() {
    showLoadingSpinner();
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6); // Past 7 days including today
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const orders = await fetchOrders(start, end);
        const itemCosts = await fetchItemCosts(); // Fetch existing costs

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
                        if (item.name === 'Soft Drink' && item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                allItems.add(customization);
                            });
                        } else if (item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                if (customization.includes('Ice Cream') || customization.includes('Cake')) {
                                    allItems.add(customization);
                                } else {
                                    allItems.add(item.name);
                                }
                            });
                        } else {
                            allItems.add(item.name);
                        }
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
                order.items.forEach(item => {
                    if (item && item.name && usageByDate[dateStr]) {
                        if (item.name === 'Soft Drink' && item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                usageByDate[dateStr][customization] = (usageByDate[dateStr][customization] || 0) + (item.quantity || 0);
                            });
                        } else if (item.customizations && item.customizations.length > 0) {
                            item.customizations.forEach(customization => {
                                if (customization.includes('Ice Cream') || customization.includes('Cake')) {
                                    usageByDate[dateStr][customization] = (usageByDate[dateStr][customization] || 0) + (item.quantity || 0);
                                } else {
                                    usageByDate[dateStr][item.name] = (usageByDate[dateStr][item.name] || 0) + (item.quantity || 0);
                                }
                            });
                        } else {
                            usageByDate[dateStr][item.name] = (usageByDate[dateStr][item.name] || 0) + (item.quantity || 0);
                        }
                    }
                });
            }
        });

        // Calculate averages and totals
        const itemTotals = {};
        const itemAverages = {};
        const itemCostsData = {};

        allItems.forEach(item => {
            itemTotals[item] = 0;
            // Calculate total including today
            dates.forEach(date => {
                const dateStr = formatDate(date);
                itemTotals[item] += usageByDate[dateStr][item] || 0;
            });
            
            // Calculate average excluding today
            const pastDates = dates.slice(0, -1); // Exclude today
            const pastTotal = pastDates.reduce((sum, date) => {
                const dateStr = formatDate(date);
                return sum + (usageByDate[dateStr][item] || 0);
            }, 0);
            itemAverages[item] = pastTotal / pastDates.length;

            // Get cost data
            itemCostsData[item] = itemCosts[item] || 0;
        });

        // Sort items by total usage
        const sortedItems = Array.from(allItems)
            .sort((a, b) => itemTotals[b] - itemTotals[a]);

        // Generate HTML
        usageAnalysis.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
                ${sortedItems.map(item => `
                    <div style="background:#f8f9fa;padding:15px;border-radius:6px;border-left:4px solid #A67C52;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div style="font-weight:bold;">${getDisplayName(item)}</div>
                            <button onclick="editItemCost('${item}', ${itemCostsData[item]})" 
                                    style="background:#6F4E37;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                                ${t('Edit Cost')}
                            </button>
                        </div>
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
                            ${t('Cost per Item')}:
                            <div style="font-weight:bold;color:#6F4E37;">¥${itemCostsData[item].toLocaleString()}</div>
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
    } finally {
        hideLoadingSpinner();
    }
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
        loadAnalysisData(period);
    }
}

// Update sales trend chart
async function loadSalesTrendData(period) {
    showLoadingSpinner();
    try {
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
            const orderDate = order.timestamp.toDate();
            const currentPeriodDate = new Date(orderDate);
            currentPeriodDate.setDate(currentPeriodDate.getDate() + periodDays);
            const mappedDate = formatDate(currentPeriodDate);
            
            const dateIndex = dates.findIndex(d => formatDate(d) === mappedDate);
            if (dateIndex !== -1) {
                const targetDate = formatDate(dates[dateIndex]);
                prevSalesByDate[targetDate] = (prevSalesByDate[targetDate] || 0) + order.total;
            }
        });

        // Calculate percentage changes for each day
        const percentageChanges = {};
        dates.forEach((date, index) => {
            const dateStr = formatDate(date);
            const current = salesByDate[dateStr];
            const previous = prevSalesByDate[dateStr];
            if (previous > 0) {
                percentageChanges[dateStr] = ((current - previous) / previous) * 100;
            } else {
                percentageChanges[dateStr] = null;
            }
        });

        // Create labels based on period
        let labels;
        if (period === 'month') {
            // For monthly view, use consistent format "Day DD"
            labels = dates.map(date => {
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                const day = date.getDate();
                return `${dayOfWeek} ${day}`;
            });
        } else if (period === 'year') {
            // For yearly view, use YYYY-MM-DD for each bar, but show only months as grid lines/labels
            labels = dates.map(date => formatDate(date));
        } else {
            // For other periods (week, last30), use original format
            labels = dates.map(date => {
                const dateStr = formatDate(date);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                return [dateStr, dayOfWeek];
            });
        }

        // Update chart
        window.salesTrendChart.data.labels = labels;
        window.salesTrendChart.data.datasets[0].data = Object.values(salesByDate);
        
        // Add percentage changes as annotations
        const annotations = {};
        Object.entries(percentageChanges).forEach(([date, change], index) => {
            if (change !== null) {
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
                    yAdjust: -15
                };
            }
        });
        
        // Update chart options based on period
        if (period === 'month') {
            window.salesTrendChart.options.scales.x = {
                ...window.salesTrendChart.options.scales.x,
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            };
        } else if (period === 'year') {
            // Show only months as grid lines/labels
            window.salesTrendChart.options.scales.x = {
                ...window.salesTrendChart.options.scales.x,
                ticks: {
                    callback: function(value, index, ticks) {
                        // value is the label (YYYY-MM-DD)
                        const date = new Date(labels[index]);
                        if (date.getDate() === 1) {
                            // Show month name at the first of each month
                            return date.toLocaleDateString('en-US', { month: 'short' });
                        }
                        return '';
                    },
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: false
                },
                grid: {
                    // Draw grid line only at the first of each month, none for other days
                    drawOnChartArea: true,
                    color: function(context) {
                        const index = context.tick && context.tick.value !== undefined ? context.tick.value : context.index;
                        const date = new Date(labels[index]);
                        if (date.getDate() === 1) {
                            return '#bbb';
                        }
                        // No grid line for other days
                        return 'rgba(0,0,0,0)';
                    },
                    // Remove border grid line for clarity
                    drawBorder: false
                }
            };
        } else {
            // Reset to default options for other periods
            window.salesTrendChart.options.scales.x = {
                ...window.salesTrendChart.options.scales.x,
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            };
        }
        
        window.salesTrendChart.options.plugins.annotation.annotations = annotations;
        window.salesTrendChart.update();
    } finally {
        hideLoadingSpinner();
    }
}

// Add these new functions for cost management
async function fetchItemCosts() {
    try {
        const costsRef = collection(window.firebaseDb, 'itemCosts');
        const querySnapshot = await getDocs(costsRef);
        const costs = {};
        querySnapshot.forEach(doc => {
            costs[doc.id] = doc.data().cost;
        });
        return costs;
    } catch (error) {
        console.error('Error fetching item costs:', error);
        return {};
    }
}

async function saveItemCost(itemName, cost) {
    try {
        const costsRef = collection(window.firebaseDb, 'itemCosts');
        await setDoc(doc(costsRef, itemName), {
            cost: parseFloat(cost),
            updatedAt: Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error('Error saving item cost:', error);
        return false;
    }
}

// Custom modal functions
function showCustomAlert(message, type = 'info') {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '10px';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '400px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.textAlign = 'center';
    modal.style.position = 'relative';

    // Set color based on type
    let color = 'var(--primary)';
    if (type === 'error') color = '#dc3545';
    if (type === 'warning') color = '#ffc107';
    if (type === 'success') color = '#28a745';

    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '25px';
    messageElement.style.color = '#333';
    messageElement.style.fontSize = '16px';
    messageElement.style.lineHeight = '1.5';

    // Create OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '12px 30px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '8px';
    okButton.style.backgroundColor = color;
    okButton.style.color = 'white';
    okButton.style.cursor = 'pointer';
    okButton.style.fontSize = '16px';
    okButton.style.fontWeight = 'bold';
    okButton.style.minWidth = '100px';
    okButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // Assemble modal
    modal.appendChild(messageElement);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Focus on button for keyboard navigation
    okButton.focus();
}

function showCustomPrompt(message, defaultValue = '', onConfirm, onCancel) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-prompt-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'custom-prompt-modal';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '10px';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '400px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.position = 'relative';

    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '20px';
    messageElement.style.color = '#333';
    messageElement.style.fontSize = '16px';
    messageElement.style.lineHeight = '1.5';

    // Create input field
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.value = defaultValue;
    inputField.style.width = '100%';
    inputField.style.padding = '12px';
    inputField.style.border = '1px solid #e0e0e0';
    inputField.style.borderRadius = '8px';
    inputField.style.fontSize = '16px';
    inputField.style.marginBottom = '20px';
    inputField.style.boxSizing = 'border-box';

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '15px';
    buttonsContainer.style.justifyContent = 'center';

    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '12px 25px';
    cancelButton.style.border = '1px solid #e0e0e0';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.backgroundColor = 'white';
    cancelButton.style.color = '#666';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.fontWeight = 'bold';
    cancelButton.style.minWidth = '80px';
    cancelButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    };

    // Create Confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'OK';
    confirmButton.style.padding = '12px 25px';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.backgroundColor = 'var(--primary)';
    confirmButton.style.color = 'white';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.fontSize = '16px';
    confirmButton.style.fontWeight = 'bold';
    confirmButton.style.minWidth = '80px';
    confirmButton.onclick = () => {
        const value = inputField.value;
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm(value);
    };

    // Assemble modal
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(confirmButton);
    modal.appendChild(messageElement);
    modal.appendChild(inputField);
    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus on input field
    inputField.focus();
    inputField.select();

    // Handle Enter key
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = inputField.value;
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm(value);
        }
    });

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        }
    });
}

// Add this to your window object
window.editItemCost = function(itemName, currentCost) {
    showCustomPrompt(`Enter cost for ${getDisplayName(itemName)}:`, currentCost, (cost) => {
        const numCost = parseFloat(cost);
        if (!isNaN(numCost) && numCost >= 0) {
            saveItemCost(itemName, numCost).then(success => {
                if (success) {
                    loadUsageAnalysis(); // Refresh the display
                } else {
                    showCustomAlert('Failed to save cost. Please try again.', 'error');
                }
            });
        } else {
            showCustomAlert('Please enter a valid number.', 'warning');
        }
    });
}; 
