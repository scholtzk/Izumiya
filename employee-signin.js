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
    container.style.gap = '40px';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflowY = 'auto';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';

    // Create left side container for sign-in form
    const signInFormContainer = document.createElement('div');
    signInFormContainer.style.flex = '0 0 400px';
    signInFormContainer.style.minWidth = '300px';
    signInFormContainer.style.maxWidth = '400px';

    // Create sign-in log container
    const signInLogContainer = document.createElement('div');
    signInLogContainer.className = 'sign-in-log-container';
    signInLogContainer.style.flex = '0 0 400px';
    signInLogContainer.style.minWidth = '300px';
    signInLogContainer.style.padding = '15px';
    signInLogContainer.style.backgroundColor = 'var(--light)';
    signInLogContainer.style.borderRadius = '8px';
    signInLogContainer.style.maxHeight = '600px';
    signInLogContainer.style.overflowY = 'auto';

    // Create title container
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'space-between';
    titleContainer.style.alignItems = 'center';
    titleContainer.style.marginBottom = '20px';

    // Create title with calendar icon
    const titleWrapper = document.createElement('div');
    titleWrapper.style.display = 'flex';
    titleWrapper.style.alignItems = 'center';
    titleWrapper.style.gap = '10px';

    const signInLogTitle = document.createElement('h2');
    signInLogTitle.textContent = "Today:";
    signInLogTitle.style.marginBottom = '0';
    signInLogTitle.style.color = 'var(--primary)';

    // Create calendar icon
    const calendarIcon = document.createElement('div');
    calendarIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
    calendarIcon.style.cursor = 'pointer';
    calendarIcon.style.color = 'var(--primary)';
    calendarIcon.style.transition = 'transform 0.2s, color 0.2s';
    calendarIcon.style.marginLeft = 'auto';
    calendarIcon.style.padding = '8px';
    calendarIcon.style.borderRadius = '4px';
    calendarIcon.onmouseover = () => {
        calendarIcon.style.transform = 'scale(1.1)';
        calendarIcon.style.color = 'var(--primary-dark)';
    };
    calendarIcon.onmouseout = () => {
        calendarIcon.style.transform = 'scale(1)';
        calendarIcon.style.color = 'var(--primary)';
    };
    calendarIcon.onclick = () => {
        const today = new Date();
        displayCalendar(today.getMonth(), today.getFullYear());
    };

    titleWrapper.appendChild(signInLogTitle);
    titleContainer.appendChild(titleWrapper);
    titleContainer.appendChild(calendarIcon);

    // Add title container to sign-in log container
    signInLogContainer.appendChild(titleContainer);

    const signInLogList = document.createElement('div');
    signInLogList.id = 'signInLogList';
    signInLogContainer.appendChild(signInLogList);

    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Employee Sign-in';
    title.style.marginBottom = '20px';
    title.style.color = 'var(--primary)';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'space-between';

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
                        saveEmployee(nameInput.value.trim(), setupPin);
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
        modalContent.appendChild(setupPinDisplayContainer);
        modalContent.appendChild(setupKeypad);
        modalContent.appendChild(setupStatus);
        modalContent.appendChild(actionButtons);
        actionButtons.appendChild(cancelButton);
        setupModal.appendChild(modalContent);
        document.body.appendChild(setupModal);
    };

    title.appendChild(setupIcon);

    // Create PIN display container
    const pinDisplayContainer = document.createElement('div');
    pinDisplayContainer.className = 'payment-details';
    pinDisplayContainer.style.background = 'var(--light)';
    pinDisplayContainer.style.padding = '15px';
    pinDisplayContainer.style.borderRadius = '8px';
    pinDisplayContainer.style.margin = '20px 0';

    // Create PIN display
    const pinDisplay = document.createElement('div');
    pinDisplay.id = 'pinDisplay';
    pinDisplay.className = 'total-amount';
    pinDisplay.style.fontSize = '24px';
    pinDisplay.style.fontWeight = 'bold';
    pinDisplay.style.color = 'var(--primary)';
    pinDisplay.style.marginBottom = '15px';
    pinDisplay.style.textAlign = 'center';
    pinDisplay.style.letterSpacing = '5px';
    pinDisplay.textContent = '----';

    pinDisplayContainer.appendChild(pinDisplay);

    // Create keypad
    const keypad = document.createElement('div');
    keypad.className = 'numpad';
    keypad.style.display = 'grid';
    keypad.style.gridTemplateColumns = 'repeat(3, 1fr)';
    keypad.style.gap = '10px';
    keypad.style.margin = '20px 0';
    keypad.style.marginTop = '30px'; // Increased top margin to compensate for removed button

    // Create number buttons
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];
    let currentPin = '';

    numbers.forEach(num => {
        const button = document.createElement('button');
        button.className = 'numpad-btn';
        button.textContent = num;
        button.style.padding = '18px'; // Increased from 15px
        button.style.border = '1px solid #e0e0e0';
        button.style.borderRadius = '8px';
        button.style.backgroundColor = 'white';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.2s';
        button.style.color = '#333';
        button.style.webkitAppearance = 'none';
        button.style.appearance = 'none';
        button.style.textDecoration = 'none';
        
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
                currentPin = '';
                pinDisplay.textContent = '----';
            } else if (num === '✓') {
                if (currentPin.length === 4) {
                    handleSignIn();
                }
            } else if (currentPin.length < 4) {
                currentPin += num;
                pinDisplay.textContent = currentPin.padEnd(4, '-');
            }
        });

        keypad.appendChild(button);
    });

    // Create status message element
    const signInStatus = document.createElement('div');
    signInStatus.id = 'signInStatus';
    signInStatus.style.marginTop = '10px';
    signInStatus.style.textAlign = 'center';
    signInStatus.style.color = '#666';

    // Assemble the form
    signInFormContainer.appendChild(title);
    signInFormContainer.appendChild(pinDisplayContainer);
    signInFormContainer.appendChild(keypad);
    signInFormContainer.appendChild(signInStatus);

    // Add both containers to main container
    container.appendChild(signInFormContainer);
    container.appendChild(signInLogContainer);

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
    const { collection, addDoc, Timestamp, getDocs, query, where, orderBy, updateDoc, deleteDoc } = window.firebaseServices;

    // Function to format time duration
    function formatDuration(startTime) {
        const now = new Date();
        const diff = now - startTime;
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
                        Duration: ${formatDuration(signInTime)}
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
                        <strong>Duration:</strong> ${formatDuration(signInTime)}
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
    async function saveEmployee(name, pin) {
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
                    Duration: ${formatDuration(signInTime)}
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
    async function openShiftSchedulingModal(dateStr, year, month, day) {
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

        // Start time selection
        const timeSection = document.createElement('div');
        timeSection.style.display = 'flex';
        timeSection.style.flexDirection = 'column';
        timeSection.style.gap = '8px';

        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Start Time:';
        timeLabel.style.fontWeight = 'bold';
        timeLabel.style.color = '#333';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.id = 'startTimeInput';
        timeInput.style.padding = '12px';
        timeInput.style.border = '1px solid #e0e0e0';
        timeInput.style.borderRadius = '8px';
        timeInput.style.fontSize = '16px';
        timeInput.style.backgroundColor = 'white';

        timeSection.appendChild(timeLabel);
        timeSection.appendChild(timeInput);

        // Add form sections
        form.appendChild(employeeSection);
        form.appendChild(timeSection);

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
            const startTime = timeInput.value;

            if (!selectedEmployeeId || !startTime) {
                showCustomAlert('Please select an employee and start time.', 'warning');
                return;
            }

            try {
                // Get employee name
                const employeeDoc = await getDocs(query(collection(db, 'employees'), where('__name__', '==', selectedEmployeeId)));
                const employeeName = employeeDoc.docs[0].data().name;

                // Create scheduled shift
                await addDoc(collection(db, 'scheduledShifts'), {
                    employeeId: selectedEmployeeId,
                    employeeName: employeeName,
                    date: dateStr,
                    startTime: startTime,
                    createdAt: Timestamp.now()
                });

                // Close modal and refresh calendar
                document.body.removeChild(overlay);
                displayCalendar(month, year);
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
}); 
