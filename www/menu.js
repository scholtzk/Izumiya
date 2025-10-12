// Menu.js - Handles drink and food tab functionality

import { getDailyOrdersDoc, updateOrderSummary, saveCurrentOrder } from './orderlog.js';

// Menu data structure
export const menuData = {
    'Drinks': [
        { name: 'Espresso', name_ja: 'エスプレッソ', price: 500, hasMilk: false, hasExtraShot: true },
        { name: 'Cappuccino', name_ja: 'カプチーノ', price: 650, hasMilk: true },
        { name: 'Americano', name_ja: 'アメリカーノ', price: 650, hasMilk: false },
        { name: 'Latte', name_ja: 'ラテ', price: 680, hasMilk: true },
        { name: 'Matcha Latte', name_ja: '抹茶ラテ', price: 680, hasMilk: true },
        { name: 'Hot Cocoa', name_ja: 'ホットココア', price: 650, hasMilk: true },
        { name: 'Tea', name_ja: '紅茶', price: 550, hasMilk: false, hasTea: true },
        { type: 'divider' },
        { name: 'Ice Americano', name_ja: 'アイスアメリカーノ', price: 650, hasMilk: false },
        { name: 'Ice Latte', name_ja: 'アイスラテ', price: 680, hasMilk: true },
        { name: 'Ice Matcha Latte', name_ja: 'アイス抹茶ラテ', price: 680, hasMilk: true },
        { name: 'Ice Cocoa', name_ja: 'アイスココア', price: 650, hasMilk: true },
        { type: 'divider' },
        { name: 'Apple Juice', name_ja: 'りんごジュース', price: 550, hasMilk: false },
        { name: 'Orange Juice', name_ja: 'オレンジジュース', price: 550, hasMilk: false },
        { name: 'Soft Drink', name_ja: 'ソフトドリンク', price: 550, hasMilk: false, hasSoftDrink: true },
        { name: 'Beer', name_ja: 'ビール', price: 580, hasMilk: false },
        { name: 'Water', name_ja: '水', price: 380, hasMilk: false },
        { type: 'divider' },
        { name: 'Local Discount', name_ja: 'ローカル割引', price: 0, isDiscount: true, hidePrice: true }
    ],
    'Food': [
        { name: 'Banana Bread', name_ja: 'バナナブレッド', price: 450, section: 1 },
        { name: 'Toast', name_ja: 'トースト', price: 440, hasJam: true, section: 1 },
        { name: 'Granola Yogurt', name_ja: 'グラノーラリーヨーグルト', price: 1200, section: 1 },
        { name: 'Breakfast', name_ja: '朝食セット', price: 1500, section: 1 },
        { type: 'divider' },
        { name: 'Croissant', name_ja: 'クロワッサン', price: 400, section: 2 },
        { name: 'Cookie', name_ja: 'クッキー', price: 400, section: 2 },
        { name: 'Caprese Sandwich', name_ja: 'カプレーゼサンド', price: 1500, section: 2 },
        { name: 'Tuna Sandwich', name_ja: 'ツナサンド', price: 1500, section: 2 },
        { name: 'Salmon Sandwich', name_ja: 'サーモンサンド', price: 1700, section: 2 },
        { name: 'Burger', name_ja: 'バーガー', price: 2000, hasFries: true, section: 3 },
        { type: 'divider' },
        { name: 'Fries', name_ja: 'フライドポテト', price: 400, section: 3 },
        { name: 'Edamame', name_ja: '枝豆', price: 450, section: 3 },
        { name: 'Nachos', name_ja: 'ナチョス', price: 1200, section: 3 },
        { type: 'divider' },
        { name: 'Ice Cream', name_ja: 'アイスクリーム', price: 480, hasFlavor: true, section: 3 },
        { name: 'Cake', name_ja: 'ケーキ', price: 680, hasFlavor: true, section: 3 },
        { name: 'Matcha Special', name_ja: '抹茶スペシャル', price: 950, section: 3 },
        { name: 'Luggage', name_ja: '荷物預かり', price: 500, section: 3 },
        { name: 'Other...', name_ja: 'その他...', price: 0, isCustom: true, hidePrice: true }
    ]
};

// Global variable to track selected milk addon
let selectedMilkAddon = null;

// Export customization options for use in other modules
export const softDrinkOptions = [
    { name: 'Coke', name_ja: 'コーラ' },
    { name: 'Ramune', name_ja: 'ラムネ' },
    { name: 'Oolong Tea', name_ja: '烏龍茶' },
    { name: 'Ginger Ale', name_ja: 'ジンジャーエール' },
    { name: 'Sparkling Water', name_ja: '炭酸水' }
];
export const cakeOptions = [
    { name: 'Cheesecake', name_ja: 'チーズケーキ' },
    { name: 'Chocolate', name_ja: 'チョコレート' }
];
export const iceCreamOptions = [
    { name: 'Vanilla', name_ja: 'バニラ' },
    { name: 'Matcha', name_ja: '抹茶' },
    { name: 'Chocolate', name_ja: 'チョコレート' }
];
export const teaOptions = [
    { name: 'Darjeeling', name_ja: 'ダージリン' },
    { name: 'Jasmine', name_ja: 'ジャスミン' }
];
export const jamOptions = [
    { name: 'Strawberry', name_ja: 'いちご' },
    { name: 'Blueberry', name_ja: 'ブルーベリー' },
    { name: 'Marmelade', name_ja: 'マーマレード' }
];

// Enhanced getDisplayName to handle customizations
export function getDisplayName(itemOrName, currentLang = window.currentLang) {
    // If passed the full item object
    if (typeof itemOrName === 'object' && itemOrName !== null) {
        if (currentLang === 'ja' && itemOrName.name_ja) return itemOrName.name_ja;
        return itemOrName.name;
    }
    // Soft Drink customizations
    for (const drink of softDrinkOptions) {
        if (itemOrName === drink.name) {
            return currentLang === 'ja' && drink.name_ja ? drink.name_ja : drink.name;
        }
    }
    // Cake customizations (e.g. 'Cheesecake Cake')
    for (const cake of cakeOptions) {
        if (itemOrName === `${cake.name} Cake`) {
            return currentLang === 'ja' && cake.name_ja ? `${cake.name_ja}ケーキ` : `${cake.name} Cake`;
        }
    }
    // Ice Cream customizations (e.g. 'Vanilla Ice Cream')
    for (const ice of iceCreamOptions) {
        if (itemOrName === `${ice.name} Ice Cream`) {
            return currentLang === 'ja' && ice.name_ja ? `${ice.name_ja}アイスクリーム` : `${ice.name} Ice Cream`;
        }
    }
    // Tea customizations
    for (const tea of teaOptions) {
        if (itemOrName === tea.name) {
            return currentLang === 'ja' && tea.name_ja ? tea.name_ja : tea.name;
        }
    }
    // Jam customizations (e.g. 'Strawberry Jam')
    for (const jam of jamOptions) {
        if (itemOrName === `${jam.name} Jam`) {
            return currentLang === 'ja' && jam.name_ja ? `${jam.name_ja}ジャム` : `${jam.name} Jam`;
        }
    }
    // Fallback to menu items
    for (const category of Object.values(menuData)) {
        for (const item of category) {
            if (item.name === itemOrName) {
                return currentLang === 'ja' && item.name_ja ? item.name_ja : item.name;
            }
        }
    }
    return itemOrName; // fallback
}

// Add item to order
export function addItemToOrder(item, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    // Always use window.currentOrder to ensure we're working with the latest order
    const currentOrderToUse = window.currentOrder;
    
    // If it's a milk addon, handle selection and check for selected drink
    if (item.isMilkAddon) {
        const itemCard = document.querySelector(`.item-card[data-milk-addon="true"] .item-name[data-name="${getDisplayName(item.name, window.currentLang)}"]`)?.closest('.item-card');
        
        if (selectedMilkAddon && selectedMilkAddon.name === item.name) {
            // Deselect if already selected
            selectedMilkAddon = null;
            if (itemCard) {
                itemCard.classList.remove('selected');
            }
        } else {
            // Select new milk addon
            selectedMilkAddon = item;
            // Remove selection from all milk addons
            document.querySelectorAll('.item-card[data-milk-addon="true"]').forEach(card => {
                card.classList.remove('selected');
            });
            // Add selection to clicked milk addon
            if (itemCard) {
                itemCard.classList.add('selected');
            }

            // Check if there's a selected drink in the order
            const selectedOrderItem = document.querySelector('.order-item.selected');
            if (selectedOrderItem) {
                const selectedItemId = parseInt(selectedOrderItem.dataset.id);
                const drinkItem = currentOrderToUse.items.find(i => i.id === selectedItemId);
                if (drinkItem) {
                    // Handle takeaway separately from milk
                    if (item.name === 'Takeaway') {
                        drinkItem.customizations = drinkItem.customizations || [];
                        const existingTakeaway = drinkItem.customizations.find(c => c === 'Takeaway');
                        if (existingTakeaway) {
                            // Remove takeaway if it's already there
                            drinkItem.customizations = drinkItem.customizations.filter(c => c !== 'Takeaway');
                        } else {
                            // Add takeaway
                            drinkItem.customizations.push('Takeaway');
                        }
                    } else {
                        // Handle milk type
                        drinkItem.customizations = drinkItem.customizations || [];
                        const existingMilkIndex = drinkItem.customizations.findIndex(c => c === item.name);
                        if (existingMilkIndex !== -1) {
                            // Remove the milk type if it's already there
                            drinkItem.customizations.splice(existingMilkIndex, 1);
                        } else {
                            // Remove any existing milk customizations first
                            drinkItem.customizations = drinkItem.customizations.filter(c => 
                                !c.includes('Milk'));
                            // Add the new milk type
                            drinkItem.customizations.push(item.name);
                        }
                    }
                    // Reset selected milk addon
                    selectedMilkAddon = null;
                    // Remove highlight from milk addon in menu
                    if (itemCard) {
                        itemCard.classList.remove('selected');
                    }
                    // Update the order display
                    renderOrderItems(currentOrderToUse, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, window.updateItemQuantity);
                    updateOrderSummary(currentOrderToUse);
                    saveCurrentOrder(currentOrderToUse, getDailyOrdersDoc);
                    return;
                }
            }
        }
        return;
    }

    // Deep copy the item to avoid reference issues
    const orderItem = {
        ...item,
        quantity: 1,
        id: Date.now() // Unique ID for the order item
    };

    // If there's a selected milk addon, add it as a customization
    if (selectedMilkAddon) {
        orderItem.customizations = orderItem.customizations || [];
        if (selectedMilkAddon.name === 'Takeaway') {
            orderItem.customizations.push('Takeaway');
        } else {
            // Remove any existing milk customizations first
            orderItem.customizations = orderItem.customizations.filter(c => 
                !c.includes('Milk'));
            // Add the new milk type
            orderItem.customizations.push(selectedMilkAddon.name);
        }
        // Reset selected milk addon
        selectedMilkAddon = null;
        // Remove highlight from milk addon in menu
        document.querySelectorAll('.item-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    // Add to order
    currentOrderToUse.items.push(orderItem);
    // Update the order display
    renderOrderItems(currentOrderToUse, window.currentLang, window.getDisplayName, window.showMilkTypeButtons, window.hideMilkTypeButtons, window.updateItemQuantity);
    // Update order summary
    updateOrderSummary(currentOrderToUse);
    // Save current order
    saveCurrentOrder(currentOrderToUse, getDailyOrdersDoc);
}

// Show jam options
export function showJamOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const jamOptionsDiv = document.createElement('div');
    jamOptionsDiv.className = 'custom-options'; // Reusing the same style
    jamOptionsDiv.style.display = 'block';
    jamOptionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        jamOptionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        jamOptionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        jamOptionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        jamOptionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    const jamOptions = ['Strawberry', 'Blueberry', 'Marmelade'];
    
    jamOptions.forEach(jam => {
        const option = document.createElement('div');
        option.className = 'custom-option'; // Reusing the same style
        option.textContent = jam;
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const customizedItem = {
                ...item,
                customizations: [`${jam} Jam`]
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (jamOptionsDiv.parentNode) {
                jamOptionsDiv.parentNode.removeChild(jamOptionsDiv);
            }
        });
        jamOptionsDiv.appendChild(option);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(jamOptionsDiv);
    } else {
        document.body.appendChild(jamOptionsDiv);
    }
    
    // Close jam options when clicking outside
    const closeJamOptions = (e) => {
        if (!jamOptionsDiv.contains(e.target) && e.target !== itemCard) {
            if (jamOptionsDiv.parentNode === document.body) {
                document.body.removeChild(jamOptionsDiv);
            } else if (jamOptionsDiv.parentNode) {
                jamOptionsDiv.parentNode.removeChild(jamOptionsDiv);
            }
            document.removeEventListener('click', closeJamOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeJamOptions);
    }, 0);
}

// Show extra shot options for espresso
export function showExtraShotOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    // Create a new item object with the correct base price
    const espressoItem = {
        ...item,
        price: 500
    };
    
    const options = ['No Extra Shot', 'Add Extra Shot (+¥100)'];
    
    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            let price = 500;
            let customizations = [];
            if (option === 'Add Extra Shot (+¥100)') {
                price = 600;
                customizations = [option];
            }
            const customizedItem = {
                ...espressoItem,
                price: price,
                customizations: customizations
            };
            console.log('Adding espresso with price:', customizedItem.price);
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(optionEl);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }
    
    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode === document.body) {
                document.body.removeChild(optionsDiv);
            } else if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show cake flavor options
export function showCakeOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    const cakeOptions = ['Cheesecake', 'Chocolate'];
    
    cakeOptions.forEach(flavor => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.textContent = flavor;
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const customizedItem = {
                ...item,
                customizations: [`${flavor} Cake`]
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(option);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }
    
    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show ice cream flavor options
export function showIceCreamOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    const iceCreamOptions = ['Vanilla', 'Matcha', 'Chocolate'];
    
    iceCreamOptions.forEach(flavor => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.textContent = flavor;
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const customizedItem = {
                ...item,
                customizations: [`${flavor} Ice Cream`]
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(option);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }
    
    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show Proscuitto options for Caprese Sandwich
export function showProscuittoOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    const options = ['No Proscuitto', 'Add Proscuitto (+¥200)'];
    
    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            let price = item.price;
            let customizations = [];
            if (option === 'Add Proscuitto (+¥200)') {
                price = item.price + 200;
                customizations = ['Proscuitto'];
            }
            const customizedItem = {
                ...item,
                price: price,
                customizations: customizations
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(optionEl);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }
    
    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode === document.body) {
                document.body.removeChild(optionsDiv);
            } else if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show burger options
export function showBurgerOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    
    const options = ['No Fries', 'Add Fries (+¥250)'];
    
    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            let price = item.price;
            let customizations = [];
            if (option === 'Add Fries (+¥250)') {
                price = item.price + 250;
                customizations = ['Fries'];
            }
            const customizedItem = {
                ...item,
                price: price,
                customizations: customizations
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(optionEl);
    });
    
    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }
    
    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode === document.body) {
                document.body.removeChild(optionsDiv);
            } else if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show soft drink options
export function showSoftDrinkOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'grid';
    optionsDiv.style.gridTemplateColumns = '1fr 1fr';
    optionsDiv.style.gap = '4px';
    optionsDiv.style.width = 'max-content';
    optionsDiv.style.minWidth = '200px';
    optionsDiv.style.padding = '8px 16px 8px 8px';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }

    const softDrinkOptions = [
        { name: 'Coke', name_ja: 'コーラ' },
        { name: 'Ramune', name_ja: 'ラムネ' },
        { name: 'Oolong Tea', name_ja: '烏龍茶' },
        { name: 'Ginger Ale', name_ja: 'ジンジャーエール' },
        { name: 'Sparkling Water', name_ja: '炭酸水' }
    ];

    softDrinkOptions.forEach(drink => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.style.display = 'flex';
        option.style.justifyContent = 'flex-start';
        option.style.alignItems = 'center';
        option.style.textAlign = 'left';
        option.style.padding = '10px 12px';
        option.style.cursor = 'pointer';
        option.textContent = window.currentLang === 'ja' ? drink.name_ja : drink.name;
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const customizedItem = {
                ...item,
                customizations: [window.currentLang === 'ja' ? drink.name_ja : drink.name]
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(option);
    });

    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }

    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Show tea options
export function showTeaOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'custom-options';
    optionsDiv.style.display = 'block';
    optionsDiv.style.width = 'max-content';
    optionsDiv.style.minWidth = '120px';
    optionsDiv.style.position = 'absolute'; // Set position for modal context
    // Set dropdown position
    if (itemCard._dropdownModalOffset) {
        optionsDiv.style.left = itemCard._dropdownModalOffset.left + 'px';
        optionsDiv.style.top = itemCard._dropdownModalOffset.top + 'px';
    } else {
        optionsDiv.style.left = itemCard.getBoundingClientRect().left + 'px';
        optionsDiv.style.top = (itemCard.getBoundingClientRect().top + itemCard.getBoundingClientRect().height) + 'px';
    }
    optionsDiv.style.padding = '8px';

    const teaOptions = [
        { name: 'Darjeeling', name_ja: 'ダージリン' },
        { name: 'Jasmine', name_ja: 'ジャスミン' }
    ];

    teaOptions.forEach(tea => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.style.display = 'flex';
        option.style.justifyContent = 'flex-start';
        option.style.alignItems = 'center';
        option.style.textAlign = 'left';
        option.style.padding = '10px 12px';
        option.style.cursor = 'pointer';
        option.textContent = window.currentLang === 'ja' ? tea.name_ja : tea.name;
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const customizedItem = {
                ...item,
                customizations: [window.currentLang === 'ja' ? tea.name_ja : tea.name]
            };
            addItemToOrder(customizedItem, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
        });
        optionsDiv.appendChild(option);
    });

    if (itemCard.closest('.add-item-content')) {
        itemCard.closest('.add-item-content').appendChild(optionsDiv);
    } else {
        document.body.appendChild(optionsDiv);
    }

    const closeOptions = (e) => {
        if (!optionsDiv.contains(e.target) && e.target !== itemCard) {
            if (optionsDiv.parentNode) {
                optionsDiv.parentNode.removeChild(optionsDiv);
            }
            document.removeEventListener('click', closeOptions);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', closeOptions);
    }, 0);
}

// Load menu items for a category
export function loadMenuItems(category, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal) {
    const itemsGrid = document.querySelector('.items-grid');
    
    itemsGrid.innerHTML = '';
    
    // Only proceed with menu items if the category exists in menuData
    if (menuData[category]) {
        menuData[category].forEach(item => {
            if (item.type === 'divider') {
                const divider = document.createElement('div');
                divider.className = 'category-divider';
                itemsGrid.appendChild(divider);
            } else if (item.isBlank) {
                // Create an empty div for blank spaces
                const blankSpace = document.createElement('div');
                blankSpace.className = 'item-card';
                blankSpace.style.visibility = 'hidden';
                itemsGrid.appendChild(blankSpace);
            } else {
                const displayName = window.currentLang === 'ja' && item.name_ja ? item.name_ja : item.name;
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';
                if (item.isMilkAddon) {
                    itemCard.setAttribute('data-milk-addon', 'true');
                }
                itemCard.innerHTML = `
                    <div class="item-name" data-name="${getDisplayName(item.name, window.currentLang)}">${displayName}</div>
                    ${!item.isMilkAddon && !item.hidePrice ? `<div class="item-price">¥${item.price}</div>` : ''}
                `;
                
                itemCard.addEventListener('click', () => {
                    if (item.isCustom) {
                        showCustomItemModal();
                    } else if (item.isDiscount) {
                        showDiscountModal();
                    } else if (item.hasJam) {
                        showJamOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else if (item.hasExtraShot) {
                        showExtraShotOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else if (item.hasFlavor) {
                        if (item.name === 'Cake') {
                            showCakeOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                        } else if (item.name === 'Ice Cream') {
                            showIceCreamOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                        }
                    } else if (item.name === 'Caprese Sandwich') {
                        showProscuittoOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else if (item.name === 'Burger') {
                        showBurgerOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else if (item.hasSoftDrink) {
                        showSoftDrinkOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else if (item.hasTea) {
                        showTeaOptions(item, itemCard, addItemToOrder, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    } else {
                        addItemToOrder(item, renderOrderItems, updateOrderSummary, saveCurrentOrder, showCustomItemModal, showDiscountModal);
                    }
                });
                
                itemsGrid.appendChild(itemCard);
            }
        });
    }
    // Discount button logic (in loadMenuItems or wherever discount button is created)
    // Find the discount button after it is created
    setTimeout(() => {
        let discountBtn = null;
        document.querySelectorAll('.add-item-option').forEach(opt => {
            const nameEl = opt.querySelector('.item-name');
            if (nameEl && nameEl.textContent.trim() === 'Local Discount') {
                discountBtn = opt;
            }
        });
        if (discountBtn) {
            const discountModal = document.getElementById('discountModal');
            const discountAmountEl = document.getElementById('discountAmount');
            const applyDiscountBtn = document.getElementById('applyDiscountBtn');
            if (!discountModal || !discountAmountEl || !applyDiscountBtn) {
                discountBtn.style.display = 'none';
            } else {
                discountBtn.style.display = '';
            }
        }
    }, 0);
}

// Show milk type buttons
export function showMilkTypeButtons(item, orderItemEl, renderOrderItems) {
    // Remove any existing milk UI
    hideMilkTypeButtons();

    // Create the milk buttons container
    const milkButtonsContainer = document.createElement('div');
    milkButtonsContainer.className = 'milk-type-buttons';
    milkButtonsContainer.style.margin = '8px 0 8px 0';
    milkButtonsContainer.style.display = 'flex';
    milkButtonsContainer.style.gap = '10px';
    milkButtonsContainer.style.justifyContent = 'flex-start';

    // Get current milk type if any
    const currentMilkType = item.customizations?.find(c => c.includes('Milk'));
    const hasTakeaway = item.customizations?.includes('Takeaway');

    // Check if this is a coffee item without milk
    const coffeeItemsWithoutMilk = ['Espresso', 'Americano', 'Ice Americano'];
    const isCoffeeWithoutMilk = coffeeItemsWithoutMilk.includes(item.name);

    // Show different options based on item type
    if (isCoffeeWithoutMilk) {
        // For coffee items without milk, only show takeaway option
        milkButtonsContainer.innerHTML = `
            <button class="takeaway-btn${hasTakeaway ? ' active' : ''}" data-takeaway="true">Takeaway</button>
        `;
    } else {
        // For items with milk, show oat, soy, and takeaway options
        milkButtonsContainer.innerHTML = `
            <button class="milk-type-btn ${currentMilkType === 'Oat Milk' ? 'active' : ''}" data-milk="Oat">Oat</button>
            <button class="milk-type-btn ${currentMilkType === 'Soy Milk' ? 'active' : ''}" data-milk="Soy">Soy</button>
            <button class="takeaway-btn${hasTakeaway ? ' active' : ''}" data-takeaway="true">Takeaway</button>
        `;
    }

    // Only add milk button event listeners if milk buttons are present
    if (!isCoffeeWithoutMilk) {
        milkButtonsContainer.querySelectorAll('.milk-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const milkType = btn.dataset.milk;
                // Find the item in window.currentOrder.items
                const updatedItem = window.currentOrder.items.find(i => i.id === item.id);
                if (updatedItem) {
                    updatedItem.customizations = updatedItem.customizations || [];
                    const milkCustomization = `${milkType} Milk`;
                    // If already selected, remove it (toggle off)
                    if (updatedItem.customizations.includes(milkCustomization)) {
                        updatedItem.customizations = updatedItem.customizations.filter(c => c !== milkCustomization);
                    } else {
                        // Remove any existing milk customizations first
                        updatedItem.customizations = updatedItem.customizations.filter(c => !c.includes('Milk'));
                        // Add the new milk type
                        updatedItem.customizations.push(milkCustomization);
                    }
                    // Update order summary and save
                    updateOrderSummary(window.currentOrder);
                    saveCurrentOrder(window.currentOrder);
                    // Re-render order items
                    renderOrderItems(window.currentOrder, window.currentLang, window.getDisplayName, showMilkTypeButtons, hideMilkTypeButtons, window.updateItemQuantity, window.getDailyOrdersDoc);
                    // Hide the milk options after selection
                    hideMilkTypeButtons();
                }
            });
        });
    }

    // Add Takeaway button handler
    const takeawayBtn = milkButtonsContainer.querySelector('.takeaway-btn');
    if (takeawayBtn) {
        takeawayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const updatedItem = window.currentOrder.items.find(i => i.id === item.id);
            if (updatedItem) {
                updatedItem.customizations = updatedItem.customizations || [];
                if (updatedItem.customizations.includes('Takeaway')) {
                    updatedItem.customizations = updatedItem.customizations.filter(c => c !== 'Takeaway');
                } else {
                    updatedItem.customizations.push('Takeaway');
                }
                updateOrderSummary(window.currentOrder);
                saveCurrentOrder(window.currentOrder);
                renderOrderItems(window.currentOrder, window.currentLang, window.getDisplayName, showMilkTypeButtons, hideMilkTypeButtons, window.updateItemQuantity, window.getDailyOrdersDoc);
                hideMilkTypeButtons();
            }
        });
    }

    // Insert after the selected order item
    orderItemEl.insertAdjacentElement('afterend', milkButtonsContainer);
    // Mark the container for easy removal
    milkButtonsContainer.setAttribute('data-milk-ui', 'true');
}

export function hideMilkTypeButtons() {
    const milkButtonsContainer = document.querySelector('.milk-type-buttons[data-milk-ui="true"]');
    if (milkButtonsContainer) {
        milkButtonsContainer.remove();
    }
} 