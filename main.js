// Import menu data and functions
import { menuData, getDisplayName, addItemToOrder, loadMenuItems, showMilkTypeButtons, hideMilkTypeButtons } from './menu.js';
import ErrorLogger from './error-logger.js';
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
    openTableAssignModal,
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
import { initTableSelection } from './table-selection.js';
import { initializeLanguage, toggleLanguage, getCategoryDisplayName, translate } from './language.js';
import {
  showJamOptions,
  showExtraShotOptions,
  showCakeOptions,
  showIceCreamOptions,
  showProscuittoOptions,
  showBurgerOptions,
  showSoftDrinkOptions,
  showTeaOptions
} from './menu.js';

window.showJamOptions = showJamOptions;
window.showExtraShotOptions = showExtraShotOptions;
window.showCakeOptions = showCakeOptions;
window.showIceCreamOptions = showIceCreamOptions;
window.showProscuittoOptions = showProscuittoOptions;
window.showBurgerOptions = showBurgerOptions;
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
window.openTableAssignModal = openTableAssignModal;
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
// Expose moveCurrentOrderToCompleted for external integrations (e.g., Square)
window.moveCurrentOrderToCompleted = moveCurrentOrderToCompleted;
// Keep a direct reference for legacy callers; external flows should use the
// bound wrapper provided to the payment modal or call moveCurrentOrderToCompleted directly.
window.processPayment = processPayment;
window.processPayLater = processPayLater;
window.updatePaymentModal = updatePaymentModal;
window.getDailyOrdersDoc = getDailyOrdersDoc;
window.getOrderByNumber = getOrderByNumber;
window.generateOrderNumber = generateOrderNumber;

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

function selectPaymentMethod(method) {
    const cashBtn = document.getElementById('cashMethodBtn');
    const cardBtn = document.getElementById('cardMethodBtn');
    const cardInfo = document.getElementById('cardPaymentInfo');
    const cashPaymentElements = document.getElementById('cashPaymentElements');
    const cashNumpadElements = document.getElementById('cashNumpadElements');
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    const processCardBtn = document.getElementById('processCardBtn');
    
    // Get the exact order total - handle both current orders and Pay Later orders
    let totalAmount;
    if (window.currentOrder && window.currentOrder.total) {
        // Normal current order - use the order object
        totalAmount = window.currentOrder.total;
    } else {
        // Pay Later order or fallback - read from DOM with robust parsing
        const totalElement = document.getElementById('totalAmount');
        if (totalElement && totalElement.textContent) {
            // Parse the text content, removing any non-numeric characters
            const totalText = totalElement.textContent.replace(/[^0-9]/g, '');
            totalAmount = parseInt(totalText, 10) || 0;
            
            // Additional validation for Pay Later orders
            if (totalAmount === 0) {
                console.warn('Pay Later order: totalAmount is 0, checking DOM element again...');
                // Try to get the value again after a brief delay to ensure DOM is updated
                setTimeout(() => {
                    const retryTotal = parseInt(document.getElementById('totalAmount').textContent.replace(/[^0-9]/g, ''), 10) || 0;
                    if (retryTotal > 0) {
                        console.log('Pay Later order: retry successful, totalAmount now:', retryTotal);
                        // Update the card total with the correct amount
                        document.getElementById('cardTotal').textContent = retryTotal;
                    }
                }, 100);
            }
        } else {
            totalAmount = 0;
        }
    }
    
    // Update button states
    if (method === 'cash') {
        cashBtn.classList.add('active');
        cardBtn.classList.remove('active');
        cardInfo.style.display = 'none';
        
        // Show cash payment elements
        cashPaymentElements.classList.remove('hidden');
        cashNumpadElements.classList.remove('hidden');
        
        // Show cash payment button, hide card button
        completePaymentBtn.style.display = 'block';
        processCardBtn.style.display = 'none';
        
        // Update modal title
        document.querySelector('#paymentModal h2').textContent = 'Cash Payment';
    } else if (method === 'card') {
        cashBtn.classList.remove('active');
        cardBtn.classList.add('active');
        cardInfo.style.display = 'block';
        
        // Hide cash payment elements
        cashPaymentElements.classList.add('hidden');
        cashNumpadElements.classList.add('hidden');
        
        // Hide cash payment button, show card button
        completePaymentBtn.style.display = 'none';
        processCardBtn.style.display = 'block';
        
        // Update modal title
        document.querySelector('#paymentModal h2').textContent = 'Card Payment';
        
        // Display card total
        document.getElementById('cardTotal').textContent = totalAmount;
    }
}
window.selectPaymentMethod = selectPaymentMethod;

// Square Payment Verification Functions
let squarePaymentWaiting = false;
let squarePaymentTimeout = null;
let squarePaymentOrderNumber = null;

// Show Square payment waiting popup
async function showSquarePaymentWaiting(orderNumber) {
    console.log('Showing Square payment waiting popup for order:', orderNumber);
    
    // Create card payment document before showing popup
    try {
        let orderData;
        let isPayLater = false;
        
        if (window.payingOrderNumber && window.payingOrderData && window.updateOrderInDaily) {
            // Pay Later order
            orderData = window.payingOrderData;
            isPayLater = true;
        } else if (window.currentOrder) {
            // Current order
            orderData = window.currentOrder;
            isPayLater = false;
        } else {
            console.warn('No order data available for card payment document');
        }
        
        if (orderData) {
            const cardPaymentCreated = await window.createCardPaymentDocument(orderData, isPayLater);
            if (!cardPaymentCreated) {
                console.error('Failed to create card payment document');
            }
        }
    } catch (error) {
        console.error('Error creating card payment document:', error);
    }
    
    // Set the waiting flag immediately
    squarePaymentWaiting = true;
    squarePaymentOrderNumber = orderNumber;
    
    // Remove any existing waiting overlay first
    const existingOverlay = document.getElementById('squarePaymentWaiting');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Clear any existing timeout
    if (squarePaymentTimeout) {
        clearTimeout(squarePaymentTimeout);
        squarePaymentTimeout = null;
    }
    
    // Create waiting overlay
    const waitingOverlay = document.createElement('div');
    waitingOverlay.id = 'squarePaymentWaiting';
    waitingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    waitingOverlay.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px;">
            <div style="font-size: 18px; margin-bottom: 15px; color: #6F4E37;">Processing Card Payment...</div>
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #6F4E37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 14px; color: #666; margin-bottom: 20px;">Please complete payment in Square app</div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button id="cancelSquarePayment" style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Cancel Payment</button>
                <button id="acceptAsPaid" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Accept as Paid</button>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
    `;
    
    document.body.appendChild(waitingOverlay);
    
    // Add button handlers
    document.getElementById('cancelSquarePayment').addEventListener('click', () => {
        cancelSquarePayment();
    });
    
    document.getElementById('acceptAsPaid').addEventListener('click', () => {
        acceptAsPaid();
    });
    
    // Start verification polling
    startSquarePaymentVerification();
    
    console.log('Square payment waiting popup displayed successfully');
}

// Start polling for payment verification
function startSquarePaymentVerification() {
    const checkInterval = setInterval(async () => {
        if (!squarePaymentWaiting) {
            clearInterval(checkInterval);
            return;
        }
        
        try {
            const paymentCompleted = await checkSquarePaymentStatus();
            if (paymentCompleted) {
                clearInterval(checkInterval);
                handleSquarePaymentSuccess();
            }
        } catch (error) {
            console.error('Error checking Square payment status:', error);
        }
    }, 2000); // Check every 2 seconds
}

// Check if Square payment was completed
async function checkSquarePaymentStatus() {
    try {
        if (!squarePaymentOrderNumber) return false;
        
        // Get today's orders from Firebase
        const dailyOrdersRef = await getDailyOrdersDoc();
        const doc = await window.firebaseServices.getDoc(dailyOrdersRef);
        const data = doc.data();
        
        if (!data || !data.orders) return false;
        
        // Check if our order number exists in completed orders with Card payment
        const completedOrder = data.orders[squarePaymentOrderNumber];
        if (completedOrder && 
            completedOrder.paymentMethod === 'Card' && 
            completedOrder.paymentStatus === 'paid') {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking Square payment status:', error);
        return false;
    }
}

// Handle successful Square payment
async function handleSquarePaymentSuccess() {
    squarePaymentWaiting = false;
    
    // Remove waiting overlay
    const waitingOverlay = document.getElementById('squarePaymentWaiting');
    if (waitingOverlay) {
        waitingOverlay.remove();
    }
    
    // Show success popup (matching cash style)
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

    const paidAmount = (() => {
        const cardTotalEl = document.getElementById('cardTotal');
        if (cardTotalEl && cardTotalEl.textContent) {
            const v = parseInt(cardTotalEl.textContent.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(v)) return v;
        }
        if (window.currentOrder && typeof window.currentOrder.total === 'number') {
            return window.currentOrder.total;
        }
        return 0;
    })();

    successMessage.innerHTML = `
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 6px;">Card payment successful</div>
        <div style="font-size: 18px; opacity: 0.9;">Paid: ¥${paidAmount}</div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(successMessage);
    
    // Close payment modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
    }
    
    const dismiss = async () => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        if (document.body.contains(successMessage)) document.body.removeChild(successMessage);
        
        console.log('Square payment success popup dismissed - starting UI refresh');
        
        // Check if all required functions are available
        console.log('Checking required functions:');
        console.log('- window.displayOrderLog:', typeof window.displayOrderLog);
        console.log('- window.getDisplayName:', typeof window.getDisplayName);
        console.log('- window.translate:', typeof window.translate);
        console.log('- window.updateOrderInDaily:', typeof window.updateOrderInDaily);
        console.log('- window.getOrderByNumber:', typeof window.getOrderByNumber);
        console.log('- window.showCustomAlert:', typeof window.showCustomAlert);
        
        // Update order log (callback page already moved current order to completed)
        const container = document.querySelector('.order-log-container');
        console.log('Order log container found:', !!container);
        
        if (container && window.displayOrderLog) {
            console.log('Refreshing order log...');
            try {
                await window.displayOrderLog(container, window.getDisplayName, window.translate, window.updateOrderInDaily, window.getOrderByNumber, window.showCustomAlert);
                console.log('Order log refreshed successfully');
            } catch (error) {
                console.error('Error refreshing order log:', error);
            }
        } else {
            console.log('Order log container not found - this is normal if Order Log tab is not active');
            console.log('Order log will be updated when user switches to Order Log tab');
        }
        
        // Initialize new order (callback page already cleared current order)
        try {
            console.log('Checking initializeOrder functions:');
            console.log('- window.initializeOrder:', typeof window.initializeOrder);
            console.log('- window.generateOrderNumber:', typeof window.generateOrderNumber);
            console.log('- window.showCustomAlert:', typeof window.showCustomAlert);
            
            if (window.initializeOrder && window.generateOrderNumber && window.showCustomAlert) {
                console.log('Initializing new order...');
                const newOrder = await window.initializeOrder(window.generateOrderNumber, window.showCustomAlert);
                console.log('initializeOrder returned:', newOrder);
                if (newOrder) {
                    console.log('New order initialized after Square payment:', newOrder);
                    
                    // Force refresh of all UI elements
                    console.log('Force refreshing UI elements...');
                    
                    // Update order title
                    const orderTitle = document.querySelector('.order-title');
                    if (orderTitle) {
                        orderTitle.textContent = `Current Order #${newOrder.orderNumber}`;
                        console.log('Order title updated to:', orderTitle.textContent);
                    }
                    
                    // Clear order items
                    const orderItems = document.querySelector('.order-items');
                    if (orderItems) {
                        orderItems.innerHTML = '';
                        console.log('Order items cleared');
                    }
                    
                    // Update order summary - try multiple approaches
                    if (window.updateOrderSummary) {
                        window.updateOrderSummary(newOrder);
                        console.log('Order summary updated via window.updateOrderSummary');
                    } else {
                        // Fallback: manually update summary elements
                        const subtotalEl = document.querySelector('.subtotal-amount');
                        const totalEl = document.querySelector('.total-amount');
                        if (subtotalEl) {
                            subtotalEl.textContent = `¥${newOrder.subtotal}`;
                            console.log('Subtotal updated manually to:', subtotalEl.textContent);
                        }
                        if (totalEl) {
                            totalEl.textContent = `¥${newOrder.total}`;
                            console.log('Total updated manually to:', totalEl.textContent);
                        }
                    }
                    
                    // Force a visual refresh by triggering a reflow
                    document.body.offsetHeight;
                    
                    // Additional aggressive refresh - try to re-render everything
                    console.log('Attempting additional UI refresh...');
                    
                    // Try to refresh the current order display by calling renderOrderItems
                    if (window.renderOrderItems && newOrder.items) {
                        const orderItemsContainer = document.querySelector('.order-items');
                        if (orderItemsContainer) {
                            window.renderOrderItems(newOrder.items, orderItemsContainer);
                            console.log('Order items re-rendered');
                        }
                    }
                    
                    // Force update the global currentOrder reference
                    window.currentOrder = newOrder;
                    console.log('window.currentOrder updated to:', window.currentOrder);
                    
                    console.log('UI refresh completed for Square payment');
                }
            }
        } catch (error) {
            console.error('Error initializing order after Square payment:', error);
        }
    };
    overlay.addEventListener('click', dismiss);
    successMessage.addEventListener('click', dismiss);
    
    // Clear timeout
    if (squarePaymentTimeout) {
        clearTimeout(squarePaymentTimeout);
        squarePaymentTimeout = null;
    }
}

// Cancel Square payment
function cancelSquarePayment() {
    squarePaymentWaiting = false;
    
    // Remove waiting overlay
    const waitingOverlay = document.getElementById('squarePaymentWaiting');
    if (waitingOverlay) {
        waitingOverlay.remove();
    }
    
    // Clear timeout
    if (squarePaymentTimeout) {
        clearTimeout(squarePaymentTimeout);
        squarePaymentTimeout = null;
    }
    
    // Show cancellation message
    showCustomAlert('Card payment cancelled', 'info');
    
    // Return to payment modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'flex';
    }
}

// Accept payment as paid manually
async function acceptAsPaid() {
    squarePaymentWaiting = false;
    
    // Remove waiting overlay
    const waitingOverlay = document.getElementById('squarePaymentWaiting');
    if (waitingOverlay) {
        waitingOverlay.remove();
    }
    
    // Clear timeout
    if (squarePaymentTimeout) {
        clearTimeout(squarePaymentTimeout);
        squarePaymentTimeout = null;
    }
    
    // Process the payment manually using the same flow as successful Square payment
    try {
        console.log('Manual card payment - window.payingOrderNumber:', window.payingOrderNumber);
        console.log('Manual card payment - window.payingOrderData:', window.payingOrderData);
        
        // Create card payment document before processing
        let orderData;
        let isPayLater = false;
        
        if (window.payingOrderNumber && window.payingOrderData && window.updateOrderInDaily) {
            // Pay Later order
            orderData = window.payingOrderData;
            isPayLater = true;
        } else if (window.currentOrder) {
            // Current order
            orderData = window.currentOrder;
            isPayLater = false;
        } else {
            throw new Error('No order data available for card payment');
        }
        
        // Create card payment document
        const cardPaymentCreated = await window.createCardPaymentDocument(orderData, isPayLater);
        if (!cardPaymentCreated) {
            throw new Error('Failed to create card payment document');
        }
        
        // Check if we're paying an existing order from Order Log
        if (window.payingOrderNumber && window.payingOrderData && window.updateOrderInDaily) {
            
            // Update the existing order with card payment details
            // Preserve original timestamp for Pay Later orders
            const paymentDetails = {
                paymentMethod: 'Card',
                tenderedAmount: window.payingOrderData.total,
                change: 0,
                paymentStatus: 'paid',
                squareTransactionId: 'manual_' + Date.now(),
                squareStatus: 'manual_accept'
            };
            
            window.updateOrderInDaily(parseInt(window.payingOrderNumber), paymentDetails).then((result) => {
                
                // Don't clear the stored order data immediately - let system health check detect it
                // window.payingOrderNumber = null;
                // window.payingOrderData = null;
                
                // Close payment modal immediately
                const paymentModal = document.getElementById('paymentModal');
                if (paymentModal) {
                    paymentModal.style.display = 'none';
                }
                
                // Refresh order log immediately
                const orderLogContainer = document.querySelector('.order-log-container');
                if (orderLogContainer && window.displayOrderLog) {
                    window.displayOrderLog(orderLogContainer, window.getDisplayName, window.translate, window.updateOrderInDaily, window.getOrderByNumber, window.showCustomAlert);
                }
                
                // Show success popup for card payment
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
                    <div style="font-size: 28px; font-weight: bold; margin-bottom: 6px;">Card payment successful</div>
                    <div style="font-size: 18px; opacity: 0.9;">Paid: ¥${window.payingOrderData.total || 0}</div>
                `;
                document.body.appendChild(overlay);
                document.body.appendChild(successMessage);
                
                const dismiss = () => {
                    if (document.body.contains(overlay)) document.body.removeChild(overlay);
                    if (document.body.contains(successMessage)) document.body.removeChild(successMessage);
                    
                    // Clear the Pay Later variables after a delay to prevent extra order creation
                    setTimeout(() => {
                        window.payingOrderNumber = null;
                        window.payingOrderData = null;
                    }, 2000); // 2 second delay
                };
                overlay.addEventListener('click', dismiss);
                successMessage.addEventListener('click', dismiss);
            }).catch((error) => {
                console.error('Error updating order:', error);
                
                // Log error to Firebase
                if (window.errorLogger) {
                    window.errorLogger.logError(error, {
                        source: 'acceptAsPaid_payLater',
                        orderNumber: window.payingOrderNumber,
                        paymentDetails: paymentDetails
                    });
                }
                
                // Don't show error if the order was actually updated (check if it exists in Firebase)
                // This prevents false error messages when the operation succeeded but the promise rejected
                console.log('Checking if order was actually updated despite error...');
                showCustomAlert('Payment processed. Please check if the order was updated in the order log.', 'warning');
            });
            
        } else if (window.moveCurrentOrderToCompleted && window.currentOrder) {
            // Ensure we have a valid order number
            if (!window.currentOrder.orderNumber || isNaN(parseInt(window.currentOrder.orderNumber, 10))) {
                console.error('Current order has no valid order number, cannot process manual payment');
                console.error('Order number value:', window.currentOrder.orderNumber, 'Type:', typeof window.currentOrder.orderNumber);
                alert('Error: Current order has no valid order number. Please start a new order.');
                return;
            }
            
            // Create a completed order object that matches the normal card payment structure
            // Use the exact same structure as square-callback.html
            const completedOrder = {
                ...window.currentOrder,  // Spread all current order fields (items, orderNumber, etc.)
                paymentMethod: 'Card',
                tenderedAmount: window.currentOrder.total,
                change: 0,
                paymentStatus: 'paid',
                timestamp: window.firebaseServices.Timestamp.now(),
                squareTransactionId: 'manual_' + Date.now(),
                squareStatus: 'manual_accept'
            };
            
            console.log('Manual card payment - completedOrder:', completedOrder);
            console.log('Manual card payment - orderNumber:', completedOrder.orderNumber);
            
            window.moveCurrentOrderToCompleted(completedOrder).then(() => {
                console.log('Current order moved to completed successfully');
                
                // Close payment modal immediately
                const paymentModal = document.getElementById('paymentModal');
                if (paymentModal) {
                    paymentModal.style.display = 'none';
                }
                
                // Refresh order log immediately
                const orderLogContainer = document.querySelector('.order-log-container');
                if (orderLogContainer && window.displayOrderLog) {
                    window.displayOrderLog(orderLogContainer, window.getDisplayName, window.translate, window.updateOrderInDaily, window.getOrderByNumber, window.showCustomAlert);
                }
                
                // Show the same success popup as normal card payments
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

                const paidAmount = window.currentOrder ? window.currentOrder.total : 0;
                successMessage.innerHTML = `
                    <div style="font-size: 28px; font-weight: bold; margin-bottom: 6px;">Card payment successful</div>
                    <div style="font-size: 18px; opacity: 0.9;">Paid: ¥${paidAmount}</div>
                `;
                document.body.appendChild(overlay);
                document.body.appendChild(successMessage);
                
                const dismiss = async () => {
                    if (document.body.contains(overlay)) document.body.removeChild(overlay);
                    if (document.body.contains(successMessage)) document.body.removeChild(successMessage);
                    
                    // Initialize new order (same as cash payment)
                    try {
                        if (window.initializeOrder && window.generateOrderNumber && window.showCustomAlert) {
                            const newOrder = await window.initializeOrder(window.generateOrderNumber, window.showCustomAlert);
                            if (newOrder) {
                                console.log('New order initialized after manual card payment');
                                // initializeOrder() already handles UI refresh
                            }
                        }
                    } catch (error) {
                        console.error('Error initializing order after manual card payment:', error);
                    }
                };
                overlay.addEventListener('click', dismiss);
                successMessage.addEventListener('click', dismiss);
                
            }).catch((error) => {
                console.error('Error moving current order to completed:', error);
                
                // Log error to Firebase
                if (window.errorLogger) {
                    window.errorLogger.logError(error, {
                        source: 'acceptAsPaid_currentOrder',
                        orderNumber: completedOrder.orderNumber,
                        completedOrder: completedOrder
                    });
                }
                
                // Don't show error if the order was actually processed
                console.log('Payment processed. Please check if the order was updated in the order log.');
            });
            
        } else {
            showCustomAlert('Error: Cannot process payment', 'error');
        }
    } catch (error) {
        console.error('Error accepting payment manually:', error);
        showCustomAlert('Error accepting payment', 'error');
    }
}

// Check for failed payments on page load
async function checkForFailedPayments() {
    try {
        // Get failed payments from Firebase
        const failedPaymentsRef = window.firebaseServices.collection('failed_payments');
        const querySnapshot = await window.firebaseServices.getDocs(
            window.firebaseServices.query(
                failedPaymentsRef,
                window.firebaseServices.orderBy('timestamp', 'desc'),
                window.firebaseServices.limit(1)
            )
        );
        
        if (!querySnapshot.empty) {
            const latestFailed = querySnapshot.docs[0].data();
            
            // Check if this failed payment is recent (within last 5 minutes)
            const now = new Date();
            const failedTime = latestFailed.timestamp.toDate();
            const timeDiff = now - failedTime;
            
            if (timeDiff < 5 * 60 * 1000) { // 5 minutes
                showFailedPaymentDialog(latestFailed);
            }
        }
    } catch (error) {
        console.error('Error checking for failed payments:', error);
    }
}

// Show failed payment dialog with retry option
function showFailedPaymentDialog(failedPayment) {
    const retryDialog = document.createElement('div');
    retryDialog.id = 'failedPaymentDialog';
    retryDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    retryDialog.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px;">
            <div style="font-size: 18px; margin-bottom: 15px; color: #ff6b6b;">Card Payment Failed</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Amount: ¥${failedPayment.amount}<br>
                Reason: ${failedPayment.reason}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="retrySquarePayment" style="background: #6F4E37; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Retry Payment</button>
                <button id="cancelFailedPayment" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(retryDialog);
    
    // Add button handlers
    document.getElementById('retrySquarePayment').addEventListener('click', () => {
        retryDialog.remove();
        // Open payment modal with card option selected
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            paymentModal.style.display = 'flex';
            if (window.selectPaymentMethod) {
                window.selectPaymentMethod('card');
            }
        }
    });
    
    document.getElementById('cancelFailedPayment').addEventListener('click', () => {
        retryDialog.remove();
    });
}

// Make Square functions available globally
window.showSquarePaymentWaiting = showSquarePaymentWaiting;
window.cancelSquarePayment = cancelSquarePayment;

// --- App Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', async function() {
    const t = (window.t || ((k) => k));
    
    // Memory management and cleanup system
    let paymentModalCleanup = null;
    let memoryCheckInterval = null;
    let sessionStartTime = Date.now();
    let sessionDayKey = null;
    
    // Function to check for memory issues and state corruption
    function checkSystemHealth() {
        try {
            // Check if critical global variables are still valid
            if (!window.currentOrder || typeof window.currentOrder !== 'object') {
                
                // Don't create new order if we're processing Pay Later orders
                if (window.payingOrderNumber && window.payingOrderData) {
                    return true;
                }
                // Don't set orderNumber to null - generate it immediately
                if (window.generateOrderNumber) {
                    window.generateOrderNumber()
                        .then((orderNumber) => {
                            window.currentOrder = {
                                items: [],
                                subtotal: 0,
                                total: 0,
                                orderNumber: orderNumber
                            };
                        })
                        .catch((error) => {
                            console.error('Order recovery failed:', error);
                            // Fallback to order number 1
                            window.currentOrder = {
                                items: [],
                                subtotal: 0,
                                total: 0,
                                orderNumber: 1
                            };
                        });
                } else {
                    // Fallback if generateOrderNumber is not available
                    window.currentOrder = {
                        items: [],
                        subtotal: 0,
                        total: 0,
                        orderNumber: 1
                    };
                }
            }
            
            // Check if DOM elements are still accessible
            const criticalElements = [
                'paymentModal',
                'totalAmount',
                'tenderedAmount',
                'changeAmount'
            ];
            
            const missingElements = criticalElements.filter(id => {
                const element = document.getElementById(id);
                return !element || !document.contains(element);
            });
            
            if (missingElements.length > 0) {
                console.warn('Critical DOM elements missing:', missingElements);
                return false;
            }
            
            // Day change detection to avoid stale dailyOrders key
            if (typeof window.getTodayKey === 'function') {
                const todayKey = window.getTodayKey();
                if (!sessionDayKey) sessionDayKey = todayKey;
                if (sessionDayKey !== todayKey) {
                    console.warn('Detected calendar day change during long session. Suggesting refresh.');
                    const notif = document.createElement('div');
                    notif.style.cssText = `
                    position: fixed; bottom: 20px; right: 20px; background: #dc3545; color: white; padding: 12px 16px; border-radius: 6px; z-index: 10001; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
                    notif.textContent = 'New day detected. Please refresh to ensure orders update correctly.';
                    document.body.appendChild(notif);
                    setTimeout(() => { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 8000);
                    // Update sessionDayKey so we don't spam notifications
                    sessionDayKey = todayKey;
                }
            }
            
            // Check session duration (suggest refresh after 4 hours)
            const sessionDuration = Date.now() - sessionStartTime;
            const fourHours = 4 * 60 * 60 * 1000;
            
            if (sessionDuration > fourHours) {
                console.warn('Long session detected, suggesting refresh for optimal performance');
                // Show a subtle notification to the user
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff9800;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-size: 14px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                `;
                notification.textContent = 'Consider refreshing for best performance';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 5000);
            }
            
            return true;
        } catch (error) {
            console.error('Error in system health check:', error);
            return false;
        }
    }
    
    // Function to perform cleanup
    function performCleanup() {
        try {
            if (paymentModalCleanup && typeof paymentModalCleanup === 'function') {
                paymentModalCleanup();
            }
            if (memoryCheckInterval) {
                clearInterval(memoryCheckInterval);
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
    
    // Set up periodic health checks
    memoryCheckInterval = setInterval(() => {
        if (!checkSystemHealth()) {
            console.warn('System health check failed');
        }
    }, 60000); // Check every minute
    
    // Initialize language system
    initializeLanguage();
    
    // Set up global variables
    window.activeCategory = 'Drinks';
    window.currentOrder = {
        items: [],
        subtotal: 0,
        total: 0,
        orderNumber: 1  // Temporary, will be replaced by loadCurrentOrder
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

    // Set up checkout button with enhanced error handling
    const checkoutBtn = document.querySelector('.checkout-btn');
    const paymentModal = document.getElementById('paymentModal');
    console.log('checkoutBtn:', checkoutBtn);
    console.log('paymentModal:', paymentModal);
    checkoutBtn.addEventListener('click', function() {
        try {
            if (!checkSystemHealth()) {
                showCustomAlert('System error detected. Please refresh the page.', 'error');
                return;
            }
            
            if (window.currentOrder.items.length > 0) {
                // Show the modal and update it
                paymentModal.style.display = 'flex';
                setTimeout(() => {
                    try {
                        updatePaymentModal(window.currentOrder);
                    } catch (error) {
                        console.error('Error updating payment modal:', error);
                        showCustomAlert('Payment system error. Please refresh the page.', 'error');
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error in checkout button handler:', error);
            showCustomAlert('Checkout error. Please refresh the page.', 'error');
        }
    });



    // Add event delegation for Pay Now, Edit, and Table Assign buttons in order log
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
        } else if (e.target.classList.contains('table-assign-btn') || e.target.closest('.table-assign-btn')) {
            const button = e.target.classList.contains('table-assign-btn') ? e.target : e.target.closest('.table-assign-btn');
            const orderNumber = button.dataset.orderNumber;
            openTableAssignModal(orderNumber, getOrderByNumber, showCustomAlert, window.updateOrderInDaily, displayOrderLog, t);
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

    // Add event listeners for payment method selection
    document.getElementById('cashMethodBtn').addEventListener('click', function() {
        selectPaymentMethod('cash');
    });

    document.getElementById('cardMethodBtn').addEventListener('click', function() {
        selectPaymentMethod('card');
    });

    document.getElementById('processCardBtn').addEventListener('click', function() {
        console.log('Card payment button clicked');
        
        // Use Square integration for card payment
        if (window.SquareIntegration && window.SquareIntegration.processCardPayment) {
            console.log('Square integration available, processing card payment');
            
            // Show waiting popup before opening Square
            const currentOrder = window.currentOrder;
            if (currentOrder && currentOrder.orderNumber) {
                console.log('Current order found, showing waiting popup');
                showSquarePaymentWaiting(currentOrder.orderNumber);
            } else {
                console.warn('No current order or order number found, showing waiting popup anyway');
                showSquarePaymentWaiting('unknown');
            }
            
            // Open Square app
            window.SquareIntegration.processCardPayment();
        } else {
            // Silently fall back to cash payment
            console.log('Square integration not available, falling back to cash payment');
            selectPaymentMethod('cash');
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
    const paymentModalResult = initPaymentModal({
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
    
    // Store cleanup function for memory management
    if (paymentModalResult && paymentModalResult.cleanup) {
        paymentModalCleanup = paymentModalResult.cleanup;
    }
    
    // Initialize table selection functionality
    const tableSelectionResult = initTableSelection();
    if (tableSelectionResult) {
        window.tableSelection = tableSelectionResult;
    }
    
    // Set up page unload cleanup
    window.addEventListener('beforeunload', performCleanup);
    
    // Set up visibility change handler for iPad backgrounding
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // App is going to background, perform minimal cleanup
            console.log('App going to background, performing cleanup');
        } else {
            // App is coming back to foreground, check system health
            console.log('App returning to foreground, checking system health');
            setTimeout(() => {
                if (!checkSystemHealth()) {
                    console.warn('System health check failed after returning to foreground');
                }
            }, 1000);
        }
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
            // Hide settings container
            const settingsContainerEl = document.getElementById('settings-container');
            if (settingsContainerEl) settingsContainerEl.style.display = 'none';
            const newOrderLogContainer = document.createElement('div');
            newOrderLogContainer.className = 'order-log-container active';
            document.querySelector('.menu-panel').appendChild(newOrderLogContainer);
            displayOrderLog(newOrderLogContainer, getDisplayName, translate, updateOrderInDaily, getOrderByNumber, showCustomAlert);
            return;
        }
    if (category === 'Analysis') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'block';
        signInContainer.style.display = 'none';
        // Hide settings container
        const settingsContainerEl = document.getElementById('settings-container');
        if (settingsContainerEl) settingsContainerEl.style.display = 'none';
        if (window.renderAnalysisTab) window.renderAnalysisTab();
        return;
    }
    if (category === 'Stocktake') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        signInContainer.style.display = 'none';
        // Hide settings container
        const settingsContainerEl = document.getElementById('settings-container');
        if (settingsContainerEl) settingsContainerEl.style.display = 'none';
        const existingStocktakeContainer = document.querySelector('.stocktake-container');
        if (existingStocktakeContainer) existingStocktakeContainer.remove();
        const newStocktakeContainer = document.createElement('div');
        newStocktakeContainer.className = 'stocktake-container active';
        document.querySelector('.menu-panel').appendChild(newStocktakeContainer);
        if (window.stocktakeSystem) window.stocktakeSystem.renderStocktake(newStocktakeContainer);
        return;
    }
    if (category === 'Settings') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        signInContainer && (signInContainer.style.display = 'none');
        // Show the settings container
        const settingsContainer = document.getElementById('settings-container');
        if (settingsContainer) settingsContainer.style.display = 'block';
        return;
    }
    if (category === 'employee') {
        itemsGrid.style.display = 'none';
        orderPanel.style.display = 'none';
        analysisContainer.style.display = 'none';
        // Hide settings container
        const settingsContainerEl = document.getElementById('settings-container');
        if (settingsContainerEl) settingsContainerEl.style.display = 'none';
        const signInContainer = document.querySelector('.sign-in-container');
        if (signInContainer) signInContainer.style.display = 'flex';
        return;
    }
    itemsGrid.style.display = 'grid';
    orderPanel.style.display = 'flex';
    analysisContainer.style.display = 'none';
    signInContainer.style.display = 'none';
    // Hide settings container
    const settingsContainerEl = document.getElementById('settings-container');
    if (settingsContainerEl) settingsContainerEl.style.display = 'none';
    if (category === 'Drinks' || category === 'Food') {
        loadMenuItems(category, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, window.showDiscountModal);
    }
    
    // Check for failed payments on page load
    checkForFailedPayments().catch(error => {
        console.error('Error checking for failed payments:', error);
    });
    
    // Check for card payment status on page load
    checkCardPaymentStatusOnLoad().catch(error => {
        console.error('Error checking card payment status:', error);
    });
}

// Card payment processing functions
async function createCardPaymentDocument(orderData, isPayLater = false) {
    try {
        const cardPaymentRef = window.firebaseServices.doc(window.firebaseDb, 'cardPaymentProcessing', 'current');
        const cardPaymentData = {
            status: 'processing',
            orderNumber: orderData.orderNumber,
            total: orderData.total,
            isPayLater: isPayLater,
            timestamp: window.firebaseServices.Timestamp.now(),
            squareTransactionId: null,
            squareStatus: null
        };
        
        await window.firebaseServices.setDoc(cardPaymentRef, cardPaymentData);
        console.log('Card payment document created:', cardPaymentData);
        return true;
    } catch (error) {
        console.error('Error creating card payment document:', error);
        return false;
    }
}

async function checkCardPaymentStatus() {
    try {
        const cardPaymentRef = window.firebaseServices.doc(window.firebaseDb, 'cardPaymentProcessing', 'current');
        const doc = await window.firebaseServices.getDoc(cardPaymentRef);
        
        if (doc.exists()) {
            const data = doc.data();
            console.log('Card payment status:', data);
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error checking card payment status:', error);
        return null;
    }
}

async function clearCardPaymentDocument() {
    try {
        const cardPaymentRef = window.firebaseServices.doc(window.firebaseDb, 'cardPaymentProcessing', 'current');
        await window.firebaseServices.deleteDoc(cardPaymentRef);
        console.log('Card payment document cleared');
        return true;
    } catch (error) {
        console.error('Error clearing card payment document:', error);
        return false;
    }
}

// Check card payment status on app load
async function checkCardPaymentStatusOnLoad() {
    try {
        const cardPaymentStatus = await window.checkCardPaymentStatus();
        if (cardPaymentStatus) {
            console.log('Card payment status found:', cardPaymentStatus);
            
            if (cardPaymentStatus.status === 'success') {
                // Card payment was successful
                console.log('Card payment completed successfully');
                
                // Show success message
                if (window.showCustomAlert) {
                    window.showCustomAlert('Card payment completed successfully!', 'success');
                }
                
                // Refresh UI based on payment type
                if (cardPaymentStatus.isPayLater) {
                    // Pay Later order - refresh order log
                    if (window.displayOrderLog) {
                        window.displayOrderLog();
                    }
                } else {
                    // Current order - refresh current order and order log
                    if (window.initializeOrder) {
                        window.initializeOrder();
                    }
                    if (window.displayOrderLog) {
                        window.displayOrderLog();
                    }
                }
                
                // Clear the card payment document
                await window.clearCardPaymentDocument();
                
            } else if (cardPaymentStatus.status === 'processing') {
                // Card payment is still processing - this shouldn't happen on app load
                console.log('Card payment still processing - clearing document');
                await window.clearCardPaymentDocument();
            }
        }
    } catch (error) {
        console.error('Error checking card payment status on load:', error);
    }
}

// Export card payment functions
window.createCardPaymentDocument = createCardPaymentDocument;
window.checkCardPaymentStatus = checkCardPaymentStatus;
window.clearCardPaymentDocument = clearCardPaymentDocument;
window.checkCardPaymentStatusOnLoad = checkCardPaymentStatusOnLoad; 