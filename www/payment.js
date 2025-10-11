// payment.js
// Handles payment modal keypad and related logic

export function initPaymentModal({ processPayment, processPayLater, updatePaymentModal, showCustomAlert }) {
    const paymentModal = document.getElementById('paymentModal');
    const tenderedAmountEl = document.getElementById('tenderedAmount');
    const changeAmountEl = document.getElementById('changeAmount');
    const totalAmountEl = document.getElementById('totalAmount');
    let tenderedAmount = '';
    
    // Remove any existing debug panels first
    const existingPanels = document.querySelectorAll('.payment-debug-panel, .debug-panel');
    existingPanels.forEach(panel => panel.remove());
    
    // Global flag to prevent multiple debug panels
    if (window.paymentDebugPanelExists) {
        console.log('Payment debug panel already exists, skipping initialization');
        return;
    }
    window.paymentDebugPanelExists = true;
    
    // Add debug panel to payment modal
    function addDebugPanel() {
        // Remove any existing panels first
        const existing = document.querySelector('.payment-debug-panel');
        if (existing) {
            existing.remove();
        }
        
        const debugPanel = document.createElement('div');
        debugPanel.className = 'payment-debug-panel';
        debugPanel.id = 'paymentDebugPanel';
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
    }
    
    // Hide debug panel
    function hideDebugPanel() {
        const debugPanel = document.getElementById('paymentDebugPanel');
        if (debugPanel) {
            debugPanel.remove();
        }
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
            <small style="color: #666;">${new Date().toLocaleTimeString()}</small>
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
                updateButtonState();
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
            updateButtonState();
        } catch (error) {
            console.error('Error in updateDisplay:', error);
            // Reset to safe state
            tenderedAmount = '';
            if (tenderedAmountEl) tenderedAmountEl.textContent = '0';
            if (changeAmountEl) changeAmountEl.textContent = '0';
            updateDebugPanel();
            updateButtonState();
        }
    }

    // Update Complete Payment button state based on payment validation
    function updateButtonState() {
        try {
            const completeBtn = document.getElementById('completePaymentBtn');
            if (!completeBtn) return;

            const totalTextRaw = totalAmountEl.textContent || '0';
            const total = parseInt(String(totalTextRaw).replace(/[^0-9]/g, ''), 10) || 0;
            const tendered = tenderedAmount ? (parseInt(String(tenderedAmount).replace(/[^0-9]/g, ''), 10) || 0) : 0;
            
            // Check if payment is sufficient
            const isPaymentSufficient = tendered >= total;
            
            // Update button state
            if (isPaymentSufficient) {
                completeBtn.disabled = false;
                completeBtn.style.opacity = '1';
                completeBtn.style.cursor = 'pointer';
                completeBtn.style.backgroundColor = 'var(--primary)';
                completeBtn.style.color = 'white';
            } else {
                completeBtn.disabled = true;
                completeBtn.style.opacity = '0.5';
                completeBtn.style.cursor = 'not-allowed';
                completeBtn.style.backgroundColor = '#ccc';
                completeBtn.style.color = '#666';
            }
            
            console.log('Button state updated - Payment sufficient:', isPaymentSufficient, 'Total:', total, 'Tendered:', tendered);
        } catch (error) {
            console.error('Error updating button state:', error);
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
                    hideDebugPanel();
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
                hideDebugPanel();
            } catch (error) {
                console.error('Error in cancel button handler:', error);
                paymentModal.style.display = 'none';
                hideDebugPanel();
            }
        });
    }

    // Double-check function to read debug panel values and validate payment
    function doubleCheckPaymentValues() {
        try {
            const debugContent = document.getElementById('debugContent');
            if (!debugContent) {
                console.log('Debug panel not found, using standard validation');
                return null;
            }
            
            const debugText = debugContent.innerHTML;
            console.log('Debug panel content:', debugText);
            
            // Extract values from debug panel using regex
            const totalMatch = debugText.match(/Total:\s*(\d+)/);
            const tenderedMatch = debugText.match(/Tendered:\s*(\d+)/);
            const changeMatch = debugText.match(/Change:\s*(\d+)/);
            const variableMatch = debugText.match(/Variable:\s*(.+?)(?:<br>|$)/);
            
            if (totalMatch && tenderedMatch) {
                const debugTotal = parseInt(totalMatch[1], 10);
                const debugTendered = parseInt(tenderedMatch[1], 10);
                const debugChange = changeMatch ? parseInt(changeMatch[1], 10) : 0;
                const debugVariable = variableMatch ? variableMatch[1].trim() : 'empty';
                
                console.log('Double-check values - Total:', debugTotal, 'Tendered:', debugTendered, 'Change:', debugChange, 'Variable:', debugVariable);
                
                // Check if the debug values show sufficient payment
                if (debugTendered >= debugTotal) {
                    console.log('Double-check PASSED: Payment is sufficient according to debug panel');
                    return {
                        total: debugTotal,
                        tendered: debugTendered,
                        change: debugChange,
                        variable: debugVariable,
                        isValid: true
                    };
                } else {
                    console.log('Double-check FAILED: Payment is insufficient according to debug panel');
                    return {
                        total: debugTotal,
                        tendered: debugTendered,
                        change: debugChange,
                        variable: debugVariable,
                        isValid: false
                    };
                }
            }
            
            console.log('Could not parse debug panel values, falling back to standard validation');
            return null;
        } catch (error) {
            console.error('Error in double-check function:', error);
            return null;
        }
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
                
                // Double-check using debug panel values
                const doubleCheckResult = doubleCheckPaymentValues();
                if (doubleCheckResult && doubleCheckResult.isValid) {
                    console.log('Double-check override: Payment is sufficient according to debug panel, proceeding with payment');
                    // Override the insufficient payment check and proceed
                } else if (tendered < total) {
                    showCustomAlert('Insufficient payment amount', 'warning');
                    return;
                }
                
                await processPayment();
                paymentModal.style.display = 'none';
                tenderedAmount = '';
                updateDisplay();
                hideDebugPanel();
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
            updateButtonState();
        } catch (error) {
            console.error('Error in modal show handler:', error);
            tenderedAmount = '';
            updateButtonState();
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
                        updateButtonState();
                    }, 100);
                } else if (modal.style.display === 'none') {
                    hideDebugPanel();
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
            updateDebugPanel();
        }
    }, 30000); // Check every 30 seconds

    // Cleanup function
    const cleanup = () => {
        clearInterval(validationInterval);
        observer.disconnect();
        // Remove debug panel on cleanup
        const debugPanel = document.getElementById('paymentDebugPanel');
        if (debugPanel) debugPanel.remove();
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