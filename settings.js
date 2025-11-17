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
                
                <!-- Card Payment Settings Section -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; border: 1px solid #e9ecef;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                                <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">Card Payment Settings</h3>
                            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Enable or disable card payment options</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 16px; color: #333; font-weight: 500;">Enable Card Payments</span>
                        
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <label style="position: relative; display: inline-block; width: 60px; height: 30px;">
                                <input type="checkbox" id="cardPaymentToggle" style="opacity: 0; width: 0; height: 0;">
                                <span id="cardPaymentSlider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--primary); transition: 0.3s; border-radius: 30px;"></span>
                                <span id="cardPaymentKnob" style="position: absolute; content: ''; height: 24px; width: 24px; left: 32px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </label>
                            <span id="cardPaymentStatus" style="font-size: 14px; color: #28a745; font-weight: 500;">Enabled</span>
                        </div>
                    </div>
                </div>
                
                <!-- Cash Flow Management Section -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; border: 1px solid #e9ecef;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">Cash Flow Management</h3>
                            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Start of day float and end of day money check</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button id="open-till-btn" style="
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
                            flex: 1;
                        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                            Open Till
                        </button>
                        <button id="close-till-btn" style="
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
                            flex: 1;
                        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                            Close Till
                        </button>
                    </div>
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
    
    // Add event listeners for open/close till buttons
    const openTillBtn = document.getElementById('open-till-btn');
    if (openTillBtn) {
        openTillBtn.addEventListener('click', showOpenTillModal);
    }
    
    const closeTillBtn = document.getElementById('close-till-btn');
    if (closeTillBtn) {
        closeTillBtn.addEventListener('click', showCloseTillModal);
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
    settingsContent.appendChild(cardPaymentSection);
    container.appendChild(settingsContent);
    
    console.log('Settings displayed successfully');
}

// Cash Flow Management Functions

// Format date as YYYY-MM-DD
function formatDateForCashFlow(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get cash sales for a specific date
async function getCashSalesForDate(date) {
    try {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        
        // Import fetchOrders from analysis.js if available, or use direct Firestore query
        if (window.fetchOrders) {
            const orders = await window.fetchOrders(start, end);
            let cashSales = 0;
            orders.forEach(order => {
                if (order.paymentMethod === 'Cash') {
                    cashSales += order.total || 0;
                }
            });
            return cashSales;
        } else {
            // Fallback: query Firestore directly
            const dateKey = formatDateForCashFlow(date);
            const dailyOrdersRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', dateKey);
            const dailyDoc = await window.firebaseServices.getDoc(dailyOrdersRef);
            
            if (dailyDoc.exists()) {
                const data = dailyDoc.data();
                let cashSales = 0;
                Object.values(data.orders || {}).forEach(order => {
                    if (order.paymentMethod === 'Cash') {
                        cashSales += order.total || 0;
                    }
                });
                return cashSales;
            }
            return 0;
        }
    } catch (error) {
        console.error('Error fetching cash sales:', error);
        return 0;
    }
}

// Get card sales for a specific date
async function getCardSalesForDate(date) {
    try {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        
        if (window.fetchOrders) {
            const orders = await window.fetchOrders(start, end);
            let cardSales = 0;
            orders.forEach(order => {
                if (order.paymentMethod === 'Card') {
                    cardSales += order.total || 0;
                }
            });
            return cardSales;
        } else {
            const dateKey = formatDateForCashFlow(date);
            const dailyOrdersRef = window.firebaseServices.doc(window.firebaseDb, 'dailyOrders', dateKey);
            const dailyDoc = await window.firebaseServices.getDoc(dailyOrdersRef);
            
            if (dailyDoc.exists()) {
                const data = dailyDoc.data();
                let cardSales = 0;
                Object.values(data.orders || {}).forEach(order => {
                    if (order.paymentMethod === 'Card') {
                        cardSales += order.total || 0;
                    }
                });
                return cardSales;
            }
            return 0;
        }
    } catch (error) {
        console.error('Error fetching card sales:', error);
        return 0;
    }
}

// Get today's open float (from today's open document)
async function getTodayOpenFloat(date) {
    try {
        const dateKey = formatDateForCashFlow(date) + '-open';
        const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
        const cashflowDoc = await window.firebaseServices.getDoc(cashflowRef);
        
        if (cashflowDoc.exists()) {
            const data = cashflowDoc.data();
            // Return the float amount from today's open document
            if (data.floatTotal !== undefined) {
                return data.floatTotal || 0;
            }
            // Also check for floatAmounts array format
            if (data.floatAmounts && Array.isArray(data.floatAmounts)) {
                return data.floatAmounts.reduce((sum, item) => sum + (item.total || 0), 0);
            }
        }
        return 0;
    } catch (error) {
        console.error('Error fetching today\'s open float:', error);
        return 0;
    }
}

// Get previous day's float (from previous day's close document)
async function getPreviousDayFloat(date) {
    try {
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        const dateKey = formatDateForCashFlow(previousDay) + '-close';
        
        const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
        const cashflowDoc = await window.firebaseServices.getDoc(cashflowRef);
        
        if (cashflowDoc.exists()) {
            const data = cashflowDoc.data();
            // Return the new float amount from previous day's close (which becomes today's starting float)
            // Check for new format first (newFloatAmounts array)
            if (data.newFloatAmounts && Array.isArray(data.newFloatAmounts)) {
                return data.newFloatAmounts.reduce((sum, item) => sum + (item.total || 0), 0);
            }
            // Fallback to old format
            if (data.newFloatTotal !== undefined) {
                return data.newFloatTotal || 0;
            }
            if (data.newFloatAmount && data.newFloatAmount.length > 0) {
                return data.newFloatAmount[0] || 0;
            }
        }
        // Also check for open document from previous day (in case no close exists)
        const openDateKey = formatDateForCashFlow(previousDay) + '-open';
        const openCashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', openDateKey);
        const openCashflowDoc = await window.firebaseServices.getDoc(openCashflowRef);
        
        if (openCashflowDoc.exists()) {
            const data = openCashflowDoc.data();
            if (data.floatTotal !== undefined) {
                return data.floatTotal || 0;
            }
        }
        return 0;
    } catch (error) {
        console.error('Error fetching previous day\'s float:', error);
        return 0;
    }
}

// Show Open Till modal (just float input)
async function showOpenTillModal() {
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
    overlay.className = 'cashflow-modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '12px';
    modal.style.padding = '32px';
    modal.style.maxWidth = '700px';
    modal.style.width = '95%';
    modal.style.maxHeight = '90vh';
    modal.style.overflowY = 'auto';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.position = 'relative';
    
    // Create modal header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '24px';
    header.style.paddingBottom = '16px';
    header.style.borderBottom = '1px solid #e9ecef';
    
    const title = document.createElement('h2');
    title.textContent = 'Open Till';
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
    
    // Create date selector
    const dateSelectorContainer = document.createElement('div');
    dateSelectorContainer.style.display = 'flex';
    dateSelectorContainer.style.alignItems = 'center';
    dateSelectorContainer.style.gap = '12px';
    dateSelectorContainer.style.marginBottom = '24px';
    dateSelectorContainer.style.padding = '12px';
    dateSelectorContainer.style.backgroundColor = '#f8f9fa';
    dateSelectorContainer.style.borderRadius = '8px';
    dateSelectorContainer.style.border = '1px solid #e9ecef';
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Date:';
    dateLabel.style.fontSize = '16px';
    dateLabel.style.fontWeight = '500';
    dateLabel.style.color = '#333';
    dateLabel.style.minWidth = '60px';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    const today = new Date();
    dateInput.value = formatDateForCashFlow(today);
    dateInput.style.padding = '8px 12px';
    dateInput.style.border = '1px solid #ddd';
    dateInput.style.borderRadius = '6px';
    dateInput.style.fontSize = '16px';
    dateInput.style.flex = '1';
    dateInput.style.maxWidth = '200px';
    
    dateSelectorContainer.appendChild(dateLabel);
    dateSelectorContainer.appendChild(dateInput);
    
    // Create denominations array
    const denominations = [
        { value: 10000, label: '¥10,000' },
        { value: 5000, label: '¥5,000' },
        { value: 1000, label: '¥1,000' },
        { value: 500, label: '¥500' },
        { value: 100, label: '¥100' },
        { value: 50, label: '¥50' },
        { value: 10, label: '¥10' },
        { value: 5, label: '¥5' },
        { value: 1, label: '¥1' }
    ];
    
    // Float input container
    const floatContainer = document.createElement('div');
    floatContainer.style.marginBottom = '24px';
    
    const floatLabel = document.createElement('div');
    floatLabel.textContent = 'Float Amount:';
    floatLabel.style.fontSize = '18px';
    floatLabel.style.fontWeight = '600';
    floatLabel.style.color = '#333';
    floatLabel.style.marginBottom = '12px';
    floatContainer.appendChild(floatLabel);
    
    // Store float input references
    const floatInputRefs = {};
    
    // Helper function to create a denomination input card
    function createDenominationCard(denom, refsObj, updateCallback) {
        const inputCard = document.createElement('div');
        inputCard.style.display = 'flex';
        inputCard.style.flexDirection = 'row';
        inputCard.style.alignItems = 'center';
        inputCard.style.flex = '0 0 calc(33.33% - 8px)';
        inputCard.style.maxWidth = 'calc(33.33% - 8px)';
        inputCard.style.padding = '12px';
        inputCard.style.backgroundColor = '#f8f9fa';
        inputCard.style.borderRadius = '8px';
        inputCard.style.border = '1px solid #e9ecef';
        inputCard.style.gap = '8px';
        
        const label = document.createElement('label');
        label.textContent = denom.label;
        label.style.fontSize = '14px';
        label.style.fontWeight = '500';
        label.style.color = '#333';
        label.style.flexShrink = '0';
        label.style.minWidth = '60px';
        
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.alignItems = 'stretch';
        inputRow.style.gap = '6px';
        inputRow.style.flex = '1';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = '1';
        input.value = '0';
        input.style.width = '56px';
        input.style.flexShrink = '0';
        input.style.padding = '6px 8px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '6px';
        input.style.fontSize = '14px';
        input.style.textAlign = 'right';
        input.style.mozAppearance = 'textfield'; // Remove spinner on Firefox
        input.style.webkitAppearance = 'none'; // Remove spinner on Chrome/Safari
        refsObj[denom.value] = input;
        
        input.addEventListener('input', function() {
            if (updateCallback) updateCallback();
        });
        
        // Button container for vertical stacking
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '4px';
        buttonContainer.style.width = '48px';
        buttonContainer.style.flexShrink = '0';
        
        // Increase button (+1) - on top
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.type = 'button';
        increaseBtn.style.width = '100%';
        increaseBtn.style.flex = '1';
        increaseBtn.style.padding = '0';
        increaseBtn.style.border = '1px solid var(--primary)';
        increaseBtn.style.borderRadius = '6px';
        increaseBtn.style.backgroundColor = 'white';
        increaseBtn.style.color = 'var(--primary)';
        increaseBtn.style.fontSize = '16px';
        increaseBtn.style.fontWeight = 'bold';
        increaseBtn.style.cursor = 'pointer';
        increaseBtn.style.display = 'flex';
        increaseBtn.style.alignItems = 'center';
        increaseBtn.style.justifyContent = 'center';
        increaseBtn.style.transition = 'all 0.2s ease';
        increaseBtn.onmouseover = function() {
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
        };
        increaseBtn.onmouseout = function() {
            this.style.backgroundColor = 'white';
            this.style.color = 'var(--primary)';
        };
        increaseBtn.onclick = function(e) {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const newValue = currentValue + 1;
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        };
        
        // Decrease button (-1) - on bottom
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '−';
        decreaseBtn.type = 'button';
        decreaseBtn.style.width = '100%';
        decreaseBtn.style.flex = '1';
        decreaseBtn.style.padding = '0';
        decreaseBtn.style.border = '1px solid var(--primary)';
        decreaseBtn.style.borderRadius = '6px';
        decreaseBtn.style.backgroundColor = 'white';
        decreaseBtn.style.color = 'var(--primary)';
        decreaseBtn.style.fontSize = '16px';
        decreaseBtn.style.fontWeight = 'bold';
        decreaseBtn.style.cursor = 'pointer';
        decreaseBtn.style.display = 'flex';
        decreaseBtn.style.alignItems = 'center';
        decreaseBtn.style.justifyContent = 'center';
        decreaseBtn.style.transition = 'all 0.2s ease';
        decreaseBtn.onmouseover = function() {
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
        };
        decreaseBtn.onmouseout = function() {
            this.style.backgroundColor = 'white';
            this.style.color = 'var(--primary)';
        };
        decreaseBtn.onclick = function(e) {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const newValue = Math.max(0, currentValue - 1);
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        };
        
        buttonContainer.appendChild(increaseBtn);
        buttonContainer.appendChild(decreaseBtn);
        
        inputRow.appendChild(input);
        inputRow.appendChild(buttonContainer);
        inputCard.appendChild(label);
        inputCard.appendChild(inputRow);
        
        return inputCard;
    }
    
    // Create float inputs (3 per row)
    for (let i = 0; i < denominations.length; i += 3) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '12px';
        row.style.marginBottom = '16px';
        
        for (let j = 0; j < 3 && (i + j) < denominations.length; j++) {
            const denom = denominations[i + j];
            const card = createDenominationCard(denom, floatInputRefs, updateFloatTotal);
            row.appendChild(card);
        }
        
        floatContainer.appendChild(row);
    }
    
    // Float total display
    const floatTotalContainer = document.createElement('div');
    floatTotalContainer.style.marginTop = '12px';
    floatTotalContainer.style.padding = '12px';
    floatTotalContainer.style.backgroundColor = '#e7f3ff';
    floatTotalContainer.style.borderRadius = '6px';
    floatTotalContainer.style.border = '1px solid #b3d9ff';
    
    const floatTotalLabel = document.createElement('div');
    floatTotalLabel.textContent = 'Float Total:';
    floatTotalLabel.style.fontSize = '14px';
    floatTotalLabel.style.color = '#666';
    floatTotalLabel.style.marginBottom = '4px';
    
    const floatTotalValue = document.createElement('div');
    floatTotalValue.id = 'float-total';
    floatTotalValue.textContent = '¥0';
    floatTotalValue.style.fontSize = '20px';
    floatTotalValue.style.fontWeight = 'bold';
    floatTotalValue.style.color = 'var(--primary)';
    
    floatTotalContainer.appendChild(floatTotalLabel);
    floatTotalContainer.appendChild(floatTotalValue);
    floatContainer.appendChild(floatTotalContainer);
    
    // Update float total function
    function updateFloatTotal() {
        let total = 0;
        denominations.forEach(denom => {
            const input = floatInputRefs[denom.value];
            if (input) {
                const count = parseInt(input.value) || 0;
                total += count * denom.value;
            }
        });
        floatTotalValue.textContent = `¥${total.toLocaleString()}`;
    }
    
    // Load existing open till data
    async function loadExistingData() {
        try {
            const dateStr = dateInput.value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const dateKey = formatDateForCashFlow(selectedDate) + '-open';
            const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
            const cashflowDoc = await window.firebaseServices.getDoc(cashflowRef);
            
            if (cashflowDoc.exists()) {
                const data = cashflowDoc.data();
                if (data.floatAmounts && Array.isArray(data.floatAmounts)) {
                    data.floatAmounts.forEach(item => {
                        if (floatInputRefs[item.denomination]) {
                            floatInputRefs[item.denomination].value = item.count;
                            floatInputRefs[item.denomination].dispatchEvent(new Event('input'));
                        }
                    });
                }
            } else {
                denominations.forEach(denom => {
                    if (floatInputRefs[denom.value]) {
                        floatInputRefs[denom.value].value = '0';
                        floatInputRefs[denom.value].dispatchEvent(new Event('input'));
                    }
                });
            }
        } catch (error) {
            console.error('Error loading existing data:', error);
        }
    }
    
    // Update when date changes
    dateInput.addEventListener('change', async () => {
        await loadExistingData();
    });
    
    // Load existing data on initial load
    loadExistingData();
    
    // Save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.background = 'var(--primary)';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '8px';
    saveButton.style.padding = '14px 28px';
    saveButton.style.fontSize = '16px';
    saveButton.style.fontWeight = '600';
    saveButton.style.cursor = 'pointer';
    saveButton.style.width = '100%';
    saveButton.style.marginTop = '8px';
    saveButton.onclick = async () => {
        try {
            const dateStr = dateInput.value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const dateKey = formatDateForCashFlow(selectedDate) + '-open';
            
            // Get float amounts from denominations
            const floatAmounts = [];
            let floatTotal = 0;
            denominations.forEach(denom => {
                const input = floatInputRefs[denom.value];
                if (input) {
                    const count = parseInt(input.value) || 0;
                    if (count > 0) {
                        floatAmounts.push({
                            denomination: denom.value,
                            count: count,
                            total: count * denom.value
                        });
                        floatTotal += count * denom.value;
                    }
                }
            });
            
            // Save to Firestore
            const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
            
            await window.firebaseServices.setDoc(cashflowRef, {
                floatAmounts: floatAmounts,
                floatTotal: floatTotal,
                date: formatDateForCashFlow(selectedDate),
                type: 'open',
                timestamp: new Date().toISOString()
            }, { merge: true });
            
            showCustomAlert('Open till data saved successfully!', 'success');
            document.body.removeChild(overlay);
        } catch (error) {
            console.error('Error saving open till data:', error);
            showCustomAlert('Failed to save open till data. Please try again.', 'error');
        }
    };
    
    // Add CSS to hide native number input spinners
    const style = document.createElement('style');
    style.textContent = `
        .cashflow-modal-overlay input[type="number"]::-webkit-outer-spin-button,
        .cashflow-modal-overlay input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .cashflow-modal-overlay input[type="number"] {
            -moz-appearance: textfield;
        }
    `;
    document.head.appendChild(style);
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(dateSelectorContainer);
    modal.appendChild(floatContainer);
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

// Show Close Till modal (full cash flow management)
async function showCloseTillModal() {
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
    overlay.className = 'cashflow-modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '12px';
    modal.style.padding = '32px';
    modal.style.maxWidth = '700px';
    modal.style.width = '95%';
    modal.style.maxHeight = '90vh';
    modal.style.overflowY = 'auto';
    modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    modal.style.position = 'relative';
    
    // Create modal header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '24px';
    header.style.paddingBottom = '16px';
    header.style.borderBottom = '1px solid #e9ecef';
    
    const title = document.createElement('h2');
    title.textContent = 'Close Till';
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
    
    // Create date selector
    const dateSelectorContainer = document.createElement('div');
    dateSelectorContainer.style.display = 'flex';
    dateSelectorContainer.style.alignItems = 'center';
    dateSelectorContainer.style.gap = '12px';
    dateSelectorContainer.style.marginBottom = '24px';
    dateSelectorContainer.style.padding = '12px';
    dateSelectorContainer.style.backgroundColor = '#f8f9fa';
    dateSelectorContainer.style.borderRadius = '8px';
    dateSelectorContainer.style.border = '1px solid #e9ecef';
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Date:';
    dateLabel.style.fontSize = '16px';
    dateLabel.style.fontWeight = '500';
    dateLabel.style.color = '#333';
    dateLabel.style.minWidth = '60px';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    const today = new Date();
    dateInput.value = formatDateForCashFlow(today);
    dateInput.style.padding = '8px 12px';
    dateInput.style.border = '1px solid #ddd';
    dateInput.style.borderRadius = '6px';
    dateInput.style.fontSize = '16px';
    dateInput.style.flex = '1';
    dateInput.style.maxWidth = '200px';
    
    dateSelectorContainer.appendChild(dateLabel);
    dateSelectorContainer.appendChild(dateInput);
    
    // Create denominations array
    const denominations = [
        { value: 10000, label: '¥10,000' },
        { value: 5000, label: '¥5,000' },
        { value: 1000, label: '¥1,000' },
        { value: 500, label: '¥500' },
        { value: 100, label: '¥100' },
        { value: 50, label: '¥50' },
        { value: 10, label: '¥10' },
        { value: 5, label: '¥5' },
        { value: 1, label: '¥1' }
    ];
    
    // Create input fields container
    const inputsContainer = document.createElement('div');
    inputsContainer.style.display = 'flex';
    inputsContainer.style.flexDirection = 'column';
    inputsContainer.style.gap = '16px';
    inputsContainer.style.marginBottom = '24px';
    
    // Store input references
    const inputRefs = {};
    
    // Create section label for till amounts
    const tillLabel = document.createElement('div');
    tillLabel.textContent = 'Amounts in Till:';
    tillLabel.style.fontSize = '18px';
    tillLabel.style.fontWeight = '600';
    tillLabel.style.color = '#333';
    tillLabel.style.marginBottom = '12px';
    inputsContainer.appendChild(tillLabel);
    
    // Helper function to create a denomination input card
    function createDenominationCard(denom, refsObj, updateCallback) {
        const inputCard = document.createElement('div');
        inputCard.style.display = 'flex';
        inputCard.style.flexDirection = 'row';
        inputCard.style.alignItems = 'center';
        inputCard.style.flex = '0 0 calc(33.33% - 8px)';
        inputCard.style.maxWidth = 'calc(33.33% - 8px)';
        inputCard.style.padding = '12px';
        inputCard.style.backgroundColor = '#f8f9fa';
        inputCard.style.borderRadius = '8px';
        inputCard.style.border = '1px solid #e9ecef';
        inputCard.style.gap = '8px';
        
        const label = document.createElement('label');
        label.textContent = denom.label;
        label.style.fontSize = '14px';
        label.style.fontWeight = '500';
        label.style.color = '#333';
        label.style.flexShrink = '0';
        label.style.minWidth = '60px';
        
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.alignItems = 'stretch';
        inputRow.style.gap = '6px';
        inputRow.style.flex = '1';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = '1';
        input.value = '0';
        input.style.width = '56px';
        input.style.flexShrink = '0';
        input.style.padding = '6px 8px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '6px';
        input.style.fontSize = '14px';
        input.style.textAlign = 'right';
        input.style.mozAppearance = 'textfield'; // Remove spinner on Firefox
        input.style.webkitAppearance = 'none'; // Remove spinner on Chrome/Safari
        refsObj[denom.value] = input;
        
        input.addEventListener('input', function() {
            if (updateCallback) updateCallback();
        });
        
        // Button container for vertical stacking
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '4px';
        buttonContainer.style.width = '48px';
        buttonContainer.style.flexShrink = '0';
        
        // Increase button (+1) - on top
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.type = 'button';
        increaseBtn.style.width = '100%';
        increaseBtn.style.flex = '1';
        increaseBtn.style.padding = '0';
        increaseBtn.style.border = '1px solid var(--primary)';
        increaseBtn.style.borderRadius = '6px';
        increaseBtn.style.backgroundColor = 'white';
        increaseBtn.style.color = 'var(--primary)';
        increaseBtn.style.fontSize = '16px';
        increaseBtn.style.fontWeight = 'bold';
        increaseBtn.style.cursor = 'pointer';
        increaseBtn.style.display = 'flex';
        increaseBtn.style.alignItems = 'center';
        increaseBtn.style.justifyContent = 'center';
        increaseBtn.style.transition = 'all 0.2s ease';
        increaseBtn.onmouseover = function() {
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
        };
        increaseBtn.onmouseout = function() {
            this.style.backgroundColor = 'white';
            this.style.color = 'var(--primary)';
        };
        increaseBtn.onclick = function(e) {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const newValue = currentValue + 1;
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        };
        
        // Decrease button (-1) - on bottom
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '−';
        decreaseBtn.type = 'button';
        decreaseBtn.style.width = '100%';
        decreaseBtn.style.flex = '1';
        decreaseBtn.style.padding = '0';
        decreaseBtn.style.border = '1px solid var(--primary)';
        decreaseBtn.style.borderRadius = '6px';
        decreaseBtn.style.backgroundColor = 'white';
        decreaseBtn.style.color = 'var(--primary)';
        decreaseBtn.style.fontSize = '16px';
        decreaseBtn.style.fontWeight = 'bold';
        decreaseBtn.style.cursor = 'pointer';
        decreaseBtn.style.display = 'flex';
        decreaseBtn.style.alignItems = 'center';
        decreaseBtn.style.justifyContent = 'center';
        decreaseBtn.style.transition = 'all 0.2s ease';
        decreaseBtn.onmouseover = function() {
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
        };
        decreaseBtn.onmouseout = function() {
            this.style.backgroundColor = 'white';
            this.style.color = 'var(--primary)';
        };
        decreaseBtn.onclick = function(e) {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 0;
            const newValue = Math.max(0, currentValue - 1);
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        };
        
        buttonContainer.appendChild(increaseBtn);
        buttonContainer.appendChild(decreaseBtn);
        
        inputRow.appendChild(input);
        inputRow.appendChild(buttonContainer);
        inputCard.appendChild(label);
        inputCard.appendChild(inputRow);
        
        return inputCard;
    }
    
    // Create input for each denomination (3 per row)
    for (let i = 0; i < denominations.length; i += 3) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '12px';
        row.style.marginBottom = '16px';
        
        // Add up to 3 denominations in row
        for (let j = 0; j < 3 && (i + j) < denominations.length; j++) {
            const denom = denominations[i + j];
            const card = createDenominationCard(denom, inputRefs, updateRunningTotal);
            row.appendChild(card);
        }
        
        inputsContainer.appendChild(row);
    }
    
    // Running total and expected amount container
    const totalsContainer = document.createElement('div');
    totalsContainer.style.display = 'flex';
    totalsContainer.style.gap = '20px';
    totalsContainer.style.marginBottom = '24px';
    totalsContainer.style.padding = '20px';
    totalsContainer.style.backgroundColor = '#f8f9fa';
    totalsContainer.style.borderRadius = '8px';
    totalsContainer.style.border = '2px solid var(--primary)';
    
    const runningTotalDiv = document.createElement('div');
    runningTotalDiv.style.flex = '1';
    
    const runningTotalLabel = document.createElement('div');
    runningTotalLabel.textContent = 'Total Amount in Till:';
    runningTotalLabel.style.fontSize = '14px';
    runningTotalLabel.style.color = '#666';
    runningTotalLabel.style.marginBottom = '8px';
    
    const runningTotalValue = document.createElement('div');
    runningTotalValue.id = 'cashflow-running-total';
    runningTotalValue.textContent = '¥0';
    runningTotalValue.style.fontSize = '32px';
    runningTotalValue.style.fontWeight = 'bold';
    runningTotalValue.style.color = 'var(--primary)';
    
    runningTotalDiv.appendChild(runningTotalLabel);
    runningTotalDiv.appendChild(runningTotalValue);
    
    const expectedTotalDiv = document.createElement('div');
    expectedTotalDiv.style.flex = '1';
    
    const expectedTotalLabel = document.createElement('div');
    expectedTotalLabel.textContent = 'Expected Amount:';
    expectedTotalLabel.style.fontSize = '14px';
    expectedTotalLabel.style.color = '#666';
    expectedTotalLabel.style.marginBottom = '8px';
    
    const expectedTotalValue = document.createElement('div');
    expectedTotalValue.id = 'cashflow-expected-total';
    expectedTotalValue.textContent = 'Calculating...';
    expectedTotalValue.style.fontSize = '24px';
    expectedTotalValue.style.fontWeight = 'bold';
    expectedTotalValue.style.color = '#28a745';
    
    expectedTotalDiv.appendChild(expectedTotalLabel);
    expectedTotalDiv.appendChild(expectedTotalValue);
    
    totalsContainer.appendChild(runningTotalDiv);
    totalsContainer.appendChild(expectedTotalDiv);
    
    // New float input container
    const newFloatContainer = document.createElement('div');
    newFloatContainer.style.marginBottom = '24px';
    
    const newFloatLabel = document.createElement('div');
    newFloatLabel.textContent = 'New Float Amount (for next day):';
    newFloatLabel.style.fontSize = '18px';
    newFloatLabel.style.fontWeight = '600';
    newFloatLabel.style.color = '#333';
    newFloatLabel.style.marginBottom = '12px';
    newFloatContainer.appendChild(newFloatLabel);
    
    // Store new float input references
    const newFloatInputRefs = {};
    
    // Create new float inputs (3 per row)
    for (let i = 0; i < denominations.length; i += 3) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '12px';
        row.style.marginBottom = '16px';
        
        // Add up to 3 denominations in row
        for (let j = 0; j < 3 && (i + j) < denominations.length; j++) {
            const denom = denominations[i + j];
            const card = createDenominationCard(denom, newFloatInputRefs, updateNewFloatTotal);
            row.appendChild(card);
        }
        
        newFloatContainer.appendChild(row);
    }
    
    // New float total display
    const newFloatTotalContainer = document.createElement('div');
    newFloatTotalContainer.style.marginTop = '12px';
    newFloatTotalContainer.style.padding = '12px';
    newFloatTotalContainer.style.backgroundColor = '#e7f3ff';
    newFloatTotalContainer.style.borderRadius = '6px';
    newFloatTotalContainer.style.border = '1px solid #b3d9ff';
    
    const newFloatTotalLabel = document.createElement('div');
    newFloatTotalLabel.textContent = 'New Float Total:';
    newFloatTotalLabel.style.fontSize = '14px';
    newFloatTotalLabel.style.color = '#666';
    newFloatTotalLabel.style.marginBottom = '4px';
    
    const newFloatTotalValue = document.createElement('div');
    newFloatTotalValue.id = 'new-float-total';
    newFloatTotalValue.textContent = '¥0';
    newFloatTotalValue.style.fontSize = '20px';
    newFloatTotalValue.style.fontWeight = 'bold';
    newFloatTotalValue.style.color = 'var(--primary)';
    
    newFloatTotalContainer.appendChild(newFloatTotalLabel);
    newFloatTotalContainer.appendChild(newFloatTotalValue);
    newFloatContainer.appendChild(newFloatTotalContainer);
    
    // Update new float total function
    function updateNewFloatTotal() {
        let total = 0;
        denominations.forEach(denom => {
            const input = newFloatInputRefs[denom.value];
            if (input) {
                const count = parseInt(input.value) || 0;
                total += count * denom.value;
            }
        });
        newFloatTotalValue.textContent = `¥${total.toLocaleString()}`;
    }
    
    // Update running total function
    function updateRunningTotal() {
        let total = 0;
        denominations.forEach(denom => {
            const count = parseInt(inputRefs[denom.value].value) || 0;
            total += count * denom.value;
        });
        runningTotalValue.textContent = `¥${total.toLocaleString()}`;
    }
    
    // Calculate and display expected amount
    async function updateExpectedAmount() {
        try {
            // Parse date input value (YYYY-MM-DD) and create date at midnight local time
            const dateStr = dateInput.value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const cashSales = await getCashSalesForDate(selectedDate);
            const cardSales = await getCardSalesForDate(selectedDate);
            // Get today's open float (from today's open document)
            const todayOpenFloat = await getTodayOpenFloat(selectedDate);
            // Expected amount in till = Cash Sales + Float (NOT including card payments)
            const expectedTotal = cashSales + todayOpenFloat;
            
            // Create card sales display with check total button
            const cardSalesContainer = document.createElement('div');
            cardSalesContainer.style.display = 'flex';
            cardSalesContainer.style.alignItems = 'center';
            cardSalesContainer.style.gap = '8px';
            
            const cardSalesText = document.createElement('span');
            cardSalesText.textContent = `Card: ¥${cardSales.toLocaleString()}`;
            
            const checkTotalBtn = document.createElement('button');
            checkTotalBtn.textContent = 'Check Total';
            checkTotalBtn.style.padding = '4px 8px';
            checkTotalBtn.style.fontSize = '11px';
            checkTotalBtn.style.fontWeight = '500';
            checkTotalBtn.style.backgroundColor = 'var(--primary)';
            checkTotalBtn.style.color = 'white';
            checkTotalBtn.style.border = 'none';
            checkTotalBtn.style.borderRadius = '4px';
            checkTotalBtn.style.cursor = 'pointer';
            checkTotalBtn.style.marginLeft = '4px';
            checkTotalBtn.onclick = () => {
                openSquareApp();
            };
            
            cardSalesContainer.appendChild(cardSalesText);
            cardSalesContainer.appendChild(checkTotalBtn);
            
            expectedTotalValue.innerHTML = `
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">¥${expectedTotal.toLocaleString()}</div>
                <div style="font-size: 14px; margin-bottom: 4px;">Cash: ¥${cashSales.toLocaleString()}</div>
                <div style="font-size: 14px; margin-bottom: 4px;">Float: ¥${todayOpenFloat.toLocaleString()}</div>
                <div style="font-size: 12px; color: #666; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;" id="card-sales-container"></div>
            `;
            
            // Append card sales container after setting innerHTML
            setTimeout(() => {
                const cardSalesDiv = document.getElementById('card-sales-container');
                if (cardSalesDiv) {
                    cardSalesDiv.appendChild(cardSalesContainer);
                }
            }, 0);
        } catch (error) {
            console.error('Error calculating expected amount:', error);
            expectedTotalValue.textContent = 'Error calculating';
            expectedTotalValue.style.color = '#dc3545';
        }
    }
    
    // Function to open Square app (attempts to open to Today's Summary if possible)
    function openSquareApp() {
        try {
            // Square's URL scheme for deep linking
            // Try to open to Today's Summary page (if Square supports this)
            // Note: Square's deep linking capabilities may be limited
            // We'll try the most likely URL format first
            const squareSummaryUrl = 'square-commerce-v1://reports/today-summary';
            
            // Show feedback
            if (showCustomAlert) {
                showCustomAlert('Opening Square app...', 'info');
            }
            
            // Use window.location similar to existing Square integration
            window.location = squareSummaryUrl;
            
            // Fallback: If the specific URL doesn't work, Square will likely just open the app
            // The user can manually navigate to Today's Summary if needed
            
        } catch (error) {
            console.error('Error opening Square app:', error);
            // Try fallback to general Square app URL
            try {
                window.location = 'square-commerce-v1://';
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                if (showCustomAlert) {
                    showCustomAlert('Unable to open Square app. Please open it manually.', 'warning');
                }
            }
        }
    }
    
    // Load existing data for the selected date
    async function loadExistingData() {
        try {
            // Parse date input value (YYYY-MM-DD) and create date at midnight local time
            const dateStr = dateInput.value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const dateKey = formatDateForCashFlow(selectedDate) + '-close';
            const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
            const cashflowDoc = await window.firebaseServices.getDoc(cashflowRef);
            
            if (cashflowDoc.exists()) {
                const data = cashflowDoc.data();
                
                // Load actual amounts
                if (data.actualAmounts && Array.isArray(data.actualAmounts)) {
                    data.actualAmounts.forEach(item => {
                        if (inputRefs[item.denomination]) {
                            inputRefs[item.denomination].value = item.count;
                            // Trigger update to refresh display
                            inputRefs[item.denomination].dispatchEvent(new Event('input'));
                        }
                    });
                }
                
                // Load new float amount from denominations
                if (data.newFloatAmounts && Array.isArray(data.newFloatAmounts)) {
                    data.newFloatAmounts.forEach(item => {
                        if (newFloatInputRefs[item.denomination]) {
                            newFloatInputRefs[item.denomination].value = item.count;
                            // Trigger update to refresh display
                            newFloatInputRefs[item.denomination].dispatchEvent(new Event('input'));
                        }
                    });
                } else if (data.newFloatAmount && data.newFloatAmount.length > 0) {
                    // Legacy support: if old format exists, try to convert to denominations
                    // This is a fallback - ideally we'd want to preserve the breakdown
                    const total = data.newFloatAmount[0];
                    // For now, just set total (user can manually adjust denominations)
                    // We'll save in new format going forward
                }
            } else {
                // Clear inputs if no data exists
                denominations.forEach(denom => {
                    if (inputRefs[denom.value]) {
                        inputRefs[denom.value].value = '0';
                        inputRefs[denom.value].dispatchEvent(new Event('input'));
                    }
                    if (newFloatInputRefs[denom.value]) {
                        newFloatInputRefs[denom.value].value = '0';
                        newFloatInputRefs[denom.value].dispatchEvent(new Event('input'));
                    }
                });
            }
        } catch (error) {
            console.error('Error loading existing data:', error);
        }
    }
    
    // Update when date changes
    dateInput.addEventListener('change', async () => {
        await updateExpectedAmount();
        await loadExistingData();
    });
    
    // Load expected amount and existing data on initial load
    updateExpectedAmount();
    loadExistingData();
    
    // Save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.background = 'var(--primary)';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '8px';
    saveButton.style.padding = '14px 28px';
    saveButton.style.fontSize = '16px';
    saveButton.style.fontWeight = '600';
    saveButton.style.cursor = 'pointer';
    saveButton.style.width = '100%';
    saveButton.style.marginTop = '8px';
    saveButton.onclick = async () => {
        try {
            // Get actual amounts
            const actualAmounts = [];
            denominations.forEach(denom => {
                const count = parseInt(inputRefs[denom.value].value) || 0;
                if (count > 0) {
                    actualAmounts.push({
                        denomination: denom.value,
                        count: count,
                        total: count * denom.value
                    });
                }
            });
            
            // Calculate total actual amount
            const totalActual = actualAmounts.reduce((sum, item) => sum + item.total, 0);
            
            // Get expected amounts using selected date
            // Parse date input value (YYYY-MM-DD) and create date at midnight local time
            const dateStr = dateInput.value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const cashSales = await getCashSalesForDate(selectedDate);
            const cardSales = await getCardSalesForDate(selectedDate);
            // Get today's open float (from today's open document)
            const todayOpenFloat = await getTodayOpenFloat(selectedDate);
            // Expected total in till = Cash Sales + Float (NOT including card payments)
            const expectedTotalInTill = cashSales + todayOpenFloat;
            const expectedAmounts = [
                {
                    type: 'cash',
                    amount: cashSales,
                    label: 'Cash Sales'
                },
                {
                    type: 'card',
                    amount: cardSales,
                    label: 'Card Sales'
                },
                {
                    type: 'float',
                    amount: todayOpenFloat,
                    label: 'Today\'s Opening Float'
                },
                {
                    type: 'total',
                    amount: expectedTotalInTill,
                    label: 'Expected Total in Till'
                }
            ];
            
            // Get new float amounts from denominations
            const newFloatAmounts = [];
            let newFloatTotal = 0;
            denominations.forEach(denom => {
                const input = newFloatInputRefs[denom.value];
                if (input) {
                    const count = parseInt(input.value) || 0;
                    if (count > 0) {
                        newFloatAmounts.push({
                            denomination: denom.value,
                            count: count,
                            total: count * denom.value
                        });
                        newFloatTotal += count * denom.value;
                    }
                }
            });
            
            // Get selected date
            const dateKey = formatDateForCashFlow(selectedDate) + '-close';
            
            // Save to Firestore
            const cashflowRef = window.firebaseServices.doc(window.firebaseDb, 'cashflow', dateKey);
            
            await window.firebaseServices.setDoc(cashflowRef, {
                actualAmounts: actualAmounts,
                expectedAmounts: expectedAmounts,
                newFloatAmounts: newFloatAmounts,
                newFloatAmount: [newFloatTotal], // Keep for backward compatibility
                newFloatTotal: newFloatTotal,
                totalActual: totalActual,
                date: formatDateForCashFlow(selectedDate),
                type: 'close',
                timestamp: new Date().toISOString()
            }, { merge: true });
            
            showCustomAlert('Close till data saved successfully!', 'success');
            document.body.removeChild(overlay);
        } catch (error) {
            console.error('Error saving close till data:', error);
            showCustomAlert('Failed to save close till data. Please try again.', 'error');
        }
    };
    
    // Add CSS to hide native number input spinners (if not already added)
    if (!document.getElementById('cashflow-spinner-hide-style')) {
        const style = document.createElement('style');
        style.id = 'cashflow-spinner-hide-style';
        style.textContent = `
            .cashflow-modal-overlay input[type="number"]::-webkit-outer-spin-button,
            .cashflow-modal-overlay input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .cashflow-modal-overlay input[type="number"] {
                -moz-appearance: textfield;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(dateSelectorContainer);
    modal.appendChild(inputsContainer);
    modal.appendChild(totalsContainer);
    modal.appendChild(newFloatContainer);
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

// Make functions available globally
window.showOpenTillModal = showOpenTillModal;
window.showCloseTillModal = showCloseTillModal;




