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
    container.style.gap = '20px';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflowY = 'auto';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-start';

    // Create left side container for sign-in form
    const signInFormContainer = document.createElement('div');
    signInFormContainer.style.flex = '0 0 auto';
    signInFormContainer.style.minWidth = '300px';
    signInFormContainer.style.maxWidth = '500px';
    signInFormContainer.style.marginRight = '40px';

    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Employee Sign-in';
    title.style.marginBottom = '20px';
    title.style.color = 'var(--primary)';

    // Create sign-in log container
    const signInLogContainer = document.createElement('div');
    signInLogContainer.className = 'sign-in-log-container';
    signInLogContainer.style.flex = '0 0 auto';
    signInLogContainer.style.width = '350px'; // Fixed width
    signInLogContainer.style.minWidth = '350px';
    signInLogContainer.style.padding = '15px';
    signInLogContainer.style.backgroundColor = 'var(--light)';
    signInLogContainer.style.borderRadius = '8px';
    signInLogContainer.style.maxHeight = 'calc(100vh - 200px)';
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

    // Create setup button
    const setupButton = document.createElement('button');
    setupButton.textContent = 'Setup New Employee';
    setupButton.className = 'action-btn';
    setupButton.style.backgroundColor = 'var(--primary)';
    setupButton.style.color = 'white';
    setupButton.style.marginBottom = '20px';
    setupButton.style.width = '100%';
    setupButton.style.padding = '12px';
    setupButton.style.border = 'none';
    setupButton.style.borderRadius = '8px';
    setupButton.style.cursor = 'pointer';
    setupButton.style.fontWeight = 'bold';

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
    keypad.style.gap = '20px'; // Increased gap further
    keypad.style.margin = '20px 0';
    keypad.style.maxWidth = '500px'; // Increased max width

    // Create number buttons
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];
    let currentPin = '';

    numbers.forEach(num => {
        const button = document.createElement('button');
        button.className = 'numpad-btn';
        button.textContent = num;
        button.style.padding = '25px'; // Increased padding
        button.style.border = '1px solid #e0e0e0';
        button.style.borderRadius = '12px'; // Increased border radius
        button.style.backgroundColor = 'white';
        button.style.fontSize = '32px'; // Increased font size
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.2s';
        button.style.height = '80px'; // Increased height
        button.style.width = '100%'; // Ensure full width
        
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
    signInFormContainer.appendChild(setupButton);
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
    const { collection, addDoc, Timestamp, getDocs, query, where, orderBy, updateDoc } = window.firebaseServices;

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

            const querySnapshot = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '==', todayStr)
            ));

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
        } catch (error) {
            console.error('Error fetching sign-ins:', error);
            document.getElementById('signInLogList').innerHTML = 
                '<div style="text-align: center; color: red;">Error loading sign-ins</div>';
        }
    }

    // Call displayTodaySignIns initially and set up refresh interval
    displayTodaySignIns();
    setInterval(displayTodaySignIns, 60000); // Refresh every minute

    // Function to close popup
    function closePopup() {
        const popup = document.querySelector('.employee-status-popup');
        const overlay = document.querySelector('.employee-status-overlay');
        if (popup) {
            document.body.removeChild(popup);
        }
        if (overlay) {
            document.body.removeChild(overlay);
        }
        clearPin();
    }

    async function handleSignIn() {
        const pin = document.getElementById('pinDisplay').textContent;
        if (pin.length === 0) return;

        try {
            // Check if employee exists
            const employeeQuery = await getDocs(query(collection(db, 'employees'), where('pin', '==', pin)));
            if (employeeQuery.empty) {
                alert('Invalid PIN');
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

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'employee-status-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '999';
            document.body.appendChild(overlay);

            // Create popup container
            const popup = document.createElement('div');
            popup.className = 'employee-status-popup';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = 'white';
            popup.style.padding = '20px';
            popup.style.borderRadius = '10px';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            popup.style.zIndex = '1000';
            popup.style.minWidth = '300px';

            const popupContent = document.createElement('div');
            popupContent.style.textAlign = 'center';

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.style.position = 'absolute';
            closeButton.style.right = '10px';
            closeButton.style.top = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.fontSize = '24px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.color = '#666';
            closeButton.onclick = closePopup;
            popupContent.appendChild(closeButton);

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

                        // Close popup and refresh
                        closePopup();
                        displayTodaySignIns();
                    } catch (error) {
                        console.error('Error starting shift:', error);
                        alert('Error starting shift. Please try again.');
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
                                closePopup();
                                displayTodaySignIns();
                            } catch (error) {
                                console.error('Error handling break:', error);
                                alert('Error handling break. Please try again.');
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
                                closePopup();
            displayTodaySignIns();
        } catch (error) {
                                console.error('Error starting break:', error);
                                alert('Error starting break. Please try again.');
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
                            closePopup();
                            displayTodaySignIns();
                        } catch (error) {
                            console.error('Error ending shift:', error);
                            alert('Error ending shift. Please try again.');
                        }
                    });

                    buttonContainer.appendChild(endShiftButton);
                    popupContent.appendChild(statusInfo);
                    popupContent.appendChild(buttonContainer);
                } else {
                    popupContent.appendChild(statusInfo);
                }
            }

            popup.appendChild(popupContent);
            document.body.appendChild(popup);

            // Clear PIN after successful sign-in
            clearPin();
        } catch (error) {
            console.error('Error processing sign-in:', error);
            alert('Error processing sign-in. Please try again.');
            clearPin();
        }
    }

    // Setup button click handler
    setupButton.addEventListener('click', () => {
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
    });

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
        // Remove any existing overlays and calendars
        const existingOverlay = document.querySelector('.calendar-overlay');
        const existingCalendar = document.querySelector('.calendar-popup');
        if (existingOverlay) document.body.removeChild(existingOverlay);
        if (existingCalendar) document.body.removeChild(existingCalendar);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'calendar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // Create calendar popup
        const calendar = document.createElement('div');
        calendar.className = 'calendar-popup';
        calendar.style.position = 'fixed';
        calendar.style.top = '50%';
        calendar.style.left = '50%';
        calendar.style.transform = 'translate(-50%, -50%)';
        calendar.style.backgroundColor = 'white';
        calendar.style.padding = '20px';
        calendar.style.borderRadius = '10px';
        calendar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        calendar.style.zIndex = '1000';
        calendar.style.minWidth = '1200px';
        calendar.style.maxWidth = '95vw';
        calendar.style.maxHeight = '90vh';
        calendar.style.overflowY = 'auto';

        // Calendar header with month/year and navigation
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';

        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.style.padding = '10px 20px';
        prevButton.style.backgroundColor = 'var(--primary)';
        prevButton.style.color = 'white';
        prevButton.style.border = 'none';
        prevButton.style.borderRadius = '5px';
        prevButton.style.cursor = 'pointer';
        prevButton.style.fontSize = '20px';

        const monthYear = document.createElement('div');
        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        monthYear.style.fontWeight = 'bold';
        monthYear.style.color = 'var(--primary)';
        monthYear.style.fontSize = '24px';

        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.style.padding = '10px 20px';
        nextButton.style.backgroundColor = 'var(--primary)';
        nextButton.style.color = 'white';
        nextButton.style.border = 'none';
        nextButton.style.borderRadius = '5px';
        nextButton.style.cursor = 'pointer';
        nextButton.style.fontSize = '20px';

        prevButton.onclick = () => {
            if (month === 0) {
                displayCalendar(11, year - 1);
            } else {
                displayCalendar(month - 1, year);
            }
        };

        nextButton.onclick = () => {
            if (month === 11) {
                displayCalendar(0, year + 1);
            } else {
                displayCalendar(month + 1, year);
            }
        };

        header.appendChild(prevButton);
        header.appendChild(monthYear);
        header.appendChild(nextButton);
        calendar.appendChild(header);

        // Days of week header
        const daysHeader = document.createElement('div');
        daysHeader.style.display = 'grid';
        daysHeader.style.gridTemplateColumns = 'repeat(7, 1fr)';
        daysHeader.style.gap = '15px';
        daysHeader.style.marginBottom = '15px';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.style.textAlign = 'center';
            dayElement.style.fontWeight = 'bold';
            dayElement.style.color = 'var(--primary)';
            dayElement.style.fontSize = '20px';
            dayElement.style.padding = '15px';
            daysHeader.appendChild(dayElement);
        });
        calendar.appendChild(daysHeader);

        // Calendar grid
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gap = '15px';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.style.padding = '15px';
            emptyCell.style.textAlign = 'center';
            emptyCell.style.minHeight = '150px';
            emptyCell.style.backgroundColor = '#f5f5f5';
            emptyCell.style.borderRadius = '5px';
            grid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.style.padding = '15px';
            cell.style.textAlign = 'left';
            cell.style.cursor = 'pointer';
            cell.style.borderRadius = '5px';
            cell.style.backgroundColor = 'white';
            cell.style.border = '1px solid #e0e0e0';
            cell.style.minHeight = '150px';
            cell.style.position = 'relative';

            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.textContent = day;
            dayNumber.style.fontWeight = 'bold';
            dayNumber.style.fontSize = '18px';
            dayNumber.style.marginBottom = '10px';
            dayNumber.style.color = 'var(--primary)';
            cell.appendChild(dayNumber);

            // Check if this day has any work records
            const dateStr = new Date(year, month, day).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            // Fetch and display work records for this day
            getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '==', dateStr)
            )).then(querySnapshot => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const record = document.createElement('div');
                        record.style.fontSize = '14px';
                        record.style.marginBottom = '8px';
                        record.style.padding = '8px';
                        record.style.backgroundColor = '#f8f9fa';
                        record.style.borderRadius = '3px';

                        const signInTime = data.signInTime.toDate();
                        const now = new Date();
                        const endTime = data.endTime ? data.endTime.toDate() : now;
                        const duration = Math.floor((endTime - signInTime) / (1000 * 60));

                        // Calculate total break time
                        const totalBreakTime = (data.breaks || [])
                            .filter(b => b.endTime)
                            .reduce((total, b) => {
                                const start = b.startTime.toDate();
                                const end = b.endTime.toDate();
                                return total + Math.floor((end - start) / (1000 * 60));
                            }, 0);

                        record.innerHTML = `
                            <div style="font-weight: bold;">${data.employeeName}</div>
                            <div style="color: #666;">
                                Worked: ${duration}m
                                ${totalBreakTime > 0 ? `<br>Break: ${totalBreakTime}m` : ''}
                            </div>
                        `;

                        cell.appendChild(record);
                    });
                }
            });

            // Highlight current day
            if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                cell.style.backgroundColor = '#e8f4ff';
                cell.style.border = '2px solid var(--primary)';
            }

            grid.appendChild(cell);
        }

        calendar.appendChild(grid);

        // Add Employee History button
        const employeeHistoryButton = document.createElement('button');
        employeeHistoryButton.textContent = 'View Employee History';
        employeeHistoryButton.style.padding = '10px 20px';
        employeeHistoryButton.style.backgroundColor = 'var(--primary)';
        employeeHistoryButton.style.color = 'white';
        employeeHistoryButton.style.border = 'none';
        employeeHistoryButton.style.borderRadius = '5px';
        employeeHistoryButton.style.cursor = 'pointer';
        employeeHistoryButton.style.marginTop = '20px';
        employeeHistoryButton.style.width = '100%';
        employeeHistoryButton.style.marginBottom = '10px';

        employeeHistoryButton.onclick = async () => {
            try {
                const monthStr = new Date(year, month).toLocaleDateString('en-US', { 
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
                header.textContent = `Employee Work History - ${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
                header.style.color = 'var(--primary)';
                header.style.marginBottom = '20px';
                historyPopup.appendChild(header);

                // Fetch all employee sign-ins for the month
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0);
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
                alert('Error loading employee history. Please try again.');
            }
        };

        calendar.appendChild(employeeHistoryButton);

        // Back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = '#f0f0f0';
        backButton.style.color = '#333';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        backButton.style.cursor = 'pointer';
        backButton.style.marginTop = '20px';
        backButton.style.width = '100%';

        backButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(calendar);
        };

        calendar.appendChild(backButton);
        document.body.appendChild(calendar);
    }

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
}); 
