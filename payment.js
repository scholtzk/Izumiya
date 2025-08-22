// payment.js
// Handles payment modal keypad and related logic

export function initPaymentModal({ processPayment, processPayLater, updatePaymentModal, showCustomAlert }) {
    const paymentModal = document.getElementById('paymentModal');
    const tenderedAmountEl = document.getElementById('tenderedAmount');
    const changeAmountEl = document.getElementById('changeAmount');
    const totalAmountEl = document.getElementById('totalAmount');
    let tenderedAmount = '';
    
    // Global flag to prevent multiple debug panels
    if (window.paymentDebugPanelExists) {
        console.log('Payment debug panel already exists, skipping initialization');
        return;
    }
    window.paymentDebugPanelExists = true;
    
    // Add debug panel to payment modal
    function addDebugPanel() {
        if (document.querySelector('.payment-debug-panel')) return; // Already exists
        
        const debugPanel = document.createElement('div');
        debugPanel.className = 'payment-debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 15px;
            background: #000;
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-size: 11px;
            font-family: monospace;
            z-index: 10000;
            min-width: 180px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            border: 1px solid #333;
        `;
        
        const debugTitle = document.createElement('div');
        debugTitle.textContent = 'Debug';
        debugTitle.style.cssText = 'font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 3px; font-size: 12px;';
        
        const debugContent = document.createElement('div');
        debugContent.id = 'debugContent';
        debugContent.style.cssText = 'line-height: 1.3; margin-bottom: 8px;';
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.cssText = `
            background: #333;
            color: #00ff00;
            border: 1px solid #00ff00;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            cursor: pointer;
            width: 100%;
        `;
        resetBtn.onclick = () => {
            tenderedAmount = '';
            updateDisplay();
            showCustomAlert('Payment state reset', 'info');
        };
        
        debugPanel.appendChild(debugTitle);
        debugPanel.appendChild(debugContent);
        debugPanel.appendChild(resetBtn);
        document.body.appendChild(debugPanel);
        
        // Auto-hide after 30 seconds of inactivity
        let hideTimeout;
        const resetHideTimeout = () => {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (debugPanel.parentNode) {
                    debugPanel.style.opacity = '0.3';
                }
            }, 30000);
        };
        
        debugPanel.addEventListener('mouseenter', () => {
            debugPanel.style.opacity = '1';
            resetHideTimeout();
        });
        
        resetHideTimeout();
    }
    
    // Update debug panel with current state
    function updateDebugPanel() {
        const debugContent = document.getElementById('debugContent');
        if (!debugContent) return;
        
        const total = totalAmountEl ? totalAmountEl.textContent : 'N/A';
        const tendered = tenderedAmountEl ? tenderedAmountEl.textContent : 'N/A';
        const change = changeAmountEl ? changeAmountEl.textContent : 'N/A';
        const tenderedVar = tenderedAmount || 'empty';
        
        debugContent.innerHTML = `
            Total: ${total}<br>
            Tendered: ${tendered}<br>
            Change: ${change}<br>
            Variable: ${tenderedVar}<br>
            <small style="color: #aaa;">${new Date().toLocaleTimeString()}</small>
        `;
    }
    
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
                updateDebugPanel();
                return;
            }

            const totalTextRaw = totalAmountEl.textContent || '0';
            const total = parseInt(String(totalTextRaw).replace(/[^0-9]/g, ''), 10) || 0;
            const tendered = tenderedAmount ? (parseInt(String(tenderedAmount).replace(/[^0-9]/g, ''), 10) || 0) : 0;
            console.log('updateDisplay: tenderedAmount =', tenderedAmount, 'parsed =', tendered, 'total parsed =', total);
            
            if (tenderedAmountEl) {
                tenderedAmountEl.textContent = isNaN(tendered) ? 0 : tendered;
            }
            const change = tendered - total;
            if (changeAmountEl) {
                changeAmountEl.textContent = change >= 0 ? change : 0;
            }
            
            updateDebugPanel();
        } catch (error) {
            console.error('Error in updateDisplay:', error);
            // Reset to safe state
            tenderedAmount = '';
            if (tenderedAmountEl) tenderedAmountEl.textContent = '0';
            if (changeAmountEl) changeAmountEl.textContent = '0';
            updateDebugPanel();
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
                // Ensure debug panel is visible
                if (!document.querySelector('.payment-debug-panel')) {
                    addDebugPanel();
                }
                
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

                const total = parseInt(String(totalAmountEl.textContent || '0').replace(/[^0-9]/g, ''), 10) || 0;
                const tendered = tenderedAmount ? (parseInt(String(tenderedAmount).replace(/[^0-9]/g, ''), 10) || 0) : 0;
                
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

    // When modal opens, reset tendered amount and add debug panel
    paymentModal.addEventListener('show', () => {
        try {
            tenderedAmount = '';
            updateDisplay();
            addDebugPanel();
        } catch (error) {
            console.error('Error in modal show handler:', error);
            tenderedAmount = '';
        }
    });

    // Also add debug panel when modal becomes visible (more reliable)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const modal = mutation.target;
                if (modal.style.display === 'flex' || modal.style.display === 'block') {
                    setTimeout(() => {
                        addDebugPanel();
                        updateDebugPanel();
                    }, 100);
                }
            }
        });
    });
    
    observer.observe(paymentModal, { attributes: true, attributeFilter: ['style'] });

    // Add periodic state validation for long-running sessions
    const validationInterval = setInterval(() => {
        if (paymentModal.style.display === 'flex' || paymentModal.style.display === 'block') {
            if (!validatePaymentState()) {
                console.warn('Periodic validation failed, resetting payment state');
                tenderedAmount = '';
                updateDisplay();
            }
            // Ensure debug panel is visible
            if (!document.querySelector('.payment-debug-panel')) {
                addDebugPanel();
            }
            updateDebugPanel();
        }
    }, 30000); // Check every 30 seconds

    // Cleanup function
    const cleanup = () => {
        clearInterval(validationInterval);
        observer.disconnect();
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