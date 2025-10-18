// OrderLog.js - Handles order log functionality

// Helper functions for daily orders structure
export function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getDailyOrdersDoc() {
    const todayKey = getTodayKey();
    const dailyOrdersRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', todayKey);
    const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
    
    if (!doc.exists()) {
        // Create new daily orders document
        await window.firebaseServices.setDoc(dailyOrdersRef, {
            date: todayKey,
            orders: {},
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
    }
    
    return dailyOrdersRef;
}

export async function addOrderToDaily(completedOrder) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Add the new order to the orders map
        const updatedOrders = {
            ...data.orders,
            [completedOrder.orderNumber]: completedOrder
        };
        
        await window.firebaseServices.updateDoc(dailyOrdersRef, {
            orders: updatedOrders,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        
        return true;
    } catch (error) {
        console.error('Error adding order to daily:', error);
        return false;
    }
}

export async function moveCurrentOrderToCompleted(completedOrder) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Remove the current order and add the completed order
        const updatedOrders = { ...data.orders };
        delete updatedOrders.current; // Remove current order
        updatedOrders[completedOrder.orderNumber] = completedOrder; // Add completed order
        
        await window.firebaseServices.updateDoc(dailyOrdersRef, {
            orders: updatedOrders,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        
        return true;
    } catch (error) {
        console.error('Error moving current order to completed:', error);
        return false;
    }
}

export async function updateOrderInDaily(orderNumber, updates) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        if (data.orders && data.orders[orderNumber]) {
            const updatedOrders = {
                ...data.orders,
                [orderNumber]: {
                    ...data.orders[orderNumber],
                    ...updates
                }
            };
            await window.firebaseServices.updateDoc(dailyOrdersRef, {
                orders: updatedOrders,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            return true;
        }
        
        // Fallback to yesterday's document (handles midnight rollover on long-running sessions)
        const yesterdayKey = getYesterdayKey();
        const yesterdayRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', yesterdayKey);
        const yDoc = await window.firebaseServices.getDoc(yesterdayRef);
        const yData = yDoc.exists() ? yDoc.data() : null;
        if (yData && yData.orders && yData.orders[orderNumber]) {
            const updatedOrders = {
                ...yData.orders,
                [orderNumber]: {
                    ...yData.orders[orderNumber],
                    ...updates
                }
            };
            await window.firebaseServices.updateDoc(yesterdayRef, {
                orders: updatedOrders,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            return true;
        }
        
        throw new Error('Order not found');
    } catch (error) {
        console.error('Error updating order in daily:', error);
        return false;
    }
}

export async function deleteOrderFromDaily(orderNumber) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        if (data.orders && data.orders[orderNumber]) {
            const updatedOrders = { ...data.orders };
            delete updatedOrders[orderNumber];
            await window.firebaseServices.updateDoc(dailyOrdersRef, {
                orders: updatedOrders,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            return true;
        }
        
        // Fallback to yesterday's document
        const yesterdayKey = getYesterdayKey();
        const yesterdayRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', yesterdayKey);
        const yDoc = await window.firebaseServices.getDoc(yesterdayRef);
        const yData = yDoc.exists() ? yDoc.data() : null;
        if (yData && yData.orders && yData.orders[orderNumber]) {
            const updatedOrders = { ...yData.orders };
            delete updatedOrders[orderNumber];
            await window.firebaseServices.updateDoc(yesterdayRef, {
                orders: updatedOrders,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            return true;
        }
        
        throw new Error('Order not found');
    } catch (error) {
        console.error('Error deleting order from daily:', error);
        return false;
    }
}

export async function getTodayOrders() {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Convert orders map to array, exclude 'current' order, and sort by timestamp
        const ordersArray = Object.entries(data.orders || {})
            .filter(([key, order]) => key !== 'current') // Exclude current order
            .map(([key, order]) => order)
            .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        
        return ordersArray;
    } catch (error) {
        console.error('Error getting today orders:', error);
        return [];
    }
}

export async function getOrderByNumber(orderNumber) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        if (data.orders && data.orders[orderNumber]) {
            return data.orders[orderNumber];
        }
        
        // Fallback to yesterday's document
        const yesterdayKey = getYesterdayKey();
        const yesterdayRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', yesterdayKey);
        const yDoc = await window.firebaseServices.getDoc(yesterdayRef);
        const yData = yDoc.exists() ? yDoc.data() : null;
        if (yData && yData.orders && yData.orders[orderNumber]) {
            return yData.orders[orderNumber];
        }
        
        return null;
    } catch (error) {
        console.error('Error getting order by number:', error);
        return null;
    }
}

// Generate simple continuous order number
export async function generateOrderNumber() {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        if (!data || !data.orders) {
            // No orders today, start with 1
            return 1;
        }
        
        // Get all completed orders (exclude 'current')
        const orders = data.orders;
        const completedOrders = Object.entries(orders)
            .filter(([key, order]) => key !== 'current' && order.orderNumber)
            .map(([key, order]) => order);
        
        if (completedOrders.length === 0) {
            // No completed orders today, start with 1
            return 1;
        }
        
        // Find the most recent order by timestamp
        const mostRecentOrder = completedOrders.reduce((latest, current) => {
            if (!latest.timestamp) return current;
            if (!current.timestamp) return latest;
            
            // Compare timestamps (newer is greater)
            const latestTime = latest.timestamp.seconds || 0;
            const currentTime = current.timestamp.seconds || 0;
            
            return currentTime > latestTime ? current : latest;
        });
        
        // Return the most recent order number + 1
        const nextOrderNumber = (mostRecentOrder.orderNumber || 0) + 1;
        console.log('Most recent order:', mostRecentOrder.orderNumber, 'Next order:', nextOrderNumber);
        return nextOrderNumber;
        
    } catch (error) {
        console.error('Error generating order number:', error);
        return 1; // Simple fallback
    }
}

// Reset order history
export async function resetOrderHistory(showCustomConfirm, showCustomAlert, activeCategory, displayOrderLog) {
    showCustomConfirm("Are you sure you want to reset today's order history? This action cannot be undone.", async () => {
        try {
            const todayOrders = await getTodayOrders();
            
            // Restore stock for all orders before deleting
            for (const orderData of todayOrders) {
                if (window.stocktakeSystem && window.stocktakeSystem.restoreStockFromOrder) {
                    await window.stocktakeSystem.restoreStockFromOrder(orderData);
                }
            }
            
            // Delete the entire daily orders document
            const dailyOrdersRef = await getDailyOrdersDoc();
            await window.firebaseServices.deleteDoc(dailyOrdersRef);
            
            showCustomAlert("Today's order history has been reset.", 'success');
            if (activeCategory === 'Order Log') {
                const container = document.querySelector('.order-log-container');
                if (container) {
                    await displayOrderLog(container);
                }
            }
        } catch (error) {
            console.error('Error resetting order history:', error);
            showCustomAlert('Error resetting order history. Please try again.', 'error');
        }
    });
}

// Export today's orders
export async function exportTodayOrders(showCustomAlert, getDisplayName) {
    try {
        const todayOrders = await getTodayOrders();
        
        if (todayOrders.length === 0) {
            showCustomAlert('No orders found for today.', 'warning');
            return;
        }
        
        const today = new Date();
        let exportText = `Daily Sales Report - ${today.toLocaleDateString()}\n\n`;
        let totalSales = 0;
        let cashSales = 0;
        let cardSales = 0;
        let otherSales = 0;
        let cashOrders = 0;
        let cardOrders = 0;
        let otherOrders = 0;
        
        todayOrders.forEach(order => {
            exportText += `Order #${order.orderNumber}\n`;
            exportText += `Time: ${order.timestamp.toDate().toLocaleTimeString()}\n`;
            exportText += 'Items:\n';
            
            order.items.forEach(item => {
                exportText += `- ${item.quantity}x ${getDisplayName(item.name)}`;
                if (item.customizations) {
                    exportText += ` (${item.customizations.join(', ')})`;
                }
                exportText += ` - ¥${item.price * item.quantity}\n`;
            });
            
            exportText += `Total: ¥${order.total}\n`;
            exportText += `Payment: ${order.paymentMethod} (Tendered: ¥${order.tenderedAmount}, Change: ¥${order.change})\n\n`;
            
            totalSales += order.total;
            
            // Track by payment method
            const paymentMethod = order.paymentMethod || 'other';
            if (paymentMethod === 'Cash') {
                cashSales += order.total;
                cashOrders++;
            } else if (paymentMethod === 'Card') {
                cardSales += order.total;
                cardOrders++;
            } else {
                otherSales += order.total;
                otherOrders++;
            }
        });
        
        exportText += `\n=== SALES SUMMARY ===\n`;
        exportText += `Total Sales: ¥${totalSales}\n`;
        exportText += `Total Orders: ${todayOrders.length}\n\n`;
        exportText += `Cash Sales: ¥${cashSales} (${cashOrders} orders)\n`;
        exportText += `Card Sales: ¥${cardSales} (${cardOrders} orders)\n`;
        if (otherSales > 0) {
            exportText += `Other Sales: ¥${otherSales} (${otherOrders} orders)\n`;
        }
        exportText += `\nCash %: ${totalSales > 0 ? ((cashSales / totalSales) * 100).toFixed(1) : 0}%\n`;
        exportText += `Card %: ${totalSales > 0 ? ((cardSales / totalSales) * 100).toFixed(1) : 0}%`;
        
        // Create and download the file
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${today.toLocaleDateString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting orders:', error);
        showCustomAlert('Error exporting orders. Please try again.', 'error');
    }
}

// Display order log
export async function displayOrderLog(container, getDisplayName, t, updateOrderInDaily, getOrderByNumber, showCustomAlert) {
    container.innerHTML = '';
    
    try {
        // Get today's orders using the new structure
        const todayOrders = await getTodayOrders();
        
        // Create grid container
        const orderLogGrid = document.createElement('div');
        orderLogGrid.className = 'order-log-grid';
        container.appendChild(orderLogGrid);
        
        if (todayOrders.length === 0) {
            orderLogGrid.innerHTML = `
                <div class="order-log-item">
                    <div class="order-log-header">
                        <div class="order-number">No Orders Today</div>
                    </div>
                    <div class="order-log-items">
                        <div class="order-log-item-row">
                            <div class="order-log-item-name">No orders have been placed today.</div>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        todayOrders.forEach(order => {
            const orderLogItem = document.createElement('div');
            orderLogItem.className = 'order-log-item' + (order.completed ? ' completed' : '');
            
            // Calculate relative time
            const orderTime = order.timestamp.toDate();
            const now = new Date();
            const diffMs = now - orderTime;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            
            let timeAgo;
            if (diffMins < 1) {
                timeAgo = t('Just now');
            } else if (diffMins < 60) {
                timeAgo = `${diffMins} ${t(diffMins === 1 ? 'minute ago' : 'minutes ago')}`;
            } else {
                timeAgo = `${diffHours} ${t(diffHours === 1 ? 'hour ago' : 'hours ago')}`;
            }
            
            // Combine identical items
            const combinedItems = order.items.reduce((acc, item) => {
                const key = `${getDisplayName(item.name, window.currentLang)}${item.customizations ? `-${item.customizations.join(',')}` : ''}`;
                if (!acc[key]) {
                    acc[key] = {
                        ...item,
                        quantity: item.quantity
                    };
                } else {
                    acc[key].quantity += item.quantity;
                }
                return acc;
            }, {});
            
            // Get table display text
            const tableText = order.tableNumber ? 
                (order.tableNumber === 'counter' ? ' - Counter' : ` - Table ${order.tableNumber}`) : '';
            
            orderLogItem.innerHTML = `
                <div class="order-log-header" data-order-number="${order.orderNumber}">
                    <div class="order-number">${t('Order')} #${order.orderNumber}${tableText}</div>
                    <div class="order-time">
                        ${timeAgo}
                        <button class="edit-order-btn" data-order-number="${order.orderNumber}">✎</button>
                    </div>
                </div>
                <div class="order-log-items">
                    ${Object.values(combinedItems).map(item => `
                        <div class="order-log-item-row ${item.completed ? 'completed' : ''}" data-item-id="${item.id}">
                            <div class="order-log-item-quantity">x${item.quantity}</div>
                            <div class="order-log-item-name">${getDisplayName(item, window.currentLang)}</div>
                            ${item.customizations ? `<div class="order-log-item-options">${item.customizations.join(', ')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="order-log-total">
                    <div class="total-label">${t('Total Amount')}</div>
                    <div class="total-amount">¥${order.total}</div>
                </div>
                <div class="order-log-payment">
                    <div class="payment-status ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}">
                        ${order.paymentStatus === 'paid' ? t('Paid') : t('Unpaid')}
                    </div>
                    <div class="payment-details-right">
                        ${order.paymentStatus === 'paid' ? `
                            ${order.paymentMethod === 'Card' ? `
                                <span><span class="payment-detail-label">${t('Card Payment:')}</span> <span class="payment-detail-value">¥${order.total}</span></span>
                            ` : `
                                <span><span class="payment-detail-label">${t('Cash Given:')}</span> <span class="payment-detail-value">¥${order.tenderedAmount}</span></span>
                                <span><span class="payment-detail-label">${t('Change:')}</span> <span class="payment-detail-value">¥${order.change}</span></span>
                            `}
                        ` : `
                            <button class="pay-now-btn" data-order-number="${order.orderNumber}">${t('Pay Now')}</button>
                        `}
                    </div>
                </div>
            `;
            
            // Add click handler for the order header to toggle completion status
            const header = orderLogItem.querySelector('.order-log-header');
            header.addEventListener('click', async (e) => {
                // Don't toggle if clicking the edit button
                if (e.target.classList.contains('edit-order-btn')) {
                    return;
                }
                
                try {
                    const orderNumber = parseInt(header.dataset.orderNumber);
                    const newStatus = !order.completed;
                    
                    // Update all items to match the order status
                    const updatedItems = order.items.map(item => ({
                        ...item,
                        completed: newStatus
                    }));
                    
                    const ok = await window.updateOrderInDaily(orderNumber, {
                        completed: newStatus,
                        items: updatedItems
                    });
                    if (!ok) {
                        showCustomAlert('Could not update order. It may belong to yesterday. Please refresh the page.', 'warning');
                        return;
                    }
                    
                    // Toggle the completed class for the entire order-log-item
                    orderLogItem.classList.toggle('completed');
                } catch (error) {
                    console.error('Error updating order completion status:', error);
                    showCustomAlert('Error updating order status. Please try again.', 'error');
                }
            });

            // Add click handlers for individual items
            orderLogItem.querySelectorAll('.order-log-item-row').forEach(row => {
                row.addEventListener('click', async (e) => {
                    // Don't trigger if clicking on a button or link
                    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                        return;
                    }

                    try {
                        const itemId = parseInt(row.dataset.itemId);
                        const orderNumber = parseInt(orderLogItem.querySelector('.order-log-header').dataset.orderNumber);
                        const currentOrder = await getOrderByNumber(orderNumber);
                        
                        if (!currentOrder) {
                            throw new Error('Order not found');
                        }
                        
                        // Toggle the completed status for this item
                        const updatedItems = currentOrder.items.map(item => {
                            if (item.id === itemId) {
                                return { ...item, completed: !item.completed };
                            }
                            return item;
                        });
                        
                        // Check if all items are completed
                        const allCompleted = updatedItems.every(item => item.completed);
                        
                        await window.updateOrderInDaily(orderNumber, {
                            items: updatedItems,
                            completed: allCompleted
                        });
                        
                        // Toggle the completed class for this item
                        row.classList.toggle('completed');
                        
                        // Update the header status based on all items
                        if (allCompleted) {
                            orderLogItem.classList.add('completed');
                        } else {
                            orderLogItem.classList.remove('completed');
                        }
                    } catch (error) {
                        console.error('Error updating item completion status:', error);
                        showCustomAlert('Error updating item status. Please try again.', 'error');
                    }
                });
            });
            
            orderLogGrid.appendChild(orderLogItem);
        });
    } catch (error) {
        console.error('Error displaying order log:', error);
        showCustomAlert('Error loading orders. Please try again.', 'error');
    }
}

// Process pay now for existing order
export async function processPayNow(orderNumber, showCustomAlert, getOrderByNumber, updateOrderInDaily, displayOrderLog, t, activeCategory) {
    let amountEntered = '';
    console.log('Starting processPayNow for order:', orderNumber);
    try {
        const orderData = await getOrderByNumber(parseInt(orderNumber));
        
        if (!orderData) {
            console.error('Order not found:', orderNumber);
            showCustomAlert('Order not found', 'error');
            return;
        }
        console.log('Found order:', orderData);
        
        // Show payment modal with the order total
        const totalAmount = orderData.total;
        document.getElementById('totalAmount').textContent = totalAmount;
        document.getElementById('tenderedAmount').textContent = '0';
        document.getElementById('changeAmount').textContent = '0';
        document.getElementById('paymentModal').style.display = 'flex';
        
        // Create new process button
        const processBtn = document.getElementById('completePaymentBtn');
        const newProcessBtn = processBtn.cloneNode(true);
        
        // Remove any existing click handlers
        processBtn.parentNode.replaceChild(newProcessBtn, processBtn);
        
        // Add new click handler
        newProcessBtn.addEventListener('click', async () => {
            const tenderedText = (document.getElementById('tenderedAmount').textContent || '0');
            const tenderedAmount = parseInt(tenderedText.replace(/[^0-9]/g, ''), 10) || 0;
            
            // Double-check using debug panel values
            const debugContent = document.getElementById('debugContent');
            let doubleCheckPassed = false;
            
            if (debugContent) {
                try {
                    const debugText = debugContent.innerHTML;
                    const totalMatch = debugText.match(/Total:\s*(\d+)/);
                    const tenderedMatch = debugText.match(/Tendered:\s*(\d+)/);
                    
                    if (totalMatch && tenderedMatch) {
                        const debugTotal = parseInt(totalMatch[1], 10);
                        const debugTendered = parseInt(tenderedMatch[1], 10);
                        
                        console.log('Double-check values - Total:', debugTotal, 'Tendered:', debugTendered);
                        
                        if (debugTendered >= debugTotal) {
                            console.log('Double-check PASSED: Payment is sufficient according to debug panel');
                            doubleCheckPassed = true;
                        }
                    }
                } catch (error) {
                    console.error('Error in double-check function:', error);
                }
            }
            
            if (!doubleCheckPassed && tenderedAmount < totalAmount) {
                showCustomAlert('Insufficient payment amount', 'warning');
                return;
            }
            
            try {
                // Update the order in Firestore with payment details
                const paymentDetails = {
                    paymentMethod: 'Cash',
                    tenderedAmount: tenderedAmount,
                    change: tenderedAmount - totalAmount,
                    paymentStatus: 'paid',
                    timestamp: window.firebaseServices.Timestamp.now()
                };
                
                await window.updateOrderInDaily(parseInt(orderNumber), paymentDetails);
                
                // Close modal
                document.getElementById('paymentModal').style.display = 'none';
                
                // Refresh order log
                const orderLogContainer = document.querySelector('.order-log-container');
                if (orderLogContainer) {
                    await displayOrderLog(orderLogContainer, window.getDisplayName, t, updateOrderInDaily, getOrderByNumber, showCustomAlert);
                }
            } catch (error) {
                console.error('Error in payment process:', error);
                showCustomAlert('Error updating order. Please try again.', 'error');
            }
        });
    } catch (error) {
        console.error('Error in processPayNow:', error);
        showCustomAlert('Error loading order. Please try again.', 'error');
    }
}

// Edit Order Modal Functions
export async function openEditOrderModal(orderNumber, getOrderByNumber, showCustomAlert, getDisplayName, t, updateOrderInDaily, deleteOrderFromDaily, displayOrderLog, activeCategory) {
    try {
        const order = await getOrderByNumber(parseInt(orderNumber));
        
        if (!order) {
            showCustomAlert('Order not found', 'error');
            return;
        }

        // Set order number in modal
        const editOrderNumberEl = document.getElementById('editOrderNumber');
        if (editOrderNumberEl) {
            editOrderNumberEl.textContent = order.orderNumber;
        } else {
            console.error('editOrderNumber element not found in DOM');
        }

        // --- SNAPSHOT ORIGINAL ITEMS ---
        order.items.forEach(item => { delete item.isAdded; });

        // Use global variable for order
        window._editOrderModalOrder = order;
        let editOrderItems = document.getElementById('editOrderItems');

        // Event delegation will be attached in renderEditOrderItems

        // Store the add item handler globally so it can be reused
        window._editOrderAddItemHandler = function() {
        let addItemModal = document.getElementById('addItemModal');
        if (!addItemModal) {
            addItemModal = document.createElement('div');
            addItemModal.id = 'addItemModal';
            addItemModal.className = 'add-item-modal';
            addItemModal.innerHTML = `
                <style>
                    .add-item-content { position: relative; }
                    .add-item-close-btn {
                        position: absolute;
                        top: 12px;
                        right: 16px;
                        font-size: 22px;
                        background: none;
                        border: none;
                        color: #a97c50;
                        cursor: pointer;
                        z-index: 10;
                    }
                </style>
                <div class="add-item-content">
                    <button class="add-item-close-btn">&times;</button>
                    <h2>Add Item to Order</h2>
                    <div class="category-tabs add-item-tabs">
                        <button class="category-tab add-item-tab active" data-tab="drinks">${t('Drinks')}</button>
                        <button class="category-tab add-item-tab" data-tab="food">${t('Food')}</button>
                    </div>
                    <div class="add-item-list"></div>
                    <div class="add-item-actions">
                        <button class="cancel-add-item-btn">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(addItemModal);
        }
            const addItemList = addItemModal.querySelector('.add-item-list');
            const tabButtons = addItemModal.querySelectorAll('.add-item-tab');
            
            // Clear previous items
            addItemList.innerHTML = '';
            
            // Add tab click handlers
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked tab
                    button.classList.add('active');
                    // Render items for selected tab
                    renderItemsForTab(button.dataset.tab);
                });
            });
            
            // Function to render items for a specific tab
            function renderItemsForTab(tabName) {
                addItemList.innerHTML = '';
                
                if (tabName === 'drinks') {
                    // Add drink items with dividers
                    window.menuData['Drinks'].forEach(item => {
                if (item.type === 'divider') {
                    // Add a visual divider
                    const divider = document.createElement('div');
                    divider.className = 'add-item-divider';
                    divider.style.gridColumn = '1 / -1';
                    divider.style.borderTop = '1px solid #e0e0e0';
                    divider.style.margin = '10px 0';
                    divider.style.height = '1px';
                    addItemList.appendChild(divider);
                } else if (!item.isBlank && !item.isCustom && !item.isMilkAddon && !item.isDiscount) {
                    const itemOption = document.createElement('div');
                    itemOption.className = 'add-item-option';
                    itemOption.innerHTML = `
                        <div class="item-name">${getDisplayName(item.name)}</div>
                        <div class="item-price">¥${item.price}</div>
                    `;
                    
                    itemOption.onclick = () => {
                        if (item.hasJam) {
                            showDropdownInModal(window.showJamOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                            return;
                        } else if (item.hasExtraShot) {
                            showDropdownInModal(window.showExtraShotOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                            return;
                        } else if (item.hasFlavor) {
                            if (item.name === 'Cake') {
                                showDropdownInModal(window.showCakeOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                return;
                            } else if (item.name === 'Ice Cream') {
                                showDropdownInModal(window.showIceCreamOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                return;
                            }
                        } else if (item.name === 'Caprese Sandwich') {
                            showDropdownInModal(window.showProscuittoOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                            return;
                        } else if (item.hasSoftDrink) {
                            showDropdownInModal(window.showSoftDrinkOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                            return;
                        } else if (item.hasTea) {
                            showDropdownInModal(window.showTeaOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                            return;
                        }
                        // Default: add item directly
                        const newItem = {
                            ...item,
                            quantity: 1,
                            id: Date.now() + Math.random(),
                            completed: false,
                            isAdded: true
                        };
                        order.items.push(newItem);
                        addItemModal.style.display = 'none';
                        renderEditOrderItems();
                        // Update total
                        const updatedTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        const totalElement = document.querySelector('.edit-order-total');
                        if (totalElement) {
                            totalElement.textContent = `Total: ¥${updatedTotal}`;
                        }
                    };
                    
                    addItemList.appendChild(itemOption);
                }
                });
                } else if (tabName === 'food') {
                    // Add food items with dividers
                    window.menuData['Food'].forEach(item => {
                        if (item.type === 'divider') {
                            // Add a visual divider
                            const divider = document.createElement('div');
                            divider.className = 'add-item-divider';
                            divider.style.gridColumn = '1 / -1';
                            divider.style.borderTop = '1px solid #e0e0e0';
                            divider.style.margin = '10px 0';
                            divider.style.height = '1px';
                            addItemList.appendChild(divider);
                        } else if (!item.isMilkAddon && !item.isCustom) {
                            const itemOption = document.createElement('div');
                            itemOption.className = 'add-item-option';
                            itemOption.innerHTML = `
                                <div class="item-name">${getDisplayName(item.name)}</div>
                                <div class="item-price">¥${item.price}</div>
                            `;
                            
                            itemOption.onclick = () => {
                                if (item.hasJam) {
                                    showDropdownInModal(window.showJamOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                    return;
                                } else if (item.hasExtraShot) {
                                    showDropdownInModal(window.showExtraShotOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                    return;
                                } else if (item.hasFlavor) {
                                    if (item.name === 'Cake') {
                                        showDropdownInModal(window.showCakeOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                        return;
                                    } else if (item.name === 'Ice Cream') {
                                        showDropdownInModal(window.showIceCreamOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                        return;
                                    }
                                } else if (item.name === 'Caprese Sandwich') {
                                    showDropdownInModal(window.showProscuittoOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                    return;
                                } else if (item.hasSoftDrink) {
                                    showDropdownInModal(window.showSoftDrinkOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                    return;
                                } else if (item.hasTea) {
                                    showDropdownInModal(window.showTeaOptions, item, itemOption, addItemToEditOrder, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
                                    return;
                                }
                                // Default: add item directly
                                const newItem = {
                                    ...item,
                                    quantity: 1,
                                    id: Date.now() + Math.random(),
                                    completed: false,
                                    isAdded: true
                                };
                                order.items.push(newItem);
                                addItemModal.style.display = 'none';
                                renderEditOrderItems();
                                // Update total
                                const updatedTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                const totalElement = document.querySelector('.edit-order-total');
                                if (totalElement) {
                                    totalElement.textContent = `Total: ¥${updatedTotal}`;
                                }
                            };
                            
                            addItemList.appendChild(itemOption);
                        }
                        
                    });
                    // Add Local Discount button at the end
                    const discountOption = document.createElement('div');
                    discountOption.className = 'add-item-option';
                    discountOption.innerHTML = `
                        <div class="item-name">${t('Local Discount')}</div>
                        <div class="item-price">-¥</div>
                    `;
                    discountOption.onclick = () => {
                        showEditOrderDiscountModal(order, renderEditOrderItems);
                    };
                    addItemList.appendChild(discountOption);
                }
            }
            
            // Reset tab highlight to Drinks
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabButtons[0].classList.add('active');
            // Initialize with drinks tab
            renderItemsForTab('drinks');
            
            // Show the add item modal
            addItemModal.style.display = 'flex';
            
            // Add event listener for cancel button
            const cancelBtn = addItemModal.querySelector('.cancel-add-item-btn');
            cancelBtn.onclick = () => {
                // Remove any open dropdowns in modal
                const modalContent = addItemModal.querySelector('.add-item-content');
                if (modalContent) {
                    modalContent.querySelectorAll('.custom-options').forEach(el => el.remove());
                }
                addItemModal.style.display = 'none';
            };
            // Add close button handler
            const closeBtn = addItemModal.querySelector('.add-item-close-btn');
            if (closeBtn) closeBtn.onclick = () => {
                // Remove any open dropdowns in modal
                const modalContent = addItemModal.querySelector('.add-item-content');
                if (modalContent) {
                    modalContent.querySelectorAll('.custom-options').forEach(el => el.remove());
                }
                addItemModal.style.display = 'none';
            };
        };
        // Helper to render all items (original, separator, added)
        function renderEditOrderItems() {
            // Always update global reference
            window._editOrderModalOrder = order;
            window._editOrderModalRender = renderEditOrderItems;
            // Remove any previous event handler
            if (editOrderItems._delegationHandler) {
                editOrderItems.removeEventListener('click', editOrderItems._delegationHandler);
            }
            editOrderItems.innerHTML = '';
            const originalItems = window._editOrderModalOrder.items.filter(item => !item.isAdded);
            const addedItems = window._editOrderModalOrder.items.filter(item => item.isAdded);
            // Render original items
            originalItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'edit-order-item';
                itemEl.innerHTML = `
                    <div class="edit-order-item-info">
                        <div>${getDisplayName(item.name)}</div>
                        ${item.customizations ? `<div style="color: #666; font-size: 14px;">${item.customizations.join(', ')}</div>` : ''}
                        <div style="color: var(--primary); font-weight: bold;">¥${item.price * item.quantity}</div>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-item-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-item-id="${item.id}">+</button>
                    </div>
                `;
                editOrderItems.appendChild(itemEl);
            });
            // Render separator if there are added items
            if (addedItems.length > 0) {
                const separator = document.createElement('div');
                separator.className = 'edit-order-separator';
                separator.style.borderTop = '3px solid #7B4F27'; // brown, thicker
                separator.style.margin = '16px 0 4px 0'; // less gap below
                separator.style.padding = '6px 0 0 0';
                separator.innerHTML = '<div style="color: #7B4F27; font-size: 14px; font-weight: bold; text-align: center; letter-spacing: 1px;">Added Items</div>';
                editOrderItems.appendChild(separator);
            }
            // Render added items
            addedItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'edit-order-item added-order-item';
                itemEl.style.background = '#f7f3ef'; // subtle background for added items
                itemEl.innerHTML = `
                    <div class="edit-order-item-info">
                        <div>${getDisplayName(item.name)}</div>
                        ${item.customizations ? `<div style="color: #666; font-size: 14px;">${item.customizations.join(', ')}</div>` : ''}
                        <div style="color: var(--primary); font-weight: bold;">¥${item.price * item.quantity}</div>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-item-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-item-id="${item.id}">+</button>
                    </div>
                `;
                editOrderItems.appendChild(itemEl);
            });
            // Render total
            let totalElement = document.createElement('div');
            totalElement.className = 'edit-order-total';
            totalElement.style.marginTop = '20px';
            totalElement.style.padding = '15px';
            totalElement.style.backgroundColor = 'var(--light)';
            totalElement.style.borderRadius = '8px';
            totalElement.style.fontWeight = 'bold';
            totalElement.style.fontSize = '18px';
            totalElement.style.textAlign = 'center';
            const total = Math.round(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
            totalElement.textContent = `Total: ¥${total}`;
            editOrderItems.appendChild(totalElement);
            // Render Add Item button
            const addItemButton = document.createElement('button');
            addItemButton.className = 'add-item-btn';
            addItemButton.textContent = 'Add Item';
            addItemButton.style.marginTop = '20px';
            addItemButton.style.width = '100%';
            editOrderItems.appendChild(addItemButton);
            // Always re-attach the click handler after rendering
            const addItemBtn = editOrderItems.querySelector('.add-item-btn');
            if (addItemBtn) addItemBtn.onclick = window._editOrderAddItemHandler;
            // Always re-attach modal action button handlers after rendering
            const cancelBtn = document.querySelector('.cancel-edit-btn');
            if (cancelBtn) cancelBtn.onclick = function() {
                document.getElementById('editOrderModal').style.display = 'none';
            };
            let originalOrderSnapshot = null;
            originalOrderSnapshot = JSON.parse(JSON.stringify(order)); // Deep copy for stock diff
            const deleteBtn = document.querySelector('.delete-order-btn');
            if (deleteBtn) deleteBtn.onclick = async function() {
                try {
                    await deleteOrderFromDaily(parseInt(order.orderNumber));
                    if (window.stocktakeSystem && window.stocktakeSystem.restoreStockFromOrder) {
                        await window.stocktakeSystem.restoreStockFromOrder(originalOrderSnapshot);
                    }
                    document.getElementById('editOrderModal').style.display = 'none';
                    if (activeCategory === 'Order Log') {
                        const container = document.querySelector('.order-log-container');
                        if (container) {
                            await displayOrderLog(container, getDisplayName, t, updateOrderInDaily, getOrderByNumber, showCustomAlert);
                        }
                    }
                } catch (error) {
                    console.error('Error deleting order:', error);
                    showCustomAlert('Error deleting order. Please try again.', 'error');
                }
            };
            const saveBtn = document.querySelector('.save-order-btn');
            if (saveBtn) saveBtn.onclick = async function() {
                try {
                    const updatedTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    await window.updateOrderInDaily(parseInt(order.orderNumber), {
                        items: order.items,
                        total: updatedTotal,
                        completed: false
                    });
                    // Update stock only for changes
                    if (window.stocktakeSystem && window.stocktakeSystem.updateStockFromOrderChanges) {
                        await window.stocktakeSystem.updateStockFromOrderChanges(originalOrderSnapshot, order);
                    }
                    document.getElementById('editOrderModal').style.display = 'none';
                    if (activeCategory === 'Order Log') {
                        const container = document.querySelector('.order-log-container');
                        if (container) {
                            await displayOrderLog(container, getDisplayName, t, updateOrderInDaily, getOrderByNumber, showCustomAlert);
                        }
                    }
                } catch (error) {
                    console.error('Error saving order:', error);
                    showCustomAlert('Error saving order. Please try again.', 'error');
                }
            };
            // Attach a new event handler for plus/minus
            editOrderItems._delegationHandler = function(e) {
                const order = window._editOrderModalOrder;
                if (e.target.classList.contains('quantity-btn')) {
                    const itemId = parseFloat(e.target.dataset.itemId);
                    if (e.target.classList.contains('minus')) {
                        order.items = order.items.filter(i => i.id !== itemId);
                        renderEditOrderItems();
                    } else if (e.target.classList.contains('plus')) {
                        const item = order.items.find(i => i.id === itemId);
                        if (item) {
                            const newItem = {
                                ...item,
                                quantity: 1,
                                id: Date.now() + Math.random(),
                                isAdded: true
                            };
                            order.items.push(newItem);
                            renderEditOrderItems();
                        }
                    }
                }
            };
            editOrderItems.addEventListener('click', editOrderItems._delegationHandler);
        }
        // Initial render
        renderEditOrderItems();
        // Show the modal (fix: ensure modal is visible)
        document.getElementById('editOrderModal').style.display = 'flex';
    } catch (error) {
        console.error('Error opening edit modal:', error);
        showCustomAlert('Error loading order. Please try again.', 'error');
    }
} 

// Add this function near the top of orderlog.js or with other modal helpers:
function showEditOrderDiscountModal(order, renderEditOrderItems) {
    const discountModal = document.getElementById('discountModal');
    if (!discountModal) {
        console.error('Discount modal not found');
        return;
    }
    
    // Find or create the discountAmount element (same logic as main.js)
    let discountAmountEl = document.getElementById('discountAmount');
    if (!discountAmountEl) {
        // Create the span if it doesn't exist
        discountAmountEl = document.createElement('span');
        discountAmountEl.id = 'discountAmount';
        discountAmountEl.textContent = '0';
        
        // Find the total-amount div and add the span
        const totalAmountDiv = discountModal.querySelector('.total-amount');
        if (totalAmountDiv) {
            totalAmountDiv.innerHTML = 'Discount Amount: -¥<span id="discountAmount">0</span>';
            discountAmountEl = document.getElementById('discountAmount');
        }
    }
    
    if (!discountAmountEl) {
        console.error('Discount amount element not found and could not be created');
        return;
    }
    
    window.discountAmount = '';
    discountAmountEl.textContent = '0';
    discountModal.style.display = 'flex';
    
    // Check for apply button
    let applyDiscountBtn = document.getElementById('applyDiscountBtn');
    if (!applyDiscountBtn) {
        console.error('applyDiscountBtn not found');
        return;
    }
    
    // Remove any existing event listeners
    const numpadBtns = discountModal.querySelectorAll('.numpad-btn');
    numpadBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Add fresh event listeners
    discountModal.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value === '⌫') {
                // Backspace functionality
                window.discountAmount = window.discountAmount.slice(0, -1);
            } else {
                // Add digit
                window.discountAmount += value;
            }
            
            // Update the discount amount display
            const amount = window.discountAmount ? parseInt(window.discountAmount) : 0;
            discountAmountEl.textContent = amount;
            
            // Enable/disable apply button based on amount
            applyDiscountBtn.disabled = amount <= 0;
            console.log('Discount amount:', amount, 'Button disabled:', applyDiscountBtn.disabled);
        });
    });
    
    // Reset apply button state
    applyDiscountBtn.disabled = true;
    console.log('Initial button state - disabled:', applyDiscountBtn.disabled);
    
    // Test: Enable button after a short delay to see if it works
    setTimeout(() => {
        if (applyDiscountBtn) {
            applyDiscountBtn.disabled = false;
            console.log('Test: Button manually enabled, disabled state:', applyDiscountBtn.disabled);
        }
    }, 1000);

    // Remove previous listeners for Apply/Cancel
    const existingApplyBtn = discountModal.querySelector('#applyDiscountBtn');
    const existingCancelBtn = discountModal.querySelector('#cancelDiscountBtn');
    
    if (existingApplyBtn) {
        const newApplyBtn = existingApplyBtn.cloneNode(true);
        existingApplyBtn.replaceWith(newApplyBtn);
        console.log('Button cloned and replaced');
        
        // Add event listener to the new apply button
        newApplyBtn.addEventListener('click', () => {
            const amount = parseInt(window.discountAmount);
            if (amount > 0) {
                const discountItem = {
                    name: 'Local Discount',
                    price: -amount,
                    quantity: 1,
                    id: Date.now(),
                    customizations: ['Discount'],
                    isAdded: true // Mark as added
                };
                order.items.push(discountItem);
                discountModal.style.display = 'none';
                renderEditOrderItems();
                // Close the add-item modal as well
                const addItemModal = document.getElementById('addItemModal');
                if (addItemModal) addItemModal.style.display = 'none';
                // Update total
                const updatedTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalElement = document.querySelector('.edit-order-total');
                if (totalElement) {
                    totalElement.textContent = `Total: ¥${updatedTotal}`;
                }
            }
        });
        
        // Update the reference to the new button for the numpad event listeners
        applyDiscountBtn = newApplyBtn;
        console.log('Button reference updated, new button disabled:', applyDiscountBtn.disabled);
    }
    
    if (existingCancelBtn) {
        const newCancelBtn = existingCancelBtn.cloneNode(true);
        existingCancelBtn.replaceWith(newCancelBtn);
        
        newCancelBtn.addEventListener('click', () => {
            discountModal.style.display = 'none';
        });
    }
}

// Helper function to identify coffee items
function isCoffeeItem(itemName) {
    const coffeeItems = [
        'Espresso', 'Cappuccino', 'Americano', 'Latte', 'Matcha Latte', 'Hot Cocoa',
        'Ice Americano', 'Ice Latte', 'Ice Matcha Latte', 'Ice Cocoa'
    ];
    return coffeeItems.includes(itemName);
}

// Current Order Management Functions
export function renderOrderItems(currentOrder, currentLang, getDisplayName, showMilkTypeButtons, hideMilkTypeButtons, updateItemQuantity, getDailyOrdersDoc) {
    if (!currentOrder || !Array.isArray(currentOrder.items)) return;
    const orderItemsContainer = document.querySelector('.order-items');
    orderItemsContainer.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const customizationsText = item.customizations ? item.customizations.join(', ') : '';
        
        const orderItemEl = document.createElement('div');
        orderItemEl.className = 'order-item';
        orderItemEl.dataset.id = item.id;
        orderItemEl.innerHTML = `
            <div class="item-info">
                <div class="item-title">${getDisplayName(item.name, currentLang)}</div>
                ${customizationsText && !item.name.includes('Discount') ? `<div class="item-options">${customizationsText}</div>` : ''}
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
            </div>
            <div class="item-total">${item.name.includes('Discount') ? '-' : ''}¥${Math.abs(itemTotal)}</div>
        `;
        
        // Add event listeners to quantity buttons
        const minusBtn = orderItemEl.querySelector('.minus');
        const plusBtn = orderItemEl.querySelector('.plus');
        
        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateItemQuantity(item.id, -1, renderOrderItems, updateOrderSummary, saveCurrentOrder, getDailyOrdersDoc);
        });
        
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateItemQuantity(item.id, 1, renderOrderItems, updateOrderSummary, saveCurrentOrder, getDailyOrdersDoc);
        });

        // Add click event for selection
        orderItemEl.addEventListener('click', () => {
            const alreadySelected = orderItemEl.classList.contains('selected');
            // Remove selected class from all items
            document.querySelectorAll('.order-item').forEach(el => {
                el.classList.remove('selected');
            });
            // Remove any milk UI
            hideMilkTypeButtons();
            if (alreadySelected) {
                // If already selected, toggle off
                return;
            }
            // Add selected class to clicked item
            orderItemEl.classList.add('selected');
            // Show milk type buttons if item has milk or is a coffee item
            if (item.hasMilk || isCoffeeItem(item.name)) {
                showMilkTypeButtons(item, orderItemEl, renderOrderItems);
            }
        });
        
        orderItemsContainer.appendChild(orderItemEl);
    });
}

export function updateItemQuantity(itemId, change, renderOrderItems, updateOrderSummary, saveCurrentOrder, getDailyOrdersDoc = window.getDailyOrdersDoc) {
    // Always use window.currentOrder to ensure we're working with the latest order
    const currentOrderToUse = window.currentOrder;
    const item = currentOrderToUse.items.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeItemFromOrder(itemId, renderOrderItems, updateOrderSummary, saveCurrentOrder, getDailyOrdersDoc);
        } else {
            renderOrderItems(currentOrderToUse, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, updateItemQuantity, getDailyOrdersDoc);
            updateOrderSummary(currentOrderToUse);
            saveCurrentOrder(currentOrderToUse, getDailyOrdersDoc);
        }
    }
}

export function removeItemFromOrder(itemId, renderOrderItems, updateOrderSummary, saveCurrentOrder, getDailyOrdersDoc = window.getDailyOrdersDoc) {
    // Always use window.currentOrder to ensure we're working with the latest order
    const currentOrderToUse = window.currentOrder;
    currentOrderToUse.items = currentOrderToUse.items.filter(item => item.id !== itemId);
    renderOrderItems(currentOrderToUse, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, updateItemQuantity, getDailyOrdersDoc);
    updateOrderSummary(currentOrderToUse);
    saveCurrentOrder(currentOrderToUse, getDailyOrdersDoc);
}

export function updateOrderSummary(currentOrder) {
    if (!currentOrder || !Array.isArray(currentOrder.items)) return;
    let subtotal = 0;
    currentOrder.items.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Round to prevent floating point precision issues
    currentOrder.subtotal = Math.round(subtotal);
    currentOrder.total = Math.round(subtotal);
    
    document.querySelector('.summary-row:nth-child(1) div:nth-child(2)').textContent = `¥${currentOrder.subtotal}`;
    document.querySelector('.total-row div:nth-child(2)').textContent = `¥${currentOrder.total}`;
    document.querySelector('#paymentModal h2').textContent = `Payment - ¥${currentOrder.total}`;
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.disabled = currentOrder.items.length === 0;
    if (currentOrder.items.length === 0) {
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }
}

export async function initializeOrder(generateOrderNumber, showCustomAlert) {
    try {
        const orderNumber = await generateOrderNumber();
        
        const currentOrder = {
            items: [],
            subtotal: 0,
            total: 0,
            orderNumber: orderNumber,
            tableNumber: null
        };
        
        // Update order number display
        document.querySelector('.order-title').textContent = `Current Order #${currentOrder.orderNumber}`;
        
        // Clear order items container
        document.querySelector('.order-items').innerHTML = '';
        
        // Update order summary
        updateOrderSummary(currentOrder);
        
        // Assign to global variable
        window.currentOrder = currentOrder;
        
        // Save the new current order to Firebase
        await saveCurrentOrder(currentOrder);
        console.log('Initialized new current order:', currentOrder);
        
        return currentOrder;
    } catch (error) {
        console.error('Error initializing order:', error);
        showCustomAlert('Error initializing order. Please refresh the page.', 'error');
        return null;
    }
}

export async function loadCurrentOrder(getDailyOrdersDoc, showCustomAlert) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Check if there's a current order in today's daily orders
        if (data.orders && data.orders.current) {
            const currentOrderData = data.orders.current;
            let orderNumber = currentOrderData.orderNumber;
            
            // If order number is invalid, generate a new one
            if (!orderNumber || orderNumber < 1) {
                console.warn('Invalid order number in current order:', orderNumber, 'generating new one');
                orderNumber = await generateOrderNumber();
            }
            
            const currentOrder = {
                items: currentOrderData.items || [],
                subtotal: currentOrderData.subtotal || 0,
                total: currentOrderData.total || 0,
                orderNumber: orderNumber,
                tableNumber: currentOrderData.tableNumber || null
            };
            // Recalculate subtotal and total from items
            currentOrder.subtotal = currentOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            currentOrder.total = currentOrder.subtotal;
            // Assign to global
            window.currentOrder = currentOrder;
            
            // Update UI
            document.querySelector('.order-title').textContent = `Current Order #${currentOrder.orderNumber}`;
            renderOrderItems(currentOrder, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, updateItemQuantity, getDailyOrdersDoc);
            updateOrderSummary(currentOrder);
            console.log('Loaded existing current order:', currentOrder);
            
            return currentOrder;
        } else {
            console.log('No current order found, will initialize new one');
            return null;
        }
    } catch (error) {
        console.error('Error loading current order:', error);
        return null;
    }
}

export async function saveCurrentOrder(currentOrder, getDailyOrdersDoc = window.getDailyOrdersDoc) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Update the current order in the daily orders document
        const updatedOrders = {
            ...data.orders,
            'current': {
                items: currentOrder.items,
                subtotal: currentOrder.subtotal,
                total: currentOrder.total,
                orderNumber: currentOrder.orderNumber,
                tableNumber: currentOrder.tableNumber || null,
                lastUpdated: window.firebaseServices.Timestamp.now()
            }
        };
        
        await window.firebaseServices.updateDoc(dailyOrdersRef, {
            orders: updatedOrders,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        console.log('Saved current order to Firebase:', currentOrder);
    } catch (error) {
        console.error('Error saving current order:', error);
    }
}

export async function clearCurrentOrder(getDailyOrdersDoc) {
    try {
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        // Remove the current order from the daily orders document
        const updatedOrders = { ...data.orders };
        delete updatedOrders.current;
        
        await window.firebaseServices.updateDoc(dailyOrdersRef, {
            orders: updatedOrders,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
    } catch (error) {
        console.error('Error clearing current order:', error);
    }
}

export async function startNewOrder(generateOrderNumber, showCustomAlert) {
    try {
        const orderNumber = await generateOrderNumber();
        const currentOrder = {
            items: [],
            subtotal: 0,
            total: 0,
            orderNumber: orderNumber
        };
        
        // Update order number display
        document.querySelector('.order-title').textContent = `Current Order #${currentOrder.orderNumber}`;
        
        // Clear order items container
        document.querySelector('.order-items').innerHTML = '';
        
        // Update order summary
        updateOrderSummary(currentOrder);
        
        return currentOrder;
    } catch (error) {
        console.error('Error starting new order:', error);
        showCustomAlert('Error starting new order. Please try again.', 'error');
        return null;
    }
}

// Payment Functions
export async function processPayment(currentOrder, moveCurrentOrderToCompleted, clearCurrentOrder, initializeOrder, displayOrderLog, activeCategory, showCustomAlert) {
    const tenderedText = (document.getElementById('tenderedAmount').textContent || '0');
    const totalText = (document.getElementById('totalAmount').textContent || '0');
    const tenderedAmount = parseInt(String(tenderedText).replace(/[^0-9]/g, ''), 10) || 0;
    const totalAmount = parseInt(String(totalText).replace(/[^0-9]/g, ''), 10) || 0;
    
    // Double-check using debug panel values
    const debugContent = document.getElementById('debugContent');
    let doubleCheckPassed = false;
    
    if (debugContent) {
        try {
            const debugText = debugContent.innerHTML;
            const totalMatch = debugText.match(/Total:\s*(\d+)/);
            const tenderedMatch = debugText.match(/Tendered:\s*(\d+)/);
            
            if (totalMatch && tenderedMatch) {
                const debugTotal = parseInt(totalMatch[1], 10);
                const debugTendered = parseInt(tenderedMatch[1], 10);
                
                console.log('Double-check values - Total:', debugTotal, 'Tendered:', debugTendered);
                
                if (debugTendered >= debugTotal) {
                    console.log('Double-check PASSED: Payment is sufficient according to debug panel');
                    doubleCheckPassed = true;
                }
            }
        } catch (error) {
            console.error('Error in double-check function:', error);
        }
    }
    
    if (!doubleCheckPassed && tenderedAmount < totalAmount) {
        showCustomAlert('Insufficient payment amount', 'warning');
        return;
    }
    
    // Show processing indicator
    const processingOverlay = document.createElement('div');
    processingOverlay.style.position = 'fixed';
    processingOverlay.style.top = '0';
    processingOverlay.style.left = '0';
    processingOverlay.style.width = '100%';
    processingOverlay.style.height = '100%';
    processingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    processingOverlay.style.zIndex = '2000';
    processingOverlay.style.display = 'flex';
    processingOverlay.style.justifyContent = 'center';
    processingOverlay.style.alignItems = 'center';
    processingOverlay.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <div style="font-size: 18px; margin-bottom: 15px;">Processing Payment...</div>
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #6F4E37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(processingOverlay);
    
    try {
        // Check connection before processing with proper validation
        if (window.ensureFirestoreConnection) {
            const isConnected = await window.ensureFirestoreConnection();
            if (!isConnected) {
                console.warn('Connection check failed, proceeding with retry logic');
                // Show user feedback about connection issues
                showCustomAlert('Connection issue detected. Processing with retry logic...', 'warning');
            }
        }
        
        // Validate current order state before processing
        if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
            throw new Error('Invalid order state: No items in current order');
        }
        
        if (!currentOrder.total || currentOrder.total <= 0) {
            throw new Error('Invalid order state: Invalid total amount');
        }

        // Move current order to completed orders
        const completedOrder = { 
            ...currentOrder, 
            paymentMethod: 'Cash',
            tenderedAmount: tenderedAmount,
            change: tenderedAmount - totalAmount,
            timestamp: window.firebaseServices.Timestamp.now(),
            paymentStatus: 'paid'
        };
        
        // Move current order to completed orders with retry logic
        let moveSuccess = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!moveSuccess && retryCount < maxRetries) {
            try {
                await moveCurrentOrderToCompleted(completedOrder);
                moveSuccess = true;
                console.log('Order successfully moved to completed');
            } catch (error) {
                retryCount++;
                console.error(`Failed to move order to completed (attempt ${retryCount}):`, error);
                
                if (retryCount < maxRetries) {
                    // Wait before retry with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                } else {
                    throw new Error(`Failed to complete order after ${maxRetries} attempts: ${error.message}`);
                }
            }
        }
        
        // Remove processing overlay
        document.body.removeChild(processingOverlay);
        
        // Validate payment completion before closing modal
        const paymentValid = await validatePaymentCompletion(completedOrder.orderNumber, showCustomAlert);
        if (!paymentValid) {
            throw new Error('Payment completion validation failed');
        }
        
        // Only close modal after successful completion and validation
        document.getElementById('paymentModal').style.display = 'none';
        
        // Show success/change popup
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        overlay.style.cursor = 'pointer';
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.top = '50%';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translate(-50%, -50%)';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '40px';
        successMessage.style.borderRadius = '15px';
        successMessage.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        successMessage.style.zIndex = '1000';
        successMessage.style.textAlign = 'center';
        successMessage.style.minWidth = '300px';
        successMessage.innerHTML = `
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">Change: ¥${tenderedAmount - totalAmount}</div>
            <div style="font-size: 16px; opacity: 0.8;">Order #${completedOrder.orderNumber}</div>
        `;
        document.body.appendChild(overlay);
        document.body.appendChild(successMessage);
        
        // Add click event to remove the message
        const dismissPopup = async () => {
            document.body.removeChild(overlay);
            document.body.removeChild(successMessage);
            // Only update order log if container exists
            const container = document.querySelector('.order-log-container');
            if (container) {
                await displayOrderLog(container);
            }
        };
        overlay.addEventListener('click', dismissPopup);
        successMessage.addEventListener('click', dismissPopup);
        
        // Do the rest in the background with proper error handling
        (async () => {
            try {
                // Process stock updates
                if (window.stocktakeSystem && window.stocktakeSystem.processOrderForStock) {
                    await window.stocktakeSystem.processOrderForStock(completedOrder);
                }
                
                // Clear current order with retry logic
                let clearSuccess = false;
                let clearRetryCount = 0;
                const maxClearRetries = 3;
                
                while (!clearSuccess && clearRetryCount < maxClearRetries) {
                    try {
                        await clearCurrentOrder();
                        clearSuccess = true;
                        console.log('Current order cleared successfully');
                    } catch (error) {
                        clearRetryCount++;
                        console.error(`Failed to clear current order (attempt ${clearRetryCount}):`, error);
                        
                        if (clearRetryCount < maxClearRetries) {
                            await new Promise(resolve => setTimeout(resolve, 1000 * clearRetryCount));
                        } else {
                            throw new Error(`Failed to clear current order after ${maxClearRetries} attempts`);
                        }
                    }
                }
                
                // Initialize new order
                const newOrder = await initializeOrder();
                if (newOrder) {
                    window.currentOrder = newOrder;
                    console.log('New order initialized successfully');
                } else {
                    console.warn('Failed to initialize new order');
                }
            } catch (backgroundError) {
                console.error('Background processing error:', backgroundError);
                // Show user-friendly error for critical background operations
                if (backgroundError.message.includes('clear current order')) {
                    showCustomAlert('Warning: Order completed but cleanup failed. Please refresh the page.', 'warning');
                }
            }
        })();
    } catch (error) {
        // Remove processing overlay
        if (document.body.contains(processingOverlay)) {
            document.body.removeChild(processingOverlay);
        }
        
        console.error('Error processing payment:', error);
        
        // Check if it's a connection-related error
        const isConnectionError = error.message && (
            error.message.includes('network') ||
            error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.message.includes('quota') ||
            error.message.includes('unavailable')
        );
        
        if (isConnectionError) {
            showCustomAlert('Connection issue detected. Please check your internet connection and try again. If the problem persists, please refresh the page.', 'error');
        } else {
            showCustomAlert('Error processing payment. Please try again.', 'error');
        }
    }
}

export async function processPayLater(currentOrder, moveCurrentOrderToCompleted, clearCurrentOrder, initializeOrder, displayOrderLog, activeCategory, showCustomAlert) {
    // Show processing indicator
    const processingOverlay = document.createElement('div');
    processingOverlay.style.position = 'fixed';
    processingOverlay.style.top = '0';
    processingOverlay.style.left = '0';
    processingOverlay.style.width = '100%';
    processingOverlay.style.height = '100%';
    processingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    processingOverlay.style.zIndex = '2000';
    processingOverlay.style.display = 'flex';
    processingOverlay.style.justifyContent = 'center';
    processingOverlay.style.alignItems = 'center';
    processingOverlay.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <div style="font-size: 18px; margin-bottom: 15px;">Saving Order...</div>
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #6F4E37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(processingOverlay);
    
    try {
        // Check if we're in the order log view
        if (activeCategory === 'Order Log') {
            // If we're in order log, just close the modal
            document.getElementById('paymentModal').style.display = 'none';
            document.body.removeChild(processingOverlay);
            return;
        }

        // Check connection before processing
        if (window.ensureFirestoreConnection) {
            const isConnected = await window.ensureFirestoreConnection();
            if (!isConnected) {
                console.warn('Connection check failed, proceeding with retry logic');
            }
        }

        // Move current order to completed orders
        const payLaterOrder = { 
            ...currentOrder, 
            paymentMethod: 'Pay Later',
            tenderedAmount: 0,
            change: 0,
            timestamp: window.firebaseServices.Timestamp.now(),
            paymentStatus: 'unpaid'
        };
        
        await moveCurrentOrderToCompleted(payLaterOrder);
        
        // Remove processing overlay
        document.body.removeChild(processingOverlay);
        
        // Immediately close modal and show order saved popup
        document.getElementById('paymentModal').style.display = 'none';
        
        // Show order saved popup
        const overlay2 = document.createElement('div');
        overlay2.style.position = 'fixed';
        overlay2.style.top = '0';
        overlay2.style.left = '0';
        overlay2.style.width = '100%';
        overlay2.style.height = '100%';
        overlay2.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay2.style.zIndex = '999';
        overlay2.style.cursor = 'pointer';
        const successMessage2 = document.createElement('div');
        successMessage2.style.position = 'fixed';
        successMessage2.style.top = '50%';
        successMessage2.style.left = '50%';
        successMessage2.style.transform = 'translate(-50%, -50%)';
        successMessage2.style.backgroundColor = '#ff9800';
        successMessage2.style.color = 'white';
        successMessage2.style.padding = '40px';
        successMessage2.style.borderRadius = '15px';
        successMessage2.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        successMessage2.style.zIndex = '1000';
        successMessage2.style.textAlign = 'center';
        successMessage2.style.minWidth = '300px';
        successMessage2.innerHTML = `
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">Order Saved</div>
            <div style="font-size: 16px; opacity: 0.8;">Order #${payLaterOrder.orderNumber}</div>
        `;
        document.body.appendChild(overlay2);
        document.body.appendChild(successMessage2);
        
        // Add click event to remove the message
        const dismissPopup2 = async () => {
            document.body.removeChild(overlay2);
            document.body.removeChild(successMessage2);
            // Only update order log if container exists
            const container = document.querySelector('.order-log-container');
            if (container) {
                await displayOrderLog(container);
            }
        };
        overlay2.addEventListener('click', dismissPopup2);
        successMessage2.addEventListener('click', dismissPopup2);
        
        // Do the rest in the background with error handling
        (async () => {
            try {
                if (window.stocktakeSystem && window.stocktakeSystem.processOrderForStock) {
                    await window.stocktakeSystem.processOrderForStock(payLaterOrder);
                }
                await clearCurrentOrder();
                const newOrder = await initializeOrder();
                window.currentOrder = newOrder;
            } catch (backgroundError) {
                console.error('Background processing error:', backgroundError);
                // Don't show error to user for background operations
            }
        })();
    } catch (error) {
        // Remove processing overlay
        if (document.body.contains(processingOverlay)) {
            document.body.removeChild(processingOverlay);
        }
        
        console.error('Error processing pay later:', error);
        
        // Check if it's a connection-related error
        const isConnectionError = error.message && (
            error.message.includes('network') ||
            error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.message.includes('quota') ||
            error.message.includes('unavailable')
        );
        
        if (isConnectionError) {
            showCustomAlert('Connection issue detected. Please check your internet connection and try again. If the problem persists, please refresh the page.', 'error');
        } else {
            showCustomAlert('Error saving order. Please try again.', 'error');
        }
    }
}

// Validate that payment was completed successfully
export async function validatePaymentCompletion(orderNumber, showCustomAlert) {
    try {
        // Check if order exists in completed orders
        const completedOrder = await getOrderByNumber(orderNumber);
        if (!completedOrder) {
            throw new Error('Order not found in completed orders');
        }
        
        if (completedOrder.paymentStatus !== 'paid') {
            throw new Error('Order payment status is not paid');
        }
        
        return true;
    } catch (error) {
        console.error('Payment completion validation failed:', error);
        showCustomAlert('Payment validation failed. Please check order status.', 'error');
        return false;
    }
}

export function updatePaymentModal(currentOrder) {
    try {
        // Validate currentOrder
        if (!currentOrder || typeof currentOrder.total !== 'number') {
            console.error('Invalid currentOrder in updatePaymentModal:', currentOrder);
            return;
        }

        const totalAmount = currentOrder.total;
        
        // Add null checks for all elements
        const totalAmountEl = document.getElementById('totalAmount');
        const tenderedAmountEl = document.getElementById('tenderedAmount');
        const changeAmountEl = document.getElementById('changeAmount');
        const processBtn = document.querySelector('.process-btn');
        
        // Validate DOM elements are still connected
        if (!totalAmountEl || !document.contains(totalAmountEl)) {
            console.error('Total amount element not found or disconnected');
            return;
        }
        
        if (!tenderedAmountEl || !document.contains(tenderedAmountEl)) {
            console.error('Tendered amount element not found or disconnected');
            return;
        }
        
        if (!changeAmountEl || !document.contains(changeAmountEl)) {
            console.error('Change amount element not found or disconnected');
            return;
        }
        
        // Update total amount with validation
        if (totalAmountEl) {
            totalAmountEl.textContent = totalAmount;
            console.log('Updated total amount to:', totalAmount);
        }
        
        // Reset tendered amount with validation
        if (tenderedAmountEl) {
            tenderedAmountEl.textContent = '0';
            console.log('Reset tendered amount to 0');
        }
        
        // Reset change amount with validation
        if (changeAmountEl) {
            changeAmountEl.textContent = '0';
            console.log('Reset change amount to 0');
        }
        
        // Reset numpad input
        if (typeof window.amountEntered !== 'undefined') {
            window.amountEntered = '';
        }
        
        // Update button state after modal update
        setTimeout(() => {
            const completeBtn = document.getElementById('completePaymentBtn');
            if (completeBtn) {
                completeBtn.disabled = true;
                completeBtn.style.opacity = '0.5';
                completeBtn.style.cursor = 'not-allowed';
                completeBtn.style.backgroundColor = '#ccc';
                completeBtn.style.color = '#666';
                console.log('Button state reset to disabled after modal update');
            }
        }, 100);
        
        // Disable process button initially
        if (processBtn) {
            processBtn.disabled = true;
        }
        
        // Force a small delay to ensure DOM updates are complete
        setTimeout(() => {
            // Double-check the values were set correctly
            if (totalAmountEl && totalAmountEl.textContent !== String(totalAmount)) {
                console.warn('Total amount not set correctly, retrying...');
                totalAmountEl.textContent = totalAmount;
            }
        }, 50);
        
    } catch (error) {
        console.error('Error in updatePaymentModal:', error);
        // Try to recover by refreshing the page if critical error
        if (error.message && error.message.includes('disconnected')) {
            console.warn('DOM elements disconnected, suggesting page refresh');
            // Don't auto-refresh, just log the issue
        }
    }
} 

// Helper to show dropdown in modal
function closeAllCustomOptions() {
    document.querySelectorAll('.custom-options').forEach(el => el.remove());
}
function showDropdownInModal(fn, item, itemOption, ...args) {
    closeAllCustomOptions();
    const modalContent = itemOption.closest('.add-item-content');
    if (!modalContent) return fn(item, itemOption, ...args); // fallback to global
    const originalAppend = document.body.appendChild;
    document.body.appendChild = function(el) {
        modalContent.appendChild(el);
        return el;
    };
    const rect = itemOption.getBoundingClientRect();
    const modalRect = modalContent.getBoundingClientRect();
    itemOption._dropdownModalOffset = {
        left: rect.left - modalRect.left,
        top: rect.bottom - modalRect.top
    };
    fn(item, itemOption, ...args);
    document.body.appendChild = originalAppend;
}

// Local addItemToEditOrder for dropdowns in edit order modal
function addItemToEditOrder(item) {
    const order = window._editOrderModalOrder;
    order.items.push({
        ...item,
        quantity: 1,
        id: Date.now() + Math.random(),
        completed: false,
        isAdded: true
    });
    // Close any open dropdowns in modal
    const modalContent = document.querySelector('.add-item-content');
    if (modalContent) {
        modalContent.querySelectorAll('.custom-options').forEach(el => el.remove());
    }
    // Hide modal
    const addItemModal = document.getElementById('addItemModal');
    if (addItemModal) addItemModal.style.display = 'none';
    // Re-render modal
    if (typeof window._editOrderModalRender === 'function') window._editOrderModalRender();
    // Update total
    const updatedTotal = Math.round(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    const totalElement = document.querySelector('.edit-order-total');
    if (totalElement) {
        totalElement.textContent = `Total: ¥${updatedTotal}`;
    }
} 