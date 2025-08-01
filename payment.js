// payment.js
// Handles payment modal keypad and related logic

export function initPaymentModal({ processPayment, processPayLater, updatePaymentModal, showCustomAlert }) {
    const paymentModal = document.getElementById('paymentModal');
    const tenderedAmountEl = document.getElementById('tenderedAmount');
    const changeAmountEl = document.getElementById('changeAmount');
    const totalAmountEl = document.getElementById('totalAmount');
    let tenderedAmount = '';
    
    // Ensure tenderedAmount is always a string
    function ensureString(value) {
        return String(value || '');
    }

    // Check if all required elements exist
    if (!paymentModal || !tenderedAmountEl || !changeAmountEl || !totalAmountEl) {
        console.warn('Payment modal elements not found. Elements may not be loaded yet.');
        return false; // Return false to indicate initialization failed
    }

    // Enhanced validation function
    function validatePaymentState() {
        try {
            // Validate DOM elements are still connected
            if (!document.contains(tenderedAmountEl) || !document.contains(totalAmountEl)) {
                console.warn('Payment modal elements disconnected from DOM');
                return false;
            }
            
            // Validate tenderedAmount is a valid string
            if (typeof tenderedAmount !== 'string') {
                console.warn('tenderedAmount corrupted, resetting to empty string');
                tenderedAmount = '';
            }
            
            // Validate total amount is readable
            const totalText = totalAmountEl.textContent;
            if (!totalText || isNaN(parseInt(totalText))) {
                console.warn('Total amount element corrupted');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating payment state:', error);
            return false;
        }
    }

    function updateDisplay() {
        try {
            if (!validatePaymentState()) {
                console.warn('Payment state validation failed, resetting display');
                tenderedAmount = '';
                if (tenderedAmountEl) tenderedAmountEl.textContent = '0';
                if (changeAmountEl) changeAmountEl.textContent = '0';
                return;
            }

            const total = parseInt(totalAmountEl.textContent) || 0;
            const tendered = tenderedAmount ? parseInt(tenderedAmount) : 0;
            console.log('updateDisplay: tenderedAmount =', tenderedAmount, 'parsed =', tendered);
            
            if (tenderedAmountEl) {
                tenderedAmountEl.textContent = isNaN(tendered) ? 0 : tendered;
            }
            const change = tendered - total;
            if (changeAmountEl) {
                changeAmountEl.textContent = change >= 0 ? change : 0;
            }
        } catch (error) {
            console.error('Error in updateDisplay:', error);
            // Reset to safe state
            tenderedAmount = '';
            if (tenderedAmountEl) tenderedAmountEl.textContent = '0';
            if (changeAmountEl) changeAmountEl.textContent = '0';
        }
    }

    // Clear existing event listeners to prevent duplicates
    function clearExistingListeners() {
        const numpadButtons = paymentModal.querySelectorAll('.numpad-btn');
        numpadButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        const cancelBtn = document.getElementById('cancelPaymentBtn');
        if (cancelBtn) {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        }
        
        const completeBtn = document.getElementById('completePaymentBtn');
        if (completeBtn) {
            const newCompleteBtn = completeBtn.cloneNode(true);
            completeBtn.parentNode.replaceChild(newCompleteBtn, completeBtn);
        }
    }

    // Clear existing listeners before adding new ones
    clearExistingListeners();

    // Numpad event listeners
    paymentModal.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            try {
                if (!validatePaymentState()) {
                    console.warn('Payment state invalid during numpad input');
                    return;
                }

                const value = this.textContent;
                console.log('Numpad button clicked:', value, 'Current tenderedAmount:', tenderedAmount);
                
                if (this.id === 'payLaterBtn') {
                    processPayLater();
                    paymentModal.style.display = 'none';
                    return;
                } else if (value === '⌫') {
                    // Backspace functionality
                    tenderedAmount = ensureString(tenderedAmount);
                    if (tenderedAmount && tenderedAmount.length > 0) {
                        tenderedAmount = tenderedAmount.slice(0, -1);
                        console.log('Backspace: new tenderedAmount:', tenderedAmount);
                    }
                } else if (this.id === 'cashBtn') {
                    const totalAmountSpan = document.getElementById('totalAmount');
                    let val = totalAmountSpan ? totalAmountSpan.textContent.replace(/[^0-9]/g, '') : '';
                    console.log('Cash button value:', val);
                    if (!val || isNaN(Number(val))) {
                        val = (window.currentOrder && typeof window.currentOrder.total === 'number') ? String(window.currentOrder.total) : '0';
                        console.log('Fallback value:', val);
                    }
                    tenderedAmount = ensureString(val);
                    console.log('Cash button: new tenderedAmount:', tenderedAmount);
                } else {
                    // Regular number input
                    tenderedAmount = ensureString(tenderedAmount) + value;
                    console.log('Number input: new tenderedAmount:', tenderedAmount);
                }
                
                updateDisplay();
            } catch (error) {
                console.error('Error in numpad button handler:', error);
                // Reset to safe state
                tenderedAmount = '';
                updateDisplay();
            }
        });
    });

    // Cancel button
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            try {
                paymentModal.style.display = 'none';
                tenderedAmount = '';
                updateDisplay();
            } catch (error) {
                console.error('Error in cancel button handler:', error);
                paymentModal.style.display = 'none';
            }
        });
    }

    // Complete Payment button
    const completeBtn = document.getElementById('completePaymentBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', async () => {
            try {
                if (!validatePaymentState()) {
                    showCustomAlert('Payment system error. Please refresh the page.', 'error');
                    return;
                }

                const total = parseInt(totalAmountEl.textContent) || 0;
                const tendered = tenderedAmount ? parseInt(tenderedAmount) : 0;
                
                console.log('Payment validation - Total:', total, 'Tendered:', tendered, 'Raw tenderedAmount:', tenderedAmount);
                
                if (isNaN(tendered) || isNaN(total)) {
                    console.error('Invalid numbers in payment validation:', { total, tendered, tenderedAmount });
                    showCustomAlert('Payment calculation error. Please try again.', 'error');
                    return;
                }
                
                if (tendered < total) {
                    showCustomAlert('Insufficient payment amount', 'warning');
                    return;
                }
                
                await processPayment();
                paymentModal.style.display = 'none';
                tenderedAmount = '';
                updateDisplay();
            } catch (error) {
                console.error('Error in complete payment handler:', error);
                showCustomAlert('Payment processing error. Please try again.', 'error');
            }
        });
    }

    // When modal opens, reset tendered amount
    paymentModal.addEventListener('show', () => {
        try {
            tenderedAmount = '';
            updateDisplay();
        } catch (error) {
            console.error('Error in modal show handler:', error);
            tenderedAmount = '';
        }
    });

    // Add periodic state validation for long-running sessions
    const validationInterval = setInterval(() => {
        if (paymentModal.style.display === 'flex' || paymentModal.style.display === 'block') {
            if (!validatePaymentState()) {
                console.warn('Periodic validation failed, resetting payment state');
                tenderedAmount = '';
                updateDisplay();
            }
        }
    }, 30000); // Check every 30 seconds

    // Cleanup function
    const cleanup = () => {
        clearInterval(validationInterval);
    };

    // Expose a reset function
    return {
        reset: () => {
            try {
                tenderedAmount = '';
                updateDisplay();
            } catch (error) {
                console.error('Error in reset function:', error);
                tenderedAmount = '';
            }
        },
        cleanup: cleanup
    };
} 