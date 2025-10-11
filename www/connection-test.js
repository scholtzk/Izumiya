// connection-test.js
// Test script to verify connection management improvements

// Test the retry mechanism
async function testRetryMechanism() {
    console.log('Testing retry mechanism...');
    
    let attemptCount = 0;
    const testOperation = async () => {
        attemptCount++;
        console.log(`Test operation attempt ${attemptCount}`);
        
        if (attemptCount < 3) {
            throw new Error('Simulated failure');
        }
        
        return 'Success!';
    };
    
    try {
        const result = await window.retryFirestoreOperation(testOperation, 3);
        console.log('Retry test passed:', result);
    } catch (error) {
        console.error('Retry test failed:', error);
    }
}

// Test connection status
async function testConnectionStatus() {
    console.log('Testing connection status...');
    
    const statusIndicator = document.getElementById('connection-status');
    if (statusIndicator) {
        console.log('Current status:', statusIndicator.textContent);
        console.log('Current class:', statusIndicator.className);
    }
    
    if (window.ensureFirestoreConnection) {
        const isConnected = await window.ensureFirestoreConnection();
        console.log('Connection test result:', isConnected);
    }
}

// Test timeout mechanism
async function testTimeoutMechanism() {
    console.log('Testing timeout mechanism...');
    
    const slowOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds
        return 'Slow operation completed';
    };
    
    try {
        const result = await window.retryFirestoreOperation(slowOperation, 1);
        console.log('Timeout test result:', result);
    } catch (error) {
        console.log('Timeout test caught error as expected:', error.message);
    }
}

// Export test functions
window.testConnectionManagement = {
    testRetryMechanism,
    testConnectionStatus,
    testTimeoutMechanism
};

console.log('Connection management test functions loaded. Use window.testConnectionManagement to run tests.'); 