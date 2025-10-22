// Error logging system for Firebase
export class ErrorLogger {
    constructor() {
        this.isInitialized = false;
        this.initializeErrorLogger();
    }

    async initializeErrorLogger() {
        try {
            // Wait for Firebase to be available
            if (window.firebaseServices && window.firebaseDb) {
                this.isInitialized = true;
                console.log('Error logger initialized');
            } else {
                // Retry after a short delay
                setTimeout(() => this.initializeErrorLogger(), 1000);
            }
        } catch (error) {
            console.error('Failed to initialize error logger:', error);
        }
    }

    async logError(error, context = {}, additionalInfo = {}) {
        if (!this.isInitialized) {
            console.error('Error logger not initialized, logging to console only:', error);
            return;
        }

        try {
            const errorData = {
                timestamp: window.firebaseServices.Timestamp.now(),
                error: {
                    message: error.message || 'Unknown error',
                    stack: error.stack || 'No stack trace available',
                    name: error.name || 'Error',
                    code: error.code || null,
                    cause: error.cause ? String(error.cause) : null
                },
                context: {
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    ...this.sanitizeObject(context)
                },
                additionalInfo: {
                    ...this.sanitizeObject(additionalInfo)
                },
                severity: this.determineSeverity(error, context)
            };

            // Create date-based document name (YYYY-MM-DD)
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            
            // Get or create today's error document
            const errorDocRef = window.firebaseServices.doc(window.firebaseDb, 'errors', dateString);
            const errorDoc = await window.firebaseServices.getDoc(errorDocRef);
            
            if (errorDoc.exists()) {
                // Update existing document with new error
                const existingData = errorDoc.data();
                const updatedErrors = [...(existingData.errors || []), errorData];
                
                await window.firebaseServices.updateDoc(errorDocRef, {
                    errors: updatedErrors,
                    lastUpdated: window.firebaseServices.Timestamp.now(),
                    totalErrors: updatedErrors.length
                });
            } else {
                // Create new document for today
                await window.firebaseServices.setDoc(errorDocRef, {
                    date: dateString,
                    errors: [errorData],
                    totalErrors: 1,
                    createdAt: window.firebaseServices.Timestamp.now(),
                    lastUpdated: window.firebaseServices.Timestamp.now()
                });
            }

            console.log('Error logged to Firebase:', errorData);
        } catch (loggingError) {
            console.error('Failed to log error to Firebase:', loggingError);
            console.error('Original error:', error);
        }
    }

    sanitizeObject(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                try {
                    // Skip functions and complex objects
                    if (typeof value === 'function') {
                        sanitized[key] = '[Function]';
                    } else if (value && typeof value === 'object' && value.constructor && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
                        // Handle custom objects by converting to string
                        sanitized[key] = `[${value.constructor.name}]`;
                    } else {
                        sanitized[key] = this.sanitizeObject(value);
                    }
                } catch (e) {
                    sanitized[key] = '[Unserializable]';
                }
            }
            return sanitized;
        }
        
        return String(obj);
    }

    determineSeverity(error, context) {
        // Determine error severity based on error type and context
        if (error.message && error.message.includes('network')) {
            return 'medium';
        }
        if (error.message && error.message.includes('permission')) {
            return 'high';
        }
        if (context.payment || context.order) {
            return 'high'; // Payment/order errors are critical
        }
        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            return 'high';
        }
        return 'low';
    }

    async getTodayErrors() {
        if (!this.isInitialized) return [];
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const errorDocRef = window.firebaseServices.doc(window.firebaseDb, 'errors', today);
            const errorDoc = await window.firebaseServices.getDoc(errorDocRef);
            
            if (errorDoc.exists()) {
                return errorDoc.data().errors || [];
            }
            return [];
        } catch (error) {
            console.error('Failed to get today\'s errors:', error);
            return [];
        }
    }

    async getErrorStats(days = 7) {
        if (!this.isInitialized) return {};
        
        try {
            const stats = {
                totalErrors: 0,
                errorsBySeverity: { low: 0, medium: 0, high: 0 },
                errorsByType: {},
                recentErrors: []
            };

            // Get errors from the last N days
            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                
                const errorDocRef = window.firebaseServices.doc(window.firebaseDb, 'errors', dateString);
                const errorDoc = await window.firebaseServices.getDoc(errorDocRef);
                
                if (errorDoc.exists()) {
                    const data = errorDoc.data();
                    stats.totalErrors += data.totalErrors || 0;
                    
                    if (data.errors) {
                        data.errors.forEach(error => {
                            // Count by severity
                            stats.errorsBySeverity[error.severity] = (stats.errorsBySeverity[error.severity] || 0) + 1;
                            
                            // Count by error type
                            const errorType = error.error.name || 'Unknown';
                            stats.errorsByType[errorType] = (stats.errorsByType[errorType] || 0) + 1;
                            
                            // Add to recent errors (limit to 10)
                            if (stats.recentErrors.length < 10) {
                                stats.recentErrors.push({
                                    ...error,
                                    date: dateString
                                });
                            }
                        });
                    }
                }
            }

            return stats;
        } catch (error) {
            console.error('Failed to get error stats:', error);
            return {};
        }
    }
}

// Create global error logger instance
window.errorLogger = new ErrorLogger();

// Only log card payment related errors automatically
// Other errors will be logged manually when needed

export default ErrorLogger;
