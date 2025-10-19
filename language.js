// Language management system for Izumiya POS

// Initialize language from localStorage or default to English
export function initializeLanguage() {
    window.currentLang = localStorage.getItem('currentLang') || 'en';
    updateLanguageButton();
    updateUILanguage();
}

// Toggle between English and Japanese
export function toggleLanguage() {
    window.currentLang = window.currentLang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('currentLang', window.currentLang);
    updateLanguageButton();
    updateUILanguage();
    window.dispatchEvent(new Event('languagechange'));
}

// Update the language toggle button text
function updateLanguageButton() {
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = window.currentLang === 'ja' ? 'English' : '日本語';
    }
}

// Translation function
export function translate(key) {
    const translations = {
        'Order': { en: 'Order', ja: '注文' },
        'Total Amount': { en: 'Total Amount', ja: '合計金額' },
        'Paid': { en: 'Paid', ja: '支払済み' },
        'Unpaid': { en: 'Unpaid', ja: '未払い' },
        'Cash Given:': { en: 'Cash Given:', ja: '支払金額:' },
        'Change:': { en: 'Change:', ja: 'お釣り:' },
        'Card Payment:': { en: 'Card Payment:', ja: 'カード支払い:' },
        'Surcharge:': { en: 'Surcharge:', ja: '手数料:' },
        'Total:': { en: 'Total:', ja: '合計:' },
        'Pay Now': { en: 'Pay Now', ja: '今すぐ支払い' },
        'Just now': { en: 'Just now', ja: '今' },
        'minute ago': { en: 'minute ago', ja: '分前' },
        'minutes ago': { en: 'minutes ago', ja: '分前' },
        'hour ago': { en: 'hour ago', ja: '時間前' },
        'hours ago': { en: 'hours ago', ja: '時間前' },
        'No Orders Today': { en: 'No Orders Today', ja: '今日の注文なし' },
        'No orders have been placed today.': { en: 'No orders have been placed today.', ja: '今日は注文がありません。' }
    };
    
    return translations[key]?.[window.currentLang] || translations[key]?.en || key;
}

// Get category display name based on current language
export function getCategoryDisplayName(category) {
    const categoryNames = {
        'Drinks': { en: 'Drinks', ja: 'ドリンク' },
        'Food': { en: 'Food', ja: 'フード' },
        'Order Log': { en: 'Order Log', ja: '注文履歴' },
        'Analysis': { en: 'Analysis', ja: '分析' },
        'Stocktake': { en: 'Stocktake', ja: '在庫管理' },
        'employee': { en: 'Sign-in', ja: 'サインイン' }
    };
    
    return categoryNames[category]?.[window.currentLang] || categoryNames[category]?.en || category;
}

// Update all UI elements to reflect current language
export function updateUILanguage() {
    // Update category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        const category = tab.dataset.category;
        if (category) {
            tab.textContent = getCategoryDisplayName(category);
        }
    });

    // Update order panel elements
    const orderTitle = document.querySelector('.order-title');
    if (orderTitle) {
        orderTitle.textContent = window.currentLang === 'ja' ? '現在の注文 #042' : 'Current Order #042';
    }

    const subtotalLabel = document.querySelector('.summary-row div:first-child');
    if (subtotalLabel) {
        subtotalLabel.textContent = window.currentLang === 'ja' ? '小計' : 'Subtotal';
    }

    const totalLabel = document.querySelector('.total-row div:first-child');
    if (totalLabel) {
        totalLabel.textContent = window.currentLang === 'ja' ? '合計' : 'Total';
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.textContent = window.currentLang === 'ja' ? '会計' : 'Checkout';
    }

    // Update payment modal
    updatePaymentModalLanguage();

    // Update custom item modal
    updateCustomItemModalLanguage();

    // Update discount modal
    updateDiscountModalLanguage();

    // Update employee sign-in panel
    updateEmployeeSignInLanguage();

    // Update edit order modal
    updateEditOrderModalLanguage();

    // Refresh current content based on active category
    refreshCurrentContent();
}

// Update payment modal language
function updatePaymentModalLanguage() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const modalTitle = paymentModal.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = window.currentLang === 'ja' ? '現金支払い' : 'Cash Payment';
        }
        const totalLabel = paymentModal.querySelector('.total-amount');
        if (totalLabel) {
            // Only update the label text node, not the span
            const totalAmountSpan = totalLabel.querySelector('#totalAmount');
            if (totalAmountSpan && totalLabel.childNodes.length > 0) {
                totalLabel.childNodes[0].textContent = window.currentLang === 'ja' ? '合計: ¥' : 'Total: ¥';
            }
        }
        const tenderedLabel = paymentModal.querySelector('.amount-tendered div:first-child');
        if (tenderedLabel) {
            tenderedLabel.textContent = window.currentLang === 'ja' ? '支払金額:' : 'Tendered Amount:';
        }
        const changeLabel = paymentModal.querySelector('.change-amount div:first-child');
        if (changeLabel) {
            changeLabel.textContent = window.currentLang === 'ja' ? 'お釣り:' : 'Change:';
        }
        const payLaterBtn = paymentModal.querySelector('#payLaterBtn');
        if (payLaterBtn) {
            payLaterBtn.textContent = window.currentLang === 'ja' ? '後払い' : 'Pay Later';
        }
        const cashBtn = paymentModal.querySelector('#cashBtn');
        if (cashBtn) {
            cashBtn.textContent = window.currentLang === 'ja' ? '現金' : 'Cash';
        }
        const cancelBtn = paymentModal.querySelector('#cancelPaymentBtn');
        if (cancelBtn) {
            cancelBtn.textContent = window.currentLang === 'ja' ? 'キャンセル' : 'Cancel';
        }
        const completeBtn = paymentModal.querySelector('#completePaymentBtn');
        if (completeBtn) {
            completeBtn.textContent = window.currentLang === 'ja' ? '支払い完了' : 'Complete Payment';
        }
    }
}

// Update custom item modal language
function updateCustomItemModalLanguage() {
    const customItemModal = document.getElementById('customItemModal');
    if (customItemModal) {
        const modalTitle = customItemModal.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = window.currentLang === 'ja' ? 'カスタムアイテム追加' : 'Add Custom Item';
        }

        const nameLabel = customItemModal.querySelector('label[for="customItemName"]');
        if (nameLabel) {
            nameLabel.textContent = window.currentLang === 'ja' ? 'アイテム名' : 'Item Name';
        }

        const priceLabel = customItemModal.querySelector('label[for="customItemPrice"]');
        if (priceLabel) {
            priceLabel.textContent = window.currentLang === 'ja' ? '価格 (¥)' : 'Price (¥)';
        }

        const nameInput = customItemModal.querySelector('#customItemName');
        if (nameInput) {
            nameInput.placeholder = window.currentLang === 'ja' ? 'アイテム名を入力' : 'Enter item name';
        }

        const priceInput = customItemModal.querySelector('#customItemPrice');
        if (priceInput) {
            priceInput.placeholder = window.currentLang === 'ja' ? '価格を入力' : 'Enter price';
        }

        const cancelBtn = customItemModal.querySelector('#cancelCustomItem');
        if (cancelBtn) {
            cancelBtn.textContent = window.currentLang === 'ja' ? 'キャンセル' : 'Cancel';
        }

        const addBtn = customItemModal.querySelector('#addCustomItem');
        if (addBtn) {
            addBtn.textContent = window.currentLang === 'ja' ? 'アイテム追加' : 'Add Item';
        }
    }
}

// Update discount modal language
function updateDiscountModalLanguage() {
    const discountModal = document.getElementById('discountModal');
    if (discountModal) {
        const modalTitle = discountModal.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = window.currentLang === 'ja' ? 'ローカル割引' : 'Local Discount';
        }

        const discountLabel = discountModal.querySelector('.total-amount');
        if (discountLabel) {
            discountLabel.textContent = window.currentLang === 'ja' ? '割引金額: -¥' : 'Discount Amount: -¥';
        }

        const cancelBtn = discountModal.querySelector('#cancelDiscountBtn');
        if (cancelBtn) {
            cancelBtn.textContent = window.currentLang === 'ja' ? 'キャンセル' : 'Cancel';
        }

        const applyBtn = discountModal.querySelector('#applyDiscountBtn');
        if (applyBtn) {
            applyBtn.textContent = window.currentLang === 'ja' ? '割引適用' : 'Apply Discount';
        }
    }
}

// Update employee sign-in panel language
function updateEmployeeSignInLanguage() {
    const signInPanel = document.getElementById('employeeSignInPanel');
    if (signInPanel) {
        const panelTitle = signInPanel.querySelector('h2');
        if (panelTitle) {
            panelTitle.textContent = window.currentLang === 'ja' ? '従業員サインイン' : 'Employee Sign-in';
        }

        const pinLabel = signInPanel.querySelector('label[for="employeePin"]');
        if (pinLabel) {
            pinLabel.textContent = window.currentLang === 'ja' ? '4桁のPINを入力:' : 'Enter 4-digit PIN:';
        }

        const signInBtn = signInPanel.querySelector('.sign-in-button');
        if (signInBtn) {
            signInBtn.textContent = window.currentLang === 'ja' ? 'サインイン' : 'Sign In';
        }
    }
}

// Update edit order modal language
function updateEditOrderModalLanguage() {
    const editOrderModal = document.getElementById('editOrderModal');
    if (editOrderModal) {
        const editOrderTitle = editOrderModal.querySelector('.edit-order-title');
        if (editOrderTitle) {
            const orderNumber = editOrderTitle.querySelector('#editOrderNumber')?.textContent || '';
            editOrderTitle.textContent = window.currentLang === 'ja' ? `注文編集 #${orderNumber}` : `Edit Order #${orderNumber}`;
        }

        const cancelEditBtn = editOrderModal.querySelector('.cancel-edit-btn');
        if (cancelEditBtn) {
            cancelEditBtn.textContent = window.currentLang === 'ja' ? 'キャンセル' : 'Cancel';
        }

        const deleteOrderBtn = editOrderModal.querySelector('.delete-order-btn');
        if (deleteOrderBtn) {
            deleteOrderBtn.textContent = window.currentLang === 'ja' ? '注文削除' : 'Delete Order';
        }

        const saveOrderBtn = editOrderModal.querySelector('.save-order-btn');
        if (saveOrderBtn) {
            saveOrderBtn.textContent = window.currentLang === 'ja' ? '変更保存' : 'Save Changes';
        }
    }
}

// Refresh current content based on active category
function refreshCurrentContent() {
    // Refresh order items if they exist
    if (window.currentOrder && window.currentOrder.items) {
        window.renderOrderItems(window.currentOrder, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, window.updateItemQuantity, window.getDailyOrdersDoc);
    }

    // Refresh menu items for the current category
    if (window.activeCategory && (window.activeCategory === 'Drinks' || window.activeCategory === 'Food')) {
        window.loadMenuItems(window.activeCategory, window.renderOrderItems, window.updateOrderSummary, window.saveCurrentOrder, window.showCustomItemModal, window.showDiscountModal);
    }

    // Refresh analysis if it's active
    if (window.activeCategory === 'Analysis' && window.renderAnalysisTab) {
        window.renderAnalysisTab();
    }

    // Refresh stocktake if it's active
    if (window.activeCategory === 'Stocktake' && window.stocktakeSystem && window.stocktakeSystem.renderStocktake) {
        const stocktakeContainer = document.querySelector('.stocktake-container');
        if (stocktakeContainer) {
            window.stocktakeSystem.renderStocktake(stocktakeContainer);
        }
    }

    // Refresh order log if it's active
    if (window.activeCategory === 'Order Log') {
        const orderLogContainer = document.querySelector('.order-log-container');
        if (orderLogContainer) {
            window.displayOrderLog(orderLogContainer, window.getDisplayName, window.translate, window.updateOrderInDaily, window.getOrderByNumber, window.showCustomAlert);
        }
    }
} 