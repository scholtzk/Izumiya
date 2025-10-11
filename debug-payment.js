// debug-payment.js - Debug script for payment issues on iPads

export function initPaymentDebugger() {
    console.log('Payment debugger initialized');
    
    // Monitor payment modal state
    let debugInterval = null;
    let lastTenderedAmount = '';
    let lastTotalAmount = '';
    
    function debugPaymentState() {
        try {
            const totalAmountEl = document.getElementById('totalAmount');
            const tenderedAmountEl = document.getElementById('tenderedAmount');
            const changeAmountEl = document.getElementById('changeAmount');
            const paymentModal = document.getElementById('paymentModal');
            
            const currentTotal = totalAmountEl ? totalAmountEl.textContent : 'N/A';
            const currentTendered = tenderedAmountEl ? tenderedAmountEl.textContent : 'N/A';
            const currentChange = changeAmountEl ? changeAmountEl.textContent : 'N/A';
            const modalVisible = paymentModal ? (paymentModal.style.display === 'flex' || paymentModal.style.display === 'block') : false;
            
            // Check for state changes
            if (currentTotal !== lastTotalAmount || currentTendered !== lastTenderedAmount) {
                console.log('Payment state change detected:', {
                    total: currentTotal,
                    tendered: currentTendered,
                    change: currentChange,
                    modalVisible: modalVisible,
                    timestamp: new Date().toISOString()
                });
                
                lastTotalAmount = currentTotal;
                lastTenderedAmount = currentTendered;
            }
            
            // Validate DOM elements
            if (!totalAmountEl || !document.contains(totalAmountEl)) {
                console.warn('Total amount element missing or disconnected');
            }
            if (!tenderedAmountEl || !document.contains(tenderedAmountEl)) {
                console.warn('Tendered amount element missing or disconnected');
            }
            
            // Check for NaN values
            if (currentTotal !== 'N/A' && isNaN(parseInt(currentTotal))) {
                console.error('Total amount is NaN:', currentTotal);
            }
            if (currentTendered !== 'N/A' && isNaN(parseInt(currentTendered))) {
                console.error('Tendered amount is NaN:', currentTendered);
            }
            
        } catch (error) {
            console.error('Error in payment debugger:', error);
        }
    }
    
    // Start monitoring
    debugInterval = setInterval(debugPaymentState, 2000); // Check every 2 seconds
    
    // Expose debug functions
    window.paymentDebugger = {
        getState: () => {
            const totalAmountEl = document.getElementById('totalAmount');
            const tenderedAmountEl = document.getElementById('tenderedAmount');
            const changeAmountEl = document.getElementById('changeAmount');
            
            return {
                total: totalAmountEl ? totalAmountEl.textContent : 'N/A',
                tendered: tenderedAmountEl ? tenderedAmountEl.textContent : 'N/A',
                change: changeAmountEl ? changeAmountEl.textContent : 'N/A',
                totalElement: totalAmountEl ? 'exists' : 'missing',
                tenderedElement: tenderedAmountEl ? 'exists' : 'missing',
                changeElement: changeAmountEl ? 'exists' : 'missing'
            };
        },
        reset: () => {
            const tenderedAmountEl = document.getElementById('tenderedAmount');
            const changeAmountEl = document.getElementById('changeAmount');
            
            if (tenderedAmountEl) tenderedAmountEl.textContent = '0';
            if (changeAmountEl) changeAmountEl.textContent = '0';
            
            console.log('Payment state manually reset');
        },
        stop: () => {
            if (debugInterval) {
                clearInterval(debugInterval);
                debugInterval = null;
                console.log('Payment debugger stopped');
            }
        }
    };
    
    console.log('Payment debugger ready. Use window.paymentDebugger.getState() to check current state');
}

// Auto-initialize if this script is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(initPaymentDebugger, 1000); // Wait 1 second after DOM loads
    });
} 