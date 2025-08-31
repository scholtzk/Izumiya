// Employee Sign-in System
window.addEventListener('firebaseReady', function() {
    console.log('Firebase ready, initializing employee sign-in system...');
    
    // Create container for the sign-in form
    const container = document.createElement('div');
    container.className = 'sign-in-container';
    container.style.maxWidth = '1200px';
    container.style.margin = '20px auto';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.borderRadius = '10px';
    container.style.display = 'none';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflowY = 'auto';

    // Create main content container
    const mainContent = document.createElement('div');
    mainContent.style.display = 'flex';
    mainContent.style.flexDirection = 'column';
    mainContent.style.gap = '20px';
    mainContent.style.width = '100%';

    // Create header with title and buttons
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';

    const title = document.createElement('h2');
    title.textContent = 'Employee Sign-in';
    title.style.margin = '0';
    title.style.color = 'var(--primary)';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.alignItems = 'center';

    // Add new employee button
    const addEmployeeBtn = document.createElement('button');
    addEmployeeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
        </svg>
        Add Employee
    `;
    addEmployeeBtn.style.display = 'flex';
    addEmployeeBtn.style.alignItems = 'center';
    addEmployeeBtn.style.gap = '8px';
    addEmployeeBtn.style.padding = '10px 16px';
    addEmployeeBtn.style.border = '1px solid var(--primary)';
    addEmployeeBtn.style.borderRadius = '6px';
    addEmployeeBtn.style.backgroundColor = 'white';
    addEmployeeBtn.style.color = 'var(--primary)';
    addEmployeeBtn.style.cursor = 'pointer';
    addEmployeeBtn.style.fontSize = '14px';
    addEmployeeBtn.style.fontWeight = 'bold';
    addEmployeeBtn.onclick = () => {
        showAddEmployeeModal();
    };

    // Calendar view button
    const calendarBtn = document.createElement('button');
    calendarBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        </svg>
        Calendar
    `;
    calendarBtn.style.display = 'flex';
    calendarBtn.style.alignItems = 'center';
    calendarBtn.style.gap = '8px';
    calendarBtn.style.padding = '10px 16px';
    calendarBtn.style.border = '1px solid var(--primary)';
    calendarBtn.style.borderRadius = '6px';
    calendarBtn.style.backgroundColor = 'white';
    calendarBtn.style.color = 'var(--primary)';
    calendarBtn.style.cursor = 'pointer';
    calendarBtn.style.fontSize = '14px';
    calendarBtn.style.fontWeight = 'bold';
    calendarBtn.onclick = () => {
        const today = new Date();
        displayWeekView(today.getMonth(), today.getFullYear());
    };

    // Unscheduled shift button
    const unscheduledBtn = document.createElement('button');
    unscheduledBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
        </svg>
        Unscheduled
    `;
    unscheduledBtn.style.display = 'flex';
    unscheduledBtn.style.alignItems = 'center';
    unscheduledBtn.style.gap = '8px';
    unscheduledBtn.style.padding = '10px 16px';
    unscheduledBtn.style.border = '1px solid #28a745';
    unscheduledBtn.style.borderRadius = '6px';
    unscheduledBtn.style.backgroundColor = '#28a745';
    unscheduledBtn.style.color = 'white';
    unscheduledBtn.style.cursor = 'pointer';
    unscheduledBtn.style.fontSize = '14px';
    unscheduledBtn.style.fontWeight = 'bold';
    unscheduledBtn.onclick = () => {
        showUnscheduledShiftKeypad();
    };

    buttonContainer.appendChild(addEmployeeBtn);
    buttonContainer.appendChild(calendarBtn);
    buttonContainer.appendChild(unscheduledBtn);

    header.appendChild(title);
    header.appendChild(buttonContainer);

    // Create today's shifts container
    const todayShiftsContainer = document.createElement('div');
    todayShiftsContainer.style.backgroundColor = 'var(--light)';
    todayShiftsContainer.style.borderRadius = '10px';
    todayShiftsContainer.style.padding = '20px';
    todayShiftsContainer.style.minHeight = '400px';

    // Create today's shifts title
    const todayTitle = document.createElement('h3');
    todayTitle.textContent = `Today's Shifts - ${new Date().toLocaleDateString()}`;
    todayTitle.style.marginBottom = '20px';
    todayTitle.style.color = 'var(--primary)';
    todayTitle.style.display = 'flex';
    todayTitle.style.alignItems = 'center';
    todayTitle.style.gap = '10px';

    todayShiftsContainer.appendChild(todayTitle);

    // Create shifts list container
    const shiftsList = document.createElement('div');
    shiftsList.id = 'todayShiftsList';
    shiftsList.style.display = 'flex';
    shiftsList.style.flexDirection = 'column';
    shiftsList.style.gap = '15px';

    todayShiftsContainer.appendChild(shiftsList);

    // Add all elements to main content
    mainContent.appendChild(header);
    mainContent.appendChild(todayShiftsContainer);
    container.appendChild(mainContent);

    // Create setup icon
    const setupIcon = document.createElement('div');
    setupIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M18 21C18 16.5817 14.4183 13 10 13C5.58172 13 2 16.5817 2 21" stroke="currentColor" stroke-width="2"/>
            <path d="M20 6L20 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M18 4L22 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `;
    setupIcon.style.cursor = 'pointer';
    setupIcon.style.color = 'var(--primary)';
    setupIcon.style.transition = 'transform 0.2s, color 0.2s';
    setupIcon.style.padding = '8px';
    setupIcon.style.borderRadius = '4px';
    setupIcon.onmouseover = () => {
        setupIcon.style.transform = 'scale(1.1)';
        setupIcon.style.color = 'var(--primary-dark)';
    };
    setupIcon.onmouseout = () => {
        setupIcon.style.transform = 'scale(1)';
        setupIcon.style.color = 'var(--primary)';
    };
    setupIcon.onclick = () => {
        // Show setup modal
        const setupModal = document.createElement('div');
        setupModal.className = 'modal';
        setupModal.style.display = 'flex';
        setupModal.style.position = 'fixed';
        setupModal.style.top = '0';
        setupModal.style.left = '0';
        setupModal.style.width = '100%';
        setupModal.style.height = '100%';
        setupModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        setupModal.style.zIndex = '1000';
        setupModal.style.alignItems = 'center';
        setupModal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.padding = '20px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Setup New Employee';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = 'var(--primary)';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Employee Name';
        nameInput.style.width = '100%';
        nameInput.style.padding = '10px';
        nameInput.style.marginBottom = '15px';
        nameInput.style.border = '1px solid #e0e0e0';
        nameInput.style.borderRadius = '8px';
        nameInput.style.fontSize = '16px';

        const wageInput = document.createElement('input');
        wageInput.type = 'number';
        wageInput.placeholder = 'Hourly Wage (円)';
        wageInput.style.width = '100%';
        wageInput.style.padding = '10px';
        wageInput.style.marginBottom = '15px';
        wageInput.style.border = '1px solid #e0e0e0';
        wageInput.style.borderRadius = '8px';
        wageInput.style.fontSize = '16px';

        const setupPinDisplayContainer = document.createElement('div');
        setupPinDisplayContainer.className = 'payment-details';
        setupPinDisplayContainer.style.background = 'var(--light)';
        setupPinDisplayContainer.style.padding = '15px';
        setupPinDisplayContainer.style.borderRadius = '8px';
        setupPinDisplayContainer.style.margin = '20px 0';

        const setupPinDisplay = document.createElement('div');
        setupPinDisplay.id = 'setupPinDisplay';
        setupPinDisplay.className = 'total-amount';
        setupPinDisplay.style.fontSize = '24px';
        setupPinDisplay.style.fontWeight = 'bold';
        setupPinDisplay.style.color = 'var(--primary)';
        setupPinDisplay.style.marginBottom = '15px';
        setupPinDisplay.style.textAlign = 'center';
        setupPinDisplay.style.letterSpacing = '5px';
        setupPinDisplay.textContent = '----';

        setupPinDisplayContainer.appendChild(setupPinDisplay);

        const setupKeypad = document.createElement('div');
        setupKeypad.className = 'numpad';
        setupKeypad.style.display = 'grid';
        setupKeypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
        setupKeypad.style.gap = '10px';
        setupKeypad.style.margin = '20px 0';

        let setupPin = '';

        numbers.forEach(num => {
            const button = document.createElement('button');
            button.className = 'numpad-btn';
            button.textContent = num;
            button.style.padding = '15px';
            button.style.border = '1px solid #e0e0e0';
            button.style.borderRadius = '8px';
            button.style.backgroundColor = 'white';
            button.style.fontSize = '18px';
            button.style.cursor = 'pointer';
            button.style.transition = 'background-color 0.2s';
            
            if (num === 'C') {
                button.classList.add('backspace-btn');
                button.style.backgroundColor = '#f8f9fa';
                button.style.color = 'var(--dark)';
            } else if (num === '✓') {
                button.classList.add('process-btn');
                button.style.backgroundColor = 'var(--primary)';
                button.style.color = 'white';
            }

            button.addEventListener('mouseover', () => {
                if (num !== 'C' && num !== '✓') {
                    button.style.backgroundColor = 'var(--light)';
                }
            });

            button.addEventListener('mouseout', () => {
                if (num !== 'C' && num !== '✓') {
                    button.style.backgroundColor = 'white';
                }
            });

            button.addEventListener('click', () => {
                if (num === 'C') {
                    setupPin = '';
                    setupPinDisplay.textContent = '----';
                } else if (num === '✓') {
                    if (setupPin.length === 4 && nameInput.value.trim()) {
                        const wage = wageInput.value.trim() ? parseInt(wageInput.value.trim()) : 0;
                        saveEmployee(nameInput.value.trim(), setupPin, wage);
                    }
                } else if (setupPin.length < 4) {
                    setupPin += num;
                    setupPinDisplay.textContent = setupPin.padEnd(4, '-');
                }
            });

            setupKeypad.appendChild(button);
        });

        const setupStatus = document.createElement('div');
        setupStatus.id = 'setupStatus';
        setupStatus.style.marginTop = '10px';
        setupStatus.style.textAlign = 'center';
        setupStatus.style.color = '#666';

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '10px';
        actionButtons.style.marginTop = '20px';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'action-btn cancel-btn';
        cancelButton.textContent = 'Cancel';
        cancelButton.style.flex = '1';
        cancelButton.style.padding = '12px';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.border = 'none';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.color = 'var(--dark)';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontWeight = 'bold';

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(setupModal);
        });

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(nameInput);
        modalContent.appendChild(wageInput);
        modalContent.appendChild(setupPinDisplayContainer);
        modalContent.appendChild(setupKeypad);
        modalContent.appendChild(setupStatus);
        modalContent.appendChild(actionButtons);
        actionButtons.appendChild(cancelButton);
        setupModal.appendChild(modalContent);
        document.body.appendChild(setupModal);
    };





    // Remove the old employee sign-in panel if it exists
    const oldPanel = document.getElementById('employeeSignInPanel');
    if (oldPanel) {
        oldPanel.remove();
    }

    // Add the container to the menu panel
    const menuPanel = document.querySelector('.menu-panel');
    if (menuPanel) {
        menuPanel.appendChild(container);
        console.log('Employee sign-in container added to menu panel');
    } else {
        console.error('Menu panel not found');
    }

    // Initialize Firebase services
    const db = window.firebaseDb;
    const { collection, addDoc, Timestamp, getDocs, query, where, orderBy, updateDoc, deleteDoc, doc, getDoc, setDoc } = window.firebaseServices;

    // Function to format time duration
    function formatDuration(startTime, endTime = null) {
        const start = startTime instanceof Date ? startTime : startTime.toDate();
        const end = endTime
            ? (endTime instanceof Date ? endTime : endTime.toDate())
            : new Date();
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    // Function to display today's sign-ins
    async function displayTodaySignIns() {
        try {
            const todayStr = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });

            const signInLogList = document.getElementById('signInLogList');
            signInLogList.innerHTML = '';

            // Fetch actual sign-ins for today
            const querySnapshot = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '==', todayStr)
            ));

            // Fetch scheduled shifts for today
            const scheduledShiftsSnapshot = await getDocs(query(
                collection(db, 'scheduledShifts'),
                where('date', '==', todayStr)
            ));

            // Display actual sign-ins
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const signInItem = document.createElement('div');
                signInItem.style.padding = '15px';
                signInItem.style.borderBottom = '1px solid #e0e0e0';
                signInItem.style.display = 'flex';
                signInItem.style.justifyContent = 'space-between';
                signInItem.style.alignItems = 'center';

                const employeeInfo = document.createElement('div');
                const signInTime = data.signInTime.toDate();
                const activeBreak = (data.breaks || []).find(b => !b.endTime);
                const shiftEnded = data.endTime;

                // Calculate current break duration if on break
                let currentBreakDuration = '';
                if (activeBreak) {
                    const breakStartTime = activeBreak.startTime.toDate();
                    const now = new Date();
                    const breakDuration = Math.floor((now - breakStartTime) / (1000 * 60));
                    currentBreakDuration = ` (${breakDuration}m)`;
                }

                // Format completed breaks
                const completedBreaks = (data.breaks || [])
                    .filter(b => b.endTime)
                    .map(b => {
                        const start = b.startTime.toDate();
                        const end = b.endTime.toDate();
                        const duration = Math.floor((end - start) / (1000 * 60));
                        return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${duration}m)`;
                    })
                    .join('<br>');

                employeeInfo.innerHTML = `
                    <div style="font-weight: bold;">${data.employeeName}</div>
                    <div style="font-size: 0.9em; color: #666;">
                        Started: ${signInTime.toLocaleTimeString()}
                        <br>
                        Duration: ${formatDuration(signInTime, data.endTime)}
                        ${activeBreak ? `
                            <br>
                            <span style="color: #dc3545;">Currently on break${currentBreakDuration}</span>
                        ` : ''}
                        ${completedBreaks ? `
                            <br>
                            <span style="color: #666;">Breaks taken:<br>${completedBreaks}</span>
                        ` : ''}
                        ${shiftEnded ? `
                            <br>
                            <span style="color: #28a745;">Shift ended at ${data.endTime.toDate().toLocaleTimeString()}</span>
                        ` : ''}
                    </div>
                `;

                signInItem.appendChild(employeeInfo);
                signInLogList.appendChild(signInItem);
            });

            // Display scheduled shifts
            scheduledShiftsSnapshot.forEach(doc => {
                const data = doc.data();
                const scheduledItem = document.createElement('div');
                scheduledItem.style.padding = '15px';
                scheduledItem.style.borderBottom = '1px solid #e0e0e0';
                scheduledItem.style.display = 'flex';
                scheduledItem.style.justifyContent = 'space-between';
                scheduledItem.style.alignItems = 'center';
                scheduledItem.style.backgroundColor = '#e3f2fd';
                scheduledItem.style.borderRadius = '4px';
                scheduledItem.style.marginBottom = '5px';

                const scheduledInfo = document.createElement('div');
                scheduledInfo.innerHTML = `
                    <div style="font-weight: bold; color: #1976d2;">${data.employeeName}</div>
                    <div style="font-size: 0.9em; color: #1976d2;">
                        Scheduled: ${data.startTime}
                        <br>
                        <span style="color: #666;">(Scheduled shift)</span>
                    </div>
                `;

                scheduledItem.appendChild(scheduledInfo);
                signInLogList.appendChild(scheduledItem);
            });
        } catch (error) {
            console.error('Error fetching sign-ins:', error);
            document.getElementById('signInLogList').innerHTML = 
                '<div style="text-align: center; color: red;">Error loading sign-ins</div>';
        }
    }

    // Call displayTodaySignIns initially and set up refresh interval
    displayTodaySignIns();
    setInterval(displayTodaySignIns, 60000); // Refresh every minute

    // Function to create a custom alert modal
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

    // Function to create a custom confirm modal
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

    // Function to create a popup window
    function createPopupWindow(title, content) {
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'popup-window';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        popup.style.zIndex = '1000';
        popup.style.minWidth = '400px';
        popup.style.maxWidth = '90vw';
        popup.style.maxHeight = '90vh';
        popup.style.overflowY = 'auto';

        // Create header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';
        header.style.paddingBottom = '10px';
        header.style.borderBottom = '1px solid #e0e0e0';

        // Add title
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.style.margin = '0';
        titleElement.style.color = 'var(--primary)';
        header.appendChild(titleElement);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.style.padding = '0 8px';
        closeButton.style.lineHeight = '1';
        closeButton.onclick = () => {
            document.body.removeChild(popup);
        };
        header.appendChild(closeButton);

        // Add content
        const contentContainer = document.createElement('div');
        contentContainer.appendChild(content);

        // Add footer with OK button
        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.justifyContent = 'flex-end';
        footer.style.marginTop = '20px';
        footer.style.paddingTop = '10px';
        footer.style.borderTop = '1px solid #e0e0e0';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 20px';
        okButton.style.backgroundColor = 'var(--primary)';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '5px';
        okButton.style.cursor = 'pointer';
        okButton.style.fontWeight = 'bold';
        okButton.onclick = () => {
            document.body.removeChild(popup);
        };
        footer.appendChild(okButton);

        // Assemble popup
        popup.appendChild(header);
        popup.appendChild(contentContainer);
        popup.appendChild(footer);

        // Add to document
        document.body.appendChild(popup);

        return popup;
    }

    // Update handleSignIn to use new popup style
    async function handleSignIn() {
        const pin = document.getElementById('pinDisplay').textContent;
        if (pin.length === 0) return;

        try {
            // Check if employee exists
            const employeeQuery = await getDocs(query(collection(db, 'employees'), where('pin', '==', pin)));
            if (employeeQuery.empty) {
                const errorContent = document.createElement('div');
                errorContent.textContent = 'Invalid PIN';
                errorContent.style.textAlign = 'center';
                errorContent.style.color = '#dc3545';
                errorContent.style.padding = '20px';
                createPopupWindow('Error', errorContent);
                clearPin();
                return;
            }

            const employeeDoc = employeeQuery.docs[0];
            const employeeData = employeeDoc.data();
            const todayStr = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });

            // Check if already signed in today
            const existingSignIn = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('employeeId', '==', employeeDoc.id),
                where('date', '==', todayStr)
            ));

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.style.textAlign = 'center';

            // Add employee name
            const nameHeader = document.createElement('h2');
            nameHeader.textContent = employeeData.name;
            nameHeader.style.marginBottom = '20px';
            nameHeader.style.color = 'var(--primary)';
            popupContent.appendChild(nameHeader);

            const statusInfo = document.createElement('div');
            statusInfo.style.marginBottom = '20px';
            statusInfo.style.textAlign = 'left';

            if (existingSignIn.empty) {
                // Not signed in - show start shift button
                statusInfo.innerHTML = `
                    <div style="color: #666; margin-bottom: 15px;">
                        Not signed in for today
                    </div>
                `;

                const startShiftButton = document.createElement('button');
                startShiftButton.textContent = 'Start Shift';
                startShiftButton.style.padding = '10px 20px';
                startShiftButton.style.backgroundColor = 'var(--primary)';
                startShiftButton.style.color = 'white';
                startShiftButton.style.border = 'none';
                startShiftButton.style.borderRadius = '5px';
                startShiftButton.style.cursor = 'pointer';
                startShiftButton.style.width = '100%';

                startShiftButton.addEventListener('click', async () => {
                    try {
                        const signInTime = Timestamp.now();
                        await addDoc(collection(db, 'employeeSignIns'), {
                            employeeId: employeeDoc.id,
                            employeeName: employeeData.name,
                            signInTime: signInTime,
                            date: todayStr,
                            breaks: []
                        });

                        // Remove scheduled shift for this employee for today if it exists
                        const scheduledShiftQuery = await getDocs(query(
                            collection(db, 'scheduledShifts'),
                            where('employeeId', '==', employeeDoc.id),
                            where('date', '==', todayStr)
                        ));
                        scheduledShiftQuery.forEach(async (doc) => {
                            await deleteDoc(doc.ref);
                        });

                        // Close popup and refresh
                        document.body.removeChild(document.querySelector('.popup-window'));
                        displayTodaySignIns();
                    } catch (error) {
                        console.error('Error starting shift:', error);
                        const errorContent = document.createElement('div');
                        errorContent.textContent = 'Error starting shift. Please try again.';
                        errorContent.style.textAlign = 'center';
                        errorContent.style.color = '#dc3545';
                        errorContent.style.padding = '20px';
                        createPopupWindow('Error', errorContent);
                    }
                });

                popupContent.appendChild(statusInfo);
                popupContent.appendChild(startShiftButton);
            } else {
                // Already signed in - show current status and break/end shift buttons
                const shiftData = existingSignIn.docs[0].data();
                const signInTime = shiftData.signInTime.toDate();
                const activeBreak = (shiftData.breaks || []).find(b => !b.endTime);

                // Format completed breaks for popup
                const completedBreaks = (shiftData.breaks || [])
                    .filter(b => b.endTime)
                    .map(b => {
                        const start = b.startTime.toDate();
                        const end = b.endTime.toDate();
                        const duration = Math.floor((end - start) / (1000 * 60));
                        return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${duration}m)`;
                    })
                    .join('<br>');

                statusInfo.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <strong>Start Time:</strong> ${signInTime.toLocaleTimeString()}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Duration:</strong> ${formatDuration(signInTime, shiftData.endTime)}
                    </div>
                    ${activeBreak ? `
                        <div style="color: #dc3545; margin-bottom: 10px;">
                            Currently on break
                        </div>
                    ` : ''}
                    ${completedBreaks ? `
                        <div style="color: #666; margin-bottom: 10px;">
                            <strong>Breaks taken:</strong><br>${completedBreaks}
                        </div>
                    ` : ''}
                    ${shiftData.endTime ? `
                        <div style="color: #28a745; margin-bottom: 10px;">
                            Shift ended at ${shiftData.endTime.toDate().toLocaleTimeString()}
                        </div>
                    ` : ''}
                `;

                if (!shiftData.endTime) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.gap = '10px';
                    buttonContainer.style.justifyContent = 'center';

                    if (activeBreak) {
                        const breakButton = document.createElement('button');
                        breakButton.textContent = 'End Break';
                        breakButton.style.padding = '10px 20px';
                        breakButton.style.backgroundColor = '#dc3545';
                        breakButton.style.color = 'white';
                        breakButton.style.border = 'none';
                        breakButton.style.borderRadius = '5px';
                        breakButton.style.cursor = 'pointer';
                        breakButton.style.flex = '1';

                        breakButton.addEventListener('click', async () => {
                            try {
                                const breakEndTime = Timestamp.now();
                                const activeBreakIndex = (shiftData.breaks || []).findIndex(b => !b.endTime);
                                
                                if (activeBreakIndex !== -1) {
                                    const updatedBreaks = [...(shiftData.breaks || [])];
                                    updatedBreaks[activeBreakIndex] = {
                                        ...updatedBreaks[activeBreakIndex],
                                        endTime: breakEndTime
                                    };

                                    await updateDoc(existingSignIn.docs[0].ref, {
                                        breaks: updatedBreaks
                                    });
                                }

                                // Close popup and refresh
                                document.body.removeChild(document.querySelector('.popup-window'));
                                displayTodaySignIns();
                            } catch (error) {
                                console.error('Error handling break:', error);
                                const errorContent = document.createElement('div');
                                errorContent.textContent = 'Error handling break. Please try again.';
                                errorContent.style.textAlign = 'center';
                                errorContent.style.color = '#dc3545';
                                errorContent.style.padding = '20px';
                                createPopupWindow('Error', errorContent);
                            }
                        });

                        buttonContainer.appendChild(breakButton);
                    } else {
                        const startBreakButton = document.createElement('button');
                        startBreakButton.textContent = 'Start Break';
                        startBreakButton.style.padding = '10px 20px';
                        startBreakButton.style.backgroundColor = 'var(--primary)';
                        startBreakButton.style.color = 'white';
                        startBreakButton.style.border = 'none';
                        startBreakButton.style.borderRadius = '5px';
                        startBreakButton.style.cursor = 'pointer';
                        startBreakButton.style.flex = '1';

                        startBreakButton.addEventListener('click', async () => {
                            try {
                                const breakStartTime = Timestamp.now();
                                const newBreak = {
                                    startTime: breakStartTime,
                                    endTime: null
                                };

                                await updateDoc(existingSignIn.docs[0].ref, {
                                    breaks: [...(shiftData.breaks || []), newBreak]
                                });

                                // Close popup and refresh
                                document.body.removeChild(document.querySelector('.popup-window'));
                                displayTodaySignIns();
                            } catch (error) {
                                console.error('Error starting break:', error);
                                const errorContent = document.createElement('div');
                                errorContent.textContent = 'Error starting break. Please try again.';
                                errorContent.style.textAlign = 'center';
                                errorContent.style.color = '#dc3545';
                                errorContent.style.padding = '20px';
                                createPopupWindow('Error', errorContent);
                            }
                        });

                        buttonContainer.appendChild(startBreakButton);
                    }

                    const endShiftButton = document.createElement('button');
                    endShiftButton.textContent = 'End Shift';
                    endShiftButton.style.padding = '10px 20px';
                    endShiftButton.style.backgroundColor = '#dc3545';
                    endShiftButton.style.color = 'white';
                    endShiftButton.style.border = 'none';
                    endShiftButton.style.borderRadius = '5px';
                    endShiftButton.style.cursor = 'pointer';
                    endShiftButton.style.flex = '1';

                    endShiftButton.addEventListener('click', async () => {
                        try {
                            const endTime = Timestamp.now();
                            const totalDuration = Math.floor((endTime.toDate() - signInTime) / (1000 * 60));

                            await updateDoc(existingSignIn.docs[0].ref, {
                                endTime: endTime,
                                totalDuration: totalDuration
                            });

                            // Close popup and refresh
                            document.body.removeChild(document.querySelector('.popup-window'));
                            displayTodaySignIns();
                        } catch (error) {
                            console.error('Error ending shift:', error);
                            const errorContent = document.createElement('div');
                            errorContent.textContent = 'Error ending shift. Please try again.';
                            errorContent.style.textAlign = 'center';
                            errorContent.style.color = '#dc3545';
                            errorContent.style.padding = '20px';
                            createPopupWindow('Error', errorContent);
                        }
                    });

                    buttonContainer.appendChild(endShiftButton);
                    popupContent.appendChild(statusInfo);
                    popupContent.appendChild(buttonContainer);
                } else {
                    popupContent.appendChild(statusInfo);
                }
            }

            createPopupWindow('Employee Status', popupContent);
            clearPin();
        } catch (error) {
            console.error('Error processing sign-in:', error);
            const errorContent = document.createElement('div');
            errorContent.textContent = 'Error processing sign-in. Please try again.';
            errorContent.style.textAlign = 'center';
            errorContent.style.color = '#dc3545';
            errorContent.style.padding = '20px';
            createPopupWindow('Error', errorContent);
            clearPin();
        }
    }

    // Save new employee
    async function saveEmployee(name, pin, wage = 0) {
        try {
            // Check if PIN already exists
            const employeesRef = collection(db, 'employees');
            const q = query(employeesRef, where('pin', '==', pin));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                document.getElementById('setupStatus').textContent = 'PIN already exists';
                document.getElementById('setupStatus').style.color = 'red';
                return;
            }

            // Save new employee
            await addDoc(collection(db, 'employees'), {
                name: name,
                pin: pin,
                wage: wage,
                createdAt: Timestamp.now()
            });

            // Close modal and show success
            const setupModal = document.querySelector('.modal');
            if (setupModal) {
                document.body.removeChild(setupModal);
            }

            // Show success message in main container
            signInStatus.textContent = 'Employee added successfully!';
            signInStatus.style.color = 'green';

            // Clear success message after 3 seconds
            setTimeout(() => {
                signInStatus.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Error saving employee:', error);
            document.getElementById('setupStatus').textContent = 'Error saving employee. Please try again.';
            document.getElementById('setupStatus').style.color = 'red';
        }
    }

    // Function to clear PIN
    function clearPin() {
        currentPin = '';
        pinDisplay.textContent = '----';
    }

    // Calendar functions
    function showCalendar() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        displayCalendar(currentMonth, currentYear);
    }

    function displayCalendar(month, year) {
        // If employee history modal is open, close it first
        const employeeHistoryModal = document.querySelector('.employee-history-modal');
        if (employeeHistoryModal && employeeHistoryModal.style.display === 'flex') {
            employeeHistoryModal.style.display = 'none';
        }

        // Show calendar modal
        const calendarModal = document.querySelector('.calendar-modal');
        if (calendarModal) {
            calendarModal.style.display = 'flex';
        }

        // Remove any existing overlays and calendars
        const existingOverlay = document.querySelector('.calendar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        const existingCalendar = document.querySelector('.calendar');
        if (existingCalendar) {
            existingCalendar.remove();
        }

        // Create calendar overlay
        const overlay = document.createElement('div');
        overlay.className = 'calendar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '900';
        document.body.appendChild(overlay);

        // Create calendar container
        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        calendar.style.position = 'fixed';
        calendar.style.top = '50%';
        calendar.style.left = '50%';
        calendar.style.transform = 'translate(-50%, -50%)';
        calendar.style.backgroundColor = 'white';
        calendar.style.padding = '20px';
        calendar.style.borderRadius = '8px';
        calendar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        calendar.style.zIndex = '901';
        calendar.style.minWidth = '1020px';
        calendar.style.maxHeight = '85vh';
        calendar.style.overflowY = 'auto';

        // Create header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';
        header.style.position = 'relative';

        // Create person icon for employee history
        const personIcon = document.createElement('div');
        personIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        personIcon.style.position = 'absolute';
        personIcon.style.left = '0';
        personIcon.style.top = '0';
        personIcon.style.cursor = 'pointer';
        personIcon.style.color = 'var(--primary)';
        personIcon.style.transition = 'transform 0.2s, color 0.2s';
        personIcon.style.padding = '8px';
        personIcon.style.borderRadius = '4px';
        personIcon.onmouseover = () => {
            personIcon.style.transform = 'scale(1.1)';
            personIcon.style.color = 'var(--primary-dark)';
        };
        personIcon.onmouseout = () => {
            personIcon.style.transform = 'scale(1)';
            personIcon.style.color = 'var(--primary)';
        };
        personIcon.onclick = () => {
            // Close calendar if it's open
            const calendarModal = document.querySelector('.calendar-modal');
            if (calendarModal && calendarModal.style.display === 'flex') {
                calendarModal.style.display = 'none';
            }
            
            // Show the employee history modal and fetch data for the current calendar month
            fetchEmployeeHistory(year, month);
        };
        header.appendChild(personIcon);

        // Add close button (X) in top right corner
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'var(--primary)';
        closeButton.onclick = () => {
            overlay.remove();
            calendar.remove();
        };
        header.appendChild(closeButton);

        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.style.display = 'flex';
        navContainer.style.alignItems = 'center';
        navContainer.style.gap = '20px';
        navContainer.style.margin = '0 auto';

        // Add navigation arrows
        const prevMonth = document.createElement('button');
        prevMonth.innerHTML = '←';
        prevMonth.style.border = 'none';
        prevMonth.style.background = 'none';
        prevMonth.style.fontSize = '20px';
        prevMonth.style.cursor = 'pointer';
        prevMonth.style.color = 'var(--primary)';
        prevMonth.onclick = () => {
            if (month === 0) {
                displayCalendar(11, year - 1);
            } else {
                displayCalendar(month - 1, year);
            }
        };
        navContainer.appendChild(prevMonth);

        // Add month/year display
        const monthYear = document.createElement('div');
        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        monthYear.style.fontWeight = 'bold';
        monthYear.style.color = 'var(--primary)';
        navContainer.appendChild(monthYear);

        const nextMonth = document.createElement('button');
        nextMonth.innerHTML = '→';
        nextMonth.style.border = 'none';
        nextMonth.style.background = 'none';
        nextMonth.style.fontSize = '20px';
        nextMonth.style.cursor = 'pointer';
        nextMonth.style.color = 'var(--primary)';
        nextMonth.onclick = () => {
            if (month === 11) {
                displayCalendar(0, year + 1);
            } else {
                displayCalendar(month + 1, year);
            }
        };
        navContainer.appendChild(nextMonth);

        // Add view toggle buttons
        const viewToggleContainer = document.createElement('div');
        viewToggleContainer.style.display = 'flex';
        viewToggleContainer.style.gap = '10px';
        viewToggleContainer.style.marginLeft = '20px';

        const monthViewBtn = document.createElement('button');
        monthViewBtn.textContent = 'Month';
        monthViewBtn.style.padding = '8px 16px';
        monthViewBtn.style.border = '1px solid var(--primary)';
        monthViewBtn.style.borderRadius = '6px';
        monthViewBtn.style.backgroundColor = 'var(--primary)';
        monthViewBtn.style.color = 'white';
        monthViewBtn.style.cursor = 'pointer';
        monthViewBtn.style.fontSize = '14px';
        monthViewBtn.style.fontWeight = 'bold';
        monthViewBtn.onclick = () => {
            displayCalendar(month, year);
        };

        const weekViewBtn = document.createElement('button');
        weekViewBtn.textContent = 'Week';
        weekViewBtn.style.padding = '8px 16px';
        weekViewBtn.style.border = '1px solid var(--primary)';
        weekViewBtn.style.borderRadius = '6px';
        weekViewBtn.style.backgroundColor = 'white';
        weekViewBtn.style.color = 'var(--primary)';
        weekViewBtn.style.cursor = 'pointer';
        weekViewBtn.style.fontSize = '14px';
        weekViewBtn.style.fontWeight = 'bold';
        weekViewBtn.onclick = () => {
            displayWeekView(month, year);
        };

        viewToggleContainer.appendChild(monthViewBtn);
        viewToggleContainer.appendChild(weekViewBtn);
        
        // Add Today button
        const todayBtn = document.createElement('button');
        todayBtn.textContent = 'Today';
        todayBtn.style.padding = '8px 16px';
        todayBtn.style.border = '1px solid #28a745';
        todayBtn.style.borderRadius = '6px';
        todayBtn.style.backgroundColor = '#28a745';
        todayBtn.style.color = 'white';
        todayBtn.style.cursor = 'pointer';
        todayBtn.style.fontSize = '14px';
        todayBtn.style.fontWeight = 'bold';
        todayBtn.onclick = () => {
            const today = new Date();
            displayCalendar(today.getMonth(), today.getFullYear());
        };
        viewToggleContainer.appendChild(todayBtn);
        
        navContainer.appendChild(viewToggleContainer);

        header.appendChild(navContainer);
        calendar.appendChild(header);

        // Create calendar grid
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gap = '10px';
        grid.style.marginTop = '20px';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.textAlign = 'center';
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.padding = '8px';
            dayHeader.style.color = 'var(--primary)';
            dayHeader.style.fontSize = '16px';
            grid.appendChild(dayHeader);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.style.height = '100px';
            emptyCell.style.backgroundColor = '#f8f9fa';
            emptyCell.style.borderRadius = '4px';
            grid.appendChild(emptyCell);
        }

                    // Add days
            for (let day = 1; day <= totalDays; day++) {
                const cell = document.createElement('div');
                cell.style.height = '100px';
                cell.style.backgroundColor = 'white';
                cell.style.border = '1px solid #e0e0e0';
                cell.style.borderRadius = '4px';
                cell.style.padding = '8px';
                cell.style.position = 'relative';
                cell.style.overflow = 'hidden';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'background-color 0.2s';

                const dayNumber = document.createElement('div');
                dayNumber.textContent = day;
                dayNumber.style.fontWeight = 'bold';
                dayNumber.style.marginBottom = '5px';
                dayNumber.style.fontSize = '16px';
                dayNumber.style.textAlign = 'center';
                
                cell.onmouseover = () => {
                    cell.style.backgroundColor = '#f8f9fa';
                };
                cell.onmouseout = () => {
                    cell.style.backgroundColor = 'white';
                };
                
                cell.appendChild(dayNumber);

                // Fetch and display employee records for this day
                const dateStr = new Date(year, month, day).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                // Fetch employee records for this day
                getDocs(query(
                    collection(db, 'employeeSignIns'),
                    where('date', '==', dateStr)
                )).then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const data = doc.data();
                            const record = document.createElement('div');
                        record.style.marginBottom = '5px';
                        record.style.padding = '5px';
                            record.style.backgroundColor = '#f8f9fa';
                        record.style.borderRadius = '4px';
                        record.style.fontSize = '12px';
                        record.innerHTML = `
                            <div style="font-weight: bold; font-size: 12px;">${data.employeeName}</div>
                            <div style="color: #666; font-size: 11px;">
                                ${data.signInTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                ${data.endTime ? ` - ${data.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ' - Present'}
                            </div>
                        `;
                        cell.appendChild(record);
                    });
                });

                // Fetch scheduled shifts for this day
                getDocs(query(
                    collection(db, 'scheduledShifts'),
                    where('date', '==', dateStr)
                )).then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const record = document.createElement('div');
                        record.style.marginBottom = '5px';
                        record.style.padding = '5px';
                        record.style.backgroundColor = '#e3f2fd';
                        record.style.borderRadius = '4px';
                        record.style.fontSize = '12px';
                        record.style.border = '1px solid #2196f3';
                        record.style.position = 'relative';
                        record.style.cursor = 'pointer';
                        record.innerHTML = `
                            <div style="font-weight: bold; font-size: 12px; color: #1976d2;">${data.employeeName}</div>
                            <div style="color: #1976d2; font-size: 11px;">
                                Scheduled: ${data.startTime}
                            </div>
                            <div style="position: absolute; top: 2px; right: 2px; font-size: 10px; color: #f44336; cursor: pointer;" title="Delete scheduled shift">×</div>
                        `;
                        
                        // Add click handler to delete scheduled shift
                        record.onclick = async (e) => {
                            // Don't trigger if clicking the delete button
                            if (e.target.style.position === 'absolute') {
                                e.stopPropagation();
                                showCustomConfirm(
                                    `Delete scheduled shift for ${data.employeeName}?`,
                                    async () => {
                                        try {
                                            await deleteDoc(doc.ref);
                                            displayCalendar(month, year);
                                        } catch (error) {
                                            console.error('Error deleting scheduled shift:', error);
                                            showCustomAlert('Error deleting scheduled shift. Please try again.', 'error');
                                        }
                                    }
                                );
                                return;
                            }
                        };
                        
                        cell.appendChild(record);
                    });
                });

                // Add click handler to open shift scheduling modal
                cell.onclick = () => {
                    openShiftSchedulingModal(dateStr, year, month, day);
                };

                grid.appendChild(cell);
            }

        calendar.appendChild(grid);
        document.body.appendChild(calendar);
    }

    // Helper function to refresh shift data for a specific date without changing calendar position
    async function refreshShiftDataForDate(firestoreDate) {
        try {
            const shifts = await getShiftsForDate(firestoreDate);
            
            // Find all shift slots for this date and update them
            const shiftSlots = document.querySelectorAll('.shift-slot');
            shiftSlots.forEach(slot => {
                const slotDate = slot.getAttribute('data-date');
                const slotCategory = slot.getAttribute('data-category');
                
                if (slotDate === firestoreDate) {
                    // Find shifts for this category
                    const categoryShifts = shifts.filter(shift => 
                        shift.shiftClassification === slotCategory
                    );
                    
                    // Clear the slot
                    slot.innerHTML = '';
                    
                    if (categoryShifts.length > 0) {
                        // Display each shift
                        categoryShifts.forEach((shift, shiftIndex) => {
                            const shiftDisplay = document.createElement('div');
                            shiftDisplay.style.width = '100%';
                            shiftDisplay.style.height = '100%';
                            shiftDisplay.style.display = 'flex';
                            shiftDisplay.style.flexDirection = 'column';
                            shiftDisplay.style.justifyContent = 'center';
                            shiftDisplay.style.alignItems = 'center';
                            shiftDisplay.style.padding = '5px';
                            shiftDisplay.style.boxSizing = 'border-box';
                            shiftDisplay.style.cursor = 'pointer';
                            
                            // Set background color based on shift status
                            if (shift.isCompleted) {
                                shiftDisplay.style.backgroundColor = '#d4edda'; // Light green for completed
                            } else if (shift.isCurrent) {
                                shiftDisplay.style.backgroundColor = '#fff3cd'; // Light yellow for current
                            } else {
                                shiftDisplay.style.backgroundColor = '#d1ecf1'; // Light blue for scheduled
                            }
                            
                            // Employee name
                            const employeeName = document.createElement('div');
                            employeeName.textContent = shift.employeeName;
                            employeeName.style.fontWeight = 'bold';
                            employeeName.style.fontSize = '11px';
                            employeeName.style.textAlign = 'center';
                            employeeName.style.marginBottom = '2px';
                            
                            // Time range
                            const timeRange = document.createElement('div');
                            const startTime = shift.shiftStartTime.toDate();
                            const endTime = shift.shiftFinishTime.toDate();
                            timeRange.textContent = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                            timeRange.style.fontSize = '10px';
                            timeRange.style.color = '#666';
                            timeRange.style.textAlign = 'center';
                            
                            // Status indicator
                            const statusIndicator = document.createElement('div');
                            if (shift.isCompleted) {
                                statusIndicator.textContent = '✓';
                                statusIndicator.style.color = '#28a745';
                            } else if (shift.isCurrent) {
                                statusIndicator.textContent = '●';
                                statusIndicator.style.color = '#ffc107';
                            } else {
                                statusIndicator.textContent = '○';
                                statusIndicator.style.color = '#17a2b8';
                            }
                            statusIndicator.style.fontSize = '12px';
                            statusIndicator.style.fontWeight = 'bold';
                            statusIndicator.style.marginTop = '2px';
                            
                            shiftDisplay.appendChild(employeeName);
                            shiftDisplay.appendChild(timeRange);
                            shiftDisplay.appendChild(statusIndicator);
                            
                            // Click handler to edit shift
                            shiftDisplay.onclick = (e) => {
                                e.stopPropagation();
                                const dateStr = slot.getAttribute('data-original-date');
                                const year = parseInt(slot.getAttribute('data-year'));
                                const month = parseInt(slot.getAttribute('data-month'));
                                const day = parseInt(slot.getAttribute('data-day'));
                                showShiftDetailsModal(shift, dateStr, year, month, day);
                            };
                            
                            slot.appendChild(shiftDisplay);
                        });
                    } else {
                        // No shifts for this category, show add button
                        const addButton = document.createElement('div');
                        addButton.innerHTML = '+';
                        addButton.style.position = 'absolute';
                        addButton.style.top = '50%';
                        addButton.style.left = '50%';
                        addButton.style.transform = 'translate(-50%, -50%)';
                        addButton.style.fontSize = '24px';
                        addButton.style.color = '#ccc';
                        addButton.style.fontWeight = 'bold';
                        addButton.style.cursor = 'pointer';
                        addButton.onclick = (e) => {
                            e.stopPropagation();
                            storeCurrentCalendarState();
                            const dateStr = slot.getAttribute('data-original-date');
                            const year = parseInt(slot.getAttribute('data-year'));
                            const month = parseInt(slot.getAttribute('data-month'));
                            const day = parseInt(slot.getAttribute('data-day'));
                            const category = slot.getAttribute('data-category');
                            openShiftSchedulingModal(dateStr, year, month, day, category);
                        };
                        slot.appendChild(addButton);
                    }
                }
            });
        } catch (error) {
            console.error('Error refreshing shift data:', error);
        }
    }

    // Global variables for bulk scheduling
    let selectedEmployee = null;
    let selectedShifts = [];
    let isBulkSchedulingMode = false;

    // Function to open bulk employee dropdown
    async function openBulkEmployeeDropdown() {
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.bulk-employee-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'bulk-employee-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #e0e0e0';
        dropdown.style.borderRadius = '6px';
        dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        dropdown.style.zIndex = '1000';
        dropdown.style.minWidth = '200px';
        dropdown.style.maxHeight = '300px';
        dropdown.style.overflowY = 'auto';

        // Get the bulk schedule button to position the dropdown
        const bulkBtn = document.getElementById('bulkScheduleBtn');
        bulkBtn.style.position = 'relative';
        bulkBtn.appendChild(dropdown);

        // Fetch employees and create list
        try {
            const employeesSnapshot = await getDocs(collection(db, 'employees'));
            employeesSnapshot.forEach(doc => {
                const employeeData = doc.data();
                const employeeItem = document.createElement('div');
                employeeItem.style.padding = '10px 15px';
                employeeItem.style.cursor = 'pointer';
                employeeItem.style.borderBottom = '1px solid #f0f0f0';
                employeeItem.style.fontSize = '14px';
                employeeItem.style.color = '#333';
                employeeItem.style.backgroundColor = 'white';
                employeeItem.textContent = employeeData.name;

                employeeItem.onmouseover = () => {
                    employeeItem.style.backgroundColor = '#f8f9fa';
                    employeeItem.style.color = '#333';
                };
                employeeItem.onmouseout = () => {
                    employeeItem.style.backgroundColor = 'white';
                    employeeItem.style.color = '#333';
                };
                employeeItem.onclick = () => {
                    selectEmployeeForBulk(doc.id, employeeData.name);
                    dropdown.remove();
                };

                dropdown.appendChild(employeeItem);
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
        }

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !bulkBtn.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    // Function to select employee for bulk scheduling
    function selectEmployeeForBulk(employeeId, employeeName) {
        selectedEmployee = { id: employeeId, name: employeeName };
        isBulkSchedulingMode = true;
        console.log('Employee selected for bulk scheduling:', { selectedEmployee, isBulkSchedulingMode });
        
        // Update button text and style (but don't trigger the action)
        const bulkBtn = document.getElementById('bulkScheduleBtn');
        bulkBtn.textContent = 'Confirm Selection';
        bulkBtn.style.backgroundColor = '#28a745';
        bulkBtn.style.borderColor = '#28a745';
        
        // Set the click handler for later use
        bulkBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Confirm Selection button clicked');
            confirmBulkSelections();
        };

        // Show employee name
        const employeeDisplay = document.getElementById('selectedEmployeeDisplay');
        employeeDisplay.textContent = employeeName;
        employeeDisplay.style.display = 'block';
    }

    // Function to restore bulk scheduling state
    function restoreBulkSchedulingState() {
        console.log('Restoring bulk scheduling state:', { isBulkSchedulingMode, selectedEmployee });
        
        if (isBulkSchedulingMode && selectedEmployee) {
            const bulkBtn = document.getElementById('bulkScheduleBtn');
            console.log('Bulk button found:', !!bulkBtn);
            if (bulkBtn) {
                bulkBtn.textContent = 'Confirm Selection';
                bulkBtn.style.backgroundColor = '#28a745';
                bulkBtn.style.borderColor = '#28a745';
                bulkBtn.onclick = () => {
                    confirmBulkSelections();
                };
            }

            const employeeDisplay = document.getElementById('selectedEmployeeDisplay');
            console.log('Employee display found:', !!employeeDisplay);
            if (employeeDisplay) {
                employeeDisplay.textContent = selectedEmployee.name;
                employeeDisplay.style.display = 'block';
            }
        }
    }

    // Function to remove selected shift (simplified for new UI)
    window.removeSelectedShift = function(index) {
        selectedShifts.splice(index, 1);
        updateCalendarSelectionDisplay();
    };

    // Function to handle shift slot selection in bulk mode
    function handleBulkShiftSelection(dateStr, category, year, month, day) {
        if (!isBulkSchedulingMode || !selectedEmployee) {
            showCustomAlert('Please select an employee first.', 'warning');
            return;
        }

        const shiftKey = `${dateStr}-${category}`;
        const existingIndex = selectedShifts.findIndex(shift => shift.key === shiftKey);

        if (existingIndex !== -1) {
            // Remove if already selected
            selectedShifts.splice(existingIndex, 1);
        } else {
            // Add new selection
            selectedShifts.push({
                key: shiftKey,
                date: dateStr,
                category: category,
                year: year,
                month: month,
                day: day
            });
        }

        updateCalendarSelectionDisplay();
    }

    // Function to update calendar selection display
    function updateCalendarSelectionDisplay() {
        if (!isBulkSchedulingMode) return;
        
        const shiftSlots = document.querySelectorAll('.shift-slot');
        shiftSlots.forEach(slot => {
            const dateStr = slot.getAttribute('data-original-date');
            const category = slot.getAttribute('data-category');
            const shiftKey = `${dateStr}-${category}`;
            
            const isSelected = selectedShifts.some(shift => shift.key === shiftKey);
            
            if (isSelected) {
                slot.style.border = '3px solid #6f42c1';
                slot.style.backgroundColor = '#f3e5f5';
            } else {
                slot.style.border = '1px solid #e0e0e0';
                slot.style.backgroundColor = 'white';
            }
        });
    }

    // Function to refresh all shift data
    async function refreshAllShiftData() {
        console.log('refreshAllShiftData called');
        const shiftSlots = document.querySelectorAll('.shift-slot');
        console.log('Found shift slots:', shiftSlots.length);
        
        for (const slot of shiftSlots) {
            const dateStr = slot.getAttribute('data-original-date');
            const category = slot.getAttribute('data-category');
            const year = parseInt(slot.getAttribute('data-year'));
            const month = parseInt(slot.getAttribute('data-month'));
            const day = parseInt(slot.getAttribute('data-day'));
            
            const firestoreDate = convertToFirestoreDate(dateStr);
            
            try {
                const shifts = await getShiftsForDate(firestoreDate);
                console.log(`Shifts for date ${firestoreDate}:`, shifts);
                const categoryShifts = shifts.filter(shift => 
                    shift.shiftClassification === category
                );
                console.log(`Category shifts for ${category}:`, categoryShifts);
                
                // Clear the slot
                slot.innerHTML = '';
                
                if (categoryShifts.length > 0) {
                    // Display each shift
                    categoryShifts.forEach((shift, shiftIndex) => {
                        const shiftDisplay = document.createElement('div');
                        shiftDisplay.style.width = '100%';
                        shiftDisplay.style.height = '100%';
                        shiftDisplay.style.display = 'flex';
                        shiftDisplay.style.flexDirection = 'column';
                        shiftDisplay.style.justifyContent = 'center';
                        shiftDisplay.style.alignItems = 'center';
                        shiftDisplay.style.padding = '5px';
                        shiftDisplay.style.boxSizing = 'border-box';
                        shiftDisplay.style.cursor = 'pointer';
                        
                        // Set background color based on shift status
                        if (shift.isCompleted) {
                            shiftDisplay.style.backgroundColor = '#d4edda'; // Light green for completed
                        } else if (shift.isCurrent) {
                            shiftDisplay.style.backgroundColor = '#fff3cd'; // Light yellow for current
                        } else {
                            shiftDisplay.style.backgroundColor = '#d1ecf1'; // Light blue for scheduled
                        }
                        
                        // Employee name
                        const employeeName = document.createElement('div');
                        employeeName.textContent = shift.employeeName;
                        employeeName.style.fontWeight = 'bold';
                        employeeName.style.fontSize = '11px';
                        employeeName.style.textAlign = 'center';
                        employeeName.style.marginBottom = '2px';
                        
                        // Time range
                        const timeRange = document.createElement('div');
                        const startTime = shift.shiftStartTime.toDate();
                        const endTime = shift.shiftFinishTime.toDate();
                        timeRange.textContent = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        timeRange.style.fontSize = '10px';
                        timeRange.style.color = '#666';
                        timeRange.style.textAlign = 'center';
                        
                        // Status indicator
                        const statusIndicator = document.createElement('div');
                        if (shift.isCompleted) {
                            statusIndicator.textContent = '✓';
                            statusIndicator.style.color = '#28a745';
                        } else if (shift.isCurrent) {
                            statusIndicator.textContent = '●';
                            statusIndicator.style.color = '#ffc107';
                        } else {
                            statusIndicator.textContent = '○';
                            statusIndicator.style.color = '#17a2b8';
                        }
                        statusIndicator.style.fontSize = '12px';
                        statusIndicator.style.fontWeight = 'bold';
                        statusIndicator.style.marginTop = '2px';
                        
                        shiftDisplay.appendChild(employeeName);
                        shiftDisplay.appendChild(timeRange);
                        shiftDisplay.appendChild(statusIndicator);
                        
                        // Click handler to edit shift
                        shiftDisplay.onclick = (e) => {
                            e.stopPropagation();
                            showShiftDetailsModal(shift, dateStr, year, month, day);
                        };
                        
                        slot.appendChild(shiftDisplay);
                    });
                } else {
                    // No shifts for this category, show add button
                    const addButton = document.createElement('div');
                    addButton.innerHTML = '+';
                    addButton.style.position = 'absolute';
                    addButton.style.top = '50%';
                    addButton.style.left = '50%';
                    addButton.style.transform = 'translate(-50%, -50%)';
                    addButton.style.fontSize = '24px';
                    addButton.style.color = '#ccc';
                    addButton.style.fontWeight = 'bold';
                    addButton.style.cursor = 'pointer';
                    addButton.onclick = (e) => {
                        e.stopPropagation();
                        // Check if bulk scheduling is active
                        if (isBulkSchedulingMode && selectedEmployee) {
                            // In bulk mode - handle selection
                            handleBulkShiftSelection(dateStr, category, year, month, day);
                        } else {
                            // Normal mode - open individual shift modal
                            storeCurrentCalendarState();
                            openShiftSchedulingModal(dateStr, year, month, day, category);
                        }
                    };
                    slot.appendChild(addButton);
                }
            } catch (error) {
                console.error('Error refreshing shift data for slot:', error);
            }
        }
    }

    // Function to confirm bulk selections
    async function confirmBulkSelections() {
        console.log('confirmBulkSelections called with:', { selectedEmployee, selectedShifts: selectedShifts.length });
        
        // Prevent execution if no shifts are selected (likely an accidental trigger)
        if (selectedShifts.length === 0) {
            console.log('No shifts selected - ignoring accidental trigger');
            return;
        }
        
        if (!selectedEmployee || selectedShifts.length === 0) {
            console.log('Validation failed - no employee or no shifts selected');
            showCustomAlert('Please select an employee and at least one shift.', 'warning');
            return;
        }

        try {
            const employeeName = selectedEmployee.name;
            const shiftCount = selectedShifts.length;
            console.log('Starting bulk selection with:', {
                employeeName,
                shiftCount,
                selectedShifts: selectedShifts
            });

            for (const shift of selectedShifts) {
                const { date: dateStr, category, year, month, day } = shift;
                console.log('Processing shift:', { dateStr, category, year, month, day });
                
                // Get shift times based on category
                const shiftTimes = getShiftTimesForCategory(category);
                console.log('Shift times for category:', category, shiftTimes);
                
                // Create shift start and end times
                const [startHour, startMinute] = shiftTimes.startTime.split(':').map(Number);
                const [endHour, endMinute] = shiftTimes.endTime.split(':').map(Number);
                
                const shiftStartTime = new Date(year, month, day, startHour, startMinute);
                const shiftFinishTime = new Date(year, month, day, endHour, endMinute);

                // Create new shift
                await createNewShift(
                    convertToFirestoreDate(dateStr),
                    category,
                    selectedEmployee.id,
                    selectedEmployee.name,
                    shiftStartTime,
                    shiftFinishTime
                );
            }

            // Clear selections and reset UI
            selectedShifts = [];
            selectedEmployee = null;
            isBulkSchedulingMode = false;
            
            // Clear all selection highlighting
            const shiftSlots = document.querySelectorAll('.shift-slot');
            shiftSlots.forEach(slot => {
                slot.style.border = '1px solid #e0e0e0';
                slot.style.backgroundColor = 'white';
            });

            // Reset button and hide employee display
            const bulkBtn = document.getElementById('bulkScheduleBtn');
            bulkBtn.textContent = 'Bulk Schedule';
            bulkBtn.style.backgroundColor = '#6f42c1';
            bulkBtn.style.borderColor = '#6f42c1';
            bulkBtn.onclick = () => {
                openBulkEmployeeDropdown();
            };

            const employeeDisplay = document.getElementById('selectedEmployeeDisplay');
            employeeDisplay.style.display = 'none';

            // Refresh all shift data to show the newly created shifts
            console.log('About to refresh shift data...');
            await refreshAllShiftData();
            console.log('Shift data refresh completed');

            showCustomAlert(`Successfully scheduled ${shiftCount} shifts for ${employeeName}!`, 'success');
        } catch (error) {
            console.error('Error confirming bulk selections:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                selectedEmployee,
                selectedShifts: selectedShifts.length
            });
            showCustomAlert('Error scheduling shifts. Please try again.', 'error');
        }
    }

    // Helper function to get shift times for category
    function getShiftTimesForCategory(category) {
        const shiftClassifications = [
            { name: 'Cafe Open', startTime: '07:30', endTime: '11:30' },
            { name: 'Cafe Morning', startTime: '09:00', endTime: '13:00' },
            { name: 'Cafe Afternoon', startTime: '13:00', endTime: '16:00' },
            { name: 'Cafe Close', startTime: '14:00', endTime: '18:00' },
            { name: 'TEN Cleaning 1', startTime: '10:00', endTime: '14:00' },
            { name: 'TEN Cleaning 2', startTime: '10:00', endTime: '14:00' }
        ];

        const found = shiftClassifications.find(s => s.name === category);
        return found || { startTime: '09:00', endTime: '17:00' };
    }

    // Helper function to store current calendar state
    function storeCurrentCalendarState() {
        const currentWeekDisplay = document.querySelector('.calendar .week-display');
        if (currentWeekDisplay) {
            const weekDisplayText = currentWeekDisplay.textContent;
            const weekStartMatch = weekDisplayText.match(/Week View - (.+?) to/);
            if (weekStartMatch) {
                const weekStartDate = new Date(weekStartMatch[1]);
                window.currentCalendarState = {
                    month: weekStartDate.getMonth(),
                    year: weekStartDate.getFullYear(),
                    weekStart: weekStartDate
                };
            }
        }
    }

    // Function to display week view
    function displayWeekView(month, year, startDate = null) {
        // Calculate week start (Sunday)
            const today = new Date();
        const weekStart = startDate || new Date(year, month, today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

        // Remove any existing calendar elements and overlays
        const existingCalendar = document.querySelector('.calendar');
        if (existingCalendar) {
            existingCalendar.remove();
        }
        
        const existingOverlay = document.querySelector('.calendar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Clean up any other modal overlays that might be lingering
        const allOverlays = document.querySelectorAll('.shift-details-overlay, .shift-edit-overlay');
        allOverlays.forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });

        // Create calendar overlay
        const overlay = document.createElement('div');
        overlay.className = 'calendar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '900';
        document.body.appendChild(overlay);

        // Create calendar container
        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        calendar.style.position = 'fixed';
        calendar.style.top = '0';
        calendar.style.left = '0';
        calendar.style.width = '100%';
        calendar.style.height = '100%';
        calendar.style.backgroundColor = 'white';
        calendar.style.padding = '10px';
        calendar.style.paddingTop = '50px';
        calendar.style.borderRadius = '0';
        calendar.style.boxShadow = 'none';
        calendar.style.zIndex = '901';
        calendar.style.overflowY = 'auto';

        // Create header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';
        header.style.position = 'relative';

        // Create person icon for employee history
        const personIcon = document.createElement('div');
        personIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        personIcon.style.position = 'absolute';
        personIcon.style.left = '0';
        personIcon.style.top = '0';
        personIcon.style.cursor = 'pointer';
        personIcon.style.color = 'var(--primary)';
        personIcon.style.transition = 'transform 0.2s, color 0.2s';
        personIcon.style.padding = '8px';
        personIcon.style.borderRadius = '4px';
        personIcon.onmouseover = () => {
            personIcon.style.transform = 'scale(1.1)';
            personIcon.style.color = 'var(--primary-dark)';
        };
        personIcon.onmouseout = () => {
            personIcon.style.transform = 'scale(1)';
            personIcon.style.color = 'var(--primary)';
        };
        personIcon.onclick = () => {
            fetchEmployeeHistory(year, month);
        };
        header.appendChild(personIcon);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'var(--primary)';
        closeButton.onclick = () => {
            cleanupAllModals();
        };
        header.appendChild(closeButton);

        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.style.display = 'flex';
        navContainer.style.alignItems = 'center';
        navContainer.style.gap = '20px';
        navContainer.style.margin = '0 auto';

        // Add navigation arrows
        const prevWeek = document.createElement('button');
        prevWeek.innerHTML = '←';
        prevWeek.style.border = 'none';
        prevWeek.style.background = 'none';
        prevWeek.style.fontSize = '20px';
        prevWeek.style.cursor = 'pointer';
        prevWeek.style.color = 'var(--primary)';
        prevWeek.onclick = () => {
            const previousWeekStart = new Date(weekStart);
            previousWeekStart.setDate(previousWeekStart.getDate() - 7);
            displayWeekView(previousWeekStart.getMonth(), previousWeekStart.getFullYear(), previousWeekStart);
        };
        navContainer.appendChild(prevWeek);

        // Add week display
        const weekDisplay = document.createElement('div');
        weekDisplay.className = 'week-display';
        weekDisplay.textContent = `Week View - ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`;
        weekDisplay.style.fontWeight = 'bold';
        weekDisplay.style.fontSize = '16px';
        navContainer.appendChild(weekDisplay);

        const nextWeek = document.createElement('button');
        nextWeek.innerHTML = '→';
        nextWeek.style.border = 'none';
        nextWeek.style.background = 'none';
        nextWeek.style.fontSize = '20px';
        nextWeek.style.cursor = 'pointer';
        nextWeek.style.color = 'var(--primary)';
        nextWeek.onclick = () => {
            const nextWeekStart = new Date(weekStart);
            nextWeekStart.setDate(nextWeekStart.getDate() + 7);
            displayWeekView(nextWeekStart.getMonth(), nextWeekStart.getFullYear(), nextWeekStart);
        };
        navContainer.appendChild(nextWeek);

        // Add view toggle container
        const viewToggleContainer = document.createElement('div');
        viewToggleContainer.style.display = 'flex';
        viewToggleContainer.style.gap = '10px';

        const monthBtn = document.createElement('button');
        monthBtn.textContent = 'Month';
        monthBtn.style.padding = '8px 16px';
        monthBtn.style.border = '1px solid var(--primary)';
        monthBtn.style.borderRadius = '6px';
        monthBtn.style.backgroundColor = 'white';
        monthBtn.style.color = 'var(--primary)';
        monthBtn.style.cursor = 'pointer';
        monthBtn.style.fontSize = '14px';
        monthBtn.style.fontWeight = 'bold';
        monthBtn.onclick = () => {
            displayMonthView(month, year);
        };
        viewToggleContainer.appendChild(monthBtn);

        const weekBtn = document.createElement('button');
        weekBtn.textContent = 'Week';
        weekBtn.style.padding = '8px 16px';
        weekBtn.style.border = '1px solid var(--primary)';
        weekBtn.style.borderRadius = '6px';
        weekBtn.style.backgroundColor = 'var(--primary)';
        weekBtn.style.color = 'white';
        weekBtn.style.cursor = 'pointer';
        weekBtn.style.fontSize = '14px';
        weekBtn.style.fontWeight = 'bold';
        viewToggleContainer.appendChild(weekBtn);

        const todayBtn = document.createElement('button');
        todayBtn.textContent = 'Today';
        todayBtn.style.padding = '8px 16px';
        todayBtn.style.border = '1px solid #28a745';
        todayBtn.style.borderRadius = '6px';
        todayBtn.style.backgroundColor = '#28a745';
        todayBtn.style.color = 'white';
        todayBtn.style.cursor = 'pointer';
        todayBtn.style.fontSize = '14px';
        todayBtn.style.fontWeight = 'bold';
        todayBtn.onclick = () => {
            displayWeekView(today.getMonth(), today.getFullYear());
        };
        viewToggleContainer.appendChild(todayBtn);

        // Add bulk scheduling button
        const bulkBtn = document.createElement('button');
        bulkBtn.id = 'bulkScheduleBtn';
        
        // Check if we're in bulk scheduling mode and set initial state
        if (isBulkSchedulingMode && selectedEmployee) {
            bulkBtn.textContent = 'Confirm Selection';
            bulkBtn.style.backgroundColor = '#28a745';
            bulkBtn.style.borderColor = '#28a745';
            bulkBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Confirm Selection button clicked (from initialization)');
                confirmBulkSelections();
            };
        } else {
            bulkBtn.textContent = 'Bulk Schedule';
            bulkBtn.style.backgroundColor = '#6f42c1';
            bulkBtn.style.borderColor = '#6f42c1';
            bulkBtn.onclick = function() {
                console.log('Bulk Schedule button clicked');
                openBulkEmployeeDropdown();
            };
        }
        
        bulkBtn.style.padding = '8px 16px';
        bulkBtn.style.border = '1px solid';
        bulkBtn.style.borderRadius = '6px';
        bulkBtn.style.color = 'white';
        bulkBtn.style.cursor = 'pointer';
        bulkBtn.style.fontSize = '14px';
        bulkBtn.style.fontWeight = 'bold';
        viewToggleContainer.appendChild(bulkBtn);

        // Add employee name display
        const employeeDisplay = document.createElement('div');
        employeeDisplay.id = 'selectedEmployeeDisplay';
        
        // Check if we should show employee name immediately
        if (isBulkSchedulingMode && selectedEmployee) {
            employeeDisplay.textContent = selectedEmployee.name;
            employeeDisplay.style.display = 'block';
        } else {
            employeeDisplay.style.display = 'none';
        }
        
        employeeDisplay.style.padding = '8px 12px';
        employeeDisplay.style.backgroundColor = '#f8f9fa';
        employeeDisplay.style.border = '1px solid #e9ecef';
        employeeDisplay.style.borderRadius = '6px';
        employeeDisplay.style.fontSize = '14px';
        employeeDisplay.style.fontWeight = 'bold';
        employeeDisplay.style.color = '#6f42c1';
        viewToggleContainer.appendChild(employeeDisplay);
        
        navContainer.appendChild(viewToggleContainer);
        header.appendChild(navContainer);
        calendar.appendChild(header);

        // Create week view container with shift categories
        const weekContainer = document.createElement('div');
        weekContainer.style.display = 'flex';
        weekContainer.style.marginTop = '0';
        weekContainer.style.border = '1px solid #e0e0e0';
        weekContainer.style.borderRadius = '0';
        weekContainer.style.overflow = 'hidden';
        weekContainer.style.backgroundColor = 'white';
        weekContainer.style.flex = '1';
        weekContainer.style.height = 'calc(100vh - 120px)';

        // Create shift categories column
        const categoriesColumn = document.createElement('div');
        categoriesColumn.style.width = '200px';
        categoriesColumn.style.backgroundColor = '#f8f9fa';
        categoriesColumn.style.borderRight = '2px solid #e0e0e0';
        categoriesColumn.style.display = 'flex';
        categoriesColumn.style.flexDirection = 'column';

        // Add categories header
        const categoriesHeader = document.createElement('div');
        categoriesHeader.style.backgroundColor = 'var(--primary)';
        categoriesHeader.style.color = 'white';
        categoriesHeader.style.padding = '15px 10px';
        categoriesHeader.style.textAlign = 'center';
        categoriesHeader.style.fontWeight = 'bold';
        categoriesHeader.style.fontSize = '14px';
        categoriesHeader.style.height = '60px';
        categoriesHeader.style.display = 'flex';
        categoriesHeader.style.alignItems = 'center';
        categoriesHeader.style.justifyContent = 'center';
        categoriesHeader.textContent = 'Shift Categories';
        categoriesColumn.appendChild(categoriesHeader);

        // Define shift categories
        const shiftCategories = [
            { name: 'Cafe Open', time: '7:30-11:30am', color: '#e3f2fd' },
            { name: 'Cafe Morning', time: '9:00-1:00pm', color: '#f3e5f5' },
            { name: 'Cafe Afternoon', time: '1:00pm-4:00pm', color: '#e8f5e8' },
            { name: 'Cafe Close', time: '2:00pm-6:00pm', color: '#fff3e0' },
            { name: 'TEN Cleaning 1', time: '10:00am-2:00pm', color: '#fce4ec' },
            { name: 'TEN Cleaning 2', time: '10:00am-2:00pm', color: '#f1f8e9' }
        ];

        // Create category rows
        shiftCategories.forEach((category, index) => {
            const categoryRow = document.createElement('div');
            categoryRow.style.display = 'flex';
            categoryRow.style.flexDirection = 'column';
            categoryRow.style.justifyContent = 'center';
            categoryRow.style.alignItems = 'center';
            categoryRow.style.height = '80px';
            categoryRow.style.borderBottom = '1px solid #e0e0e0';
            categoryRow.style.backgroundColor = category.color;
            categoryRow.style.padding = '10px';
            categoryRow.style.boxSizing = 'border-box';

            const categoryName = document.createElement('div');
            categoryName.textContent = category.name;
            categoryName.style.fontWeight = 'bold';
            categoryName.style.fontSize = '12px';
            categoryName.style.textAlign = 'center';
            categoryName.style.marginBottom = '4px';

            const categoryTime = document.createElement('div');
            categoryTime.textContent = category.time;
            categoryTime.style.fontSize = '10px';
            categoryTime.style.color = '#666';
            categoryTime.style.textAlign = 'center';

            categoryRow.appendChild(categoryName);
            categoryRow.appendChild(categoryTime);
            categoriesColumn.appendChild(categoryRow);
        });
        
        weekContainer.appendChild(categoriesColumn);

        // Create day columns
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const japanesedays = ['日', '月', '火', '水', '木', '金', '土'];
        
        // Get today's date for comparison
        const currentToday = new Date();
        
        days.forEach((day, dayIndex) => {
            const dayColumn = document.createElement('div');
            dayColumn.style.flex = '1';
            dayColumn.style.position = 'relative';
            dayColumn.style.borderRight = dayIndex < 6 ? '1px solid #e0e0e0' : 'none';
            
            // Calculate the date for this day
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + dayIndex);
            const dayNumber = currentDate.getDate();
            
            // Check if this is actually today's date
            const isToday = currentDate.toDateString() === currentToday.toDateString();
            
            // Day header
            const dayHeader = document.createElement('div');
            dayHeader.innerHTML = `${day} ${japanesedays[dayIndex]} ${dayNumber}`;
            dayHeader.style.backgroundColor = isToday ? '#28a745' : 'var(--primary)';
            dayHeader.style.color = 'white';
            dayHeader.style.padding = '15px 10px';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.fontSize = '14px';
            dayHeader.style.height = '60px';
            dayHeader.style.display = 'flex';
            dayHeader.style.alignItems = 'center';
            dayHeader.style.justifyContent = 'center';
            dayColumn.appendChild(dayHeader);

            // Create shift slots for each category
            const shiftSlotsContainer = document.createElement('div');
            shiftSlotsContainer.style.display = 'flex';
            shiftSlotsContainer.style.flexDirection = 'column';
            shiftSlotsContainer.style.height = 'calc(100vh - 180px)';

            // Create shift slots for each category
            shiftCategories.forEach((category, categoryIndex) => {
                const shiftSlot = document.createElement('div');
                shiftSlot.className = 'shift-slot';
                shiftSlot.style.height = '80px';
                shiftSlot.style.borderBottom = '1px solid #e0e0e0';
                shiftSlot.style.backgroundColor = 'white';
                shiftSlot.style.cursor = 'pointer';
                shiftSlot.style.display = 'flex';
                shiftSlot.style.alignItems = 'center';
                shiftSlot.style.justifyContent = 'center';
                shiftSlot.style.padding = '10px';
                shiftSlot.style.boxSizing = 'border-box';
                shiftSlot.style.position = 'relative';
                
                // Add click handler to open shift scheduling modal
                const dateStr = currentDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                
                shiftSlot.onclick = () => {
                    // Check if bulk scheduling is active
                    if (isBulkSchedulingMode && selectedEmployee) {
                        // In bulk mode - handle selection
                        handleBulkShiftSelection(dateStr, category.name, year, month, currentDate.getDate());
                    } else {
                        // Normal mode - open individual shift modal
                        storeCurrentCalendarState();
                        openShiftSchedulingModal(dateStr, year, month, currentDate.getDate(), category.name);
                    }
                };
                
                // Fetch and display shifts for this category and date
                const firestoreDate = convertToFirestoreDate(dateStr);
                
                // Set data attributes for refresh functionality
                shiftSlot.setAttribute('data-date', firestoreDate);
                shiftSlot.setAttribute('data-category', category.name);
                shiftSlot.setAttribute('data-original-date', dateStr);
                shiftSlot.setAttribute('data-year', year);
                shiftSlot.setAttribute('data-month', month);
                shiftSlot.setAttribute('data-day', currentDate.getDate());
                getShiftsForDate(firestoreDate).then(shifts => {
                    // Find shifts for this specific category
                    const categoryShifts = shifts.filter(shift => 
                        shift.shiftClassification === category.name
                    );
                    
                    if (categoryShifts.length > 0) {
                        // Clear the add button since we have shifts
                        shiftSlot.innerHTML = '';
                        
                        // Display each shift
                        categoryShifts.forEach((shift, shiftIndex) => {
                            const shiftDisplay = document.createElement('div');
                            shiftDisplay.style.width = '100%';
                            shiftDisplay.style.height = '100%';
                            shiftDisplay.style.display = 'flex';
                            shiftDisplay.style.flexDirection = 'column';
                            shiftDisplay.style.justifyContent = 'center';
                            shiftDisplay.style.alignItems = 'center';
                            shiftDisplay.style.padding = '5px';
                            shiftDisplay.style.boxSizing = 'border-box';
                            shiftDisplay.style.cursor = 'pointer';
                            
                            // Set background color based on shift status
                            if (shift.isCompleted) {
                                shiftDisplay.style.backgroundColor = '#d4edda'; // Light green for completed
                            } else if (shift.isCurrent) {
                                shiftDisplay.style.backgroundColor = '#fff3cd'; // Light yellow for current
                            } else {
                                shiftDisplay.style.backgroundColor = '#d1ecf1'; // Light blue for scheduled
                            }
                            
                            // Employee name
                            const employeeName = document.createElement('div');
                            employeeName.textContent = shift.employeeName;
                            employeeName.style.fontWeight = 'bold';
                            employeeName.style.fontSize = '11px';
                            employeeName.style.textAlign = 'center';
                            employeeName.style.marginBottom = '2px';
                            
                            // Time range
                            const timeRange = document.createElement('div');
                            const startTime = shift.shiftStartTime.toDate();
                            const endTime = shift.shiftFinishTime.toDate();
                            timeRange.textContent = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                            timeRange.style.fontSize = '10px';
                            timeRange.style.color = '#666';
                            timeRange.style.textAlign = 'center';
                            
                            // Status indicator
                            const statusIndicator = document.createElement('div');
                            if (shift.isCompleted) {
                                statusIndicator.textContent = '✓';
                                statusIndicator.style.color = '#28a745';
                            } else if (shift.isCurrent) {
                                statusIndicator.textContent = '●';
                                statusIndicator.style.color = '#ffc107';
                            } else {
                                statusIndicator.textContent = '○';
                                statusIndicator.style.color = '#17a2b8';
                            }
                            statusIndicator.style.fontSize = '12px';
                            statusIndicator.style.fontWeight = 'bold';
                            statusIndicator.style.marginTop = '2px';
                            
                            shiftDisplay.appendChild(employeeName);
                            shiftDisplay.appendChild(timeRange);
                            shiftDisplay.appendChild(statusIndicator);
                            
                            // Click handler to edit shift
                            shiftDisplay.onclick = (e) => {
                                e.stopPropagation();
                                showShiftDetailsModal(shift, dateStr, year, month, currentDate.getDate());
                            };
                            
                            shiftSlot.appendChild(shiftDisplay);
                        });
                    } else {
                        // No shifts for this category, show add button
                        const addButton = document.createElement('div');
                        addButton.innerHTML = '+';
                        addButton.style.position = 'absolute';
                        addButton.style.top = '50%';
                        addButton.style.left = '50%';
                        addButton.style.transform = 'translate(-50%, -50%)';
                        addButton.style.fontSize = '24px';
                        addButton.style.color = '#ccc';
                        addButton.style.fontWeight = 'bold';
                        addButton.style.cursor = 'pointer';
                        addButton.onclick = (e) => {
                            e.stopPropagation();
                            // Check if bulk scheduling is active
                            if (isBulkSchedulingMode && selectedEmployee) {
                                // In bulk mode - handle selection
                                handleBulkShiftSelection(dateStr, category.name, year, month, currentDate.getDate());
                            } else {
                                // Normal mode - open individual shift modal
                                storeCurrentCalendarState();
                                openShiftSchedulingModal(dateStr, year, month, currentDate.getDate(), category.name);
                            }
                        };
                        shiftSlot.appendChild(addButton);
                    }
                }).catch(error => {
                    console.error('Error fetching shifts:', error);
                    // Show add button on error
                    const addButton = document.createElement('div');
                    addButton.innerHTML = '+';
                    addButton.style.position = 'absolute';
                    addButton.style.top = '50%';
                    addButton.style.left = '50%';
                    addButton.style.transform = 'translate(-50%, -50%)';
                    addButton.style.fontSize = '24px';
                    addButton.style.color = '#ccc';
                    addButton.style.fontWeight = 'bold';
                    addButton.style.cursor = 'pointer';
                    addButton.onclick = (e) => {
                        e.stopPropagation();
                        // Check if bulk scheduling is active
                        if (isBulkSchedulingMode && selectedEmployee) {
                            // In bulk mode - handle selection
                            handleBulkShiftSelection(dateStr, category.name, year, month, currentDate.getDate());
                        } else {
                            // Normal mode - open individual shift modal
                            storeCurrentCalendarState();
                            openShiftSchedulingModal(dateStr, year, month, currentDate.getDate(), category.name);
                        }
                    };
                    shiftSlot.appendChild(addButton);
                });
                
                shiftSlotsContainer.appendChild(shiftSlot);
            });

            dayColumn.appendChild(shiftSlotsContainer);
            weekContainer.appendChild(dayColumn);
        });

        calendar.appendChild(weekContainer);
        document.body.appendChild(calendar);
        
        // Update calendar selection display if in bulk mode
        if (isBulkSchedulingMode && selectedEmployee) {
            setTimeout(() => {
                updateCalendarSelectionDisplay();
            }, 50);
        }
    }

    // Function to display month view
    function displayMonthView(month, year) {
        // If employee history modal is open, close it first
        const employeeHistoryModal = document.querySelector('.employee-history-modal');
        if (employeeHistoryModal && employeeHistoryModal.style.display === 'flex') {
            employeeHistoryModal.style.display = 'none';
        }

        // Show calendar modal
        const calendarModal = document.querySelector('.calendar-modal');
        if (calendarModal) {
            calendarModal.style.display = 'flex';
        }

        // Remove any existing overlays and calendars
        const existingOverlay = document.querySelector('.calendar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        const existingCalendar = document.querySelector('.calendar');
        if (existingCalendar) {
            existingCalendar.remove();
        }

        // Create calendar overlay
        const overlay = document.createElement('div');
        overlay.className = 'calendar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '900';
        document.body.appendChild(overlay);

        // Create calendar container
        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        calendar.style.position = 'fixed';
        calendar.style.top = '50%';
        calendar.style.left = '50%';
        calendar.style.transform = 'translate(-50%, -50%)';
        calendar.style.backgroundColor = 'white';
        calendar.style.padding = '20px';
        calendar.style.borderRadius = '8px';
        calendar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        calendar.style.zIndex = '901';
        calendar.style.minWidth = '1020px';
        calendar.style.maxHeight = '85vh';
        calendar.style.overflowY = 'auto';

        // Create header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';
        header.style.position = 'relative';

        // Create person icon for employee history
        const personIcon = document.createElement('div');
        personIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        personIcon.style.position = 'absolute';
        personIcon.style.left = '0';
        personIcon.style.top = '0';
        personIcon.style.cursor = 'pointer';
        personIcon.style.color = 'var(--primary)';
        personIcon.style.transition = 'transform 0.2s, color 0.2s';
        personIcon.style.padding = '8px';
        personIcon.style.borderRadius = '4px';
        personIcon.onmouseover = () => {
            personIcon.style.transform = 'scale(1.1)';
            personIcon.style.color = 'var(--primary-dark)';
        };
        personIcon.onmouseout = () => {
            personIcon.style.transform = 'scale(1)';
            personIcon.style.color = 'var(--primary)';
        };
        personIcon.onclick = () => {
            // Close calendar if it's open
            const calendarModal = document.querySelector('.calendar-modal');
            if (calendarModal && calendarModal.style.display === 'flex') {
                calendarModal.style.display = 'none';
            }
            
            // Show the employee history modal and fetch data for the current calendar month
            fetchEmployeeHistory(year, month);
        };
        header.appendChild(personIcon);

        // Add close button (X) in top right corner
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'var(--primary)';
        closeButton.onclick = () => {
            overlay.remove();
            calendar.remove();
        };
        header.appendChild(closeButton);

        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.style.display = 'flex';
        navContainer.style.alignItems = 'center';
        navContainer.style.gap = '20px';
        navContainer.style.margin = '0 auto';

        // Add navigation arrows
        const prevMonth = document.createElement('button');
        prevMonth.innerHTML = '←';
        prevMonth.style.border = 'none';
        prevMonth.style.background = 'none';
        prevMonth.style.fontSize = '20px';
        prevMonth.style.cursor = 'pointer';
        prevMonth.style.color = 'var(--primary)';
        prevMonth.onclick = () => {
            if (month === 0) {
                displayCalendar(11, year - 1);
                    } else {
                displayCalendar(month - 1, year);
            }
        };
        navContainer.appendChild(prevMonth);

        // Add month/year display
        const monthYear = document.createElement('div');
        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        monthYear.style.fontWeight = 'bold';
        monthYear.style.color = 'var(--primary)';
        navContainer.appendChild(monthYear);

        const nextMonth = document.createElement('button');
        nextMonth.innerHTML = '→';
        nextMonth.style.border = 'none';
        nextMonth.style.background = 'none';
        nextMonth.style.fontSize = '20px';
        nextMonth.style.cursor = 'pointer';
        nextMonth.style.color = 'var(--primary)';
        nextMonth.onclick = () => {
            if (month === 11) {
                displayCalendar(0, year + 1);
            } else {
                displayCalendar(month + 1, year);
            }
        };
        navContainer.appendChild(nextMonth);

        // Add view toggle buttons
        const viewToggleContainer = document.createElement('div');
        viewToggleContainer.style.display = 'flex';
        viewToggleContainer.style.gap = '10px';
        viewToggleContainer.style.marginLeft = '20px';

        const monthViewBtn = document.createElement('button');
        monthViewBtn.textContent = 'Month';
        monthViewBtn.style.padding = '8px 16px';
        monthViewBtn.style.border = '1px solid var(--primary)';
        monthViewBtn.style.borderRadius = '6px';
        monthViewBtn.style.backgroundColor = 'var(--primary)';
        monthViewBtn.style.color = 'white';
        monthViewBtn.style.cursor = 'pointer';
        monthViewBtn.style.fontSize = '14px';
        monthViewBtn.style.fontWeight = 'bold';
        monthViewBtn.onclick = () => {
            displayCalendar(month, year);
        };

        const weekViewBtn = document.createElement('button');
        weekViewBtn.textContent = 'Week';
        weekViewBtn.style.padding = '8px 16px';
        weekViewBtn.style.border = '1px solid var(--primary)';
        weekViewBtn.style.borderRadius = '6px';
        weekViewBtn.style.backgroundColor = 'white';
        weekViewBtn.style.color = 'var(--primary)';
        weekViewBtn.style.cursor = 'pointer';
        weekViewBtn.style.fontSize = '14px';
        weekViewBtn.style.fontWeight = 'bold';
        weekViewBtn.onclick = () => {
            displayWeekView(month, year);
        };

        viewToggleContainer.appendChild(monthViewBtn);
        viewToggleContainer.appendChild(weekViewBtn);
        
        // Add Today button
        const todayBtn = document.createElement('button');
        todayBtn.textContent = 'Today';
        todayBtn.style.padding = '8px 16px';
        todayBtn.style.border = '1px solid #28a745';
        todayBtn.style.borderRadius = '6px';
        todayBtn.style.backgroundColor = '#28a745';
        todayBtn.style.color = 'white';
        todayBtn.style.cursor = 'pointer';
        todayBtn.style.fontSize = '14px';
        todayBtn.style.fontWeight = 'bold';
        todayBtn.onclick = () => {
            const today = new Date();
            displayCalendar(today.getMonth(), today.getFullYear());
        };
        viewToggleContainer.appendChild(todayBtn);
        
        navContainer.appendChild(viewToggleContainer);

        header.appendChild(navContainer);
        calendar.appendChild(header);

        // Create calendar grid
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gap = '10px';
        grid.style.marginTop = '20px';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.textAlign = 'center';
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.padding = '8px';
            dayHeader.style.color = 'var(--primary)';
            dayHeader.style.fontSize = '16px';
            grid.appendChild(dayHeader);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.style.height = '100px';
            emptyCell.style.backgroundColor = '#f8f9fa';
            emptyCell.style.borderRadius = '4px';
            grid.appendChild(emptyCell);
        }

                    // Add days
            for (let day = 1; day <= totalDays; day++) {
                const cell = document.createElement('div');
                cell.style.height = '100px';
                cell.style.backgroundColor = 'white';
                cell.style.border = '1px solid #e0e0e0';
                cell.style.borderRadius = '4px';
                cell.style.padding = '8px';
                cell.style.position = 'relative';
                cell.style.overflow = 'hidden';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'background-color 0.2s';

                const dayNumber = document.createElement('div');
                dayNumber.textContent = day;
                dayNumber.style.fontWeight = 'bold';
                dayNumber.style.marginBottom = '5px';
                dayNumber.style.fontSize = '16px';
                dayNumber.style.textAlign = 'center';
                
                cell.onmouseover = () => {
                    cell.style.backgroundColor = '#f8f9fa';
                };
                cell.onmouseout = () => {
                    cell.style.backgroundColor = 'white';
                };
                
                cell.appendChild(dayNumber);

                // Fetch and display employee records for this day
                const dateStr = new Date(year, month, day).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                // Fetch employee records for this day
                getDocs(query(
                    collection(db, 'employeeSignIns'),
                    where('date', '==', dateStr)
                )).then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const data = doc.data();
                            const record = document.createElement('div');
                        record.style.marginBottom = '5px';
                        record.style.padding = '5px';
                            record.style.backgroundColor = '#f8f9fa';
                        record.style.borderRadius = '4px';
                        record.style.fontSize = '12px';
                        record.innerHTML = `
                            <div style="font-weight: bold; font-size: 12px;">${data.employeeName}</div>
                            <div style="color: #666; font-size: 11px;">
                                ${data.signInTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                ${data.endTime ? ` - ${data.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ' - Present'}
                        </div>
                        `;
                        cell.appendChild(record);
                    });
                });

                // Fetch scheduled shifts for this day
                getDocs(query(
                    collection(db, 'scheduledShifts'),
                    where('date', '==', dateStr)
                )).then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const record = document.createElement('div');
                        record.style.marginBottom = '5px';
                        record.style.padding = '5px';
                        record.style.backgroundColor = '#e3f2fd';
                        record.style.borderRadius = '4px';
                        record.style.fontSize = '12px';
                        record.style.border = '1px solid #2196f3';
                        record.style.position = 'relative';
                        record.style.cursor = 'pointer';
                        record.innerHTML = `
                            <div style="font-weight: bold; font-size: 12px; color: #1976d2;">${data.employeeName}</div>
                            <div style="color: #1976d2; font-size: 11px;">
                                Scheduled: ${data.startTime}
                        </div>
                            <div style="position: absolute; top: 2px; right: 2px; font-size: 10px; color: #f44336; cursor: pointer;" title="Delete scheduled shift">×</div>
                    `;
                    
                    // Add click handler to delete scheduled shift
                        record.onclick = async (e) => {
                            // Don't trigger if clicking the delete button
                            if (e.target.style.position === 'absolute') {
                            e.stopPropagation();
                            showCustomConfirm(
                                    `Delete scheduled shift for ${data.employeeName}?`,
                                async () => {
                                    try {
                                            await deleteDoc(doc.ref);
                                            displayCalendar(month, year);
                                    } catch (error) {
                                        console.error('Error deleting scheduled shift:', error);
                                        showCustomAlert('Error deleting scheduled shift. Please try again.', 'error');
                                    }
                                }
                            );
                            return;
                        }
                    };
                    
                        cell.appendChild(record);
                });
            });

                // Add click handler to open shift scheduling modal
                cell.onclick = () => {
                    openShiftSchedulingModal(dateStr, year, month, day);
                };

                grid.appendChild(cell);
            }

        calendar.appendChild(grid);
        document.body.appendChild(calendar);
    }

    // Update click outside handler for calendar
    document.addEventListener('click', (e) => {
        const calendarModal = document.querySelector('.calendar-modal');
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarModal && calendarModal.style.display === 'flex' && 
            !calendarContainer.contains(e.target) && 
            e.target !== calendarModal) {
            calendarModal.style.display = 'none';
        }
    });

    function showWorkHistory(dateStr, querySnapshot) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'history-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // Create history popup
        const history = document.createElement('div');
        history.className = 'history-popup';
        history.style.position = 'fixed';
        history.style.top = '50%';
        history.style.left = '50%';
        history.style.transform = 'translate(-50%, -50%)';
        history.style.backgroundColor = 'white';
        history.style.padding = '20px';
        history.style.borderRadius = '10px';
        history.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        history.style.zIndex = '1000';
        history.style.minWidth = '300px';
        history.style.maxWidth = '400px';
        history.style.maxHeight = '80vh';
        history.style.overflowY = 'auto';

        // Add header
        const header = document.createElement('h2');
        header.textContent = `Work History - ${new Date(dateStr).toLocaleDateString()}`;
        header.style.color = 'var(--primary)';
        header.style.marginBottom = '20px';
        history.appendChild(header);

        // Add work records
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const record = document.createElement('div');
            record.style.padding = '15px';
            record.style.borderBottom = '1px solid #e0e0e0';
            record.style.marginBottom = '10px';

            const signInTime = data.signInTime.toDate();
            const completedBreaks = (data.breaks || [])
                            .filter(b => b.endTime)
                .map(b => {
                                const start = b.startTime.toDate();
                                const end = b.endTime.toDate();
                    const duration = Math.floor((end - start) / (1000 * 60));
                    return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${duration}m)`;
                })
                .join('<br>');

                        record.innerHTML = `
                            <div style="font-weight: bold;">${data.employeeName}</div>
                <div style="font-size: 0.9em; color: #666;">
                    Started: ${signInTime.toLocaleTimeString()}
                    <br>
                    Duration: ${formatDuration(signInTime, data.endTime)}
                    ${completedBreaks ? `
                        <br>
                        <span style="color: #666;">Breaks taken:<br>${completedBreaks}</span>
                    ` : ''}
                    ${data.endTime ? `
                        <br>
                        <span style="color: #28a745;">Shift ended at ${data.endTime.toDate().toLocaleTimeString()}</span>
                    ` : ''}
                            </div>
                        `;

            history.appendChild(record);
            });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#f0f0f0';
        closeButton.style.color = '#333';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '20px';
        closeButton.style.width = '100%';

        closeButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(history);
        };

        history.appendChild(closeButton);
        document.body.appendChild(history);
    }

    // Create employee history modal
    const employeeHistoryModal = document.createElement('div');
    employeeHistoryModal.className = 'employee-history-modal';
    employeeHistoryModal.style.position = 'fixed';
    employeeHistoryModal.style.top = '0';
    employeeHistoryModal.style.left = '0';
    employeeHistoryModal.style.width = '100%';
    employeeHistoryModal.style.height = '100%';
    employeeHistoryModal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    employeeHistoryModal.style.display = 'none';
    employeeHistoryModal.style.justifyContent = 'center';
    employeeHistoryModal.style.alignItems = 'center';
    employeeHistoryModal.style.zIndex = '1000';
    employeeHistoryModal.style.backdropFilter = 'blur(5px)';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.maxWidth = '800px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.position = 'relative';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'var(--primary)';
    closeButton.onclick = () => {
        employeeHistoryModal.style.display = 'none';
    };

    // Add title
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Employee History';
    modalTitle.style.marginBottom = '20px';
    modalTitle.style.color = 'var(--primary)';

    // Add content container
    const historyContent = document.createElement('div');
    historyContent.id = 'employeeHistoryContent';

    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(historyContent);
    employeeHistoryModal.appendChild(modalContent);
    document.body.appendChild(employeeHistoryModal);

    // Add click outside handler for the modal
    employeeHistoryModal.addEventListener('click', (e) => {
        if (e.target === employeeHistoryModal) {
            employeeHistoryModal.style.display = 'none';
        }
    });

    // Create calendar modal
    const calendarModal = document.createElement('div');
    calendarModal.className = 'calendar-modal';
    calendarModal.style.position = 'fixed';
    calendarModal.style.top = '0';
    calendarModal.style.left = '0';
    calendarModal.style.width = '100%';
    calendarModal.style.height = '100%';
    calendarModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    calendarModal.style.display = 'none';
    calendarModal.style.justifyContent = 'center';
    calendarModal.style.alignItems = 'center';
    calendarModal.style.zIndex = '900'; // Lower than employee history modal
    calendarModal.style.backdropFilter = 'blur(3px)';

    // Create calendar container
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';
    calendarContainer.style.backgroundColor = 'white';
    calendarContainer.style.padding = '20px';
    calendarContainer.style.borderRadius = '8px';
    calendarContainer.style.minWidth = '1020px';
    calendarContainer.style.maxHeight = '85vh';
    calendarContainer.style.overflowY = 'auto';
    calendarContainer.style.position = 'relative';
    calendarContainer.style.zIndex = '901'; // Just above the modal background

    // Function to open shift scheduling modal
    async function openShiftSchedulingModal(dateStr, year, month, day, shiftClassification = null) {
        // Store current calendar state before opening modal
        storeCurrentCalendarState();
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'shift-scheduling-overlay';
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

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'shift-scheduling-modal';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '30px';
        modal.style.borderRadius = '10px';
        modal.style.minWidth = '400px';
        modal.style.maxWidth = '500px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.position = 'relative';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '20px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.onclick = () => {
            document.body.removeChild(overlay);
        };

        // Create title
        const title = document.createElement('h2');
        title.textContent = `Schedule Shift - ${new Date(year, month, day).toLocaleDateString()}`;
        title.style.marginBottom = '25px';
        title.style.color = 'var(--primary)';
        title.style.textAlign = 'center';

        // Create form
        const form = document.createElement('div');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '20px';

        // Employee selection
        const employeeSection = document.createElement('div');
        employeeSection.style.display = 'flex';
        employeeSection.style.flexDirection = 'column';
        employeeSection.style.gap = '8px';

        const employeeLabel = document.createElement('label');
        employeeLabel.textContent = 'Select Employee:';
        employeeLabel.style.fontWeight = 'bold';
        employeeLabel.style.color = '#333';

        const employeeSelect = document.createElement('select');
        employeeSelect.id = 'employeeSelect';
        employeeSelect.style.padding = '12px';
        employeeSelect.style.border = '1px solid #e0e0e0';
        employeeSelect.style.borderRadius = '8px';
        employeeSelect.style.fontSize = '16px';
        employeeSelect.style.backgroundColor = 'white';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose an employee...';
        employeeSelect.appendChild(defaultOption);

        // Fetch employees and populate dropdown
        try {
            const employeesSnapshot = await getDocs(collection(db, 'employees'));
            employeesSnapshot.forEach(doc => {
                const employeeData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = employeeData.name;
                employeeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
        }

        employeeSection.appendChild(employeeLabel);
        employeeSection.appendChild(employeeSelect);

        // Shift classification selection
        const classificationSection = document.createElement('div');
        classificationSection.style.display = 'flex';
        classificationSection.style.flexDirection = 'column';
        classificationSection.style.gap = '8px';

        const classificationLabel = document.createElement('label');
        classificationLabel.textContent = 'Shift Classification:';
        classificationLabel.style.fontWeight = 'bold';
        classificationLabel.style.color = '#333';

        const classificationSelect = document.createElement('select');
        classificationSelect.id = 'classificationSelect';
        classificationSelect.style.padding = '12px';
        classificationSelect.style.border = '1px solid #e0e0e0';
        classificationSelect.style.borderRadius = '8px';
        classificationSelect.style.fontSize = '16px';
        classificationSelect.style.backgroundColor = 'white';

        // Add shift classifications with default times
        const shiftClassifications = [
            { name: 'Cafe Open', startTime: '07:30', endTime: '11:30' },
            { name: 'Cafe Morning', startTime: '09:00', endTime: '13:00' },
            { name: 'Cafe Afternoon', startTime: '13:00', endTime: '16:00' },
            { name: 'Cafe Close', startTime: '14:00', endTime: '18:00' },
            { name: 'TEN Cleaning 1', startTime: '10:00', endTime: '14:00' },
            { name: 'TEN Cleaning 2', startTime: '10:00', endTime: '14:00' }
        ];

        // Add default option
        const defaultClassificationOption = document.createElement('option');
        defaultClassificationOption.value = '';
        defaultClassificationOption.textContent = 'Choose shift type...';
        classificationSelect.appendChild(defaultClassificationOption);

        // Add classification options
        shiftClassifications.forEach(classification => {
            const option = document.createElement('option');
            option.value = classification.name;
            option.textContent = classification.name;
            if (shiftClassification && classification.name === shiftClassification) {
                option.selected = true;
            }
            classificationSelect.appendChild(option);
        });

        classificationSection.appendChild(classificationLabel);
        classificationSection.appendChild(classificationSelect);

        // Time selection container
        const timeContainer = document.createElement('div');
        timeContainer.style.display = 'flex';
        timeContainer.style.gap = '15px';

        // Start time selection
        const startTimeSection = document.createElement('div');
        startTimeSection.style.display = 'flex';
        startTimeSection.style.flexDirection = 'column';
        startTimeSection.style.gap = '8px';
        startTimeSection.style.flex = '1';

        const startTimeLabel = document.createElement('label');
        startTimeLabel.textContent = 'Start Time:';
        startTimeLabel.style.fontWeight = 'bold';
        startTimeLabel.style.color = '#333';

        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.id = 'startTimeInput';
        startTimeInput.style.padding = '12px';
        startTimeInput.style.border = '1px solid #e0e0e0';
        startTimeInput.style.borderRadius = '8px';
        startTimeInput.style.fontSize = '16px';
        startTimeInput.style.backgroundColor = 'white';

        startTimeSection.appendChild(startTimeLabel);
        startTimeSection.appendChild(startTimeInput);

        // End time selection
        const endTimeSection = document.createElement('div');
        endTimeSection.style.display = 'flex';
        endTimeSection.style.flexDirection = 'column';
        endTimeSection.style.gap = '8px';
        endTimeSection.style.flex = '1';

        const endTimeLabel = document.createElement('label');
        endTimeLabel.textContent = 'End Time:';
        endTimeLabel.style.fontWeight = 'bold';
        endTimeLabel.style.color = '#333';

        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.id = 'endTimeInput';
        endTimeInput.style.padding = '12px';
        endTimeInput.style.border = '1px solid #e0e0e0';
        endTimeInput.style.borderRadius = '8px';
        endTimeInput.style.fontSize = '16px';
        endTimeInput.style.backgroundColor = 'white';

        endTimeSection.appendChild(endTimeLabel);
        endTimeSection.appendChild(endTimeInput);

        timeContainer.appendChild(startTimeSection);
        timeContainer.appendChild(endTimeSection);

        // Add event listener to auto-fill times when classification changes
        classificationSelect.addEventListener('change', () => {
            const selectedClassification = shiftClassifications.find(c => c.name === classificationSelect.value);
            if (selectedClassification) {
                startTimeInput.value = selectedClassification.startTime;
                endTimeInput.value = selectedClassification.endTime;
            }
        });

        // Auto-fill times if a classification is pre-selected
        if (shiftClassification) {
            const selectedClassification = shiftClassifications.find(c => c.name === shiftClassification);
            if (selectedClassification) {
                startTimeInput.value = selectedClassification.startTime;
                endTimeInput.value = selectedClassification.endTime;
            }
        }

        // Add form sections
        form.appendChild(employeeSection);
        form.appendChild(classificationSection);
        form.appendChild(timeContainer);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '15px';
        buttonsContainer.style.marginTop = '25px';

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.flex = '1';
        cancelButton.style.padding = '12px';
        cancelButton.style.border = '1px solid #e0e0e0';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.backgroundColor = 'white';
        cancelButton.style.color = '#666';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.fontWeight = 'bold';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
        };

        // Schedule button
        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = 'Schedule Shift';
        scheduleButton.style.flex = '1';
        scheduleButton.style.padding = '12px';
        scheduleButton.style.border = 'none';
        scheduleButton.style.borderRadius = '8px';
        scheduleButton.style.backgroundColor = 'var(--primary)';
        scheduleButton.style.color = 'white';
        scheduleButton.style.cursor = 'pointer';
        scheduleButton.style.fontSize = '16px';
        scheduleButton.style.fontWeight = 'bold';
        scheduleButton.onclick = async () => {
            const selectedEmployeeId = employeeSelect.value;
            const selectedClassification = classificationSelect.value;
            const startTime = startTimeInput.value;
            const endTime = endTimeInput.value;

            if (!selectedEmployeeId || !selectedClassification || !startTime || !endTime) {
                showCustomAlert('Please select an employee, shift classification, start time, and end time.', 'warning');
                return;
            }

            // Validate that end time is after start time
            if (startTime >= endTime) {
                showCustomAlert('End time must be after start time.', 'warning');
                return;
            }

            try {
                // Get employee name
                const employeeDoc = await getDocs(query(collection(db, 'employees'), where('__name__', '==', selectedEmployeeId)));
                const employeeName = employeeDoc.docs[0].data().name;

                // Convert date string to YYYY-MM-DD format
                const firestoreDate = convertToFirestoreDate(dateStr);
                
                // Create shift start and end times
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
                
                const shiftStartTime = new Date(year, month, day, startHour, startMinute);
                const shiftFinishTime = new Date(year, month, day, endHour, endMinute);

                // Create new shift using the new system
                await createNewShift(
                    firestoreDate,
                    selectedClassification,
                    selectedEmployeeId,
                    employeeName,
                    shiftStartTime,
                    shiftFinishTime
                );

                // Also create in old system for compatibility
                await addDoc(collection(db, 'scheduledShifts'), {
                    employeeId: selectedEmployeeId,
                    employeeName: employeeName,
                    date: dateStr,
                    startTime: startTime,
                    endTime: endTime,
                    createdAt: Timestamp.now()
                });

                // Close modal and refresh only the shift data
                document.body.removeChild(overlay);
                
                // Refresh the specific date's shift data without changing calendar position
                const refreshDate = convertToFirestoreDate(dateStr);
                refreshShiftDataForDate(refreshDate);
                
                showCustomAlert('Shift scheduled successfully!', 'success');
            } catch (error) {
                console.error('Error scheduling shift:', error);
                showCustomAlert('Error scheduling shift. Please try again.', 'error');
            }
        };

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(scheduleButton);

        // Assemble modal
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(form);
        modal.appendChild(buttonsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // Add fetchEmployeeHistory function
    async function fetchEmployeeHistory(currentYear, currentMonth) {
            try {
            const monthStr = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit'
                });

                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'employee-history-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                overlay.style.zIndex = '999';
                document.body.appendChild(overlay);

                // Create history popup
                const historyPopup = document.createElement('div');
                historyPopup.className = 'employee-history-popup';
                historyPopup.style.position = 'fixed';
                historyPopup.style.top = '50%';
                historyPopup.style.left = '50%';
                historyPopup.style.transform = 'translate(-50%, -50%)';
                historyPopup.style.backgroundColor = 'white';
                historyPopup.style.padding = '20px';
                historyPopup.style.borderRadius = '10px';
                historyPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                historyPopup.style.zIndex = '1000';
                historyPopup.style.minWidth = '600px';
                historyPopup.style.maxWidth = '90vw';
                historyPopup.style.maxHeight = '90vh';
                historyPopup.style.overflowY = 'auto';

                // Add header
                const header = document.createElement('h2');
            header.textContent = `Employee Work History - ${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
                header.style.color = 'var(--primary)';
                header.style.marginBottom = '20px';
                historyPopup.appendChild(header);

                // Fetch all employee sign-ins for the month
            const startDate = new Date(currentYear, currentMonth, 1);
            const endDate = new Date(currentYear, currentMonth + 1, 0);
                const querySnapshot = await getDocs(query(
                    collection(db, 'employeeSignIns'),
                    where('date', '>=', startDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })),
                    where('date', '<=', endDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
                ));

                // Group sign-ins by employee
                const employeeShifts = {};
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (!employeeShifts[data.employeeName]) {
                        employeeShifts[data.employeeName] = [];
                    }
                    employeeShifts[data.employeeName].push(data);
                });

                // Create employee list
                const employeeList = document.createElement('div');
                employeeList.style.display = 'flex';
                employeeList.style.flexDirection = 'column';
                employeeList.style.gap = '10px';

                Object.keys(employeeShifts).sort().forEach(employeeName => {
                    const employeeButton = document.createElement('button');
                    employeeButton.textContent = employeeName;
                    employeeButton.style.padding = '10px';
                    employeeButton.style.backgroundColor = 'white';
                    employeeButton.style.border = '1px solid #e0e0e0';
                    employeeButton.style.borderRadius = '5px';
                    employeeButton.style.cursor = 'pointer';
                    employeeButton.style.textAlign = 'left';
                    employeeButton.style.transition = 'background-color 0.2s';

                    employeeButton.onmouseover = () => employeeButton.style.backgroundColor = '#f0f0f0';
                    employeeButton.onmouseout = () => employeeButton.style.backgroundColor = 'white';

                    employeeButton.onclick = () => {
                        // Remove any existing shift details
                        const existingDetails = historyPopup.querySelector('.shift-details');
                        if (existingDetails) {
                            historyPopup.removeChild(existingDetails);
                        }

                        // Create shift details container
                        const shiftDetails = document.createElement('div');
                        shiftDetails.className = 'shift-details';
                        shiftDetails.style.marginTop = '20px';
                        shiftDetails.style.padding = '15px';
                        shiftDetails.style.backgroundColor = '#f8f9fa';
                        shiftDetails.style.borderRadius = '5px';

                        const shifts = employeeShifts[employeeName];
                        let totalWorkTime = 0;
                        let totalBreakTime = 0;

                        shifts.forEach(shift => {
                            const shiftDiv = document.createElement('div');
                            shiftDiv.style.marginBottom = '15px';
                            shiftDiv.style.padding = '10px';
                            shiftDiv.style.backgroundColor = 'white';
                            shiftDiv.style.borderRadius = '5px';
                            shiftDiv.style.border = '1px solid #e0e0e0';

                            const signInTime = shift.signInTime.toDate();
                            const endTime = shift.endTime ? shift.endTime.toDate() : new Date();
                            const workDuration = Math.floor((endTime - signInTime) / (1000 * 60));

                            // Calculate break times
                            const breaks = shift.breaks || [];
                            const breakTimes = breaks
                                .filter(b => b.endTime)
                                .map(b => {
                                    const start = b.startTime.toDate();
                                    const end = b.endTime.toDate();
                                    const duration = Math.floor((end - start) / (1000 * 60));
                                    totalBreakTime += duration;
                                    return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${duration}m)`;
                                })
                                .join('<br>');

                            totalWorkTime += workDuration;

                            shiftDiv.innerHTML = `
                                <div style="font-weight: bold;">${shift.date}</div>
                                <div style="color: #666; margin-top: 5px;">
                                    Start: ${signInTime.toLocaleTimeString()}
                                    ${shift.endTime ? `<br>End: ${shift.endTime.toDate().toLocaleTimeString()}` : '<br>Currently working'}
                                    <br>Duration: ${Math.floor(workDuration / 60)}h ${workDuration % 60}m
                                    ${breakTimes ? `<br>Breaks:<br>${breakTimes}` : ''}
                                </div>
                            `;

                            shiftDetails.appendChild(shiftDiv);
                        });

                        // Add totals
                        const totalsDiv = document.createElement('div');
                        totalsDiv.style.marginTop = '20px';
                        totalsDiv.style.padding = '15px';
                        totalsDiv.style.backgroundColor = 'var(--primary)';
                        totalsDiv.style.color = 'white';
                        totalsDiv.style.borderRadius = '5px';
                        totalsDiv.innerHTML = `
                            <div style="font-weight: bold;">Monthly Totals</div>
                            <div style="margin-top: 5px;">
                                Total Work Time: ${Math.floor(totalWorkTime / 60)}h ${totalWorkTime % 60}m
                                <br>Total Break Time: ${Math.floor(totalBreakTime / 60)}h ${totalBreakTime % 60}m
                            </div>
                        `;

                        shiftDetails.appendChild(totalsDiv);
                        
                        // Add payslip generation button
                        if (window.addPayslipButton) {
                            const payslipButton = window.addPayslipButton(employeeName, currentYear, currentMonth);
                            shiftDetails.appendChild(payslipButton);
                        }
                        
                        historyPopup.appendChild(shiftDetails);
                    };

                    employeeList.appendChild(employeeButton);
                });

                historyPopup.appendChild(employeeList);

                // Add close button
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.style.padding = '10px 20px';
                closeButton.style.backgroundColor = '#f0f0f0';
                closeButton.style.border = 'none';
                closeButton.style.borderRadius = '5px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.marginTop = '20px';
                closeButton.style.width = '100%';

                closeButton.onclick = () => {
                    document.body.removeChild(overlay);
                    document.body.removeChild(historyPopup);
                };

                historyPopup.appendChild(closeButton);
                document.body.appendChild(historyPopup);
            } catch (error) {
                console.error('Error fetching employee history:', error);
                showCustomAlert('Error loading employee history. Please try again.', 'error');
            }
    }

    // ===== NEW SHIFTS COLLECTION SYSTEM =====
    
    /**
     * Create a new shift in the shifts collection
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @param {string} shiftClassification - Shift type (Cafe Open, Cafe Morning, etc.)
     * @param {string} employeeId - Employee document ID
     * @param {string} employeeName - Employee name
     * @param {Date} shiftStartTime - Scheduled start time
     * @param {Date} shiftFinishTime - Scheduled end time
     * @returns {Promise<string>} - Shift ID
     */
    async function createNewShift(dateStr, shiftClassification, employeeId, employeeName, shiftStartTime, shiftFinishTime) {
        try {
            const { doc, getDoc, setDoc, Timestamp } = window.firebaseServices;
            
            // Calculate total duration in minutes
            const totalDuration = Math.floor((shiftFinishTime - shiftStartTime) / (1000 * 60));
            
            // Create the shift object
            const newShift = {
                shiftClassification: shiftClassification,
                shiftStartTime: Timestamp.fromDate(shiftStartTime),
                shiftFinishTime: Timestamp.fromDate(shiftFinishTime),
                employeeName: employeeName,
                employeeId: employeeId,
                signInTime: null,
                signOutTime: null,
                breaks: [],
                totalDuration: totalDuration,
                isScheduled: true,
                isCurrent: false,
                isCompleted: false,
                createdAt: Timestamp.now()
            };
            
            // Get or create the date document
            const dateDocRef = doc(db, 'shifts', dateStr);
            const dateDoc = await getDoc(dateDocRef);
            
            if (dateDoc.exists()) {
                // Document exists, add to existing shifts array
                const existingData = dateDoc.data();
                const shifts = existingData.shifts || [];
                shifts.push(newShift);
                
                await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
            } else {
                // Document doesn't exist, create new with this shift
                await setDoc(dateDocRef, { shifts: [newShift] });
            }
            
            console.log('New shift created successfully:', newShift);
            return 'success';
        } catch (error) {
            console.error('Error creating new shift:', error);
            console.error('Error details for createNewShift:', {
                message: error.message,
                stack: error.stack,
                dateStr,
                shiftClassification,
                employeeId,
                employeeName
            });
            throw error;
        }
    }
    
    /**
     * Update shift status when employee signs in
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @param {string} employeeId - Employee document ID
     * @param {Date} signInTime - Actual sign in time
     * @returns {Promise<boolean>} - Success status
     */
    async function updateShiftToCurrent(dateStr, employeeId, signInTime) {
        try {
            const { doc, getDoc, setDoc, Timestamp } = window.firebaseServices;
            
            const dateDocRef = doc(db, 'shifts', dateStr);
            const dateDoc = await getDoc(dateDocRef);
            
            if (!dateDoc.exists()) {
                console.log('No shifts found for date:', dateStr);
                return false;
            }
            
            const data = dateDoc.data();
            const shifts = data.shifts || [];
            
            // Find the scheduled shift for this employee
            const shiftIndex = shifts.findIndex(shift => 
                shift.employeeId === employeeId && 
                shift.isScheduled === true
            );
            
            if (shiftIndex === -1) {
                console.log('No scheduled shift found for employee:', employeeId);
                return false;
            }
            
            // Calculate total duration from sign-in time to now
            const totalDuration = Math.floor((new Date() - signInTime) / (1000 * 60));
            
            // Update the shift status
            shifts[shiftIndex].isScheduled = false;
            shifts[shiftIndex].isCurrent = true;
            shifts[shiftIndex].isCompleted = false;
            shifts[shiftIndex].signInTime = Timestamp.fromDate(signInTime);
            shifts[shiftIndex].totalDuration = totalDuration;
            
            // Save updated shifts
            await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
            
            console.log('Shift updated to current:', shifts[shiftIndex]);
            return true;
        } catch (error) {
            console.error('Error updating shift to current:', error);
            throw error;
        }
    }
    
    /**
     * Complete a shift when employee signs out
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @param {string} employeeId - Employee document ID
     * @param {Date} signOutTime - Actual sign out time
     * @returns {Promise<boolean>} - Success status
     */
    async function completeShift(dateStr, employeeId, signOutTime) {
        try {
            const { doc, getDoc, setDoc, Timestamp } = window.firebaseServices;
            
            const dateDocRef = doc(db, 'shifts', dateStr);
            const dateDoc = await getDoc(dateDocRef);
            
            if (!dateDoc.exists()) {
                console.log('No shifts found for date:', dateStr);
                return false;
            }
            
            const data = dateDoc.data();
            const shifts = data.shifts || [];
            
            // Find the current shift for this employee
            const shiftIndex = shifts.findIndex(shift => 
                shift.employeeId === employeeId && 
                shift.isCurrent === true
            );
            
            if (shiftIndex === -1) {
                console.log('No current shift found for employee:', employeeId);
                return false;
            }
            
            // Calculate final total duration from sign-in to sign-out
            const signInTime = shifts[shiftIndex].signInTime.toDate();
            const totalDuration = Math.floor((signOutTime - signInTime) / (1000 * 60));
            
            // Update the shift status
            shifts[shiftIndex].isScheduled = false;
            shifts[shiftIndex].isCurrent = false;
            shifts[shiftIndex].isCompleted = true;
            shifts[shiftIndex].signOutTime = Timestamp.fromDate(signOutTime);
            shifts[shiftIndex].totalDuration = totalDuration;
            
            // Save updated shifts
            await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
            
            console.log('Shift completed:', shifts[shiftIndex]);
            return true;
        } catch (error) {
            console.error('Error completing shift:', error);
            throw error;
        }
    }
    
    /**
     * Add a break to a current shift
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @param {string} employeeId - Employee document ID
     * @param {Date} breakStartTime - Break start time
     * @param {Date} breakEndTime - Break end time
     * @returns {Promise<boolean>} - Success status
     */
    async function addBreakToShift(dateStr, employeeId, breakStartTime, breakEndTime) {
        try {
            const { doc, getDoc, setDoc, Timestamp } = window.firebaseServices;
            
            const dateDocRef = doc(db, 'shifts', dateStr);
            const dateDoc = await getDoc(dateDocRef);
            
            if (!dateDoc.exists()) {
                console.log('No shifts found for date:', dateStr);
                return false;
            }
            
            const data = dateDoc.data();
            const shifts = data.shifts || [];
            
            // Find the current shift for this employee
            const shiftIndex = shifts.findIndex(shift => 
                shift.employeeId === employeeId && 
                shift.isCurrent === true
            );
            
            if (shiftIndex === -1) {
                console.log('No current shift found for employee:', employeeId);
                return false;
            }
            
            // Calculate break duration in minutes
            const durationMs = breakEndTime.getTime() - breakStartTime.getTime();
            const durationMinutes = Math.floor(durationMs / (1000 * 60));
            
            // Create break object
            const breakObj = {
                startTime: Timestamp.fromDate(breakStartTime),
                endTime: Timestamp.fromDate(breakEndTime),
                duration: durationMinutes
            };
            
            // Add break to shifts array
            if (!shifts[shiftIndex].breaks) {
                shifts[shiftIndex].breaks = [];
            }
            shifts[shiftIndex].breaks.push(breakObj);
            
            // Save updated shifts
            await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
            
            console.log('Break added to shift:', breakObj);
            return true;
        } catch (error) {
            console.error('Error adding break to shift:', error);
            throw error;
        }
    }
    
    /**
     * Get all shifts for a specific date
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @returns {Promise<Array>} - Array of shifts
     */
    async function getShiftsForDate(dateStr) {
        try {
            const { doc, getDoc } = window.firebaseServices;
            
            const dateDocRef = doc(db, 'shifts', dateStr);
            const dateDoc = await getDoc(dateDocRef);
            
            if (!dateDoc.exists()) {
                return [];
            }
            
            const data = dateDoc.data();
            return data.shifts || [];
        } catch (error) {
            console.error('Error getting shifts for date:', error);
            throw error;
        }
    }
    
    /**
     * Get current shift for an employee
     * @param {string} dateStr - Date in YYYY-MM-DD format
     * @param {string} employeeId - Employee document ID
     * @returns {Promise<Object|null>} - Current shift or null
     */
    async function getCurrentShift(dateStr, employeeId) {
        try {
            const shifts = await getShiftsForDate(dateStr);
            return shifts.find(shift => 
                shift.employeeId === employeeId && 
                shift.isCurrent === true
            ) || null;
        } catch (error) {
            console.error('Error getting current shift:', error);
            throw error;
        }
    }
    
    /**
     * Convert date string to YYYY-MM-DD format
     * @param {string} dateStr - Date in MM/DD/YYYY format
     * @returns {string} - Date in YYYY-MM-DD format
     */
    function convertToFirestoreDate(dateStr) {
        // Handle MM/DD/YYYY format (from toLocaleDateString)
        if (dateStr.includes('/')) {
            const [month, day, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        }
        
        // Handle other formats with Date constructor
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Show shift details modal with edit functionality
     * @param {Object} shift - The shift object
     * @param {string} dateStr - Date string
     * @param {number} year - Year
     * @param {number} month - Month
     * @param {number} day - Day
     */
    function showShiftDetailsModal(shift, dateStr, year, month, day) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'shift-details-overlay';
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

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'shift-details-modal';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '30px';
        modal.style.borderRadius = '10px';
        modal.style.minWidth = '400px';
        modal.style.maxWidth = '500px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.position = 'relative';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '20px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.onclick = () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        // Create title with edit icon
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.marginBottom = '25px';

        const title = document.createElement('h2');
        title.textContent = 'Shift Details';
        title.style.margin = '0';
        title.style.color = 'var(--primary)';
        title.style.fontSize = '24px';

        const editButton = document.createElement('button');
        editButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        editButton.style.border = 'none';
        editButton.style.background = 'none';
        editButton.style.cursor = 'pointer';
        editButton.style.padding = '8px';
        editButton.style.borderRadius = '50%';
        editButton.style.transition = 'background-color 0.2s';
        editButton.style.color = 'var(--primary)';
        editButton.onmouseover = () => {
            editButton.style.backgroundColor = '#f8f9fa';
        };
        editButton.onmouseout = () => {
            editButton.style.backgroundColor = 'transparent';
        };
        editButton.onclick = () => {
            // Close the details modal first
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            // Open edit modal
            openShiftEditModal(shift, dateStr, year, month, day);
        };

        titleContainer.appendChild(title);
        titleContainer.appendChild(editButton);

        // Create content container
        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '15px';

        // Employee section
        const employeeSection = createDetailSection('Employee', shift.employeeName, `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="2"/>
            </svg>
        `);

        // Shift classification section
        const classificationSection = createDetailSection('Shift Type', shift.shiftClassification, `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `);

        // Date section
        const date = new Date(year, month, day);
        const dateSection = createDetailSection('Date', date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }), `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            </svg>
        `);

        // Time section
        const startTime = shift.shiftStartTime.toDate();
        const endTime = shift.shiftFinishTime.toDate();
        const timeSection = createDetailSection('Time', `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `);

        // Status section
        let statusText, statusColor, statusIcon;
        if (shift.isCompleted) {
            statusText = 'Completed';
            statusColor = '#28a745';
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else if (shift.isCurrent) {
            statusText = 'In Progress';
            statusColor = '#ffc107';
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            statusText = 'Scheduled';
            statusColor = '#17a2b8';
            statusIcon = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        const statusSection = createDetailSection('Status', statusText, statusIcon, statusColor);

        // Sign in/out times if available
        if (shift.signInTime) {
            const signInTime = shift.signInTime.toDate();
            const signInSection = createDetailSection('Sign In', signInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `);
            content.appendChild(signInSection);
        }

        if (shift.signOutTime) {
            const signOutTime = shift.signOutTime.toDate();
            const signOutSection = createDetailSection('Sign Out', signOutTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `);
            content.appendChild(signOutSection);
        }

        // Breaks section if any
        if (shift.breaks && shift.breaks.length > 0) {
            const breaksSection = document.createElement('div');
            breaksSection.style.border = '1px solid #e0e0e0';
            breaksSection.style.borderRadius = '8px';
            breaksSection.style.padding = '15px';
            breaksSection.style.backgroundColor = '#f8f9fa';

            const breaksTitle = document.createElement('div');
            breaksTitle.style.display = 'flex';
            breaksTitle.style.alignItems = 'center';
            breaksTitle.style.gap = '8px';
            breaksTitle.style.fontWeight = 'bold';
            breaksTitle.style.marginBottom = '10px';
            breaksTitle.style.color = '#333';
            breaksTitle.style.fontSize = '14px';
            breaksTitle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Breaks
            `;

            const breaksList = document.createElement('div');
            breaksList.style.display = 'flex';
            breaksList.style.flexDirection = 'column';
            breaksList.style.gap = '8px';

            shift.breaks.forEach((breakItem, index) => {
                const breakStart = breakItem.startTime.toDate();
                const breakEnd = breakItem.endTime.toDate();
                const breakDisplay = document.createElement('div');
                breakDisplay.style.fontSize = '14px';
                breakDisplay.style.color = '#666';
                breakDisplay.textContent = `${breakStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${breakEnd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (${breakItem.duration}m)`;
                breaksList.appendChild(breakDisplay);
            });

            breaksSection.appendChild(breaksTitle);
            breaksSection.appendChild(breaksList);
            content.appendChild(breaksSection);
        }

        // Add all sections to content
        content.appendChild(employeeSection);
        content.appendChild(classificationSection);
        content.appendChild(dateSection);
        content.appendChild(timeSection);
        content.appendChild(statusSection);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '15px';
        buttonsContainer.style.marginTop = '25px';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.flex = '1';
        closeBtn.style.padding = '12px';
        closeBtn.style.border = '1px solid #e0e0e0';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.backgroundColor = 'white';
        closeBtn.style.color = '#666';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.onclick = () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        buttonsContainer.appendChild(closeBtn);

        // Assemble modal
        modal.appendChild(closeButton);
        modal.appendChild(titleContainer);
        modal.appendChild(content);
        modal.appendChild(buttonsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }
        });
    }

    /**
     * Create a detail section for the shift details modal
     * @param {string} label - Section label
     * @param {string} value - Section value
     * @param {string} icon - SVG icon
     * @param {string} color - Optional color for the value
     * @returns {HTMLElement} - The section element
     */
    function createDetailSection(label, value, icon, color = '#333') {
        const section = document.createElement('div');
        section.style.border = '1px solid #e0e0e0';
        section.style.borderRadius = '8px';
        section.style.padding = '15px';
        section.style.backgroundColor = 'white';

        const title = document.createElement('div');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '8px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        title.style.color = '#666';
        title.style.fontSize = '14px';
        title.innerHTML = `${icon} ${label}`;

        const valueDiv = document.createElement('div');
        valueDiv.textContent = value;
        valueDiv.style.fontSize = '16px';
        valueDiv.style.color = color;
        valueDiv.style.fontWeight = '500';

        section.appendChild(title);
        section.appendChild(valueDiv);
        return section;
    }

    /**
     * Open shift edit modal
     * @param {Object} shift - The shift object to edit
     * @param {string} dateStr - Date string
     * @param {number} year - Year
     * @param {number} month - Month
     * @param {number} day - Day
     */
    async function openShiftEditModal(shift, dateStr, year, month, day) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'shift-edit-overlay';
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

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'shift-edit-modal';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '30px';
        modal.style.borderRadius = '10px';
        modal.style.minWidth = '450px';
        modal.style.maxWidth = '550px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.position = 'relative';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '20px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.onclick = () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Edit Shift';
        title.style.marginBottom = '25px';
        title.style.color = 'var(--primary)';
        title.style.textAlign = 'center';

        // Create form
        const form = document.createElement('div');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '20px';

        // Employee selection
        const employeeSection = document.createElement('div');
        employeeSection.style.display = 'flex';
        employeeSection.style.flexDirection = 'column';
        employeeSection.style.gap = '8px';

        const employeeLabel = document.createElement('label');
        employeeLabel.textContent = 'Employee:';
        employeeLabel.style.fontWeight = 'bold';
        employeeLabel.style.color = '#333';

        const employeeSelect = document.createElement('select');
        employeeSelect.id = 'editEmployeeSelect';
        employeeSelect.style.padding = '12px';
        employeeSelect.style.border = '1px solid #e0e0e0';
        employeeSelect.style.borderRadius = '8px';
        employeeSelect.style.fontSize = '16px';
        employeeSelect.style.backgroundColor = 'white';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose an employee...';
        employeeSelect.appendChild(defaultOption);

        // Fetch employees and populate dropdown
        try {
            const employeesSnapshot = await getDocs(collection(db, 'employees'));
            employeesSnapshot.forEach(doc => {
                const employeeData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = employeeData.name;
                // Set current employee as selected
                if (employeeData.name === shift.employeeName) {
                    option.selected = true;
                }
                employeeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
        }

        employeeSection.appendChild(employeeLabel);
        employeeSection.appendChild(employeeSelect);

        // Shift classification selection
        const classificationSection = document.createElement('div');
        classificationSection.style.display = 'flex';
        classificationSection.style.flexDirection = 'column';
        classificationSection.style.gap = '8px';

        const classificationLabel = document.createElement('label');
        classificationLabel.textContent = 'Shift Type:';
        classificationLabel.style.fontWeight = 'bold';
        classificationLabel.style.color = '#333';

        const classificationSelect = document.createElement('select');
        classificationSelect.id = 'editClassificationSelect';
        classificationSelect.style.padding = '12px';
        classificationSelect.style.border = '1px solid #e0e0e0';
        classificationSelect.style.borderRadius = '8px';
        classificationSelect.style.fontSize = '16px';
        classificationSelect.style.backgroundColor = 'white';

        // Add shift classifications with default times
        const shiftClassifications = [
            { name: 'Cafe Open', startTime: '07:30', endTime: '11:30' },
            { name: 'Cafe Morning', startTime: '09:00', endTime: '13:00' },
            { name: 'Cafe Afternoon', startTime: '13:00', endTime: '16:00' },
            { name: 'Cafe Close', startTime: '14:00', endTime: '18:00' },
            { name: 'TEN Cleaning 1', startTime: '10:00', endTime: '14:00' },
            { name: 'TEN Cleaning 2', startTime: '10:00', endTime: '14:00' }
        ];

        // Add default option
        const defaultClassificationOption = document.createElement('option');
        defaultClassificationOption.value = '';
        defaultClassificationOption.textContent = 'Choose shift type...';
        classificationSelect.appendChild(defaultClassificationOption);

        // Add classification options
        shiftClassifications.forEach(classification => {
            const option = document.createElement('option');
            option.value = classification.name;
            option.textContent = classification.name;
            // Set current classification as selected
            if (classification.name === shift.shiftClassification) {
                option.selected = true;
            }
            classificationSelect.appendChild(option);
        });

        classificationSection.appendChild(classificationLabel);
        classificationSection.appendChild(classificationSelect);

        // Time inputs
        const timeSection = document.createElement('div');
        timeSection.style.display = 'flex';
        timeSection.style.flexDirection = 'column';
        timeSection.style.gap = '8px';

        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Time:';
        timeLabel.style.fontWeight = 'bold';
        timeLabel.style.color = '#333';

        const timeInputsContainer = document.createElement('div');
        timeInputsContainer.style.display = 'flex';
        timeInputsContainer.style.gap = '10px';
        timeInputsContainer.style.alignItems = 'center';

        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.id = 'editStartTimeInput';
        startTimeInput.style.padding = '12px';
        startTimeInput.style.border = '1px solid #e0e0e0';
        startTimeInput.style.borderRadius = '8px';
        startTimeInput.style.fontSize = '16px';
        startTimeInput.style.flex = '1';

        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.id = 'editEndTimeInput';
        endTimeInput.style.padding = '12px';
        endTimeInput.style.border = '1px solid #e0e0e0';
        endTimeInput.style.borderRadius = '8px';
        endTimeInput.style.fontSize = '16px';
        endTimeInput.style.flex = '1';

        // Set current times
        const startTime = shift.shiftStartTime.toDate();
        const endTime = shift.shiftFinishTime.toDate();
        startTimeInput.value = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
        endTimeInput.value = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        const timeSeparator = document.createElement('span');
        timeSeparator.textContent = 'to';
        timeSeparator.style.fontWeight = 'bold';
        timeSeparator.style.color = '#666';

        timeInputsContainer.appendChild(startTimeInput);
        timeInputsContainer.appendChild(timeSeparator);
        timeInputsContainer.appendChild(endTimeInput);

        timeSection.appendChild(timeLabel);
        timeSection.appendChild(timeInputsContainer);

        // Auto-fill times when classification changes
        classificationSelect.addEventListener('change', () => {
            const selectedClassification = shiftClassifications.find(c => c.name === classificationSelect.value);
            if (selectedClassification) {
                startTimeInput.value = selectedClassification.startTime;
                endTimeInput.value = selectedClassification.endTime;
            }
        });

        // Add all sections to form
        form.appendChild(employeeSection);
        form.appendChild(classificationSection);
        form.appendChild(timeSection);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '15px';
        buttonsContainer.style.marginTop = '25px';

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.flex = '1';
        cancelBtn.style.padding = '12px';
        cancelBtn.style.border = '1px solid #e0e0e0';
        cancelBtn.style.borderRadius = '8px';
        cancelBtn.style.backgroundColor = 'white';
        cancelBtn.style.color = '#666';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.fontSize = '16px';
        cancelBtn.style.fontWeight = 'bold';
        cancelBtn.onclick = () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.style.flex = '1';
        saveBtn.style.padding = '12px';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '8px';
        saveBtn.style.backgroundColor = 'var(--primary)';
        saveBtn.style.color = 'white';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.fontSize = '16px';
        saveBtn.style.fontWeight = 'bold';
        saveBtn.onclick = async () => {
            // Validate inputs
            if (!employeeSelect.value || !classificationSelect.value || !startTimeInput.value || !endTimeInput.value) {
                showCustomAlert('Please fill in all fields', 'error');
                return;
            }

            // Get selected employee name
            const selectedEmployeeOption = employeeSelect.options[employeeSelect.selectedIndex];
            const selectedEmployeeName = selectedEmployeeOption.textContent;

            // Create new shift object with updated values
            const updatedShift = {
                ...shift,
                employeeName: selectedEmployeeName,
                employeeId: employeeSelect.value,
                shiftClassification: classificationSelect.value,
                shiftStartTime: new Date(year, month, day, parseInt(startTimeInput.value.split(':')[0]), parseInt(startTimeInput.value.split(':')[1])),
                shiftFinishTime: new Date(year, month, day, parseInt(endTimeInput.value.split(':')[0]), parseInt(endTimeInput.value.split(':')[1]))
            };

            try {
                // Update the shift in Firestore
                const firestoreDate = convertToFirestoreDate(dateStr);
                await updateShiftInFirestore(firestoreDate, shift.employeeId, updatedShift);
                
                // Close modal
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                
                // Refresh the calendar to show updated shift
                displayWeekView(month, year);
                
                showCustomAlert('Shift updated successfully!', 'success');
            } catch (error) {
                console.error('Error updating shift:', error);
                showCustomAlert('Error updating shift. Please try again.', 'error');
            }
        };

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Shift';
        deleteBtn.style.flex = '1';
        deleteBtn.style.padding = '12px';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '8px';
        deleteBtn.style.backgroundColor = '#dc3545';
        deleteBtn.style.color = 'white';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.onclick = async () => {
            // Confirm deletion
            if (!confirm('Are you sure you want to delete this shift? This action cannot be undone.')) {
                return;
            }

            try {
                // Delete the shift from Firestore
                const firestoreDate = convertToFirestoreDate(dateStr);
                await deleteShiftFromFirestore(firestoreDate, shift.employeeId);
                
                // Close modal
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                
                // Refresh the calendar to show updated shift
                displayWeekView(month, year);
                
                showCustomAlert('Shift deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting shift:', error);
                showCustomAlert('Error deleting shift. Please try again.', 'error');
            }
        };

        buttonsContainer.appendChild(cancelBtn);
        buttonsContainer.appendChild(deleteBtn);
        buttonsContainer.appendChild(saveBtn);

        // Assemble modal
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(form);
        modal.appendChild(buttonsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }
        });
    }

    /**
     * Update shift in Firestore
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @param {string} employeeId - Employee ID
     * @param {Object} updatedShift - Updated shift object
     */
    async function updateShiftInFirestore(dateStr, employeeId, updatedShift) {
        const docRef = doc(db, 'shifts', dateStr);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const shifts = docSnap.data().shifts || [];
            const shiftIndex = shifts.findIndex(s => s.employeeId === employeeId);
            
            if (shiftIndex !== -1) {
                // Update the existing shift
                shifts[shiftIndex] = updatedShift;
                await setDoc(docRef, { shifts: shifts });
            } else {
                throw new Error('Shift not found');
            }
        } else {
            throw new Error('Date document not found');
        }
    }

    /**
     * Delete shift from Firestore
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @param {string} employeeId - Employee ID
     */
    async function deleteShiftFromFirestore(dateStr, employeeId) {
        const docRef = doc(db, 'shifts', dateStr);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const shifts = docSnap.data().shifts || [];
            const shiftIndex = shifts.findIndex(s => s.employeeId === employeeId);
            
            if (shiftIndex !== -1) {
                // Remove the shift from the array
                shifts.splice(shiftIndex, 1);
                
                // If no shifts left for this date, delete the entire document
                if (shifts.length === 0) {
                    await deleteDoc(docRef);
                } else {
                    // Update the document with the remaining shifts
                    await setDoc(docRef, { shifts: shifts });
                }
            } else {
                throw new Error('Shift not found');
            }
        } else {
            throw new Error('Date document not found');
        }
    }

    /**
     * Clean up all modal elements and restore main interface
     */
    function cleanupAllModals() {
        // Remove all calendar-related elements
        const calendarOverlays = document.querySelectorAll('.calendar-overlay');
        calendarOverlays.forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        
        const calendars = document.querySelectorAll('.calendar');
        calendars.forEach(calendar => {
            if (calendar && calendar.parentNode) {
                calendar.parentNode.removeChild(calendar);
            }
        });
        
        // Remove all shift-related modals
        const shiftOverlays = document.querySelectorAll('.shift-details-overlay, .shift-edit-overlay');
        shiftOverlays.forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        
        // Ensure main interface is visible
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.style.display = 'block';
            mainContainer.style.visibility = 'visible';
        }
        
        // Force a repaint
        document.body.style.overflow = 'auto';
    }

    /**
     * Show add employee modal
     */
    function showAddEmployeeModal() {
        // Show setup modal
        const setupModal = document.createElement('div');
        setupModal.className = 'modal';
        setupModal.style.display = 'flex';
        setupModal.style.position = 'fixed';
        setupModal.style.top = '0';
        setupModal.style.left = '0';
        setupModal.style.width = '100%';
        setupModal.style.height = '100%';
        setupModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        setupModal.style.zIndex = '1000';
        setupModal.style.alignItems = 'center';
        setupModal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.padding = '20px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Setup New Employee';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = 'var(--primary)';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Employee Name';
        nameInput.style.width = '100%';
        nameInput.style.padding = '10px';
        nameInput.style.marginBottom = '15px';
        nameInput.style.border = '1px solid #e0e0e0';
        nameInput.style.borderRadius = '8px';
        nameInput.style.fontSize = '16px';

        const wageInput = document.createElement('input');
        wageInput.type = 'number';
        wageInput.placeholder = 'Hourly Wage (円)';
        wageInput.style.width = '100%';
        wageInput.style.padding = '10px';
        wageInput.style.marginBottom = '15px';
        wageInput.style.border = '1px solid #e0e0e0';
        wageInput.style.borderRadius = '8px';
        wageInput.style.fontSize = '16px';

        const setupPinDisplayContainer = document.createElement('div');
        setupPinDisplayContainer.className = 'payment-details';
        setupPinDisplayContainer.style.background = 'var(--light)';
        setupPinDisplayContainer.style.padding = '15px';
        setupPinDisplayContainer.style.borderRadius = '8px';
        setupPinDisplayContainer.style.margin = '20px 0';

        const setupPinDisplay = document.createElement('div');
        setupPinDisplay.id = 'setupPinDisplay';
        setupPinDisplay.className = 'total-amount';
        setupPinDisplay.style.fontSize = '24px';
        setupPinDisplay.style.fontWeight = 'bold';
        setupPinDisplay.style.color = 'var(--primary)';
        setupPinDisplay.style.marginBottom = '15px';
        setupPinDisplay.style.textAlign = 'center';
        setupPinDisplay.style.letterSpacing = '5px';
        setupPinDisplay.textContent = '----';

        setupPinDisplayContainer.appendChild(setupPinDisplay);

        const setupKeypad = document.createElement('div');
        setupKeypad.className = 'numpad';
        setupKeypad.style.display = 'grid';
        setupKeypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
        setupKeypad.style.gap = '10px';

        let setupPin = '';
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

        numbers.forEach(num => {
            if (num === '') {
                const emptyBtn = document.createElement('div');
                emptyBtn.style.height = '50px';
                setupKeypad.appendChild(emptyBtn);
            } else {
                const btn = document.createElement('button');
                btn.textContent = num;
                btn.style.padding = '15px';
                btn.style.border = '1px solid #e0e0e0';
                btn.style.borderRadius = '8px';
                btn.style.backgroundColor = 'white';
                btn.style.fontSize = '18px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';

                btn.onclick = () => {
                    if (num === '⌫') {
                        setupPin = setupPin.slice(0, -1);
                    } else if (setupPin.length < 4) {
                        setupPin += num;
                    }
                    setupPinDisplay.textContent = setupPin.padEnd(4, '-');
                };

                setupKeypad.appendChild(btn);
            }
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Employee';
        saveButton.style.width = '100%';
        saveButton.style.padding = '15px';
        saveButton.style.backgroundColor = 'var(--primary)';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '8px';
        saveButton.style.fontSize = '16px';
        saveButton.style.fontWeight = 'bold';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginTop = '20px';

        saveButton.onclick = async () => {
            if (!nameInput.value || !wageInput.value || setupPin.length !== 4) {
                showCustomAlert('Please fill in all fields and set a 4-digit PIN', 'error');
                return;
            }

            try {
                const employeeData = {
                    name: nameInput.value,
                    wage: parseFloat(wageInput.value),
                    pin: setupPin
                };

                await addDoc(collection(db, 'employees'), employeeData);
                showCustomAlert('Employee added successfully!', 'success');
                setupModal.remove();
            } catch (error) {
                console.error('Error adding employee:', error);
                showCustomAlert('Error adding employee. Please try again.', 'error');
            }
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cancel';
        closeButton.style.width = '100%';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = 'white';
        closeButton.style.color = '#666';
        closeButton.style.border = '1px solid #e0e0e0';
        closeButton.style.borderRadius = '8px';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '10px';

        closeButton.onclick = () => {
            setupModal.remove();
        };

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(nameInput);
        modalContent.appendChild(wageInput);
        modalContent.appendChild(setupPinDisplayContainer);
        modalContent.appendChild(setupKeypad);
        modalContent.appendChild(saveButton);
        modalContent.appendChild(closeButton);
        setupModal.appendChild(modalContent);
        document.body.appendChild(setupModal);
    }

    /**
     * Show unscheduled shift keypad
     */
    function showUnscheduledShiftKeypad() {
        const keypadModal = document.createElement('div');
        keypadModal.className = 'keypad-modal';
        keypadModal.style.display = 'flex';
        keypadModal.style.position = 'fixed';
        keypadModal.style.top = '0';
        keypadModal.style.left = '0';
        keypadModal.style.width = '100%';
        keypadModal.style.height = '100%';
        keypadModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        keypadModal.style.zIndex = '1000';
        keypadModal.style.alignItems = 'center';
        keypadModal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '400px';
        modalContent.style.padding = '30px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Unscheduled Shift Sign-in';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = 'var(--primary)';
        modalTitle.style.textAlign = 'center';

        const pinDisplay = document.createElement('div');
        pinDisplay.id = 'unscheduledPinDisplay';
        pinDisplay.style.fontSize = '32px';
        pinDisplay.style.fontWeight = 'bold';
        pinDisplay.style.color = 'var(--primary)';
        pinDisplay.style.textAlign = 'center';
        pinDisplay.style.marginBottom = '20px';
        pinDisplay.style.letterSpacing = '8px';
        pinDisplay.style.padding = '20px';
        pinDisplay.style.backgroundColor = 'var(--light)';
        pinDisplay.style.borderRadius = '8px';
        pinDisplay.textContent = '----';

        const keypad = document.createElement('div');
        keypad.style.display = 'grid';
        keypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
        keypad.style.gap = '15px';

        let inputPin = '';
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

        numbers.forEach(num => {
            if (num === '') {
                const emptyBtn = document.createElement('div');
                emptyBtn.style.height = '60px';
                keypad.appendChild(emptyBtn);
            } else {
                const btn = document.createElement('button');
                btn.textContent = num;
                btn.style.padding = '20px';
                btn.style.border = '1px solid #e0e0e0';
                btn.style.borderRadius = '8px';
                btn.style.backgroundColor = 'white';
                btn.style.fontSize = '20px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';

                btn.onclick = async () => {
                    if (num === '⌫') {
                        inputPin = inputPin.slice(0, -1);
                    } else if (inputPin.length < 4) {
                        inputPin += num;
                    }
                    pinDisplay.textContent = inputPin.padEnd(4, '-');

                    if (inputPin.length === 4) {
                        // Verify PIN and sign in employee
                        try {
                            const employeesSnapshot = await getDocs(collection(db, 'employees'));
                            let employeeFound = null;
                            
                            employeesSnapshot.forEach(doc => {
                                const employeeData = doc.data();
                                if (employeeData.pin === inputPin) {
                                    employeeFound = { id: doc.id, ...employeeData };
                                }
                            });

                            if (employeeFound) {
                                // Sign in for unscheduled shift
                                const now = new Date();
                                const today = now.toISOString().split('T')[0];
                                
                                const unscheduledShift = {
                                    employeeName: employeeFound.name,
                                    employeeId: employeeFound.id,
                                    shiftClassification: 'Unscheduled',
                                    shiftStartTime: now,
                                    shiftFinishTime: null,
                                    signInTime: now,
                                    signOutTime: null,
                                    breaks: [],
                                    isScheduled: false,
                                    isCurrent: true,
                                    isCompleted: false
                                };

                                await createNewShift(today, 'Unscheduled', employeeFound.id, employeeFound.name, now, null);
                                showCustomAlert(`${employeeFound.name} signed in for unscheduled shift!`, 'success');
                                keypadModal.remove();
                                loadTodayShifts(); // Refresh the shifts list
                            } else {
                                showCustomAlert('Invalid PIN. Please try again.', 'error');
                                inputPin = '';
                                pinDisplay.textContent = '----';
                            }
                        } catch (error) {
                            console.error('Error signing in employee:', error);
                            showCustomAlert('Error signing in. Please try again.', 'error');
                        }
                    }
                };

                keypad.appendChild(btn);
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.width = '100%';
        cancelButton.style.padding = '15px';
        cancelButton.style.backgroundColor = 'white';
        cancelButton.style.color = '#666';
        cancelButton.style.border = '1px solid #e0e0e0';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.marginTop = '20px';

        cancelButton.onclick = () => {
            keypadModal.remove();
        };

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(pinDisplay);
        modalContent.appendChild(keypad);
        modalContent.appendChild(cancelButton);
        keypadModal.appendChild(modalContent);
        document.body.appendChild(keypadModal);
    }

    /**
     * Load and display today's shifts
     */
    async function loadTodayShifts() {
        const shiftsList = document.getElementById('todayShiftsList');
        if (!shiftsList) return;

        shiftsList.innerHTML = '';

        try {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const shifts = await getShiftsForDate(todayStr);

            if (shifts.length === 0) {
                const noShiftsMessage = document.createElement('div');
                noShiftsMessage.textContent = 'No shifts scheduled for today';
                noShiftsMessage.style.textAlign = 'center';
                noShiftsMessage.style.color = '#666';
                noShiftsMessage.style.padding = '40px';
                noShiftsMessage.style.fontStyle = 'italic';
                shiftsList.appendChild(noShiftsMessage);
                return;
            }

            // Group shifts by classification
            const groupedShifts = {};
            shifts.forEach(shift => {
                if (!groupedShifts[shift.shiftClassification]) {
                    groupedShifts[shift.shiftClassification] = [];
                }
                groupedShifts[shift.shiftClassification].push(shift);
            });

            // Display shifts by classification
            Object.keys(groupedShifts).forEach(classification => {
                const classificationGroup = document.createElement('div');
                classificationGroup.style.marginBottom = '20px';

                const classificationTitle = document.createElement('h4');
                classificationTitle.textContent = classification;
                classificationTitle.style.marginBottom = '10px';
                classificationTitle.style.color = 'var(--primary)';
                classificationTitle.style.fontSize = '16px';
                classificationTitle.style.fontWeight = 'bold';

                classificationGroup.appendChild(classificationTitle);

                groupedShifts[classification].forEach(shift => {
                    const shiftCard = document.createElement('div');
                    shiftCard.style.backgroundColor = 'white';
                    shiftCard.style.borderRadius = '8px';
                    shiftCard.style.padding = '15px';
                    shiftCard.style.marginBottom = '10px';
                    shiftCard.style.border = '1px solid #e0e0e0';
                    shiftCard.style.cursor = 'pointer';
                    shiftCard.style.transition = 'all 0.2s';

                    // Set background color based on status
                    if (shift.isCompleted) {
                        shiftCard.style.backgroundColor = '#d4edda';
                        shiftCard.style.borderColor = '#28a745';
                    } else if (shift.isCurrent) {
                        shiftCard.style.backgroundColor = '#fff3cd';
                        shiftCard.style.borderColor = '#ffc107';
                    } else {
                        shiftCard.style.backgroundColor = '#d1ecf1';
                        shiftCard.style.borderColor = '#17a2b8';
                    }

                    shiftCard.onmouseover = () => {
                        shiftCard.style.transform = 'translateY(-2px)';
                        shiftCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    };

                    shiftCard.onmouseout = () => {
                        shiftCard.style.transform = 'translateY(0)';
                        shiftCard.style.boxShadow = 'none';
                    };

                    // Show actual times if shift is in progress or completed, otherwise show scheduled times
                    let timeRange;
                    if (shift.isCompleted) {
                        // For completed shifts, show ONLY actual sign-in and sign-out times
                        const actualStartTime = shift.signInTime ? shift.signInTime.toDate() : shift.shiftStartTime.toDate();
                        const actualEndTime = shift.signOutTime ? shift.signOutTime.toDate() : shift.shiftFinishTime.toDate();
                        timeRange = `${actualStartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${actualEndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                    } else if (shift.isCurrent) {
                        // For in-progress shifts, show actual sign-in time and "Ongoing"
                        const actualStartTime = shift.signInTime ? shift.signInTime.toDate() : shift.shiftStartTime.toDate();
                        timeRange = `${actualStartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Ongoing`;
                    } else {
                        // Show scheduled times for scheduled shifts
                        const startTime = shift.shiftStartTime.toDate();
                        const endTime = shift.shiftFinishTime ? shift.shiftFinishTime.toDate() : null;
                        
                        timeRange = endTime 
                            ? `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                            : `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Ongoing`;
                    }

                    const statusText = shift.isCompleted ? 'Completed' : shift.isCurrent ? 'In Progress' : 'Scheduled';
                    const statusColor = shift.isCompleted ? '#28a745' : shift.isCurrent ? '#ffc107' : '#17a2b8';

                    // Check if employee is currently on break
                    const isOnBreak = shift.breaks && shift.breaks.length > 0 && 
                                     shift.breaks[shift.breaks.length - 1].endTime === null;
                    
                    let breakIndicator = '';
                    if (isOnBreak) {
                        const breakStartTime = shift.breaks[shift.breaks.length - 1].startTime.toDate();
                        const breakStartTimeStr = breakStartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        breakIndicator = `<div style="color: #dc3545; font-weight: bold; font-size: 12px; margin-top: 2px;">ON BREAK (since ${breakStartTimeStr})</div>`;
                    }

                    shiftCard.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${shift.employeeName}</div>
                                <div style="color: #666; font-size: 14px;">${timeRange}</div>
                                ${breakIndicator}
                            </div>
                            <div style="text-align: right;">
                                <div style="color: ${statusColor}; font-weight: bold; font-size: 14px;">${statusText}</div>
                                ${shift.signInTime ? `<div style="color: #666; font-size: 12px;">Signed in: ${shift.signInTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>` : ''}
                                ${shift.breaks && shift.breaks.length > 0 ? `<div style="color: #666; font-size: 12px;">Breaks: ${shift.breaks.length}</div>` : ''}
                            </div>
                        </div>
                    `;

                    // Add click handler for sign in/out
                    shiftCard.onclick = () => {
                        if (shift.isScheduled && !shift.isCurrent && !shift.isCompleted) {
                            // Sign in for scheduled shift
                            showShiftSignInKeypad(shift, todayStr);
                        } else if (shift.isCurrent && !shift.isCompleted) {
                            // Show break options for current shift
                            showBreakOptionsModal(shift, todayStr);
                        }
                    };

                    classificationGroup.appendChild(shiftCard);
                });

                shiftsList.appendChild(classificationGroup);
            });

        } catch (error) {
            console.error('Error loading today\'s shifts:', error);
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Error loading shifts. Please try again.';
            errorMessage.style.textAlign = 'center';
            errorMessage.style.color = '#dc3545';
            errorMessage.style.padding = '40px';
            shiftsList.appendChild(errorMessage);
        }
    }

    /**
     * Show shift sign-in keypad
     */
    function showShiftSignInKeypad(shift, dateStr) {
        const keypadModal = document.createElement('div');
        keypadModal.className = 'keypad-modal';
        keypadModal.style.display = 'flex';
        keypadModal.style.position = 'fixed';
        keypadModal.style.top = '0';
        keypadModal.style.left = '0';
        keypadModal.style.width = '100%';
        keypadModal.style.height = '100%';
        keypadModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        keypadModal.style.zIndex = '1000';
        keypadModal.style.alignItems = 'center';
        keypadModal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '400px';
        modalContent.style.padding = '30px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = `Sign In - ${shift.employeeName}`;
        modalTitle.style.marginBottom = '10px';
        modalTitle.style.color = 'var(--primary)';
        modalTitle.style.textAlign = 'center';

        const shiftInfo = document.createElement('div');
        shiftInfo.textContent = `${shift.shiftClassification} - ${shift.shiftStartTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${shift.shiftFinishTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        shiftInfo.style.textAlign = 'center';
        shiftInfo.style.color = '#666';
        shiftInfo.style.marginBottom = '20px';
        shiftInfo.style.fontSize = '14px';

        const pinDisplay = document.createElement('div');
        pinDisplay.id = 'shiftSignInPinDisplay';
        pinDisplay.style.fontSize = '32px';
        pinDisplay.style.fontWeight = 'bold';
        pinDisplay.style.color = 'var(--primary)';
        pinDisplay.style.textAlign = 'center';
        pinDisplay.style.marginBottom = '20px';
        pinDisplay.style.letterSpacing = '8px';
        pinDisplay.style.padding = '20px';
        pinDisplay.style.backgroundColor = 'var(--light)';
        pinDisplay.style.borderRadius = '8px';
        pinDisplay.textContent = '----';

        const keypad = document.createElement('div');
        keypad.style.display = 'grid';
        keypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
        keypad.style.gap = '15px';

        let inputPin = '';
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

        numbers.forEach(num => {
            if (num === '') {
                const emptyBtn = document.createElement('div');
                emptyBtn.style.height = '60px';
                keypad.appendChild(emptyBtn);
            } else {
                const btn = document.createElement('button');
                btn.textContent = num;
                btn.style.padding = '20px';
                btn.style.border = '1px solid #e0e0e0';
                btn.style.borderRadius = '8px';
                btn.style.backgroundColor = 'white';
                btn.style.fontSize = '20px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';

                btn.onclick = async () => {
                    if (num === '⌫') {
                        inputPin = inputPin.slice(0, -1);
                    } else if (inputPin.length < 4) {
                        inputPin += num;
                    }
                    pinDisplay.textContent = inputPin.padEnd(4, '-');

                    if (inputPin.length === 4) {
                        // Verify PIN matches the employee
                        try {
                            const employeeDoc = await getDoc(doc(db, 'employees', shift.employeeId));
                            if (employeeDoc.exists() && employeeDoc.data().pin === inputPin) {
                                // Sign in the employee
                                const now = new Date();
                                await updateShiftToCurrent(dateStr, shift.employeeId, now);
                                showCustomAlert(`${shift.employeeName} signed in successfully!`, 'success');
                                keypadModal.remove();
                                loadTodayShifts(); // Refresh the shifts list
                            } else {
                                showCustomAlert('Invalid PIN. Please try again.', 'error');
                                inputPin = '';
                                pinDisplay.textContent = '----';
                            }
                        } catch (error) {
                            console.error('Error signing in employee:', error);
                            showCustomAlert('Error signing in. Please try again.', 'error');
                        }
                    }
                };

                keypad.appendChild(btn);
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.width = '100%';
        cancelButton.style.padding = '15px';
        cancelButton.style.backgroundColor = 'white';
        cancelButton.style.color = '#666';
        cancelButton.style.border = '1px solid #e0e0e0';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.marginTop = '20px';

        cancelButton.onclick = () => {
            keypadModal.remove();
        };

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(shiftInfo);
        modalContent.appendChild(pinDisplay);
        modalContent.appendChild(keypad);
        modalContent.appendChild(cancelButton);
        keypadModal.appendChild(modalContent);
        document.body.appendChild(keypadModal);
    }

    /**
     * Show shift sign-out keypad
     */
    function showShiftSignOutKeypad(shift, dateStr) {
        const keypadModal = document.createElement('div');
        keypadModal.className = 'keypad-modal';
        keypadModal.style.display = 'flex';
        keypadModal.style.position = 'fixed';
        keypadModal.style.top = '0';
        keypadModal.style.left = '0';
        keypadModal.style.width = '100%';
        keypadModal.style.height = '100%';
        keypadModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        keypadModal.style.zIndex = '1000';
        keypadModal.style.alignItems = 'center';
        keypadModal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '400px';
        modalContent.style.padding = '30px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = `Sign Out - ${shift.employeeName}`;
        modalTitle.style.marginBottom = '10px';
        modalTitle.style.color = 'var(--primary)';
        modalTitle.style.textAlign = 'center';

        const shiftInfo = document.createElement('div');
        shiftInfo.textContent = `${shift.shiftClassification} - ${shift.shiftStartTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${shift.shiftFinishTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        shiftInfo.style.textAlign = 'center';
        shiftInfo.style.color = '#666';
        shiftInfo.style.marginBottom = '20px';
        shiftInfo.style.fontSize = '14px';

        const pinDisplay = document.createElement('div');
        pinDisplay.id = 'shiftSignOutPinDisplay';
        pinDisplay.style.fontSize = '32px';
        pinDisplay.style.fontWeight = 'bold';
        pinDisplay.style.color = 'var(--primary)';
        pinDisplay.style.textAlign = 'center';
        pinDisplay.style.marginBottom = '20px';
        pinDisplay.style.letterSpacing = '8px';
        pinDisplay.style.padding = '20px';
        pinDisplay.style.backgroundColor = 'var(--light)';
        pinDisplay.style.borderRadius = '8px';
        pinDisplay.textContent = '----';

        const keypad = document.createElement('div');
        keypad.style.display = 'grid';
        keypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
        keypad.style.gap = '15px';

        let inputPin = '';
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

        numbers.forEach(num => {
            if (num === '') {
                const emptyBtn = document.createElement('div');
                emptyBtn.style.height = '60px';
                keypad.appendChild(emptyBtn);
            } else {
                const btn = document.createElement('button');
                btn.textContent = num;
                btn.style.padding = '20px';
                btn.style.border = '1px solid #e0e0e0';
                btn.style.borderRadius = '8px';
                btn.style.backgroundColor = 'white';
                btn.style.fontSize = '20px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';

                btn.onclick = async () => {
                    if (num === '⌫') {
                        inputPin = inputPin.slice(0, -1);
                    } else if (inputPin.length < 4) {
                        inputPin += num;
                    }
                    pinDisplay.textContent = inputPin.padEnd(4, '-');

                    if (inputPin.length === 4) {
                        // Verify PIN matches the employee
                        try {
                            const employeeDoc = await getDoc(doc(db, 'employees', shift.employeeId));
                            if (employeeDoc.exists() && employeeDoc.data().pin === inputPin) {
                                // Sign out the employee
                                const now = new Date();
                                await completeShift(dateStr, shift.employeeId, now);
                                showCustomAlert(`${shift.employeeName} signed out successfully!`, 'success');
                                keypadModal.remove();
                                loadTodayShifts(); // Refresh the shifts list
                            } else {
                                showCustomAlert('Invalid PIN. Please try again.', 'error');
                                inputPin = '';
                                pinDisplay.textContent = '----';
                            }
                        } catch (error) {
                            console.error('Error signing out employee:', error);
                            showCustomAlert('Error signing out. Please try again.', 'error');
                        }
                    }
                };

                keypad.appendChild(btn);
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.width = '100%';
        cancelButton.style.padding = '15px';
        cancelButton.style.backgroundColor = 'white';
        cancelButton.style.color = '#666';
        cancelButton.style.border = '1px solid #e0e0e0';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.marginTop = '20px';

        cancelButton.onclick = () => {
            keypadModal.remove();
        };

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(shiftInfo);
        modalContent.appendChild(pinDisplay);
        modalContent.appendChild(keypad);
        modalContent.appendChild(cancelButton);
        keypadModal.appendChild(modalContent);
        document.body.appendChild(keypadModal);
    }

    // Load today's shifts when the page loads
    loadTodayShifts();

    /**
     * Show break options modal for current shift
     */
    function showBreakOptionsModal(shift, dateStr) {
        const modal = document.createElement('div');
        modal.className = 'break-options-modal';
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '1000';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '400px';
        modalContent.style.padding = '30px';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = `${shift.employeeName} - Break Options`;
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = 'var(--primary)';
        modalTitle.style.textAlign = 'center';

        const shiftInfo = document.createElement('div');
        shiftInfo.textContent = `${shift.shiftClassification} - ${shift.shiftStartTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${shift.shiftFinishTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        shiftInfo.style.textAlign = 'center';
        shiftInfo.style.color = '#666';
        shiftInfo.style.marginBottom = '20px';
        shiftInfo.style.fontSize = '14px';

        // Check if employee is currently on break
        const isOnBreak = shift.breaks && shift.breaks.length > 0 && 
                         shift.breaks[shift.breaks.length - 1].endTime === null;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'column';
        buttonsContainer.style.gap = '15px';

        if (isOnBreak) {
            // End break button
            const endBreakBtn = document.createElement('button');
            endBreakBtn.textContent = 'End Break';
            endBreakBtn.style.padding = '15px';
            endBreakBtn.style.border = 'none';
            endBreakBtn.style.borderRadius = '8px';
            endBreakBtn.style.backgroundColor = '#28a745';
            endBreakBtn.style.color = 'white';
            endBreakBtn.style.fontSize = '16px';
            endBreakBtn.style.fontWeight = 'bold';
            endBreakBtn.style.cursor = 'pointer';

            endBreakBtn.onclick = async () => {
                try {
                    const now = new Date();
                    await endBreakForShift(dateStr, shift.employeeId, now);
                    showCustomAlert('Break ended successfully!', 'success');
                    modal.remove();
                    loadTodayShifts(); // Refresh the shifts list
                } catch (error) {
                    console.error('Error ending break:', error);
                    showCustomAlert('Error ending break. Please try again.', 'error');
                }
            };

            buttonsContainer.appendChild(endBreakBtn);
        } else {
            // Start break button
            const startBreakBtn = document.createElement('button');
            startBreakBtn.textContent = 'Start Break';
            startBreakBtn.style.padding = '15px';
            startBreakBtn.style.border = 'none';
            startBreakBtn.style.borderRadius = '8px';
            startBreakBtn.style.backgroundColor = '#ffc107';
            startBreakBtn.style.color = 'white';
            startBreakBtn.style.fontSize = '16px';
            startBreakBtn.style.fontWeight = 'bold';
            startBreakBtn.style.cursor = 'pointer';

            startBreakBtn.onclick = async () => {
                try {
                    const now = new Date();
                    await startBreakForShift(dateStr, shift.employeeId, now);
                    showCustomAlert('Break started successfully!', 'success');
                    modal.remove();
                    loadTodayShifts(); // Refresh the shifts list
                } catch (error) {
                    console.error('Error starting break:', error);
                    showCustomAlert('Error starting break. Please try again.', 'error');
                }
            };

            buttonsContainer.appendChild(startBreakBtn);
        }

        // Sign out button
        const signOutBtn = document.createElement('button');
        signOutBtn.textContent = 'Sign Out';
        signOutBtn.style.padding = '15px';
        signOutBtn.style.border = '1px solid #dc3545';
        signOutBtn.style.borderRadius = '8px';
        signOutBtn.style.backgroundColor = 'white';
        signOutBtn.style.color = '#dc3545';
        signOutBtn.style.fontSize = '16px';
        signOutBtn.style.fontWeight = 'bold';
        signOutBtn.style.cursor = 'pointer';

        signOutBtn.onclick = () => {
            modal.remove();
            showShiftSignOutKeypad(shift, dateStr);
        };

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.padding = '15px';
        cancelBtn.style.border = '1px solid #e0e0e0';
        cancelBtn.style.borderRadius = '8px';
        cancelBtn.style.backgroundColor = 'white';
        cancelBtn.style.color = '#666';
        cancelBtn.style.fontSize = '16px';
        cancelBtn.style.fontWeight = 'bold';
        cancelBtn.style.cursor = 'pointer';

        cancelBtn.onclick = () => {
            modal.remove();
        };

        buttonsContainer.appendChild(signOutBtn);
        buttonsContainer.appendChild(cancelBtn);

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(shiftInfo);
        modalContent.appendChild(buttonsContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Start break for a shift
     */
    async function startBreakForShift(dateStr, employeeId, startTime) {
        const docRef = doc(db, 'shifts', dateStr);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const shifts = docSnap.data().shifts || [];
            const shiftIndex = shifts.findIndex(s => s.employeeId === employeeId);
            
            if (shiftIndex !== -1) {
                const shift = shifts[shiftIndex];
                if (!shift.breaks) {
                    shift.breaks = [];
                }
                
                // Add new break
                shift.breaks.push({
                    startTime: startTime,
                    endTime: null,
                    duration: 0
                });
                
                await setDoc(docRef, { shifts: shifts });
            } else {
                throw new Error('Shift not found');
            }
        } else {
            throw new Error('Date document not found');
        }
    }

    /**
     * End break for a shift
     */
    async function endBreakForShift(dateStr, employeeId, endTime) {
        const docRef = doc(db, 'shifts', dateStr);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const shifts = docSnap.data().shifts || [];
            const shiftIndex = shifts.findIndex(s => s.employeeId === employeeId);
            
            if (shiftIndex !== -1) {
                const shift = shifts[shiftIndex];
                if (shift.breaks && shift.breaks.length > 0) {
                    const lastBreak = shift.breaks[shift.breaks.length - 1];
                    if (lastBreak.endTime === null) {
                        lastBreak.endTime = endTime;
                        lastBreak.duration = Math.round((endTime - lastBreak.startTime) / (1000 * 60)); // Duration in minutes
                    }
                }
                
                await setDoc(docRef, { shifts: shifts });
            } else {
                throw new Error('Shift not found');
            }
        } else {
            throw new Error('Date document not found');
            }
    }
}); 
