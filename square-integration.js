// square-integration.js
// Square Point of Sale API Integration for Izumiya POS

// Square Configuration
const SQUARE_CONFIG = {
    appId: 'sq0idp-MVzo31QnyyzHTP4SrxoOoQ',
    callbackUrl: 'https://scholtzk.github.io/Izumiya/square-callback.html',
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
        console.log('Setting up Square callback handling...');
        console.log('Current URL:', window.location.href);
        
        // Check if we're returning from a Square payment (iOS format)
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        
        // Check for Square callback parameters (from redirect page)
        const squareSuccess = urlParams.get('square_success');
        const squareError = urlParams.get('square_error');
        const squareCancelled = urlParams.get('square_cancelled');
        const transactionId = urlParams.get('transaction_id');
        
        console.log('URL parameters:', {
            dataParam,
            squareSuccess,
            squareError,
            squareCancelled,
            transactionId
        });
        
        if (dataParam) {
            // Direct Square callback
            console.log('Processing direct Square callback with data:', dataParam);
            try {
                // Create a proper URL object from window.location
                const currentUrl = new URL(window.location.href);
                const transactionInfo = this.getTransactionInfo(currentUrl);
                this.handlePaymentCallback(transactionInfo);
            } catch (error) {
                console.error('Error parsing Square callback data:', error);
                this.showDebugInfo('Error parsing Square callback: ' + error.message);
            }
        } else if (squareSuccess) {
            // Success from redirect page
            console.log('Processing Square success from redirect');
            this.handleSquareSuccess(transactionId);
        } else if (squareError) {
            // Error from redirect page
            console.log('Processing Square error from redirect');
            this.handleSquareError(squareError);
        } else if (squareCancelled) {
            // Cancelled from redirect page
            console.log('Processing Square cancellation from redirect');
            this.handlePaymentCancellation();
        } else {
            console.log('No Square callback parameters found');
        }
    }
    
    // Get transaction info from Square callback (iOS format)
    getTransactionInfo(url) {
        try {
            console.log("Processing Square callback URL:", url.href);
            console.log("URL search params:", url.search);
            
            let dataParam;
            
            // Try URL object first
            if (url.searchParams && url.searchParams.get) {
                dataParam = url.searchParams.get("data");
                console.log("Using URL.searchParams.get");
            } else {
                // Fallback to manual parsing
                console.log("URL.searchParams not available, using manual parsing");
                const urlString = url.href || window.location.href;
                const urlObj = new URL(urlString);
                dataParam = urlObj.searchParams.get("data");
                console.log("Using manual URL parsing");
            }
            
            console.log("Raw data parameter:", dataParam);
            
            if (!dataParam) {
                throw new Error("No data parameter found in URL");
            }
            
            const data = decodeURIComponent(dataParam);
            console.log("Decoded Square callback data:", data);
            
            const transactionInfo = JSON.parse(data);
            console.log("Parsed transaction info:", transactionInfo);
            
            return transactionInfo;
        } catch (error) {
            console.error("Error in getTransactionInfo:", error);
            this.showDebugInfo("Error parsing Square data: " + error.message);
            throw error;
        }
    }

    // Handle payment callback from Square
    handlePaymentCallback(transactionInfo) {
        console.log('Square payment callback received:', transactionInfo);
        this.showDebugInfo('Square callback received: ' + JSON.stringify(transactionInfo));
        
        // Check for error first using Square's actual response format
        if (transactionInfo.error_code) {
            this.handlePaymentError(transactionInfo.error_code);
            return;
        }
        
        // Check for success using Square's actual response format
        if (transactionInfo.status === 'ok' || transactionInfo.transaction_id || transactionInfo.client_transaction_id) {
            this.processSuccessfulPayment(transactionInfo);
        } else if (transactionInfo.status === 'error') {
            this.handlePaymentError(transactionInfo.error_code || 'unknown_error');
        } else {
            this.handlePaymentCancellation();
        }
    }

    // Process successful Square payment
    processSuccessfulPayment(transactionInfo) {
        console.log('Processing successful Square payment:', transactionInfo);
        
        // Use Square's actual response format
        const clientTransactionId = transactionInfo.client_transaction_id;
        const transactionId = transactionInfo.transaction_id;
        const status = transactionInfo.status;
        
        // Build result string using Square's actual response
        let resultString = "";
        if (clientTransactionId) {
            resultString += "Client Transaction ID: " + clientTransactionId + "<br>";
        }
        if (transactionId) {
            resultString += "Transaction ID: " + transactionId + "<br>";
        } else {
            resultString += "Transaction ID: NO CARD USED<br>";
        }
        if (status) {
            resultString += "Status: " + status + "<br>";
        }
        
        // Show success message
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment successful! ${resultString}`, 'success');
        }

        // Process the payment through the existing POS system
        if (window.currentOrder && window.processPayment) {
            // Update the order with Square payment details
            const squareOrder = {
                ...window.currentOrder,
                paymentMethod: 'Square',
                paymentId: transactionId || clientTransactionId,
                total: window.currentOrder.total,
                timestamp: new Date(),
                paymentStatus: 'paid',
                squareStatus: status
            };

            // Process through existing payment system
            window.processPayment(squareOrder);
        }

        // Clean up URL parameters
        this.cleanupUrl();
        
        // Redirect to home screen app after processing
        this.redirectToHomeScreenApp();
    }

    // Handle payment cancellation
    handlePaymentCancellation() {
        console.log('Square payment was cancelled');
        
        if (window.showCustomAlert) {
            window.showCustomAlert('Square payment was cancelled', 'info');
        }

        // Return to payment modal
        this.cleanupUrl();
        
        // Redirect to home screen app after cancellation
        this.redirectToHomeScreenApp();
    }
    
    // Redirect to home screen app
    redirectToHomeScreenApp() {
        console.log('Redirecting to home screen app...');
        this.showDebugInfo('Returning to POS app...');
        
        // Show user-friendly message
        if (window.showCustomAlert) {
            window.showCustomAlert('Returning to POS app...', 'info');
        }
        
        // Use dedicated PWA redirect page
        const redirectUrl = 'https://scholtzk.github.io/Izumiya/pwa-redirect.html';
        
        setTimeout(() => {
            console.log('Redirecting to PWA redirect page...');
            this.showDebugInfo('Opening PWA...');
            
            try {
                // Redirect to dedicated PWA redirect page
                window.location.href = redirectUrl;
                console.log('PWA redirect page opened');
            } catch (error) {
                console.log('PWA redirect failed:', error);
                this.showDebugInfo(`PWA redirect failed: ${error.message}`);
                
                // Fallback to direct POS URL
                window.location.href = 'https://scholtzk.github.io/Izumiya/';
            }
        }, 1000);
    }
    
    
    // Handle Square success from redirect page
    handleSquareSuccess(transactionId) {
        console.log('Square payment successful via redirect:', transactionId);
        
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment successful! Transaction ID: ${transactionId}`, 'success');
        }

        // Process the payment through the existing POS system
        if (window.currentOrder && window.processPayment) {
            const squareOrder = {
                ...window.currentOrder,
                paymentMethod: 'Square',
                paymentId: transactionId,
                total: window.currentOrder.total,
                timestamp: new Date(),
                paymentStatus: 'paid'
            };

            window.processPayment(squareOrder);
        }

        this.cleanupUrl();
    }
    
    // Handle Square error from redirect page
    handleSquareError(errorCode) {
        console.error('Square payment error via redirect:', errorCode);
        
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment failed: ${errorCode}`, 'error');
        }

        this.cleanupUrl();
        
        // Redirect to home screen app after error
        this.redirectToHomeScreenApp();
    }

    // Handle payment error
    handlePaymentError(status) {
        console.error('Square payment error:', status);
        
        if (window.showCustomAlert) {
            window.showCustomAlert(`Square payment failed: ${status}`, 'error');
        }

        this.cleanupUrl();
        
        // Redirect to home screen app after error
        this.redirectToHomeScreenApp();
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
        
        // Get current order data
        const currentOrder = window.currentOrder;
        if (!currentOrder) {
            if (window.showCustomAlert) {
                window.showCustomAlert('No current order found', 'error');
            }
            return;
        }
        
        // Use exact callback URL (must match Square app settings EXACTLY)
        const callbackUrl = SQUARE_CONFIG.callbackUrl;

        // Generate a client transaction id to correlate on callback
        const clientTransactionId = `order-${currentOrder.orderNumber}-${Date.now()}`;
        
        // Prepare Square payment data according to official documentation
        const dataParameter = {
            amount_money: {
                amount: Math.round(amount), // Amount in cents for JPY
                currency_code: SQUARE_CONFIG.currency
            },
            callback_url: callbackUrl,
            client_transaction_id: clientTransactionId,
            client_id: SQUARE_CONFIG.appId,
            version: SQUARE_CONFIG.version,
            notes: "POS Transaction",
            options: {
                supported_tender_types: ["CREDIT_CARD", "CASH", "OTHER", "SQUARE_GIFT_CARD", "CARD_ON_FILE"]
            }
        };

        // Use the exact format from Square documentation
        const squareUrl = "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(dataParameter));
        
        console.log('Square payment data:', dataParameter);
        console.log('Square URL:', squareUrl);

        // Show loading message
        if (window.showCustomAlert) {
            window.showCustomAlert('Opening Square app...', 'info');
        }

        // Use window.location as per Square documentation
        this.attemptSquarePayment(squareUrl);
    }

    // Attempt to open Square app with fallback handling
    attemptSquarePayment(squareUrl) {
        console.log('Attempting to open Square app with URL:', squareUrl);
        
        // Show debug info on screen for iPad
        this.showDebugInfo('Opening Square app...');
        
        // Use the exact method from Square documentation
        try {
            window.location = squareUrl;
            this.showDebugInfo('Square app launch attempted');
            
            // Set up fallback timeout
            setTimeout(() => {
                this.showDebugInfo('Square app not responding - may not be installed');
                this.handleSquareNotInstalled();
            }, 3000);
            
        } catch (error) {
            this.showDebugInfo('Error opening Square: ' + error.message);
            this.handleSquareNotInstalled();
        }
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
