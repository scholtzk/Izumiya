// Error viewer utility for debugging
export class ErrorViewer {
    constructor() {
        this.isInitialized = false;
        this.initializeErrorViewer();
    }

    async initializeErrorViewer() {
        try {
            // Wait for Firebase to be available
            if (window.firebaseServices && window.firebaseDb) {
                this.isInitialized = true;
                console.log('Error viewer initialized');
            } else {
                // Retry after a short delay
                setTimeout(() => this.initializeErrorViewer(), 1000);
            }
        } catch (error) {
            console.error('Failed to initialize error viewer:', error);
        }
    }

    async viewTodayErrors() {
        if (!this.isInitialized) {
            console.error('Error viewer not initialized');
            return [];
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            const errorDocRef = window.firebaseServices.doc(window.firebaseDb, 'errors', today);
            const errorDoc = await window.firebaseServices.getDoc(errorDocRef);
            
            if (errorDoc.exists()) {
                const data = errorDoc.data();
                console.log(`Today's errors (${data.totalErrors} total):`, data.errors);
                return data.errors || [];
            } else {
                console.log('No errors found for today');
                return [];
            }
        } catch (error) {
            console.error('Failed to get today\'s errors:', error);
            return [];
        }
    }

    async viewErrorStats(days = 7) {
        if (!this.isInitialized) {
            console.error('Error viewer not initialized');
            return {};
        }

        try {
            const stats = await window.errorLogger.getErrorStats(days);
            console.log(`Error stats for last ${days} days:`, stats);
            return stats;
        } catch (error) {
            console.error('Failed to get error stats:', error);
            return {};
        }
    }

    async viewErrorsByDate(dateString) {
        if (!this.isInitialized) {
            console.error('Error viewer not initialized');
            return [];
        }

        try {
            const errorDocRef = window.firebaseServices.doc(window.firebaseDb, 'errors', dateString);
            const errorDoc = await window.firebaseServices.getDoc(errorDocRef);
            
            if (errorDoc.exists()) {
                const data = errorDoc.data();
                console.log(`Errors for ${dateString}:`, data.errors);
                return data.errors || [];
            } else {
                console.log(`No errors found for ${dateString}`);
                return [];
            }
        } catch (error) {
            console.error(`Failed to get errors for ${dateString}:`, error);
            return [];
        }
    }

    // Helper function to format error for display
    formatError(error) {
        return {
            timestamp: error.timestamp?.toDate?.() || new Date(error.timestamp),
            message: error.error?.message || 'Unknown error',
            name: error.error?.name || 'Error',
            code: error.error?.code || null,
            cause: error.error?.cause || null,
            severity: error.severity || 'unknown',
            source: error.context?.source || 'unknown',
            stack: error.error?.stack || 'No stack trace'
        };
    }

    // Display errors in a readable format
    displayErrors(errors) {
        if (!errors || errors.length === 0) {
            console.log('No errors to display');
            return;
        }

        console.group('📊 Error Report');
        errors.forEach((error, index) => {
            const formatted = this.formatError(error);
            console.group(`Error ${index + 1} (${formatted.severity})`);
            console.log('Time:', formatted.timestamp);
            console.log('Source:', formatted.source);
            console.log('Message:', formatted.message);
            console.log('Type:', formatted.name);
            if (formatted.code) {
                console.log('Code:', formatted.code);
            }
            if (formatted.cause) {
                console.log('Cause:', formatted.cause);
            }
            if (formatted.stack) {
                console.log('Stack:', formatted.stack);
            }
            console.groupEnd();
        });
        console.groupEnd();
    }
}

// Create global error viewer instance
window.errorViewer = new ErrorViewer();

// Add helper functions to global scope for easy debugging
window.viewTodayErrors = () => window.errorViewer.viewTodayErrors();
window.viewErrorStats = (days) => window.errorViewer.viewErrorStats(days);
window.viewErrorsByDate = (dateString) => window.errorViewer.viewErrorsByDate(dateString);

export default ErrorViewer;
