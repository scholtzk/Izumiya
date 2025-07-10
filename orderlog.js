// OrderLog.js - Handles order log functionality

// Helper functions for daily orders structure
export function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
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
        
        if (!data.orders[orderNumber]) {
            throw new Error('Order not found');
        }
        
        // Update the specific order
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
        
        if (!data.orders[orderNumber]) {
            throw new Error('Order not found');
        }
        
        // Remove the order from the map
        const updatedOrders = { ...data.orders };
        delete updatedOrders[orderNumber];
        
        await window.firebaseServices.updateDoc(dailyOrdersRef, {
            orders: updatedOrders,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        
        return true;
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
        
        return data.orders[orderNumber] || null;
    } catch (error) {
        console.error('Error getting order by number:', error);
        return null;
    }
}

// Generate progressive order number
export async function generateOrderNumber() {
    try {
        const todayOrders = await getTodayOrders();
        
        if (todayOrders.length === 0) {
            return 1; // Start with #1 if no orders exist today
        }
        
        // Get the highest order number from today's orders
        const maxOrderNumber = Math.max(...todayOrders.map(order => order.orderNumber));
        return maxOrderNumber + 1;
    } catch (error) {
        console.error('Error generating order number:', error);
        return 1;
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
        });
        
        exportText += `\nTotal Sales: ¥${totalSales}`;
        exportText += `\nNumber of Orders: ${todayOrders.length}`;
        
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
            
            orderLogItem.innerHTML = `
                <div class="order-log-header" data-order-number="${order.orderNumber}">
                    <div class="order-number">${t('Order')} #${order.orderNumber}</div>
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
                            <span><span class="payment-detail-label">${t('Cash Given:')}</span> <span class="payment-detail-value">¥${order.tenderedAmount}</span></span>
                            <span><span class="payment-detail-label">${t('Change:')}</span> <span class="payment-detail-value">¥${order.change}</span></span>
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
                    
                    await updateOrderInDaily(orderNumber, {
                        completed: newStatus,
                        items: updatedItems
                    });
                    
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
                        
                        await updateOrderInDaily(orderNumber, {
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
            const tenderedAmount = parseInt(document.getElementById('tenderedAmount').textContent);
            
            if (tenderedAmount < totalAmount) {
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
                
                await updateOrderInDaily(parseInt(orderNumber), paymentDetails);
                
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
            const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                    await updateOrderInDaily(parseInt(order.orderNumber), {
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
    window.discountAmount = '';
    document.getElementById('discountAmount').textContent = '0';
    discountModal.style.display = 'flex';
    // Remove any existing event listeners
    const numpadBtns = discountModal.querySelectorAll('.numpad-btn');
    numpadBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    discountModal.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.textContent;
            if (value === '⌫') {
                window.discountAmount = window.discountAmount.slice(0, -1);
            } else {
                window.discountAmount += value;
            }
            const amount = window.discountAmount ? parseInt(window.discountAmount) : 0;
            document.getElementById('discountAmount').textContent = amount;
            document.querySelector('#applyDiscountBtn').disabled = amount <= 0;
        });
    });
    document.querySelector('#applyDiscountBtn').disabled = true;

    // Remove previous listeners for Apply/Cancel
    const newApplyBtn = discountModal.querySelector('#applyDiscountBtn').cloneNode(true);
    discountModal.querySelector('#applyDiscountBtn').replaceWith(newApplyBtn);
    const newCancelBtn = discountModal.querySelector('#cancelDiscountBtn').cloneNode(true);
    discountModal.querySelector('#cancelDiscountBtn').replaceWith(newCancelBtn);

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
    newCancelBtn.addEventListener('click', () => {
        discountModal.style.display = 'none';
    });
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
            // Show milk type buttons if item has milk
            if (item.hasMilk) {
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
    
    currentOrder.subtotal = subtotal;
    currentOrder.total = subtotal;
    
    document.querySelector('.summary-row:nth-child(1) div:nth-child(2)').textContent = `¥${subtotal}`;
    document.querySelector('.total-row div:nth-child(2)').textContent = `¥${subtotal}`;
    document.querySelector('#paymentModal h2').textContent = `Payment - ¥${subtotal}`;
    
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
        let orderNumber = await generateOrderNumber();
        if (!orderNumber || orderNumber < 1) orderNumber = 1;
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
            
            // If order number is 0 or invalid, generate a new one
            if (!orderNumber || orderNumber < 1) {
                orderNumber = await generateOrderNumber();
            }
            
            const currentOrder = {
                items: currentOrderData.items || [],
                subtotal: currentOrderData.subtotal || 0,
                total: currentOrderData.total || 0,
                orderNumber: orderNumber
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
    const tenderedAmount = parseInt(document.getElementById('tenderedAmount').textContent);
    const totalAmount = parseInt(document.getElementById('totalAmount').textContent);
    
    if (tenderedAmount < totalAmount) {
        showCustomAlert('Insufficient payment amount', 'warning');
        return;
    }
    
    try {
        // Move current order to completed orders
        const completedOrder = { 
            ...currentOrder, 
            paymentMethod: 'Cash',
            tenderedAmount: tenderedAmount,
            change: tenderedAmount - totalAmount,
            timestamp: window.firebaseServices.Timestamp.now(),
            paymentStatus: 'paid'
        };
        
        await moveCurrentOrderToCompleted(completedOrder);
        // Immediately close modal and show success popup
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
        // Do the rest in the background
        (async () => {
            if (window.stocktakeSystem && window.stocktakeSystem.processOrderForStock) {
                await window.stocktakeSystem.processOrderForStock(completedOrder);
            }
            await clearCurrentOrder();
            const newOrder = await initializeOrder();
            window.currentOrder = newOrder;
        })();
    } catch (error) {
        console.error('Error processing payment:', error);
        showCustomAlert('Error processing payment. Please try again.', 'error');
    }
}

export async function processPayLater(currentOrder, moveCurrentOrderToCompleted, clearCurrentOrder, initializeOrder, displayOrderLog, activeCategory, showCustomAlert) {
    try {
        // Check if we're in the order log view
        if (activeCategory === 'Order Log') {
            // If we're in order log, just close the modal
            document.getElementById('paymentModal').style.display = 'none';
            return;
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
        // Do the rest in the background
        (async () => {
            if (window.stocktakeSystem && window.stocktakeSystem.processOrderForStock) {
                await window.stocktakeSystem.processOrderForStock(payLaterOrder);
            }
            await clearCurrentOrder();
            const newOrder = await initializeOrder();
            window.currentOrder = newOrder;
        })();
    } catch (error) {
        console.error('Error processing pay later:', error);
        showCustomAlert('Error saving order. Please try again.', 'error');
    }
}

export function updatePaymentModal(currentOrder) {
    const totalAmount = currentOrder.total;
    
    // Add null checks for all elements
    const totalAmountEl = document.getElementById('totalAmount');
    const tenderedAmountEl = document.getElementById('tenderedAmount');
    const changeAmountEl = document.getElementById('changeAmount');
    const processBtn = document.querySelector('.process-btn');
    
    if (totalAmountEl) {
        totalAmountEl.textContent = totalAmount;
    }
    
    if (tenderedAmountEl) {
        tenderedAmountEl.textContent = '0';
    }
    
    if (changeAmountEl) {
        changeAmountEl.textContent = '0';
    }
    
    // Reset numpad input
    window.amountEntered = '';
    
    // Disable process button initially
    if (processBtn) {
        processBtn.disabled = true;
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
    const updatedTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.querySelector('.edit-order-total');
    if (totalElement) {
        totalElement.textContent = `Total: ¥${updatedTotal}`;
    }
} 