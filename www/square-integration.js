// square-integration.js
// Square Point of Sale API Integration for Izumiya POS

// Square Configuration
const SQUARE_CONFIG = {
    appId: 'sq0idp-MVzo31QnyyzHTP4SrxoOoQ',
    callbackUrl: 'https://scholtzk.github.io/Izumiya/',
    currency: 'JPY',
    version: '1.3'
};

// Square Integration Class
class SquareIntegration {
    constructor() {
        this.isSquareAvailable = false;
        this.currentOrder = null;
        this.init();
    }

    // Initialize Square integration
    init() {
        console.log('Initializing Square integration...');
        this.checkSquareAvailability();
        this.setupCallbackHandling();
    }

    // Check if Square app is available on the device
    checkSquareAvailability() {
        // Test if Square app can be opened
        const testUrl = 'square-commerce-v1://test';
        const testLink = document.createElement('a');
        testLink.href = testUrl;
        testLink.style.display = 'none';
        document.body.appendChild(testLink);
        
        // This is a basic check - in practice, we'll handle the case where Square isn't installed
        this.isSquareAvailable = true; // We'll handle the actual check in the payment flow
        document.body.removeChild(testLink);
    }

    // Setup callback URL handling for payment results
    setupCallbackHandling() {
        // Check if we're returning from a Square payment
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('status');
        const paymentAmount = urlParams.get('amount');
        const paymentId = urlParams.get('payment_id');

        if (paymentStatus && paymentAmount) {
            this.handlePaymentCallback(paymentStatus, paymentAmount, paymentId);
        }
    }

    // Handle payment callback from Square
    handlePaymentCallback(status, amount, paymentId) {
        console.log('Square payment callback received:', { status, amount, paymentId });
        
        if (status === 'success') {
            this.processSuccessfulPayment(amount, paymentId);
        } else if (status === 'cancelled') {
            this.handlePaymentCancellation();
        } else {
            this.handlePaymentError(status);
        }
    }

    // Process successful Square payment
    processSuccessfulPayment(amount, paymentId) {
        console.log('Processing successful Square payment:', amount);
        
        // Show success message
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment successful: ¥${amount}`, 'success');
        }

        // Process the payment through the existing POS system
        if (window.currentOrder && window.processPayment) {
            // Update the order with Square payment details
            const squareOrder = {
                ...window.currentOrder,
                paymentMethod: 'Square',
                paymentId: paymentId,
                total: parseInt(amount),
                timestamp: new Date(),
                paymentStatus: 'paid'
            };

            // Process through existing payment system
            window.processPayment(squareOrder);
        }

        // Clean up URL parameters
        this.cleanupUrl();
    }

    // Handle payment cancellation
    handlePaymentCancellation() {
        console.log('Square payment was cancelled');
        
        if (window.showCustomAlert) {
            window.showCustomAlert('Square payment was cancelled', 'info');
        }

        // Return to payment modal
        this.cleanupUrl();
    }

    // Handle payment error
    handlePaymentError(status) {
        console.error('Square payment error:', status);
        
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment failed: ${status}`, 'error');
        }

        this.cleanupUrl();
    }

    // Clean up URL parameters after processing
    cleanupUrl() {
        const url = new URL(window.location);
        url.searchParams.delete('status');
        url.searchParams.delete('amount');
        url.searchParams.delete('payment_id');
        window.history.replaceState({}, document.title, url.pathname);
    }

    // Open Square app with payment amount
    openSquarePayment(amount) {
        console.log('Opening Square payment for amount:', amount);
        
        // Validate amount
        if (!amount || amount <= 0) {
            if (window.showCustomAlert) {
                window.showCustomAlert('Invalid payment amount', 'error');
            }
            return;
        }
        
        // Prepare Square payment data
        const squareData = {
            amount_money: {
                amount: Math.round(amount), // Square expects amount in smallest currency unit
                currency_code: SQUARE_CONFIG.currency
            },
            callback_url: SQUARE_CONFIG.callbackUrl,
            client_id: SQUARE_CONFIG.appId,
            version: SQUARE_CONFIG.version
        };

        // Encode the data for URL
        const encodedData = encodeURIComponent(JSON.stringify(squareData));
        const squareUrl = `square-commerce-v1://payment/create?data=${encodedData}`;
        
        console.log('Square payment data:', squareData);
        console.log('Square URL:', squareUrl);

        // Show loading message
        if (window.showCustomAlert) {
            window.showCustomAlert('Opening Square app...', 'info');
        }

        // Attempt to open Square app
        this.attemptSquarePayment(squareUrl);
    }

    // Attempt to open Square app with fallback handling
    attemptSquarePayment(squareUrl) {
        console.log('Attempting to open Square app with URL:', squareUrl);
        
        // Show debug info on screen for iPad
        this.showDebugInfo('Attempting to open Square app...');
        
        // Try multiple methods to open Square app
        let squareOpened = false;
        
        // Method 1: Direct window.location
        try {
            window.location.href = squareUrl;
            squareOpened = true;
            this.showDebugInfo('Method 1: Direct location attempted');
        } catch (error) {
            this.showDebugInfo('Method 1 failed: ' + error.message);
        }
        
        // Method 2: Create and click link
        if (!squareOpened) {
            try {
                const link = document.createElement('a');
                link.href = squareUrl;
                link.target = '_self';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                squareOpened = true;
                this.showDebugInfo('Method 2: Link click attempted');
            } catch (error) {
                this.showDebugInfo('Method 2 failed: ' + error.message);
            }
        }
        
        // Method 3: Use window.open
        if (!squareOpened) {
            try {
                window.open(squareUrl, '_self');
                squareOpened = true;
                this.showDebugInfo('Method 3: Window.open attempted');
            } catch (error) {
                this.showDebugInfo('Method 3 failed: ' + error.message);
            }
        }
        
        // Set up fallback timeout
        const fallbackTimeout = setTimeout(() => {
            this.showDebugInfo('Square app not responding after 3 seconds');
            this.handleSquareNotInstalled();
        }, 3000);
        
        // Check if we're still on the same page (indicating Square didn't open)
        const checkPage = setInterval(() => {
            if (document.visibilityState === 'visible') {
                // Still on the page, Square probably didn't open
                clearTimeout(fallbackTimeout);
                clearInterval(checkPage);
                this.showDebugInfo('Still on page - Square app likely not installed');
                this.handleSquareNotInstalled();
            }
        }, 1000);
    }
    
    // Show debug information on screen for iPad
    showDebugInfo(message) {
        // Create or update debug display
        let debugDiv = document.getElementById('square-debug');
        if (!debugDiv) {
            debugDiv = document.createElement('div');
            debugDiv.id = 'square-debug';
            debugDiv.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10000;
                max-width: 300px;
                word-wrap: break-word;
            `;
            document.body.appendChild(debugDiv);
        }
        
        const timestamp = new Date().toLocaleTimeString();
        debugDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (debugDiv && debugDiv.parentNode) {
                debugDiv.parentNode.removeChild(debugDiv);
            }
        }, 10000);
    }

    // Handle case where Square app is not installed
    handleSquareNotInstalled() {
        console.log('Square app not found, showing fallback options');
        
        if (window.showCustomAlert) {
            const userChoice = confirm(
                'Square app not found. Would you like to:\n\n' +
                '• Download Square Point of Sale app\n' +
                '• Return to cash payment\n\n' +
                'Click OK to download Square app, or Cancel to return to cash payment.'
            );
            
            if (userChoice) {
                // Open App Store to download Square app
                window.open('https://apps.apple.com/jp/app/square-point-of-sale/id1116598129', '_blank');
            } else {
                // Return to cash payment
                this.returnToCashPayment();
            }
        }
    }

    // Return to cash payment mode
    returnToCashPayment() {
        console.log('Returning to cash payment mode');
        
        // Switch back to cash payment method
        if (window.selectPaymentMethod) {
            window.selectPaymentMethod('cash');
        }
        
        if (window.showCustomAlert) {
            window.showCustomAlert('Switched to cash payment mode', 'info');
        }
    }

    // Get payment amount for Square (with surcharge if applicable)
    getSquarePaymentAmount() {
        if (!window.currentOrder) {
            console.error('No current order found');
            return 0;
        }

        const originalTotal = window.currentOrder.total || 0;
        
        // Check if we're in card payment mode (with surcharge)
        const cardInfo = document.getElementById('cardPaymentInfo');
        if (cardInfo && cardInfo.style.display !== 'none') {
            // Card payment mode - use the total with surcharge
            const cardTotalElement = document.getElementById('cardTotal');
            if (cardTotalElement) {
                return parseInt(cardTotalElement.textContent) || originalTotal;
            }
        }
        
        // Cash payment mode - use original total
        return originalTotal;
    }
}

// Initialize Square integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Square integration
    window.squareIntegration = new SquareIntegration();
    
    console.log('Square integration initialized');
});

// Export functions for use in other files
window.SquareIntegration = {
    openPayment: function(amount) {
        if (window.squareIntegration) {
            window.squareIntegration.openSquarePayment(amount);
        }
    },
    
    getPaymentAmount: function() {
        if (window.squareIntegration) {
            return window.squareIntegration.getSquarePaymentAmount();
        }
        return 0;
    },
    
    processCardPayment: function() {
        if (window.squareIntegration) {
            const amount = window.squareIntegration.getSquarePaymentAmount();
            if (amount > 0) {
                window.squareIntegration.openSquarePayment(amount);
            } else {
                if (window.showCustomAlert) {
                    window.showCustomAlert('No payment amount found', 'error');
                }
            }
        }
    }
};

// Make Square integration available globally
window.SquareIntegration = window.SquareIntegration;
