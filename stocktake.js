// Stocktake System
// Remove Firebase imports since we'll use window.firebaseServices

// Custom modal functions
function showCustomAlert(message, type = 'info') {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '10px';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '400px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.textAlign = 'center';
    modal.style.position = 'relative';

    // Set color based on type
    let color = 'var(--primary)';
    if (type === 'error') color = '#dc3545';
    if (type === 'warning') color = '#ffc107';
    if (type === 'success') color = '#28a745';

    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '25px';
    messageElement.style.color = '#333';
    messageElement.style.fontSize = '16px';
    messageElement.style.lineHeight = '1.5';

    // Create OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '12px 30px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '8px';
    okButton.style.backgroundColor = color;
    okButton.style.color = 'white';
    okButton.style.cursor = 'pointer';
    okButton.style.fontSize = '16px';
    okButton.style.fontWeight = 'bold';
    okButton.style.minWidth = '100px';
    okButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // Assemble modal
    modal.appendChild(messageElement);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Focus on button for keyboard navigation
    okButton.focus();
}

function showCustomConfirm(message, onConfirm, onCancel) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '10px';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '400px';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.textAlign = 'center';
    modal.style.position = 'relative';

    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '25px';
    messageElement.style.color = '#333';
    messageElement.style.fontSize = '16px';
    messageElement.style.lineHeight = '1.5';

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '15px';
    buttonsContainer.style.justifyContent = 'center';

    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '12px 25px';
    cancelButton.style.border = '1px solid #e0e0e0';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.backgroundColor = 'white';
    cancelButton.style.color = '#666';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.fontWeight = 'bold';
    cancelButton.style.minWidth = '80px';
    cancelButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    };

    // Create Confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.style.padding = '12px 25px';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.backgroundColor = '#dc3545';
    confirmButton.style.color = 'white';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.fontSize = '16px';
    confirmButton.style.fontWeight = 'bold';
    confirmButton.style.minWidth = '80px';
    confirmButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm();
    };

    // Assemble modal
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(confirmButton);
    modal.appendChild(messageElement);
    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        }
    });

    // Focus on cancel button for keyboard navigation
    cancelButton.focus();
}

const inventoryData = {
    'Toast': {
        name: 'Toast',
        name_ja: 'トーズト',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/760649000',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Bread': {
        name: 'Bread',
        name_ja: 'パン',
        supplier: 'Dining Plus',
        supplierUrl: 'https://www.dining-plus.com/shop/g/g1-2A0-U2S3',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Burger Buns': {
        name: 'Burger Buns',
        name_ja: 'ハンバーガーバンズ',
        supplier: 'Amazon',
        supplierUrl: 'https://www.amazon.co.jp/-/en/Fluffy-Burger-Frozen-Piece-Hamburger/dp/B08DR7ZGQ3',
        currentStock: 0,
        reorderQuantity: 50,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Cheesecake': {
        name: 'Cheesecake',
        name_ja: 'チーズケーキ',
        supplier: 'Sweets Pro',
        supplierUrl: 'https://www.sweets-pro.com/Form/Product/ProductDetail.aspx?shop=0&pid=01015360&cat=100101',
        currentStock: 0,
        reorderQuantity: 6,
        unit: 'portions',
        category: 'Desserts',
        shippingTime: 3
    },
    'Fries': {
        name: 'Fries',
        name_ja: 'フライドポテト',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/779201316',
        currentStock: 0,
        reorderQuantity: 20,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Chips': {
        name: 'Chips',
        name_ja: 'チップス',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://www.amazon.co.jp/dp/B08HCQD6VQ',
        currentStock: 0,
        reorderQuantity: 20,
        unit: 'portions',
        category: 'Pantry',
        shippingTime: 3
    },
    'Chocolate Ice Cream': {
        name: 'Chocolate Ice Cream',
        name_ja: 'チョコレートアイスクリーム',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/769108666',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Desserts',
        shippingTime: 3
    },
    'Cookies': {
        name: 'Cookies',
        name_ja: 'クッキー',
        supplier: 'Amazon',
        supplierUrl: 'https://www.amazon.co.jp/-/en/dp/B0DJR1GNW6',
        currentStock: 0,
        reorderQuantity: 30,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Croissant': {
        name: 'Croissant',
        name_ja: 'クロワッサン',
        supplier: 'Picard',
        supplierUrl: 'https://picard-frozen.jp/collections/bread/products/200121',
        currentStock: 0,
        reorderQuantity: 20,
        unit: 'portions',
        category: 'Bakery',
        shippingTime: 3
    },
    'Cheese': {
        name: 'Cheese',
        name_ja: 'チーズ',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 20,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Granola': {
        name: 'Granola',
        name_ja: 'グラノーラ',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 20,
        unit: 'portions',
        category: 'Pantry',
        shippingTime: 3
    },
    'Apple Juice': {
        name: 'Apple Juice',
        name_ja: 'アップルジュース',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Beverages',
        shippingTime: 3
    },
    'Orange Juice': {
        name: 'Orange Juice',
        name_ja: 'オレンジジュース',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Beverages',
        shippingTime: 3
    },
    'Coke': {
        name: 'Coke',
        name_ja: 'コーラ',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Ramune': {
        name: 'Ramune',
        name_ja: 'ラムネ',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Oolong Tea': {
        name: 'Oolong Tea',
        name_ja: 'ウーロン茶',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Beer': {
        name: 'Beer',
        name_ja: 'ビール',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'cans',
        category: 'Beverages',
        shippingTime: 3
    },
    'Ginger Ale': {
        name: 'Ginger Ale',
        name_ja: 'ジンジャーエール',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 12,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Sparkling Water': {
        name: 'Sparkling Water',
        name_ja: '炭酸水',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Water': {
        name: 'Water',
        name_ja: '水',
        supplier: 'Supermarket',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 24,
        unit: 'bottles',
        category: 'Beverages',
        shippingTime: 3
    },
    'Matcha Ice Cream': {
        name: 'Matcha Ice Cream',
        name_ja: '抹茶アイスクリーム',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/769108665',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Desserts',
        shippingTime: 3
    },
    'Prosciutto': {
        name: 'Prosciutto',
        name_ja: 'プロシュート',
        supplier: 'Dining Plus',
        supplierUrl: 'https://www.dining-plus.com/shop/g/gR-1097/',
        currentStock: 0,
        reorderQuantity: 5,
        unit: 'portions',
        category: 'Meat',
        shippingTime: 3
    },
    'Salmon': {
        name: 'Salmon',
        name_ja: 'サーモン',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/295333000',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Freezer',
        shippingTime: 3
    },
    'Vanilla Ice Cream': {
        name: 'Vanilla Ice Cream',
        name_ja: 'バニラアイスクリーム',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/769108664',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Desserts',
        shippingTime: 3
    },
    'Chocolate Cake': {
        name: 'Chocolate Cake',
        name_ja: 'チョコレートケーキ',
        supplier: 'Foods Fridge',
        supplierUrl: 'https://foodsfridge.jp/products/271725000',
        currentStock: 0,
        reorderQuantity: 6,
        unit: 'portions',
        category: 'Desserts',
        shippingTime: 3
    },
    'Guacamole': {
        name: 'Guacamole',
        name_ja: 'グアカモーレ',
        supplier: 'Amazon',
        supplierUrl: 'https://www.amazon.co.jp/-/en/dp/B0B57YB396',
        currentStock: 0,
        reorderQuantity: 10,
        unit: 'portions',
        category: 'Fridge',
        shippingTime: 3
    },
    'Cocoa': {
        name: 'Cocoa',
        name_ja: 'ココア',
        supplier: 'Amazon',
        supplierUrl: 'https://www.amazon.co.jp/-/en/dp/B000FQ5K2C',
        currentStock: 0,
        reorderQuantity: 5,
        unit: 'portions',
        category: 'Beverages',
        shippingTime: 3
    }
};

// Track processed orders globally
let processedOrderNumbers = new Set();

// Function to fetch orders from Firebase
async function fetchOrders(start, end) {
    try {
        const ordersRef = window.firebaseServices.collection(window.firebaseDb, 'orders');
        const q = window.firebaseServices.query(
            ordersRef,
            window.firebaseServices.where('timestamp', '>=', window.firebaseServices.Timestamp.fromDate(start)),
            window.firebaseServices.where('timestamp', '<=', window.firebaseServices.Timestamp.fromDate(end)),
            window.firebaseServices.orderBy('timestamp', 'asc')
        );
        
        const querySnapshot = await window.firebaseServices.getDocs(q);
        const orders = querySnapshot.docs.map(doc => doc.data());
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to fetch usage data for an item
async function fetchItemUsage(itemName) {
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6); // Past 7 days including today
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const orders = await fetchOrders(start, end);
        let totalUsage = 0;
        let dailyUsage = Array(7).fill(0);

        // Calculate usage for the item
        orders.forEach(order => {
            if (order.items) {
                const orderDate = order.timestamp.toDate();
                const dayIndex = 6 - Math.floor((end - orderDate) / (1000 * 60 * 60 * 24));
                
                order.items.forEach(item => {
                    if (item && item.name) {
                        let itemUsage = 0;
                        
                        // Special handling for bread
                        if (itemName === 'Bread') {
                            if (item.name.toLowerCase().includes('salmon sandwich') ||
                                item.name.toLowerCase().includes('caprese sandwich') ||
                                item.name.toLowerCase().includes('tuna sandwich')) {
                                itemUsage = item.quantity || 0;
                            }
                        }
                        // Special handling for toast
                        else if (itemName === 'Toast') {
                            if (item.name.toLowerCase().includes('toast')) {
                                itemUsage = (item.quantity || 0) * 2;
                            }
                            if (item.name.toLowerCase().includes('breakfast')) {
                                itemUsage = (item.quantity || 0) * 2;
                            }
                        }
                        // Regular item handling
                        else if (item.name === 'Soft Drink' && item.customizations && item.customizations.includes(itemName)) {
                            itemUsage = item.quantity || 0;
                        } else if (item.customizations && item.customizations.includes(itemName)) {
                            itemUsage = item.quantity || 0;
                        } else if (item.name === itemName) {
                            itemUsage = item.quantity || 0;
                        }

                        if (itemUsage > 0 && dayIndex >= 0 && dayIndex < 7) {
                            dailyUsage[dayIndex] += itemUsage;
                            totalUsage += itemUsage;
                        }
                    }
                });
            }
        });

        // Calculate average
        const average = totalUsage / 7;

        return {
            total: totalUsage,
            average: average,
            dailyUsage: dailyUsage
        };
    } catch (error) {
        console.error('Error fetching item usage:', error);
        return {
            total: 0,
            average: 0,
            dailyUsage: Array(7).fill(0)
        };
    }
}

// Function to render the stocktake interface
async function renderStocktake(container) {
    if (!container) return;
    console.log('Rendering stocktake interface');

    // Create the main structure
    container.innerHTML = `
        <div class="stocktake-container">
            <div class="stocktake-header">
                <h2>${currentLang === 'ja' ? '在庫管理' : 'Stock Management'}</h2>
                <div class="stocktake-controls">
                    <button class="stocktake-btn" id="editItems">${currentLang === 'ja' ? 'アイテム編集' : 'Edit Items'}</button>
                    <button class="stocktake-btn" id="orderSelected" disabled>${currentLang === 'ja' ? '選択したアイテムを注文' : 'Order Selected'}</button>
                    <button class="stocktake-btn" id="exportStocktake">${currentLang === 'ja' ? 'エクスポート' : 'Export'}</button>
                    <button class="stocktake-btn" id="saveStocktake">${currentLang === 'ja' ? '保存' : 'Save'}</button>
                </div>
            </div>
            
            <div class="stocktake-filters">
                <select id="categoryFilter">
                    <option value="all">${currentLang === 'ja' ? '全カテゴリー' : 'All Categories'}</option>
                    ${[...new Set(Object.values(inventoryData).map(item => item.category))].map(category => 
                        `<option value="${category}">${category}</option>`
                    ).join('')}
                </select>
                <select id="stockFilter">
                    <option value="all">${currentLang === 'ja' ? '全在庫' : 'All Stock'}</option>
                    <option value="low">${currentLang === 'ja' ? '在庫切れ' : 'Low Stock'}</option>
                    <option value="out">${currentLang === 'ja' ? '在庫なし' : 'Out of Stock'}</option>
                </select>
                <input type="text" id="searchStock" placeholder="${currentLang === 'ja' ? '検索...' : 'Search...'}">
            </div>

            <div class="stocktake-grid">
                ${Object.entries(inventoryData)
                    .sort((a, b) => a[1].category.localeCompare(b[1].category))
                    .reduce((acc, [key, item], index, array) => {
                        // Add category header if it's the first item or category changed
                        if (index === 0 || item.category !== array[index - 1][1].category) {
                            acc.push(`
                                ${index > 0 ? '<div class="category-divider"></div>' : ''}
                                <div class="category-header">${item.category}</div>
                            `);
                        }
                        
                        // Add the item
                        acc.push(`
                            <div class="stocktake-item" data-category="${item.category}" data-item="${key}">
                                <div class="stocktake-item-header">
                                    <div class="stocktake-item-title">
                                        <input type="checkbox" class="item-selector" data-item="${key}">
                                        <h3><a href="${item.supplierUrl}" target="_blank">${currentLang === 'ja' ? item.name_ja : item.name}</a></h3>
                                    </div>
                                    <span class="stocktake-category">${item.category}</span>
                                </div>
                                <div class="stocktake-item-details">
                                    <div class="stocktake-stock">
                                        <label>${currentLang === 'ja' ? '在庫数' : 'Current Stock'}:</label>
                                        <span class="current-stock">${item.currentStock}</span>
                                        <span class="stocktake-unit">${item.unit}</span>
                                        <button class="update-stock-btn" data-item="${key}">${currentLang === 'ja' ? '在庫更新' : 'Update Stock'}</button>
                                    </div>
                                </div>
                                ${item.isSubscription ? `
                                    <div class="stocktake-status subscription">
                                        <div class="next-delivery">
                                            <span class="delivery-label">${currentLang === 'ja' ? '次回配送予定' : 'Next Delivery'}:</span>
                                            <span class="delivery-value">${item.nextDeliveryDate ? item.nextDeliveryDate.toDate().toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <button class="update-delivery-btn" onclick="window.stocktakeSystem.updateSubscriptionDelivery('${key}')">
                                            ${currentLang === 'ja' ? '配送更新' : 'Update Delivery'}
                                        </button>
                                    </div>
                                ` : `
                                    <div class="stocktake-status">
                                        ${currentLang === 'ja' ? '読み込み中...' : 'Loading...'}
                                    </div>
                                `}
                                ${!item.orderStatus || !item.orderStatus.ordered ? `
                                    <div class="order-actions">
                                        <button class="order-btn" onclick="window.stocktakeSystem.markItemAsOrdered('${key}')">
                                            ${currentLang === 'ja' ? '発注済みとしてマーク' : 'Mark as Ordered'}
                                        </button>
                                    </div>
                                ` : `
                                    <div class="order-status">
                                        <div class="order-date">
                                            <span class="order-label">${currentLang === 'ja' ? '発注日' : 'Ordered'}:</span>
                                            <span class="order-value">${item.orderStatus.orderDate.toDate().toLocaleDateString()}</span>
                                        </div>
                                        <div class="arrival-date">
                                            <span class="order-label">${currentLang === 'ja' ? '到着予定' : 'Expected Arrival'}:</span>
                                            <span class="order-value">${item.orderStatus.estimatedArrival.toDate().toLocaleDateString()}</span>
                                        </div>
                                        ${item.orderStatus.quantity ? `
                                            <div class="order-quantity">
                                                <span class="order-label">${currentLang === 'ja' ? '発注数量' : 'Order Quantity'}:</span>
                                                <span class="order-value">${item.orderStatus.quantity} ${item.unit}</span>
                                            </div>
                                        ` : ''}
                                        <div class="order-actions">
                                            <button class="arrived-btn" onclick="window.stocktakeSystem.markItemAsArrived('${key}')">
                                                ${currentLang === 'ja' ? '到着済み' : 'Mark as Arrived'}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                <div class="stocktake-usage" data-item="${key}">
                                    <div class="usage-loading">${currentLang === 'ja' ? '使用量を読み込み中...' : 'Loading usage data...'}</div>
                                </div>
                            </div>
                        `);
                        return acc;
                    }, [])
                    .join('')}
            </div>
        </div>

        <!-- Edit Items Modal -->
        <div id="editItemsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${currentLang === 'ja' ? 'アイテム編集' : 'Edit Items'}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <button id="addNewItem" class="stocktake-btn">${currentLang === 'ja' ? '新規アイテム追加' : 'Add New Item'}</button>
                    <div id="itemsList"></div>
                </div>
            </div>
        </div>

        <!-- Update Stock Modal -->
        <div id="updateStockModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${currentLang === 'ja' ? '在庫更新' : 'Update Stock'} - <span id="updateItemName"></span></h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stock-update-options">
                        <button class="stock-action-btn add" data-action="add">${currentLang === 'ja' ? '追加' : 'Add'}</button>
                        <button class="stock-action-btn subtract" data-action="subtract">${currentLang === 'ja' ? '減算' : 'Subtract'}</button>
                    </div>
                    <div class="numpad-display">
                        <input type="text" id="stockAmount" readonly>
                    </div>
                    <div class="numpad-grid">
                        <button class="numpad-btn">1</button>
                        <button class="numpad-btn">2</button>
                        <button class="numpad-btn">3</button>
                        <button class="numpad-btn">4</button>
                        <button class="numpad-btn">5</button>
                        <button class="numpad-btn">6</button>
                        <button class="numpad-btn">7</button>
                        <button class="numpad-btn">8</button>
                        <button class="numpad-btn">9</button>
                        <button class="numpad-btn clear">C</button>
                        <button class="numpad-btn">0</button>
                        <button class="numpad-btn enter">Enter</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    addStocktakeEventListeners();
    console.log('Stocktake interface rendered and event listeners added');

    // Load usage data for each item
    await Promise.all(Object.entries(inventoryData).map(async ([key, item]) => {
        const usageContainer = document.querySelector(`.stocktake-usage[data-item="${key}"]`);
        if (usageContainer) {
            try {
                const usageData = await fetchItemUsage(item.name);
                const currentStock = item.currentStock;
                
                // Calculate days left based on current stock and average usage
                let daysLeft;
                if (usageData.average === 0) {
                    daysLeft = 0; // No usage data means we need to reorder
                } else {
                    daysLeft = Math.floor(currentStock / usageData.average);
                }
                
                console.log('Debug stock status:', {
                    item: item.name,
                    currentStock,
                    average: usageData.average,
                    daysLeft,
                    shippingTime: item.shippingTime,
                    condition: daysLeft === 0 || daysLeft <= item.shippingTime
                });
                
                // Update status based on days left vs shipping time
                const statusDiv = document.querySelector(`.stocktake-item[data-item="${key}"] .stocktake-status`);
                if (statusDiv) {
                    if (daysLeft === 0 || daysLeft <= item.shippingTime) {
                        statusDiv.classList.add('low-stock');
                        statusDiv.classList.remove('stock-ok', 'reorder-soon');
                        statusDiv.textContent = currentLang === 'ja' ? '発注が必要' : 'Reorder Needed';
                    } else if (daysLeft === item.shippingTime + 1) {
                        statusDiv.classList.remove('low-stock', 'stock-ok');
                        statusDiv.classList.add('reorder-soon');
                        statusDiv.textContent = currentLang === 'ja' ? '発注予定' : 'Reorder Soon';
                    } else {
                        statusDiv.classList.remove('low-stock', 'reorder-soon');
                        statusDiv.classList.add('stock-ok');
                        statusDiv.textContent = currentLang === 'ja' ? '在庫十分' : 'Stock OK';
                    }
                }
                
                usageContainer.innerHTML = `
                    <div class="usage-header">
                        <div class="usage-total">
                            <span class="usage-label">${currentLang === 'ja' ? '在庫予測' : 'Stock Projection'}:</span>
                            <span class="usage-value">${daysLeft === 0 ? 
                                (currentLang === 'ja' ? '使用なし' : 'No Usage') : 
                                `${daysLeft} ${currentLang === 'ja' ? '日' : 'days'}`}</span>
                        </div>
                        <div class="usage-average">
                            <span class="usage-label">${currentLang === 'ja' ? '配送予定日数' : 'Shipping Time'}:</span>
                            <span class="usage-value">${item.shippingTime || 3} ${currentLang === 'ja' ? '日' : 'days'}</span>
                        </div>
                    </div>
                    <div class="usage-header">
                        <div class="usage-average">
                            <span class="usage-label">${currentLang === 'ja' ? '平均使用量' : 'Average Usage'}:</span>
                            <span class="usage-value">${usageData.average.toFixed(1)} ${item.unit}/day</span>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading usage data:', error);
                usageContainer.innerHTML = `<div class="usage-error">${currentLang === 'ja' ? '使用量データの読み込みに失敗しました' : 'Failed to load usage data'}</div>`;
            }
        }
    }));
}

// Function to add event listeners to stocktake interface
function addStocktakeEventListeners() {
    // Existing event listeners
    document.getElementById('categoryFilter').addEventListener('change', filterStocktake);
    document.getElementById('stockFilter').addEventListener('change', filterStocktake);
    document.getElementById('searchStock').addEventListener('input', filterStocktake);
    document.getElementById('exportStocktake').addEventListener('click', exportStocktake);
    document.getElementById('saveStocktake').addEventListener('click', saveStocktake);

    // New event listeners
    document.getElementById('editItems').addEventListener('click', showEditModal);
    document.getElementById('orderSelected').addEventListener('click', orderSelectedItems);
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    document.getElementById('addNewItem').addEventListener('click', addNewItem);

    // Item selection
    document.querySelectorAll('.item-selector').forEach(checkbox => {
        checkbox.addEventListener('change', updateOrderButton);
    });

    // Update stock buttons
    document.querySelectorAll('.update-stock-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemKey = button.dataset.item;
            showUpdateStockModal(itemKey);
        });
    });

    // Stock action buttons (Add/Subtract)
    document.querySelectorAll('.stock-action-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.stock-action-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
        });
    });

    // Numpad event listeners
    document.querySelectorAll('.numpad-btn').forEach(button => {
        button.addEventListener('click', () => {
            const display = document.getElementById('stockAmount');
            if (!display) return;
            
            if (button.classList.contains('clear')) {
                display.value = '';
            } else if (button.classList.contains('enter')) {
                const amount = parseInt(display.value) || 0;
                const itemKey = display.dataset.item;
                const activeAction = document.querySelector('.stock-action-btn.active');
                
                if (!activeAction) {
                    showCustomAlert(currentLang === 'ja' ? '追加または減算を選択してください' : 'Please select Add or Subtract', 'warning');
                    return;
                }
                
                const action = activeAction.dataset.action;
                updateStockAmount(itemKey, amount, action);
                document.getElementById('updateStockModal').style.display = 'none';
                display.value = '';
            } else {
                display.value += button.textContent;
            }
        });
    });
}

// Function to filter stocktake items
function filterStocktake() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    const searchFilter = document.getElementById('searchStock').value.toLowerCase();
    
    document.querySelectorAll('.stocktake-item').forEach(item => {
        const category = item.dataset.category;
        const stock = parseInt(item.querySelector('.current-stock').textContent);
        const name = item.querySelector('h3').textContent.toLowerCase();
        const nameJa = item.querySelector('h3').textContent.toLowerCase();
        
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter;
        const stockMatch = stockFilter === 'all' || 
            (stockFilter === 'low' && item.querySelector('.stocktake-status').classList.contains('low-stock')) ||
            (stockFilter === 'out' && stock === 0);
        const searchMatch = name.includes(searchFilter) || nameJa.includes(searchFilter);
        
        // Show/hide the item based on all filters
        item.style.display = categoryMatch && stockMatch && searchMatch ? 'block' : 'none';
        
        // Also show/hide category headers and dividers based on visibility of items
        const categoryHeader = item.previousElementSibling;
        const categoryDivider = item.previousElementSibling?.previousElementSibling;
        
        if (categoryHeader && categoryHeader.classList.contains('category-header')) {
            // Check if any items in this category are visible
            const categoryItems = document.querySelectorAll(`.stocktake-item[data-category="${category}"]`);
            const hasVisibleItems = Array.from(categoryItems).some(item => item.style.display !== 'none');
            categoryHeader.style.display = hasVisibleItems ? 'block' : 'none';
            
            if (categoryDivider && categoryDivider.classList.contains('category-divider')) {
                categoryDivider.style.display = hasVisibleItems ? 'block' : 'none';
            }
        }
    });
}

// Function to update stock level
async function updateStockLevel(event) {
    const input = event.target;
    const itemKey = input.dataset.item;
    const newValue = parseInt(input.value);
    
    if (newValue >= 0) {
        inventoryData[itemKey].currentStock = newValue;
        
        // Update status indicator
        const statusDiv = input.closest('.stocktake-item').querySelector('.stocktake-status');
        const item = inventoryData[itemKey];
        const usageData = await fetchItemUsage(item.name);
        
        // Calculate days left based on current stock and average usage
        let daysLeft;
        if (usageData.average === 0) {
            daysLeft = 0; // No usage data means we need to reorder
        } else {
            daysLeft = Math.floor(newValue / usageData.average);
        }
        
        // Update status based on days left vs shipping time
        if (daysLeft === 0 || daysLeft <= item.shippingTime) {
            statusDiv.classList.add('low-stock');
            statusDiv.classList.remove('stock-ok', 'reorder-soon');
            statusDiv.textContent = currentLang === 'ja' ? '発注が必要' : 'Reorder Needed';
        } else if (daysLeft === item.shippingTime + 1) {
            statusDiv.classList.remove('low-stock', 'stock-ok');
            statusDiv.classList.add('reorder-soon');
            statusDiv.textContent = currentLang === 'ja' ? '発注予定' : 'Reorder Soon';
        } else {
            statusDiv.classList.remove('low-stock', 'reorder-soon');
            statusDiv.classList.add('stock-ok');
            statusDiv.textContent = currentLang === 'ja' ? '在庫十分' : 'Stock OK';
        }
    }
}

// Function to export stocktake data
function exportStocktake() {
    const data = Object.entries(inventoryData).map(([key, item]) => ({
        name: currentLang === 'ja' ? item.name_ja : item.name,
        category: item.category,
        currentStock: item.currentStock,
        shippingTime: item.shippingTime,
        unit: item.unit,
        supplier: item.supplier
    }));
    
    const csv = [
        ['Name', 'Category', 'Current Stock', 'Shipping Time', 'Unit', 'Supplier'].join(','),
        ...data.map(item => [
            item.name,
            item.category,
            item.currentStock,
            item.shippingTime,
            item.unit,
            item.supplier
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stocktake-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Function to save stocktake data
async function saveStocktake() {
    try {
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        await window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving stocktake data:', error);
        showCustomAlert(currentLang === 'ja' ? 'エラーが発生しました' : 'Error saving stock data', 'error');
    }
}

// Function to load stocktake data
async function loadStocktake() {
    try {
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        const doc = await window.firebaseServices.getDoc(stocktakeRef);
        
        if (doc.exists()) {
            const data = doc.data();
            // Clear existing data and assign new data
            Object.keys(inventoryData).forEach(key => delete inventoryData[key]);
            
            // Ensure all properties are preserved when loading from Firebase
            Object.entries(data.inventory).forEach(([key, item]) => {
                inventoryData[key] = {
                    ...item,
                    shippingTime: item.shippingTime || 3, // Ensure shippingTime is set
                    currentStock: item.currentStock || 0,
                    reorderQuantity: item.reorderQuantity || 0,
                    unit: item.unit || 'portions',
                    category: item.category || 'Misc'
                };
            });
            
            // Re-render the stocktake interface with the loaded data
            const container = document.querySelector('.stocktake-container');
            if (container) {
                renderStocktake(container);
            }
        }
    } catch (error) {
        console.error('Error loading stocktake data:', error);
    }
}

// Function to show edit modal
function showEditModal() {
    const modal = document.getElementById('editItemsModal');
    const itemsList = document.getElementById('itemsList');
    
    // Group items by category
    const itemsByCategory = {};
    Object.entries(inventoryData).forEach(([key, item]) => {
        const category = item.category || 'Misc';
        if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
        }
        itemsByCategory[category].push({ key, item });
    });

    // Sort categories alphabetically
    const sortedCategories = Object.keys(itemsByCategory).sort();
    
    // Generate HTML for each category
    itemsList.innerHTML = sortedCategories.map(category => `
        <div class="category-section">
            <h3 class="category-header">${category}</h3>
            <div class="category-items">
                ${itemsByCategory[category].map(({ key, item }) => `
                    <div class="edit-item" data-key="${key}">
                        <div class="edit-item-header">
                            <h3>${currentLang === 'ja' ? item.name_ja : item.name}</h3>
                            <button class="edit-item-btn" data-key="${key}">${currentLang === 'ja' ? '編集' : 'Edit'}</button>
                            <button class="delete-item-btn" data-key="${key}">${currentLang === 'ja' ? '削除' : 'Delete'}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Add event listeners for edit and delete buttons
    itemsList.querySelectorAll('.edit-item-btn').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.key;
            editItem(key);
        });
    });
    
    itemsList.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.key;
            deleteItem(key);
        });
    });
    
    modal.style.display = 'block';
}

// Function to hide edit modal
function hideEditModal() {
    const modal = document.getElementById('editItemsModal');
    modal.style.display = 'none';
}

// Function to add new item
function addNewItem() {
    const newItem = {
        name: '',
        name_ja: '',
        supplier: '',
        supplierUrl: '',
        currentStock: 0,
        reorderQuantity: 0,
        unit: 'portions',
        category: 'Misc',
        shippingTime: 3
    };
    
    const key = 'new_item_' + Date.now();
    inventoryData[key] = newItem;
    editItem(key);
}

// Function to edit item
function editItem(key) {
    const item = inventoryData[key];
    const modal = document.getElementById('editItemsModal');
    const itemsList = document.getElementById('itemsList');
    
    itemsList.innerHTML = `
        <form id="editItemForm" class="edit-form">
            <div class="form-group">
                <label>Name (English):</label>
                <input type="text" name="name" value="${item.name}" required>
            </div>
            <div class="form-group">
                <label>Name (Japanese):</label>
                <input type="text" name="name_ja" value="${item.name_ja}" required>
            </div>
            <div class="form-group">
                <label>Supplier:</label>
                <input type="text" name="supplier" value="${item.supplier}" required>
            </div>
            <div class="form-group">
                <label>Supplier URL:</label>
                <input type="url" name="supplierUrl" value="${item.supplierUrl}">
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" required>
                    <option value="Misc">Misc</option>
                    ${[...new Set(Object.values(inventoryData).map(item => item.category))].map(category => 
                        category ? `<option value="${category}" ${item.category === category ? 'selected' : ''}>${category}</option>` : ''
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Unit:</label>
                <input type="text" name="unit" value="${item.unit}" required>
            </div>
            <div class="form-group">
                <label>Reorder Quantity:</label>
                <input type="number" name="reorderQuantity" value="${item.reorderQuantity}" required>
            </div>
            <div class="form-group">
                <label>Shipping Time (days):</label>
                <input type="number" name="shippingTime" value="${item.shippingTime}" required>
            </div>
            <div class="form-group">
                <label>Current Stock:</label>
                <input type="number" name="currentStock" value="${item.currentStock}" required>
            </div>
            <div class="form-group">
                <label>Is Subscription:</label>
                <input type="checkbox" name="isSubscription" ${item.isSubscription ? 'checked' : ''}>
            </div>
            <div class="subscription-options" style="display: ${item.isSubscription ? 'block' : 'none'}">
                <div class="form-group">
                    <label>Delivery Frequency (days):</label>
                    <input type="number" name="deliveryFrequency" value="${item.deliveryFrequency || 30}" ${item.isSubscription ? 'required' : ''}>
                </div>
                <div class="form-group">
                    <label>Next Delivery Date:</label>
                    <input type="date" name="nextDeliveryDate" value="${item.nextDeliveryDate ? new Date(item.nextDeliveryDate.seconds * 1000).toISOString().split('T')[0] : ''}" ${item.isSubscription ? 'required' : ''}>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="stocktake-btn save-btn">${currentLang === 'ja' ? '保存' : 'Save'}</button>
                <button type="button" class="stocktake-btn cancel-btn">${currentLang === 'ja' ? 'キャンセル' : 'Cancel'}</button>
            </div>
        </form>
    `;
    
    // Add event listener for subscription checkbox
    const subscriptionCheckbox = itemsList.querySelector('input[name="isSubscription"]');
    const subscriptionOptions = itemsList.querySelector('.subscription-options');
    const deliveryFrequencyInput = itemsList.querySelector('input[name="deliveryFrequency"]');
    const nextDeliveryDateInput = itemsList.querySelector('input[name="nextDeliveryDate"]');
    
    subscriptionCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        subscriptionOptions.style.display = isChecked ? 'block' : 'none';
        deliveryFrequencyInput.required = isChecked;
        nextDeliveryDateInput.required = isChecked;
    });
    
    // Add event listener for form submission
    const form = itemsList.querySelector('#editItemForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            const newItem = {};
            
            formData.forEach((value, key) => {
                if (key === 'isSubscription') {
                    newItem[key] = value === 'on';
                } else if (key === 'nextDeliveryDate' && value) {
                    newItem[key] = window.firebaseServices.Timestamp.fromDate(new Date(value));
                } else {
                    newItem[key] = value;
                }
            });
            
            // Update the item in inventoryData
            inventoryData[key] = { ...inventoryData[key], ...newItem };
            
            // Save to Firebase
            const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
            await window.firebaseServices.setDoc(stocktakeRef, {
                inventory: inventoryData,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            
            // Re-render the interface
            showEditModal();
            const container = document.querySelector('.stocktake-container');
            if (container) {
                renderStocktake(container);
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert(currentLang === 'ja' ? '保存に失敗しました' : 'Failed to save changes');
        }
    });

    // Add event listener for cancel button
    const cancelBtn = itemsList.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        showEditModal();
    });
}

// Function to delete item
function deleteItem(key) {
    showCustomConfirm(currentLang === 'ja' ? 'このアイテムを削除してもよろしいですか？' : 'Are you sure you want to delete this item?', () => {
        delete inventoryData[key];
        showEditModal();
        renderStocktake(document.querySelector('.stocktake-container'));
    });
}

// Function to update order button state
function updateOrderButton() {
    const selectedItems = document.querySelectorAll('.item-selector:checked');
    const orderButton = document.getElementById('orderSelected');
    orderButton.disabled = selectedItems.length === 0;
}

// Function to order selected items
function orderSelectedItems() {
    const selectedItems = document.querySelectorAll('.item-selector:checked');
    if (selectedItems.length === 0) return;

    const items = Array.from(selectedItems).map(checkbox => ({
        key: checkbox.dataset.item,
        item: inventoryData[checkbox.dataset.item]
    }));

    showBulkOrderModal(items);
}

// Function to show bulk order modal
function showBulkOrderModal(items) {
    // Filter supermarket items
    const supermarketItems = items.filter(({item}) => item.supplier.toLowerCase() === 'supermarket');
    const otherItems = items.filter(({item}) => item.supplier.toLowerCase() !== 'supermarket');

    // If there are supermarket items, create shopping list
    if (supermarketItems.length > 0) {
        const shoppingList = supermarketItems.map(({item}) => 
            `${item.name} / ${item.name_ja} - ${item.reorderQuantity} ${item.unit}`
        ).join('\n');

        const blob = new Blob([
            `Shopping List / 買い物リスト\n\n${shoppingList}`
        ], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // If there are no other items, return
    if (otherItems.length === 0) return;

    // Create modal for non-supermarket items
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'bulkOrderModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${currentLang === 'ja' ? '一括発注' : 'Bulk Order'}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="bulkOrderForm">
                    ${otherItems.map(({key, item}) => `
                        <div class="bulk-order-item">
                            <div class="bulk-order-header">
                                <h3>${currentLang === 'ja' ? item.name_ja : item.name}</h3>
                                <a href="${item.supplierUrl}" target="_blank" class="supplier-link">
                                    ${currentLang === 'ja' ? '仕入先サイト' : 'Supplier Site'}
                                </a>
                            </div>
                            <div class="bulk-order-details">
                                <div class="form-group">
                                    <label>${currentLang === 'ja' ? '発注数量' : 'Order Quantity'}:</label>
                                    <input type="number" name="quantity_${key}" value="${item.reorderQuantity}" min="1" required>
                                    <span class="unit">${item.unit}</span>
                                </div>
                                <div class="form-group">
                                    <label>${currentLang === 'ja' ? '到着予定日' : 'Expected Arrival'}:</label>
                                    <input type="date" name="arrival_${key}" required>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="form-actions">
                        <button type="submit" class="stocktake-btn">${currentLang === 'ja' ? '発注を確定' : 'Confirm Orders'}</button>
                        <button type="button" class="stocktake-btn cancel-btn">${currentLang === 'ja' ? 'キャンセル' : 'Cancel'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Set default arrival dates based on shipping time
    otherItems.forEach(({key, item}) => {
        const arrivalInput = modal.querySelector(`input[name="arrival_${key}"]`);
        const defaultArrival = new Date();
        defaultArrival.setDate(defaultArrival.getDate() + (parseInt(item.shippingTime) || 3));
        arrivalInput.value = defaultArrival.toISOString().split('T')[0];
    });

    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#bulkOrderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Process each item
        for (const {key, item} of otherItems) {
            const quantity = parseInt(formData.get(`quantity_${key}`));
            const arrivalDate = new Date(formData.get(`arrival_${key}`));
            
            // Update order status
            item.orderStatus = {
                ordered: true,
                orderDate: window.firebaseServices.Timestamp.fromDate(new Date()),
                estimatedArrival: window.firebaseServices.Timestamp.fromDate(arrivalDate),
                quantity: quantity
            };
        }

        // Save to Firebase
        try {
            const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
            await window.firebaseServices.setDoc(stocktakeRef, {
                inventory: inventoryData,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });

            // Close modal and refresh display
            modal.remove();
            const container = document.querySelector('.stocktake-container');
            if (container) {
                renderStocktake(container);
            }
        } catch (error) {
            console.error('Error saving order status:', error);
            showCustomAlert(currentLang === 'ja' ? '発注状態の保存に失敗しました' : 'Failed to save order status', 'error');
        }
    });
}

// Function to mark item as arrived
function markItemAsArrived(itemKey) {
    const item = inventoryData[itemKey];
    if (item.orderStatus && item.orderStatus.ordered) {
        // Add the ordered quantity to current stock
        item.currentStock += item.orderStatus.quantity;
        // Clear the order status
        delete item.orderStatus;
        
        // Save to Firebase
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        }).then(() => {
            // Re-render the interface
            const container = document.querySelector('.stocktake-container');
            if (container) {
                renderStocktake(container);
            }
        }).catch(error => {
            console.error('Error saving stock update:', error);
            showCustomAlert(currentLang === 'ja' ? '在庫の更新に失敗しました' : 'Failed to update stock', 'error');
        });
    }
}

// Function to show update stock modal
function showUpdateStockModal(itemKey) {
    const modal = document.getElementById('updateStockModal');
    const display = document.getElementById('stockAmount');
    const itemName = document.getElementById('updateItemName');
    const item = inventoryData[itemKey];
    
    if (display) {
        display.dataset.item = itemKey;
        display.value = '';
    }
    
    itemName.textContent = currentLang === 'ja' ? item.name_ja : item.name;
    
    // Reset action buttons and select Add by default
    document.querySelectorAll('.stock-action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.stock-action-btn.add').classList.add('active');
    
    modal.style.display = 'block';
}

// Function to update stock amount
async function updateStockAmount(itemKey, amount, action) {
    const item = inventoryData[itemKey];
    const currentStock = item.currentStock;
    
    // Apply the action (add or subtract)
    if (action === 'subtract') {
        // Prevent negative stock
        if (amount > currentStock) {
            alert(currentLang === 'ja' ? '在庫が不足しています' : 'Insufficient stock');
            return;
        }
        item.currentStock -= amount;
    } else {
        item.currentStock += amount;
    }
    
    // Update the display
    const stockDisplay = document.querySelector(`.stocktake-item[data-item="${itemKey}"] .current-stock`);
    stockDisplay.textContent = item.currentStock;
    
    // Update status indicator
    const statusDiv = document.querySelector(`.stocktake-item[data-item="${itemKey}"] .stocktake-status`);
    const usageData = await fetchItemUsage(item.name);
    let daysLeft;
    if (usageData.average === 0) {
        daysLeft = 0;
    } else {
        daysLeft = Math.floor(item.currentStock / usageData.average);
    }
    if (daysLeft === 0 || daysLeft <= item.shippingTime) {
        statusDiv.classList.add('low-stock');
        statusDiv.classList.remove('stock-ok', 'reorder-soon');
        statusDiv.textContent = currentLang === 'ja' ? '発注が必要' : 'Reorder Needed';
    } else if (daysLeft === item.shippingTime + 1) {
        statusDiv.classList.remove('low-stock', 'stock-ok');
        statusDiv.classList.add('reorder-soon');
        statusDiv.textContent = currentLang === 'ja' ? '発注予定' : 'Reorder Soon';
    } else {
        statusDiv.classList.remove('low-stock', 'reorder-soon');
        statusDiv.classList.add('stock-ok');
        statusDiv.textContent = currentLang === 'ja' ? '在庫十分' : 'Stock OK';
    }

    // Save to Firebase
    try {
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        await window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving stock update:', error);
        showCustomAlert(currentLang === 'ja' ? '在庫の更新に失敗しました' : 'Failed to update stock', 'error');
    }
}

// Function to handle special stock circumstances
function handleSpecialStockCircumstances(itemName, quantity, isAdding = false) {
    const specialCases = {
        'nachos': {
            'Cheese': -1,
            'Chips': -1,
            'Guacamole': -1
        },
        'toast': {
            'Toast': -2
        },
        'breakfast': {
            'Toast': -2
        },
        'caprese': {
            'Bread': -1
        },
        'salmon sandwich': {
            'Bread': -1
        },
        'tuna sandwich': {
            'Bread': -1
        },
        // Add specific drink types
        'coke': {
            'Coke': -1
        },
        'ramune': {
            'Ramune': -1
        },
        'oolong tea': {
            'Oolong Tea': -1
        },
        'ginger ale': {
            'Ginger Ale': -1
        },
        'sparkling water': {
            'Sparkling Water': -1
        },
        // Add specific ice cream types
        'chocolate ice cream': {
            'Chocolate Ice Cream': -1
        },
        'matcha ice cream': {
            'Matcha Ice Cream': -1
        },
        'vanilla ice cream': {
            'Vanilla Ice Cream': -1
        },
        // Add specific cake types
        'cheesecake': {
            'Cheesecake': -1
        },
        'chocolate cake': {
            'Chocolate Cake': -1
        },
        // Add milk coffee types
        'soy milk coffee': {
            'Soy Milk': -1
        },
        'oat milk coffee': {
            'Oat Milk': -1
        }
    };

    const itemNameLower = itemName.toLowerCase();
    const stockChanges = {};

    // Check for special cases
    for (const [specialItem, changes] of Object.entries(specialCases)) {
        if (itemNameLower.includes(specialItem)) {
            for (const [stockItem, change] of Object.entries(changes)) {
                const multiplier = isAdding ? -1 : 1; // Reverse the change if we're adding stock back
                stockChanges[stockItem] = change * quantity * multiplier;
            }
        }
    }

    return stockChanges;
}

// Function to process the most recent order
async function processMostRecentOrder() {
    console.log('Starting processMostRecentOrder function');
    try {
        // Get the most recent order
        console.log('Fetching most recent order...');
        const ordersRef = window.firebaseServices.collection(window.firebaseDb, 'orders');
        const querySnapshot = await window.firebaseServices.getDocs(ordersRef);
        console.log('Query snapshot:', querySnapshot);
        
        if (querySnapshot.empty) {
            console.log('No orders found');
            return;
        }

        // Get the most recent order by sorting the documents
        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        const order = orders[0];
        console.log('Found order:', order);

        // Process each item in the order
        for (const item of order.items) {
            const itemName = item.name.toLowerCase();
            console.log('Processing item:', itemName, 'Quantity:', item.quantity);

            // Handle special stock circumstances
            const specialStockChanges = handleSpecialStockCircumstances(item.name, item.quantity);
            
            // Apply special stock changes
            for (const [stockItem, change] of Object.entries(specialStockChanges)) {
                const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                    stockItem === inventoryItem.name
                )?.[0];

                if (inventoryKey) {
                    const oldStock = inventoryData[inventoryKey].currentStock;
                    const newStock = Math.max(0, oldStock + change);
                    inventoryData[inventoryKey].currentStock = newStock;
                    console.log(`Updated ${inventoryKey} stock:`, {
                        itemName: stockItem,
                        change,
                        oldStock,
                        newStock
                    });
                }
            }

            // Handle items with customizations (soft drinks, ice cream, cakes)
            if (item.customizations && item.customizations.length > 0) {
                if (item.name === 'Soft Drink') {
                    // Handle soft drink customizations
                    item.customizations.forEach(customization => {
                        const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                            customization === inventoryItem.name
                        )?.[0];

                        if (inventoryKey) {
                            const oldStock = inventoryData[inventoryKey].currentStock;
                            const newStock = Math.max(0, oldStock - item.quantity);
                            inventoryData[inventoryKey].currentStock = newStock;
                            console.log(`Updated ${inventoryKey} stock:`, {
                                itemName: customization,
                                quantity: item.quantity,
                                oldStock,
                                newStock
                            });
                        }
                    });
                } else {
                    // Handle ice cream and cake customizations
                    item.customizations.forEach(customization => {
                        if (customization.includes('Ice Cream') || customization.includes('Cake')) {
                            const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                                customization === inventoryItem.name
                            )?.[0];

                            if (inventoryKey) {
                                const oldStock = inventoryData[inventoryKey].currentStock;
                                const newStock = Math.max(0, oldStock - item.quantity);
                                inventoryData[inventoryKey].currentStock = newStock;
                                console.log(`Updated ${inventoryKey} stock:`, {
                                    itemName: customization,
                                    quantity: item.quantity,
                                    oldStock,
                                    newStock
                                });
                            }
                        }
                    });
                }
            } else {
                // Handle regular stock items
                const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                    itemName === inventoryItem.name.toLowerCase() || 
                    itemName === inventoryItem.name_ja.toLowerCase()
                )?.[0];

                if (inventoryKey) {
                    const oldStock = inventoryData[inventoryKey].currentStock;
                    const newStock = Math.max(0, oldStock - item.quantity);
                    inventoryData[inventoryKey].currentStock = newStock;
                    console.log(`Updated ${inventoryKey} stock:`, {
                        itemName,
                        quantity: item.quantity,
                        oldStock,
                        newStock
                    });
                }
            }
        }

        // Save updated stock to Firebase
        console.log('Saving updated stock to Firebase...');
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        await window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        console.log('Stock saved to Firebase');

        // Update display if stocktake view is active
        const stocktakeContainer = document.querySelector('.stocktake-container');
        if (stocktakeContainer && stocktakeContainer.style.display !== 'none') {
            console.log('Updating stocktake display');
            renderStocktake(stocktakeContainer);
        }

    } catch (error) {
        console.error('Error processing order:', error);
    }
}

// Function to initialize stocktake system
function initializeStocktake() {
    console.log('Initializing stocktake system');
    
    // Load stocktake data
    loadStocktake();
    
    // Use event delegation for payment buttons
    document.addEventListener('click', async (event) => {
        // Check if the clicked element is the pay later button
        if (event.target.id === 'payLaterBtn' || 
            (event.target.classList.contains('pay-later-modal-btn') && event.target.closest('#paymentModal'))) {
            console.log('Pay Later button clicked');
            await processMostRecentOrder();
        }
    });
}

// Function to restore stock from an order
async function restoreStockFromOrder(orderData) {
    console.log('Restoring stock from order:', orderData);
    try {
        for (const item of orderData.items) {
            const itemName = item.name.toLowerCase();
            
            // Handle special stock circumstances
            const specialStockChanges = handleSpecialStockCircumstances(item.name, item.quantity, true);
            
            // Apply special stock changes
            for (const [stockItem, change] of Object.entries(specialStockChanges)) {
                const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                    stockItem === inventoryItem.name
                )?.[0];

                if (inventoryKey) {
                    inventoryData[inventoryKey].currentStock += change;
                    console.log(`Restored ${change} ${inventoryKey} to stock`);
                }
            }

            // Handle regular stock items
            const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                itemName === inventoryItem.name.toLowerCase() || 
                itemName === inventoryItem.name_ja.toLowerCase()
            )?.[0];

            if (inventoryKey) {
                inventoryData[inventoryKey].currentStock += item.quantity;
                console.log(`Restored ${item.quantity} ${inventoryKey} to stock`);
            }
        }

        // Save updated stock to Firebase
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        await window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        console.log('Stock restored and saved to Firebase');
    } catch (error) {
        console.error('Error restoring stock:', error);
    }
}

// Function to update stock based on order changes
async function updateStockFromOrderChanges(oldOrderData, newOrderData) {
    console.log('Updating stock from order changes:', { oldOrderData, newOrderData });
    try {
        // Create maps of items by name for easy comparison
        const oldItemsMap = new Map(oldOrderData.items.map(item => [item.name.toLowerCase(), item]));
        const newItemsMap = new Map(newOrderData.items.map(item => [item.name.toLowerCase(), item]));

        // Process removed or reduced items (restore stock)
        for (const [itemName, oldItem] of oldItemsMap) {
            const newItem = newItemsMap.get(itemName);
            if (!newItem || newItem.quantity < oldItem.quantity) {
                const quantityDiff = oldItem.quantity - (newItem ? newItem.quantity : 0);
                
                // Handle special stock circumstances
                const specialStockChanges = handleSpecialStockCircumstances(oldItem.name, quantityDiff, true);
                
                // Apply special stock changes
                for (const [stockItem, change] of Object.entries(specialStockChanges)) {
                    const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                        stockItem === inventoryItem.name
                    )?.[0];

                    if (inventoryKey) {
                        inventoryData[inventoryKey].currentStock += change;
                        console.log(`Restored ${change} ${inventoryKey} to stock`);
                    }
                }

                // Handle regular stock items
                const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                    itemName === inventoryItem.name.toLowerCase() || 
                    itemName === inventoryItem.name_ja.toLowerCase()
                )?.[0];

                if (inventoryKey) {
                    inventoryData[inventoryKey].currentStock += quantityDiff;
                    console.log(`Restored ${quantityDiff} ${inventoryKey} to stock`);
                }
            }
        }

        // Process added or increased items (reduce stock)
        for (const [itemName, newItem] of newItemsMap) {
            const oldItem = oldItemsMap.get(itemName);
            if (!oldItem || newItem.quantity > oldItem.quantity) {
                const quantityDiff = newItem.quantity - (oldItem ? oldItem.quantity : 0);
                
                // Handle special stock circumstances
                const specialStockChanges = handleSpecialStockCircumstances(newItem.name, quantityDiff);
                
                // Apply special stock changes
                for (const [stockItem, change] of Object.entries(specialStockChanges)) {
                    const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                        stockItem === inventoryItem.name
                    )?.[0];

                    if (inventoryKey) {
                        inventoryData[inventoryKey].currentStock += change;
                        console.log(`Updated ${inventoryKey} stock by ${change}`);
                    }
                }

                // Handle regular stock items
                const inventoryKey = Object.entries(inventoryData).find(([_, inventoryItem]) => 
                    itemName === inventoryItem.name.toLowerCase() || 
                    itemName === inventoryItem.name_ja.toLowerCase()
                )?.[0];

                if (inventoryKey) {
                    inventoryData[inventoryKey].currentStock -= quantityDiff;
                    console.log(`Reduced ${inventoryKey} stock by ${quantityDiff}`);
                }
            }
        }

        // Save updated stock to Firebase
        const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
        await window.firebaseServices.setDoc(stocktakeRef, {
            inventory: inventoryData,
            lastUpdated: window.firebaseServices.Timestamp.now()
        });
        console.log('Stock updated and saved to Firebase');
    } catch (error) {
        console.error('Error updating stock from order changes:', error);
    }
}

// Add function to mark item as ordered
function markItemAsOrdered(itemKey) {
    const item = inventoryData[itemKey];
    showBulkOrderModal([{ key: itemKey, item: item }]);
}

// Function to update subscription delivery
async function updateSubscriptionDelivery(itemKey) {
    const item = inventoryData[itemKey];
    if (item.isSubscription) {
        // Add the delivery quantity to current stock
        item.currentStock += item.deliveryQuantity;
        
        // Calculate next delivery date
        const nextDelivery = new Date(item.nextDeliveryDate.seconds * 1000);
        nextDelivery.setDate(nextDelivery.getDate() + item.deliveryFrequency);
        item.nextDeliveryDate = window.firebaseServices.Timestamp.fromDate(nextDelivery);
        
        // Save to Firebase
        try {
            const stocktakeRef = window.firebaseServices.doc(window.firebaseDb, 'stocktake', 'current');
            await window.firebaseServices.setDoc(stocktakeRef, {
                inventory: inventoryData,
                lastUpdated: window.firebaseServices.Timestamp.now()
            });
            
            // Re-render the interface
            const container = document.querySelector('.stocktake-container');
            if (container) {
                renderStocktake(container);
            }
        } catch (error) {
            console.error('Error updating subscription delivery:', error);
            showCustomAlert(currentLang === 'ja' ? '配送の更新に失敗しました' : 'Failed to update delivery', 'error');
        }
    }
}

// Export functions for use in main POS system
window.stocktakeSystem = {
    renderStocktake,
    loadStocktake,
    processMostRecentOrder,
    initializeStocktake,
    restoreStockFromOrder,
    updateStockFromOrderChanges,
    markItemAsOrdered,
    markItemAsArrived,
    showBulkOrderModal,
    showEditModal,
    updateSubscriptionDelivery
};

// Initialize when the script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing stocktake system');
    initializeStocktake();
});

// Add styles to the main CSS
const stocktakeStyles = `
    .stocktake-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        display: block !important;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .stocktake-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 20px;
    }

    .stocktake-controls {
        display: flex;
        gap: 10px;
    }

    .stocktake-btn {
        padding: 8px 16px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .stocktake-filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        padding: 0 20px;
    }

    .stocktake-filters select,
    .stocktake-filters input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }

    .stocktake-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 0 20px;
    }

    .stocktake-item {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stocktake-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .stocktake-item-header h3 {
        margin: 0;
        font-size: 16px;
    }

    .stocktake-category {
        background: var(--light);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        color: var(--primary);
    }

    .stocktake-item-details {
        margin-bottom: 10px;
    }

    .stocktake-stock {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }

    .stocktake-stock input {
        width: 60px;
        padding: 4px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .stocktake-unit {
        color: #666;
        font-size: 14px;
    }

    .stocktake-reorder {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
    }

    .stocktake-supplier a {
        color: var(--primary);
        text-decoration: none;
        font-size: 14px;
    }

    .stocktake-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        background: #f5f5f5;
        color: #666;
    }

    .stocktake-status.low-stock {
        background: #ffebee;
        color: #c62828;
    }

    .stocktake-status.stock-ok {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .stocktake-status.reorder-soon {
        background: #fff3e0;
        color: #ef6c00;
    }

    .stocktake-item-title {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .item-selector {
        width: 18px;
        height: 18px;
    }

    .stocktake-item-title h3 a {
        color: var(--primary);
        text-decoration: none;
    }

    .stocktake-item-title h3 a:hover {
        text-decoration: underline;
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 20px;
        width: 90%;
        max-width: 600px;
        border-radius: 8px;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .close-modal {
        font-size: 24px;
        cursor: pointer;
        border: none;
        background: none;
    }

    .edit-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .edit-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-bottom: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .form-group input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        position: sticky;
        bottom: 0;
        background: white;
        padding: 10px 0;
        border-top: 1px solid #eee;
    }

    .edit-item-btn, .delete-item-btn {
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .edit-item-btn {
        background-color: var(--primary);
        color: white;
    }

    .delete-item-btn {
        background-color: #dc3545;
        color: white;
    }

    .update-stock-btn {
        padding: 4px 8px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
    }

    .current-stock {
        font-weight: bold;
        margin: 0 5px;
    }

    .stock-input {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
    }

    .stock-input input {
        width: 100px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
    }

    .stock-input button {
        padding: 8px 16px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .numpad-display {
        margin-bottom: 20px;
    }

    .numpad-display input {
        width: 100%;
        padding: 10px;
        font-size: 24px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .numpad-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        max-width: 300px;
        margin: 0 auto;
    }

    .numpad-btn {
        padding: 15px;
        font-size: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    }

    .numpad-btn:hover {
        background: #f0f0f0;
    }

    .numpad-btn.clear {
        background: #ffebee;
        color: #c62828;
    }

    .numpad-btn.enter {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .stock-update-options {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        justify-content: center;
    }

    .stock-action-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .stock-action-btn.add {
        background-color: #e8f5e9;
        color: #2e7d32;
    }

    .stock-action-btn.subtract {
        background-color: #ffebee;
        color: #c62828;
    }

    .stock-action-btn.active {
        transform: scale(1.05);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .stock-action-btn.add.active {
        background-color: #2e7d32;
        color: white;
    }

    .stock-action-btn.subtract.active {
        background-color: #c62828;
        color: white;
    }

    #updateItemName {
        color: var(--primary);
        font-weight: normal;
    }

    .category-header {
        grid-column: 1 / -1;
        font-size: 1.2em;
        font-weight: bold;
        color: var(--primary);
        padding: 15px 0 5px 0;
        margin-top: 10px;
    }

    .category-divider {
        grid-column: 1 / -1;
        height: 1px;
        background-color: #ddd;
        margin: 10px 0;
    }

    .stocktake-usage {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }

    .usage-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .usage-total, .usage-average {
        font-size: 14px;
    }

    .usage-label {
        color: #666;
        margin-right: 5px;
    }

    .usage-value {
        font-weight: bold;
        color: #6F4E37;
    }

    .usage-daily {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        margin-top: 10px;
    }

    .usage-day {
        text-align: center;
        padding: 5px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 12px;
    }

    .usage-day.has-usage {
        background: #e8f5e9;
    }

    .day-name {
        color: #666;
        margin-bottom: 2px;
    }

    .day-usage {
        font-weight: bold;
        color: #6F4E37;
    }

    .usage-loading {
        text-align: center;
        color: #666;
        font-size: 14px;
        padding: 10px;
    }

    .usage-error {
        text-align: center;
        color: #dc3545;
        font-size: 14px;
        padding: 10px;
    }
`;

// Add the styles for new elements
const additionalStyles = `
    .order-status {
        margin-top: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 14px;
    }

    .order-date, .arrival-date {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }

    .order-label {
        color: #666;
    }

    .order-value {
        font-weight: bold;
        color: #6F4E37;
    }

    .order-actions {
        margin-top: 10px;
        text-align: center;
    }

    .order-btn {
        padding: 8px 16px;
        background-color: #6F4E37;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .order-btn:hover {
        background-color: #5a3f2e;
    }

    .arrived-btn {
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 10px;
        width: 100%;
    }

    .arrived-btn:hover {
        background-color: #45a049;
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }

    .cancel-btn:hover {
        background-color: #da190b;
    }
`;

// Add styles for subscription items
const subscriptionStyles = `
    .subscription-options {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 10px;
    }

    .stocktake-status.subscription {
        background: #e3f2fd;
        color: #1976d2;
        padding: 10px;
        border-radius: 4px;
    }

    .next-delivery {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .delivery-label {
        color: #666;
    }

    .delivery-value {
        font-weight: bold;
    }

    .update-delivery-btn {
        width: 100%;
        padding: 8px;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .update-delivery-btn:hover {
        background-color: #1565c0;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
    }
`;

// Create a single styleSheet with all styles
const styleSheet = document.createElement('style');
styleSheet.textContent = stocktakeStyles + additionalStyles + subscriptionStyles;
document.head.appendChild(styleSheet);