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

    function updateDisplay() {
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
    }

    // Numpad event listeners
    paymentModal.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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
                let val = totalAmountSpan ? totalAmountSpan.textContent.replace(/[^ -9]/g, '') : '';
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
        });
    });

    // Cancel button
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            paymentModal.style.display = 'none';
            tenderedAmount = '';
            updateDisplay();
        });
    }

    // Complete Payment button
    const completeBtn = document.getElementById('completePaymentBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', async () => {
            const total = parseInt(totalAmountEl.textContent) || 0;
            const tendered = tenderedAmount ? parseInt(tenderedAmount) : 0;
            if (tendered < total) {
                showCustomAlert('Insufficient payment amount', 'warning');
                return;
            }
            await processPayment();
            paymentModal.style.display = 'none';
            tenderedAmount = '';
            updateDisplay();
        });
    }

    // When modal opens, reset tendered amount
    paymentModal.addEventListener('show', () => {
        tenderedAmount = '';
        updateDisplay();
    });

    // Expose a reset function
    return {
        reset: () => {
            tenderedAmount = '';
            updateDisplay();
        }
    };
} 