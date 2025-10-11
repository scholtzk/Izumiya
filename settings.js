// Settings Management System
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings system initializing...');
    
    // Initialize settings when the page loads
    initializeSettings();
    
    // Listen for tab changes to show/hide settings
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-tab') && e.target.dataset.category === 'Settings') {
            showSettings();
        }
    });
});

// Initialize settings system
function initializeSettings() {
    // Load availability settings from localStorage
    loadAvailabilitySettings();
    
    // Render settings interface
    renderSettingsInterface();
}

// Show settings interface
function showSettings() {
    const settingsContainer = document.getElementById('settings-container');
    if (settingsContainer) {
        settingsContainer.style.display = 'block';
        renderSettingsInterface();
    }
}

// Render the settings interface
function renderSettingsInterface() {
    const settingsContent = document.getElementById('settings-content');
    if (!settingsContent) return;
    
    settingsContent.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="display: flex; flex-direction: column; gap: 24px;">
                
                <!-- Availability Management Section -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; border: 1px solid #e9ecef;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">Availability Management</h3>
                            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Manage which menu items are available for ordering</p>
                        </div>
                    </div>
                    
                    <button id="availability-btn" style="
                        background: var(--primary); 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        padding: 12px 24px; 
                        font-size: 16px; 
                        font-weight: 600; 
                        cursor: pointer; 
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                        Manage Item Availability
                    </button>
                </div>
                
                <!-- Other Settings Sections (for future expansion) -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; border: 1px solid #e9ecef; opacity: 0.6;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 40px; height: 40px; background: #6c757d; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">System Settings</h3>
                            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Additional system configuration options (coming soon)</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    `;
    
    // Add event listener for availability button
    const availabilityBtn = document.getElementById('availability-btn');
    if (availabilityBtn) {
        availabilityBtn.addEventListener('click', showAvailabilityModal);
    }
}

// Show availability management modal
function showAvailabilityModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.className = 'availability-modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '12px';
    modal.style.padding = '32px';
    modal.style.maxWidth = '900px';
    modal.style.width = '95%';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.position = 'relative';
    
    // Get all menu items from menu.js
    const allMenuItems = getAllMenuItems();
    
    // Make options available globally
    if (window.menuData) {
        window.jamOptions = [
            { name: 'Strawberry', name_ja: 'いちご' },
            { name: 'Blueberry', name_ja: 'ブルーベリー' },
            { name: 'Marmelade', name_ja: 'マーマレード' }
        ];
        window.cakeOptions = [
            { name: 'Cheesecake', name_ja: 'チーズケーキ' },
            { name: 'Chocolate', name_ja: 'チョコレート' }
        ];
        window.iceCreamOptions = [
            { name: 'Vanilla', name_ja: 'バニラ' },
            { name: 'Matcha', name_ja: '抹茶' },
            { name: 'Chocolate', name_ja: 'チョコレート' }
        ];
        window.teaOptions = [
            { name: 'Darjeeling', name_ja: 'ダージリン' },
            { name: 'Jasmine', name_ja: 'ジャスミン' }
        ];
        window.softDrinkOptions = [
            { name: 'Coke', name_ja: 'コーラ' },
            { name: 'Ramune', name_ja: 'ラムネ' },
            { name: 'Oolong Tea', name_ja: '烏龍茶' },
            { name: 'Ginger Ale', name_ja: 'ジンジャーエール' },
            { name: 'Sparkling Water', name_ja: '炭酸水' }
        ];
    }
    
    // Create modal header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '24px';
    header.style.paddingBottom = '16px';
    header.style.borderBottom = '1px solid #e9ecef';
    
    const title = document.createElement('h2');
    title.textContent = 'Item Availability';
    title.style.margin = '0';
    title.style.color = 'var(--primary)';
    title.style.fontSize = '24px';
    title.style.fontWeight = '600';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '28px';
    closeBtn.style.color = '#888';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '0';
    closeBtn.style.width = '32px';
    closeBtn.style.height = '32px';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create items list
    const itemsList = document.createElement('div');
    itemsList.style.display = 'grid';
    itemsList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    itemsList.style.gap = '16px';
    itemsList.style.maxWidth = '100%';
    
    // Load current availability settings
    const availabilitySettings = loadAvailabilitySettings();
    
    // Create toggle for each menu item
    allMenuItems.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.style.display = 'flex';
        itemRow.style.flexDirection = 'column';
        itemRow.style.padding = '16px';
        itemRow.style.border = '1px solid #e9ecef';
        itemRow.style.borderRadius = '8px';
        itemRow.style.backgroundColor = '#f8f9fa';
        itemRow.style.minHeight = '120px';
        
        const itemInfo = document.createElement('div');
        itemInfo.style.display = 'flex';
        itemInfo.style.flexDirection = 'column';
        itemInfo.style.flex = '1';
        
        const itemName = document.createElement('div');
        itemName.textContent = item.name;
        itemName.style.fontWeight = '600';
        itemName.style.color = '#333';
        itemName.style.fontSize = '16px';
        
        const itemNameJa = document.createElement('div');
        itemNameJa.textContent = item.name_ja;
        itemNameJa.style.color = '#666';
        itemNameJa.style.fontSize = '14px';
        itemNameJa.style.marginTop = '2px';
        
        const itemPrice = document.createElement('div');
        itemPrice.textContent = `¥${item.price}`;
        itemPrice.style.color = 'var(--primary)';
        itemPrice.style.fontWeight = '600';
        itemPrice.style.fontSize = '14px';
        itemPrice.style.marginTop = '4px';
        
        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemNameJa);
        itemInfo.appendChild(itemPrice);
        
        // Get options for this item
        const itemOptions = getItemOptions(item);
        
        // Create options container if item has options
        let optionsContainer = null;
        if (itemOptions.length > 0) {
            optionsContainer = document.createElement('div');
            optionsContainer.style.marginTop = '12px';
            optionsContainer.style.paddingTop = '12px';
            optionsContainer.style.borderTop = '1px solid #dee2e6';
            
            const optionsTitle = document.createElement('div');
            optionsTitle.textContent = window.currentLang === 'ja' ? 'オプション:' : 'Options:';
            optionsTitle.style.fontSize = '12px';
            optionsTitle.style.fontWeight = '600';
            optionsTitle.style.color = '#666';
            optionsTitle.style.marginBottom = '8px';
            optionsContainer.appendChild(optionsTitle);
            
            // Create option toggles
            itemOptions.forEach(option => {
                const optionRow = document.createElement('div');
                optionRow.style.display = 'flex';
                optionRow.style.justifyContent = 'space-between';
                optionRow.style.alignItems = 'center';
                optionRow.style.marginBottom = '6px';
                optionRow.style.padding = '4px 8px';
                optionRow.style.backgroundColor = '#ffffff';
                optionRow.style.borderRadius = '4px';
                optionRow.style.border = '1px solid #e9ecef';
                
                const optionName = document.createElement('span');
                optionName.textContent = window.currentLang === 'ja' && option.name_ja ? option.name_ja : option.name;
                optionName.style.fontSize = '12px';
                optionName.style.color = '#333';
                
                const optionToggleContainer = document.createElement('div');
                optionToggleContainer.style.display = 'flex';
                optionToggleContainer.style.alignItems = 'center';
                optionToggleContainer.style.gap = '8px';
                
                const optionToggle = document.createElement('label');
                optionToggle.style.position = 'relative';
                optionToggle.style.display = 'inline-block';
                optionToggle.style.width = '40px';
                optionToggle.style.height = '20px';
                
                const optionToggleInput = document.createElement('input');
                optionToggleInput.type = 'checkbox';
                optionToggleInput.style.opacity = '0';
                optionToggleInput.style.width = '0';
                optionToggleInput.style.height = '0';
                // Check availability using both English and Japanese names
                const isOptionAvailable = availabilitySettings[option.name] !== false && 
                    (!option.name_ja || availabilitySettings[option.name_ja] !== false);
                optionToggleInput.checked = isOptionAvailable;
                
                const optionToggleSlider = document.createElement('span');
                optionToggleSlider.style.position = 'absolute';
                optionToggleSlider.style.cursor = 'pointer';
                optionToggleSlider.style.top = '0';
                optionToggleSlider.style.left = '0';
                optionToggleSlider.style.right = '0';
                optionToggleSlider.style.bottom = '0';
                optionToggleSlider.style.backgroundColor = optionToggleInput.checked ? 'var(--primary)' : '#ccc';
                optionToggleSlider.style.transition = '0.3s';
                optionToggleSlider.style.borderRadius = '20px';
                
                const optionToggleKnob = document.createElement('span');
                optionToggleKnob.style.position = 'absolute';
                optionToggleKnob.style.content = '""';
                optionToggleKnob.style.height = '16px';
                optionToggleKnob.style.width = '16px';
                optionToggleKnob.style.left = optionToggleInput.checked ? '20px' : '2px';
                optionToggleKnob.style.bottom = '2px';
                optionToggleKnob.style.backgroundColor = 'white';
                optionToggleKnob.style.transition = '0.3s';
                optionToggleKnob.style.borderRadius = '50%';
                optionToggleKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
                
                optionToggle.appendChild(optionToggleInput);
                optionToggle.appendChild(optionToggleSlider);
                optionToggle.appendChild(optionToggleKnob);
                
                // Update option toggle appearance when changed
                optionToggleInput.addEventListener('change', function() {
                    optionToggleSlider.style.backgroundColor = this.checked ? 'var(--primary)' : '#ccc';
                    optionToggleKnob.style.left = this.checked ? '20px' : '2px';
                    
                    // Update availability settings for the option (both English and Japanese names)
                    availabilitySettings[option.name] = this.checked;
                    if (option.name_ja) {
                        availabilitySettings[option.name_ja] = this.checked;
                    }
                    saveAvailabilitySettings(availabilitySettings);
                    
                    // Update menu items immediately
                    updateMenuItemsAvailability();
                });
                
                const optionStatusText = document.createElement('span');
                optionStatusText.textContent = optionToggleInput.checked ? 
                    (window.currentLang === 'ja' ? 'オン' : 'On') : 
                    (window.currentLang === 'ja' ? 'オフ' : 'Off');
                optionStatusText.style.fontSize = '10px';
                optionStatusText.style.color = optionToggleInput.checked ? '#28a745' : '#dc3545';
                optionStatusText.style.fontWeight = '500';
                
                // Update option status text when toggle changes
                optionToggleInput.addEventListener('change', function() {
                    optionStatusText.textContent = this.checked ? 
                        (window.currentLang === 'ja' ? 'オン' : 'On') : 
                        (window.currentLang === 'ja' ? 'オフ' : 'Off');
                    optionStatusText.style.color = this.checked ? '#28a745' : '#dc3545';
                });
                
                optionToggleContainer.appendChild(optionToggle);
                optionToggleContainer.appendChild(optionStatusText);
                
                optionRow.appendChild(optionName);
                optionRow.appendChild(optionToggleContainer);
                optionsContainer.appendChild(optionRow);
            });
        }
        
        // Create main toggle switch
        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.justifyContent = 'space-between';
        toggleContainer.style.gap = '12px';
        toggleContainer.style.marginTop = 'auto';
        
        const toggleSwitch = document.createElement('label');
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.display = 'inline-block';
        toggleSwitch.style.width = '50px';
        toggleSwitch.style.height = '24px';
        
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.style.opacity = '0';
        toggleInput.style.width = '0';
        toggleInput.style.height = '0';
        toggleInput.checked = availabilitySettings[item.name] !== false; // Default to available
        
        const toggleSlider = document.createElement('span');
        toggleSlider.style.position = 'absolute';
        toggleSlider.style.cursor = 'pointer';
        toggleSlider.style.top = '0';
        toggleSlider.style.left = '0';
        toggleSlider.style.right = '0';
        toggleSlider.style.bottom = '0';
        toggleSlider.style.backgroundColor = toggleInput.checked ? 'var(--primary)' : '#ccc';
        toggleSlider.style.transition = '0.3s';
        toggleSlider.style.borderRadius = '24px';
        
        const toggleKnob = document.createElement('span');
        toggleKnob.style.position = 'absolute';
        toggleKnob.style.content = '""';
        toggleKnob.style.height = '18px';
        toggleKnob.style.width = '18px';
        toggleKnob.style.left = toggleInput.checked ? '26px' : '3px';
        toggleKnob.style.bottom = '3px';
        toggleKnob.style.backgroundColor = 'white';
        toggleKnob.style.transition = '0.3s';
        toggleKnob.style.borderRadius = '50%';
        toggleKnob.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);
        toggleSwitch.appendChild(toggleKnob);
        
        // Update toggle appearance when changed
        toggleInput.addEventListener('change', function() {
            toggleSlider.style.backgroundColor = this.checked ? 'var(--primary)' : '#ccc';
            toggleKnob.style.left = this.checked ? '26px' : '3px';
            
            // Update availability settings
            availabilitySettings[item.name] = this.checked;
            saveAvailabilitySettings(availabilitySettings);
            
            // Update menu items immediately
            updateMenuItemsAvailability();
        });
        
        const statusText = document.createElement('span');
        statusText.textContent = toggleInput.checked ? 
            (window.currentLang === 'ja' ? '利用可能' : 'Available') : 
            (window.currentLang === 'ja' ? '利用不可' : 'Unavailable');
        statusText.style.fontSize = '14px';
        statusText.style.color = toggleInput.checked ? '#28a745' : '#dc3545';
        statusText.style.fontWeight = '500';
        
        // Update status text when toggle changes
        toggleInput.addEventListener('change', function() {
            statusText.textContent = this.checked ? 
                (window.currentLang === 'ja' ? '利用可能' : 'Available') : 
                (window.currentLang === 'ja' ? '利用不可' : 'Unavailable');
            statusText.style.color = this.checked ? '#28a745' : '#dc3545';
        });
        
        toggleContainer.appendChild(toggleSwitch);
        toggleContainer.appendChild(statusText);
        
        itemRow.appendChild(itemInfo);
        if (optionsContainer) {
            itemRow.appendChild(optionsContainer);
        }
        itemRow.appendChild(toggleContainer);
        itemsList.appendChild(itemRow);
    });
    
    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.style.background = 'var(--primary)';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '8px';
    saveButton.style.padding = '12px 24px';
    saveButton.style.fontSize = '16px';
    saveButton.style.fontWeight = '600';
    saveButton.style.cursor = 'pointer';
    saveButton.style.marginTop = '24px';
    saveButton.style.width = '100%';
    saveButton.onclick = () => {
        document.body.removeChild(overlay);
        showCustomAlert('Availability settings saved successfully!', 'success');
    };
    
    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .availability-modal-overlay .items-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            }
        }
        @media (max-width: 480px) {
            .availability-modal-overlay .items-grid {
                grid-template-columns: 1fr !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add class for styling
    itemsList.className = 'items-grid';
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(itemsList);
    modal.appendChild(saveButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Get all menu items from menu.js
function getAllMenuItems() {
    // Import menuData from menu.js
    if (window.menuData) {
        const allItems = [];
        // Get all items from both Drinks and Food categories
        Object.values(window.menuData).forEach(category => {
            category.forEach(item => {
                // Only include actual menu items (not dividers or special items)
                if (item.name && !item.type) {
                    allItems.push(item);
                }
            });
        });
        return allItems;
    }
    
    // Fallback if menuData is not available
    console.warn('menuData not found, using fallback menu items');
    return [];
}

// Get options for a specific item
function getItemOptions(item) {
    const options = [];
    
    if (item.hasJam && window.jamOptions) {
        window.jamOptions.forEach(jam => {
            options.push({
                name: `${jam.name} Jam`,
                name_ja: `${jam.name_ja}ジャム`,
                parentItem: item.name,
                type: 'jam'
            });
        });
    }
    
    if (item.hasFlavor && item.name === 'Cake' && window.cakeOptions) {
        window.cakeOptions.forEach(cake => {
            options.push({
                name: `${cake.name} Cake`,
                name_ja: `${cake.name_ja}ケーキ`,
                parentItem: item.name,
                type: 'cake'
            });
        });
    }
    
    if (item.hasFlavor && item.name === 'Ice Cream' && window.iceCreamOptions) {
        window.iceCreamOptions.forEach(ice => {
            options.push({
                name: `${ice.name} Ice Cream`,
                name_ja: `${ice.name_ja}アイスクリーム`,
                parentItem: item.name,
                type: 'icecream'
            });
        });
    }
    
    if (item.hasTea && window.teaOptions) {
        window.teaOptions.forEach(tea => {
            options.push({
                name: tea.name,
                name_ja: tea.name_ja,
                parentItem: item.name,
                type: 'tea'
            });
        });
    }
    
    if (item.hasSoftDrink && window.softDrinkOptions) {
        window.softDrinkOptions.forEach(drink => {
            options.push({
                name: drink.name,
                name_ja: drink.name_ja,
                parentItem: item.name,
                type: 'softdrink'
            });
        });
    }
    
    if (item.hasExtraShot) {
        options.push({
            name: 'Extra Shot',
            name_ja: 'エクストラショット',
            parentItem: item.name,
            type: 'extrashot'
        });
    }
    
    return options;
}

// Load availability settings from localStorage
function loadAvailabilitySettings() {
    const settings = localStorage.getItem('menuAvailabilitySettings');
    return settings ? JSON.parse(settings) : {};
}

// Save availability settings to localStorage
function saveAvailabilitySettings(settings) {
    localStorage.setItem('menuAvailabilitySettings', JSON.stringify(settings));
}

// Update menu items availability in the main interface
function updateMenuItemsAvailability() {
    const availabilitySettings = loadAvailabilitySettings();
    
    // Create a mapping from Japanese names to English names
    const japaneseToEnglishMap = {};
    if (window.menuData) {
        Object.values(window.menuData).forEach(category => {
            category.forEach(item => {
                if (item.name && item.name_ja) {
                    japaneseToEnglishMap[item.name_ja] = item.name;
                }
            });
        });
    }
    
    // Update all menu item buttons
    const menuItems = document.querySelectorAll('.item-card');
    menuItems.forEach(item => {
        const itemName = item.querySelector('.item-name')?.textContent;
        const dataName = item.querySelector('.item-name')?.getAttribute('data-name');
        
        // Check availability using multiple methods
        let isUnavailable = false;
        
        // Method 1: Check using data-name attribute (English name)
        if (dataName && availabilitySettings[dataName] === false) {
            isUnavailable = true;
        }
        // Method 2: Check using displayed name directly
        else if (itemName && availabilitySettings[itemName] === false) {
            isUnavailable = true;
        }
        // Method 3: If displayed name is Japanese, check if English equivalent is unavailable
        else if (itemName && japaneseToEnglishMap[itemName] && availabilitySettings[japaneseToEnglishMap[itemName]] === false) {
            isUnavailable = true;
        }
        
        if (isUnavailable) {
            // Make item unavailable
            item.style.opacity = '0.5';
            item.style.backgroundColor = '#ffebee';
            item.style.border = '1px solid #ffcdd2';
            item.style.cursor = 'not-allowed';
            item.style.pointerEvents = 'none';
            
            // Add "Unavailable" label
            let unavailableLabel = item.querySelector('.unavailable-label');
            if (!unavailableLabel) {
                unavailableLabel = document.createElement('div');
                unavailableLabel.className = 'unavailable-label';
                unavailableLabel.textContent = window.currentLang === 'ja' ? '利用不可' : 'Unavailable';
                unavailableLabel.style.position = 'absolute';
                unavailableLabel.style.top = '8px';
                unavailableLabel.style.right = '8px';
                unavailableLabel.style.background = '#dc3545';
                unavailableLabel.style.color = 'white';
                unavailableLabel.style.padding = '4px 8px';
                unavailableLabel.style.borderRadius = '4px';
                unavailableLabel.style.fontSize = '12px';
                unavailableLabel.style.fontWeight = 'bold';
                item.style.position = 'relative';
                item.appendChild(unavailableLabel);
            }
        } else {
            // Make item available
            item.style.opacity = '1';
            item.style.backgroundColor = '';
            item.style.border = '';
            item.style.cursor = 'pointer';
            item.style.pointerEvents = 'auto';
            
            // Remove unavailable label
            const unavailableLabel = item.querySelector('.unavailable-label');
            if (unavailableLabel) {
                unavailableLabel.remove();
            }
        }
    });
}

// Custom alert function (if not already defined)
function showCustomAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.padding = '16px 24px';
    alert.style.borderRadius = '8px';
    alert.style.color = 'white';
    alert.style.fontWeight = '600';
    alert.style.zIndex = '10000';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Set color based on type
    switch(type) {
        case 'success':
            alert.style.backgroundColor = '#28a745';
            break;
        case 'error':
            alert.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            alert.style.backgroundColor = '#ffc107';
            alert.style.color = '#333';
            break;
        default:
            alert.style.backgroundColor = '#007bff';
    }
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Initialize availability settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for menu items to load, then update availability
    setTimeout(() => {
        updateMenuItemsAvailability();
    }, 1000);
});

// Also update when menu items are loaded dynamically
document.addEventListener('menuItemsLoaded', function() {
    updateMenuItemsAvailability();
});

// Update availability when switching between categories
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-tab')) {
        // Wait a bit for menu items to render, then update availability
        setTimeout(() => {
            updateMenuItemsAvailability();
        }, 100);
    }
});

// Display settings in the provided container
function displaySettings(container) {
    console.log('Displaying settings in container:', container);
    
    // Clear the container
    container.innerHTML = '';
    
    // Create settings content
    const settingsContent = document.createElement('div');
    settingsContent.style.padding = '20px';
    settingsContent.style.maxWidth = '800px';
    settingsContent.style.margin = '0 auto';
    
    const title = document.createElement('h2');
    title.textContent = window.currentLang === 'ja' ? '設定' : 'Settings';
    title.style.marginBottom = '20px';
    title.style.color = '#333';
    title.style.fontSize = '24px';
    title.style.fontWeight = '600';
    
    const availabilityBtn = document.createElement('button');
    availabilityBtn.textContent = window.currentLang === 'ja' ? 'アイテムの利用可能性を管理' : 'Manage Item Availability';
    availabilityBtn.style.padding = '12px 24px';
    availabilityBtn.style.backgroundColor = 'var(--primary)';
    availabilityBtn.style.color = 'white';
    availabilityBtn.style.border = 'none';
    availabilityBtn.style.borderRadius = '8px';
    availabilityBtn.style.cursor = 'pointer';
    availabilityBtn.style.fontSize = '16px';
    availabilityBtn.style.fontWeight = '500';
    availabilityBtn.style.transition = 'background-color 0.3s';
    
    availabilityBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#0056b3';
    });
    
    availabilityBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--primary)';
    });
    
    availabilityBtn.addEventListener('click', function() {
        openAvailabilityModal();
    });
    
    settingsContent.appendChild(title);
    settingsContent.appendChild(availabilityBtn);
    container.appendChild(settingsContent);
    
    console.log('Settings displayed successfully');
}
