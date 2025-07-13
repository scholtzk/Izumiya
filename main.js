// Import menu data and functions
import { menuData, getDisplayName, addItemToOrder, loadMenuItems, showMilkTypeButtons, hideMilkTypeButtons } from './menu.js';
import {
    getTodayKey,
    getDailyOrdersDoc,
    addOrderToDaily,
    moveCurrentOrderToCompleted,
    updateOrderInDaily,
    deleteOrderFromDaily,
    getTodayOrders,
    getOrderByNumber,
    generateOrderNumber,
    resetOrderHistory,
    exportTodayOrders,
    displayOrderLog,
    processPayNow,
    openEditOrderModal,
    renderOrderItems,
    updateItemQuantity,
    removeItemFromOrder,
    updateOrderSummary,
    initializeOrder,
    loadCurrentOrder,
    saveCurrentOrder,
    clearCurrentOrder,
    startNewOrder,
    processPayment,
    processPayLater,
    updatePaymentModal
} from './orderlog.js';
import { initPaymentModal } from './payment.js';
import { initializeLanguage, toggleLanguage, getCategoryDisplayName, translate } from './language.js';
import {
  showJamOptions,
  showExtraShotOptions,
  showCakeOptions,
  showIceCreamOptions,
  showProscuittoOptions,
  showSoftDrinkOptions,
  showTeaOptions
} from './menu.js';

window.showJamOptions = showJamOptions;
window.showExtraShotOptions = showExtraShotOptions;
window.showCakeOptions = showCakeOptions;
window.showIceCreamOptions = showIceCreamOptions;
window.showProscuittoOptions = showProscuittoOptions;
window.showSoftDrinkOptions = showSoftDrinkOptions;
window.showTeaOptions = showTeaOptions;

// Make imported functions available globally (for inline event handlers and legacy code)
window.menuData = menuData;
window.getDisplayName = getDisplayName;
window.addItemToOrder = addItemToOrder;
window.loadMenuItems = loadMenuItems;
window.showMilkTypeButtons = showMilkTypeButtons;
window.hideMilkTypeButtons = hideMilkTypeButtons;
window.showTeaOptions = showTeaOptions;
window.displayOrderLog = displayOrderLog;
window.processPayNow = processPayNow;
window.openEditOrderModal = openEditOrderModal;
window.resetOrderHistory = resetOrderHistory;
window.exportTodayOrders = exportTodayOrders;
window.renderOrderItems = renderOrderItems;
window.updateItemQuantity = updateItemQuantity;
window.removeItemFromOrder = removeItemFromOrder;
window.updateOrderSummary = updateOrderSummary;
window.initializeOrder = initializeOrder;
window.loadCurrentOrder = loadCurrentOrder;
window.saveCurrentOrder = saveCurrentOrder;
window.clearCurrentOrder = clearCurrentOrder;
window.startNewOrder = startNewOrder;
window.processPayment = processPayment;
window.processPayLater = processPayLater;
window.updatePaymentModal = updatePaymentModal;
window.getDailyOrdersDoc = getDailyOrdersDoc;

// Robust fallback: ensure window.updateOrderInDaily is always set
if (!window.updateOrderInDaily || typeof window.updateOrderInDaily !== 'function') {
    window.updateOrderInDaily = updateOrderInDaily;
    console.log('window.updateOrderInDaily set by fallback:', typeof window.updateOrderInDaily);
} else {
    console.log('window.updateOrderInDaily already set:', typeof window.updateOrderInDaily);
}

// Make language functions available globally
window.initializeLanguage = initializeLanguage;
window.toggleLanguage = toggleLanguage;
window.getCategoryDisplayName = getCategoryDisplayName;
window.translate = translate;

// --- Modal and Custom Item Functions ---
function showCustomItemModal() {
    document.getElementById('customItemModal').style.display = 'flex';
    document.getElementById('customItemName').focus();
}

function closeCustomItemModal() {
    document.getElementById('customItemModal').style.display = 'none';
    document.getElementById('customItemName').value = '';
    document.getElementById('customItemPrice').value = '';
}

function addCustomItem() {
    const name = document.getElementById('customItemName').value.trim();
    const price = parseInt(document.getElementById('customItemPrice').value);
    if (!name || isNaN(price) || price < 0) {
        showCustomAlert('Please enter a valid name and price', 'error');
        return;
    }
    const customItem = {
        name: name,
        price: price,
        quantity: 1,
        id: Date.now(),
        isCustom: true
    };
    addItemToOrder(customItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
    closeCustomItemModal();
}

function showDiscountModal() {
    const discountModal = document.getElementById('discountModal');
    if (!discountModal) {
        console.error('Discount modal not found');
        return;
    }
    
    // Find or create the discountAmount element
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
    
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    if (!applyDiscountBtn) {
        console.error('applyDiscountBtn not found');
        return;
    }
    
    // Reset discount amount
    window.discountAmount = '';
    discountAmountEl.textContent = '0';
    
    // Show the modal
    discountModal.style.display = 'flex';
    
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
        });
    });
    
    // Reset apply button state
    applyDiscountBtn.disabled = true;
}
window.showDiscountModal = showDiscountModal;

// --- App Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', async function() {
    const t = (window.t || ((k) => k));
    
    // Initialize language system
    initializeLanguage();
    
    // Set up global variables
    window.activeCategory = 'Drinks';
    window.currentOrder = {
        items: [],
        subtotal: 0,
        total: 0,
        orderNumber: 0
    };

    // Restore last active category if it exists
    const lastCategory = localStorage.getItem('lastActiveCategory');
    if (lastCategory) {
        const categoryTab = document.querySelector(`.category-tab[data-category="${lastCategory}"]`);
        if (categoryTab) {
            categoryTab.click();
        }
        localStorage.removeItem('lastActiveCategory');
    }

    // Set up category tab switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            window.activeCategory = this.dataset.category;
            loadCategoryItems(window.activeCategory);
        });
    });

    // Set up checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    const paymentModal = document.getElementById('paymentModal');
    console.log('checkoutBtn:', checkoutBtn);
    console.log('paymentModal:', paymentModal);
    checkoutBtn.addEventListener('click', function() {
        if (window.currentOrder.items.length > 0) {
            // Show the modal and update it
            paymentModal.style.display = 'flex';
            setTimeout(() => {
                updatePaymentModal(window.currentOrder);
            }, 100);
        }
    });



    // Add event delegation for Pay Now and Edit buttons in order log
    // Add a check before using window.updateOrderInDaily
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('pay-now-btn')) {
            const orderNumber = e.target.dataset.orderNumber;
            if (typeof window.updateOrderInDaily !== 'function') {
                alert('Order update function is not available. Please refresh the page.');
                console.error('window.updateOrderInDaily is not a function at pay-now-btn click:', window.updateOrderInDaily);
                return;
            }
            processPayNow(orderNumber, showCustomAlert, getOrderByNumber, window.updateOrderInDaily, displayOrderLog, t, window.activeCategory);
        } else if (e.target.classList.contains('edit-order-btn')) {
            const orderNumber = e.target.dataset.orderNumber;
            if (typeof window.updateOrderInDaily !== 'function') {
                alert('Order update function is not available. Please refresh the page.');
                console.error('window.updateOrderInDaily is not a function at edit-order-btn click:', window.updateOrderInDaily);
                return;
            }
            openEditOrderModal(orderNumber, getOrderByNumber, showCustomAlert, getDisplayName, t, window.updateOrderInDaily, deleteOrderFromDaily, displayOrderLog, window.activeCategory);
        }
    });

    // Add event listeners for custom item modal
    document.getElementById('cancelCustomItem').addEventListener('click', closeCustomItemModal);
    document.getElementById('addCustomItem').addEventListener('click', addCustomItem);
    document.getElementById('customItemName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('customItemPrice').focus();
        }
    });
    document.getElementById('customItemPrice').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCustomItem();
        }
    });

    // Add event listeners for discount modal
    document.getElementById('cancelDiscountBtn').addEventListener('click', () => {
        document.getElementById('discountModal').style.display = 'none';
    });
    document.getElementById('applyDiscountBtn').addEventListener('click', () => {
        const amount = parseInt(window.discountAmount);
        if (amount > 0) {
            const discountItem = {
                name: 'Local Discount',
                price: -amount,
                quantity: 1,
                id: Date.now(),
                customizations: ['Discount']
            };
            addItemToOrder(discountItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            document.getElementById('discountModal').style.display = 'none';
        }
    });

    // Add click event listener to logo for page refresh
    document.querySelector('.logo').addEventListener('click', () => {
        location.reload();
    });

    // Add event listener for language toggle button
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    } else {
        console.warn('Language toggle button not found');
    }

    // Initialize the time display and update it every minute
    function updateTime() {
        const timeElement = document.querySelector('.time');
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        timeElement.textContent = `${formattedHours}:${formattedMinutes}`;
    }
    updateTime();
    setInterval(updateTime, 60000);

    // Load the current order after initializing
    await loadCurrentOrder(getDailyOrdersDoc, showCustomAlert);
    // Load menu items for the active category
    loadCategoryItems(window.activeCategory);

    // Initialize stocktake system
    if (window.stocktakeSystem) {
        window.stocktakeSystem.loadStocktake();
    }
    // Initialize analysis system
    if (window.renderAnalysisTab) {
        window.renderAnalysisTab();
    }
    
    // Initialize payment modal keypad logic LAST, after everything else is ready
    initPaymentModal({
        processPayment: async () => await processPayment(
            window.currentOrder,
            moveCurrentOrderToCompleted,
            () => clearCurrentOrder(getDailyOrdersDoc),
            (...args) => initializeOrder(generateOrderNumber, showCustomAlert, ...args),
            displayOrderLog,
            window.activeCategory,
            showCustomAlert
        ),
        processPayLater: async () => await processPayLater(
            window.currentOrder,
            moveCurrentOrderToCompleted,
            () => clearCurrentOrder(getDailyOrdersDoc),
            (...args) => initializeOrder(generateOrderNumber, showCustomAlert, ...args),
            displayOrderLog,
            window.activeCategory,
            showCustomAlert
        ),
        updatePaymentModal,
        showCustomAlert
    });
});

// Helper for loading menu items by category
function loadCategoryItems(category) {
    const t = (window.t || ((k) => k));
    const itemsGrid = document.querySelector('.items-grid');
    const orderLogContainer = document.querySelector('.order-log-container');
    const settingsContainer = document.querySelector('.settings-container');
    const stocktakeContainer = document.querySelector('.stocktake-container');
    const analysisContainer = document.querySelector('.analysis-container');
    const orderPanel = document.querySelector('.order-panel');
    const signInContainer = document.querySelector('.sign-in-container');
    
    // Update category tab text to reflect current language
    const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
    if (categoryTab) {
        categoryTab.textContent = getCategoryDisplayName(category);
    }
    // Remove existing containers if they exist
    if (orderLogContainer) orderLogContainer.remove();
    if (settingsContainer) settingsContainer.remove();
    if (stocktakeContainer) stocktakeContainer.remove();
    itemsGrid.innerHTML = '';
            if (category === 'Order Log') {
            itemsGrid.style.display = 'none';
            orderPanel.style.display = 'none';
            analysisContainer.style.display = 'none';
            signInContainer.style.display = 'none';
            const newOrderLogContainer = document.createElement('div');
            newOrderLogContainer.className = 'order-log-container active';
            document.querySelector('.menu-panel').appendChild(newOrderLogContainer);
            displayOrderLog(newOrderLogContainer, getDisplayName, translate, updateOrderInDaily, getOrderByNumber, showCustomAlert);
            return;
        }
    if (category === 'Settings') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        signInContainer.style.display = 'none';
        const newSettingsContainer = document.createElement('div');
        newSettingsContainer.className = 'settings-container active';
        document.querySelector('.menu-panel').appendChild(newSettingsContainer);
        displaySettings(newSettingsContainer);
        return;
    }
    if (category === 'Analysis') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'block';
        signInContainer.style.display = 'none';
        if (window.renderAnalysisTab) window.renderAnalysisTab();
        return;
    }
    if (category === 'Stocktake') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        signInContainer.style.display = 'none';
        const existingStocktakeContainer = document.querySelector('.stocktake-container');
        if (existingStocktakeContainer) existingStocktakeContainer.remove();
        const newStocktakeContainer = document.createElement('div');
        newStocktakeContainer.className = 'stocktake-container active';
        document.querySelector('.menu-panel').appendChild(newStocktakeContainer);
        if (window.stocktakeSystem) window.stocktakeSystem.renderStocktake(newStocktakeContainer);
        return;
    }
    if (category === 'Task Manager') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        signInContainer && (signInContainer.style.display = 'none');
        // Show the task manager container
        const taskManagerContainer = document.getElementById('task-manager-container');
        if (taskManagerContainer) taskManagerContainer.style.display = 'block';
        return;
    }
    if (category === 'employee') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        const signInContainer = document.querySelector('.sign-in-container');
        if (signInContainer) signInContainer.style.display = 'flex';
        return;
    }
    itemsGrid.style.display = 'grid';
    orderPanel.style.display = 'flex';
    analysisContainer.style.display = 'none';
    signInContainer.style.display = 'none';
    if (category === 'Drinks' || category === 'Food') {
        loadMenuItems(category, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, window.showDiscountModal);
    }
} 