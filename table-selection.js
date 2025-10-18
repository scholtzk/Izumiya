// table-selection.js
// Handles table selection functionality for orders

export function initTableSelection() {
    const tableSelectBtn = document.getElementById('tableSelectBtn');
    const tableSelectionModal = document.getElementById('tableSelectionModal');
    const closeTableModal = document.getElementById('closeTableModal');
    const tableNumberBadge = document.getElementById('tableNumberBadge');
    const tableItems = document.querySelectorAll('.table-item');
    
    let currentTableNumber = null;
    
    // Open table selection modal
    tableSelectBtn.addEventListener('click', () => {
        tableSelectionModal.style.display = 'block';
        // Ensure iframe content is loaded before updating display
        const iframe = tableSelectionModal.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.onload = () => updateTableSelectionDisplay();
            if (iframe.contentWindow.document.readyState === 'complete') {
                updateTableSelectionDisplay();
            }
        }
    });
    
    // Close table selection modal
    closeTableModal.addEventListener('click', () => {
        tableSelectionModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    tableSelectionModal.addEventListener('click', (e) => {
        if (e.target === tableSelectionModal) {
            tableSelectionModal.style.display = 'none';
        }
    });
    
    // Handle table selection from iframe via postMessage
    window.addEventListener('message', (event) => {
        if (event.data.type === 'tableSelected') {
            const tableNumber = event.data.tableNumber;
            
            // If clicking the same table, deselect it
            if (currentTableNumber === tableNumber) {
                currentTableNumber = null;
            } else {
                currentTableNumber = tableNumber;
            }
            
            // Update current order with table number
            updateCurrentOrderTableNumber(currentTableNumber);
            
            // Update UI
            updateTableSelectionDisplay();
            updateTableButtonDisplay();
            
            // Close modal immediately after selection
            tableSelectionModal.style.display = 'none';
        }
    });
    
    // Update table selection display in modal
    function updateTableSelectionDisplay() {
        const iframe = tableSelectionModal.querySelector('iframe');
        if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
            const iframeDocument = iframe.contentWindow.document;
            iframeDocument.querySelectorAll('.table-item').forEach(item => {
                const tableNumber = item.getAttribute('data-table');
                if (tableNumber === currentTableNumber) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
    }
    
    // Update table button display
    function updateTableButtonDisplay() {
        if (currentTableNumber) {
            tableNumberBadge.textContent = currentTableNumber === 'counter' ? 'C' : currentTableNumber;
            tableNumberBadge.style.display = 'flex';
        } else {
            tableNumberBadge.style.display = 'none';
        }
    }
    
    // Update current order with table number
    function updateCurrentOrderTableNumber(tableNumber) {
        if (window.currentOrder) {
            window.currentOrder.tableNumber = tableNumber;
            
            // Save to Firebase
            if (window.saveCurrentOrder) {
                window.saveCurrentOrder(window.currentOrder);
            }
            
            console.log('Updated current order table number:', tableNumber);
        }
    }
    
    // Load table number from current order
    function loadTableNumberFromCurrentOrder() {
        if (window.currentOrder && window.currentOrder.tableNumber) {
            currentTableNumber = window.currentOrder.tableNumber;
            updateTableButtonDisplay();
        }
    }
    
    // Initialize table number from current order
    loadTableNumberFromCurrentOrder();
    
    // Listen for current order changes
    const originalSetCurrentOrder = window.setCurrentOrder;
    if (originalSetCurrentOrder) {
        window.setCurrentOrder = function(order) {
            originalSetCurrentOrder(order);
            loadTableNumberFromCurrentOrder();
        };
    }
    
    // Return functions for external use
    return {
        getCurrentTableNumber: () => currentTableNumber,
        setTableNumber: (tableNumber) => {
            currentTableNumber = tableNumber;
            updateCurrentOrderTableNumber(tableNumber);
            updateTableButtonDisplay();
        },
        clearTableNumber: () => {
            currentTableNumber = null;
            updateCurrentOrderTableNumber(null);
            updateTableButtonDisplay();
        }
    };
}

// Function to get table display text for order log
export function getTableDisplayText(tableNumber) {
    if (!tableNumber) return '';
    if (tableNumber === 'counter') return 'Counter';
    return `Table ${tableNumber}`;
}
