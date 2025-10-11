// Payslip Generator for Employee Sign-in System
window.addEventListener('firebaseReady', function() {
    console.log('Firebase ready, initializing payslip generator...');
    
    // Function to generate payslip for an employee
    async function generatePayslip(employeeName, year, month) {
        try {
            // Show loading message
            showCustomAlert('Generating payslip...', 'info');
            
            const db = window.firebaseDb;
            const { collection, getDocs, query, where } = window.firebaseServices;
            
            // Get the date range for the month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            const startDateStr = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            const endDateStr = endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            
            // Fetch employee sign-ins for the month
            // Use a simpler query to avoid indexing issues
            const querySnapshot = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '>=', startDateStr),
                where('date', '<=', endDateStr)
            ));
            
            // Filter by employee name in JavaScript to avoid indexing issues
            const filteredSnapshot = {
                docs: querySnapshot.docs.filter(doc => doc.data().employeeName === employeeName)
            };
            
            // Calculate work data
            const workData = calculateWorkData(filteredSnapshot);
            
            // Create Excel workbook
            const workbook = createPayslipWorkbook(employeeName, year, month, workData);
            
            // Generate filename
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const filename = `Payslip_${employeeName}_${monthName}_${year}.xlsx`;
            
            // Download the file with formatting preserved
            XLSX.writeFile(workbook, filename, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary',
                cellStyles: true,
                cellDates: true,
                cellNF: true,
                cellHTML: true
            });
            
            showCustomAlert('Payslip generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating payslip:', error);
            showCustomAlert('Error generating payslip. Please try again.', 'error');
        }
    }
    
    // Function to generate payslip using a custom template
    async function generatePayslipFromTemplate(employeeName, year, month, templateFile) {
        try {
            // Show loading message
            showCustomAlert('Loading template and generating payslip...', 'info');
            
            const db = window.firebaseDb;
            const { collection, getDocs, query, where } = window.firebaseServices;
            
            // Get the date range for the month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            const startDateStr = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            const endDateStr = endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            
            // Fetch employee sign-ins for the month
            // Use a simpler query to avoid indexing issues
            const querySnapshot = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '>=', startDateStr),
                where('date', '<=', endDateStr)
            ));
            
            // Filter by employee name in JavaScript to avoid indexing issues
            const filteredSnapshot = {
                docs: querySnapshot.docs.filter(doc => doc.data().employeeName === employeeName)
            };
            
            // Calculate work data
            const workData = calculateWorkData(filteredSnapshot);
            
            // Load template file
            const response = await fetch(templateFile);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { 
                type: 'array',
                cellStyles: true,
                cellDates: true,
                cellNF: true,
                cellHTML: true
            });
            
            // Fill out the template
            fillTemplateWithData(workbook, employeeName, year, month, workData);
            
            // Generate filename
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const filename = `Payslip_${employeeName}_${monthName}_${year}.xlsx`;
            
            // Download the file with formatting preserved
            XLSX.writeFile(workbook, filename, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary',
                cellStyles: true,
                cellDates: true,
                cellNF: true,
                cellHTML: true
            });
            
            showCustomAlert('Payslip generated successfully from template!', 'success');
            
        } catch (error) {
            console.error('Error generating payslip from template:', error);
            showCustomAlert('Error generating payslip from template. Please try again.', 'error');
        }
    }
    
    // Function to fill template with employee data for Japanese payslip
    function fillTemplateWithData(workbook, employeeName, year, month, workData) {
        // Get the first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Format month and year for Japanese format
        const monthStr = (month + 1).toString().padStart(2, '0');
        const nextMonth = month === 11 ? 1 : month + 1;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        const yearStr = year.toString();
        
        // Japanese payslip template fields
        const templateFields = {
            // A2: 給与明細書（２０２５年０X月分）- where X is the month
            'A2': `給与明細書（${yearStr}年${monthStr}月分）`,
            
            // I4: ２０２５年０X月０1日 - Where X is the next month
            'I4': `${yearStr}年${nextMonthStr}月01日`,
            
            // I5: ２０２５年０X月３１日 - where X is this month
            'I5': `${yearStr}年${monthStr}月31日`,
            
            // B11: days/shifts worked
            'B11': workData.monthlyTotals.workDays,
            
            // B13: total hours worked (rounded to nearest 15 minutes per day)
            'B13': calculateRoundedTotalHours(workData.dailyRecords),
            
            // B20: Wage (should be input in employee info) - placeholder for now
            'B20': '要設定', // This will need to be configured with actual wage data
        };
        
        // Fill in the template fields
        Object.keys(templateFields).forEach(cellAddress => {
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].v = templateFields[cellAddress];
            } else {
                // Create cell if it doesn't exist
                worksheet[cellAddress] = { v: templateFields[cellAddress] };
            }
        });
        
        // Add daily records if there's a data table in the template
        // This assumes your template has a table starting at row 25
        let currentRow = 25;
        workData.dailyRecords.forEach(record => {
            const roundedWorkHours = roundToNearestQuarter(parseFloat(record.workHours));
            const roundedBreakHours = roundToNearestQuarter(parseFloat(record.breakHours));
            const roundedNetHours = roundToNearestQuarter(parseFloat(record.netHours));
            
            const rowData = [
                record.date,
                record.signInTime,
                record.endTime,
                roundedWorkHours,
                roundedBreakHours,
                roundedNetHours,
                record.breaks.map(b => {
                    if (b.endTime) {
                        const start = b.startTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        const end = b.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        return `${start}-${end}`;
                    }
                    return '';
                }).filter(detail => detail !== '').join('; ')
            ];
            
            // Fill row data
            rowData.forEach((value, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: currentRow, c: colIndex });
                if (!worksheet[cellAddress]) {
                    worksheet[cellAddress] = { v: value };
                } else {
                    worksheet[cellAddress].v = value;
                }
            });
            
            currentRow++;
        });
    }
    
    // Function to round time to nearest 15 minutes
    function roundToNearestQuarter(hours) {
        const minutes = hours * 60;
        const roundedMinutes = Math.round(minutes / 15) * 15;
        return (roundedMinutes / 60).toFixed(2);
    }
    
    // Function to calculate total hours with rounding to nearest 15 minutes per day
    function calculateRoundedTotalHours(dailyRecords) {
        let totalRoundedHours = 0;
        
        dailyRecords.forEach(record => {
            const netHours = parseFloat(record.netHours);
            const roundedHours = roundToNearestQuarter(netHours);
            totalRoundedHours += parseFloat(roundedHours);
        });
        
        return totalRoundedHours.toFixed(2);
    }
    
    // Function to show template selection modal
    function showTemplateSelectionModal(employeeName, year, month) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'template-selection-overlay';
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
        modal.className = 'template-selection-modal';
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
        title.textContent = 'Generate Payslip';
        title.style.marginBottom = '25px';
        title.style.color = 'var(--primary)';
        title.style.textAlign = 'center';

        // Create options
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexDirection = 'column';
        optionsContainer.style.gap = '15px';

        // Option 1: Generate from scratch
        const option1 = document.createElement('button');
        option1.textContent = 'Generate Standard Payslip';
        option1.style.padding = '15px';
        option1.style.backgroundColor = 'var(--primary)';
        option1.style.color = 'white';
        option1.style.border = 'none';
        option1.style.borderRadius = '8px';
        option1.style.cursor = 'pointer';
        option1.style.fontSize = '16px';
        option1.style.fontWeight = 'bold';
        option1.onclick = () => {
            document.body.removeChild(overlay);
            generatePayslip(employeeName, year, month);
        };

        // Option 2: Use custom template
        const option2 = document.createElement('button');
        option2.textContent = 'Use Custom Template';
        option2.style.padding = '15px';
        option2.style.backgroundColor = '#28a745';
        option2.style.color = 'white';
        option2.style.border = 'none';
        option2.style.borderRadius = '8px';
        option2.style.cursor = 'pointer';
        option2.style.fontSize = '16px';
        option2.style.fontWeight = 'bold';
        option2.onclick = () => {
            // Create file input for template selection
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xlsx,.xls';
            fileInput.style.display = 'none';
            
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                                         reader.onload = async (e) => {
                         try {
                             const arrayBuffer = e.target.result;
                             const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                             
                             // Fetch employee data for the month
                             const db = window.firebaseDb;
                             const { collection, getDocs, query, where } = window.firebaseServices;
                             
                             const startDate = new Date(year, month, 1);
                             const endDate = new Date(year, month + 1, 0);
                             
                             const startDateStr = startDate.toLocaleDateString('en-US', { 
                                 year: 'numeric', 
                                 month: '2-digit', 
                                 day: '2-digit' 
                             });
                             const endDateStr = endDate.toLocaleDateString('en-US', { 
                                 year: 'numeric', 
                                 month: '2-digit', 
                                 day: '2-digit' 
                             });
                             
                             const querySnapshot = await getDocs(query(
                                 collection(db, 'employeeSignIns'),
                                 where('date', '>=', startDateStr),
                                 where('date', '<=', endDateStr)
                             ));
                             
                             // Filter by employee name in JavaScript to avoid indexing issues
                             const filteredSnapshot = {
                                 docs: querySnapshot.docs.filter(doc => doc.data().employeeName === employeeName)
                             };
                             
                             const workData = calculateWorkData(filteredSnapshot);
                             
                             // Fill template with data
                             fillTemplateWithData(workbook, employeeName, year, month, workData);
                             
                             // Generate filename
                             const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
                             const filename = `Payslip_${employeeName}_${monthName}_${year}.xlsx`;
                             
                             // Download the file
                             XLSX.writeFile(workbook, filename);
                             
                             showCustomAlert('Payslip generated successfully from template!', 'success');
                         } catch (error) {
                             console.error('Error processing template:', error);
                             showCustomAlert('Error processing template. Please try again.', 'error');
                         }
                     };
                    reader.readAsArrayBuffer(file);
                }
                document.body.removeChild(overlay);
            };
            
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        };

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '15px';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.color = '#333';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.fontWeight = 'bold';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
        };

        // Assemble modal
        optionsContainer.appendChild(option1);
        optionsContainer.appendChild(option2);
        optionsContainer.appendChild(cancelButton);
        
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(optionsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
    
    // Function to calculate work data from sign-ins
    function calculateWorkData(querySnapshot) {
        const workData = {
            totalWorkDays: 0,
            totalWorkHours: 0,
            totalBreakHours: 0,
            totalNetHours: 0,
            dailyRecords: [],
            monthlyTotals: {
                workDays: 0,
                workHours: 0,
                breakHours: 0,
                netHours: 0
            }
        };
        
        // Handle both QuerySnapshot and filtered object
        const docs = querySnapshot.docs || querySnapshot;
        docs.forEach(doc => {
            const data = doc.data();
            const signInTime = data.signInTime.toDate();
            const endTime = data.endTime ? data.endTime.toDate() : new Date();
            
            // Calculate work duration in hours
            const workDurationMs = endTime - signInTime;
            const workHours = workDurationMs / (1000 * 60 * 60);
            
            // Calculate break duration
            let breakHours = 0;
            if (data.breaks && data.breaks.length > 0) {
                data.breaks.forEach(breakRecord => {
                    if (breakRecord.endTime) {
                        const breakStart = breakRecord.startTime.toDate();
                        const breakEnd = breakRecord.endTime.toDate();
                        const breakDurationMs = breakEnd - breakStart;
                        breakHours += breakDurationMs / (1000 * 60 * 60);
                    }
                });
            }
            
            // Calculate net hours (work hours minus breaks)
            const netHours = workHours - breakHours;
            
            // Add to daily records
            workData.dailyRecords.push({
                date: data.date,
                signInTime: signInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                endTime: data.endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Present',
                workHours: workHours.toFixed(2),
                breakHours: breakHours.toFixed(2),
                netHours: netHours.toFixed(2),
                breaks: data.breaks || []
            });
            
            // Add to totals
            workData.totalWorkDays++;
            workData.totalWorkHours += workHours;
            workData.totalBreakHours += breakHours;
            workData.totalNetHours += netHours;
        });
        
        // Update monthly totals
        workData.monthlyTotals = {
            workDays: workData.totalWorkDays,
            workHours: workData.totalWorkHours,
            breakHours: workData.totalBreakHours,
            netHours: workData.totalNetHours
        };
        
        return workData;
    }
    
    // Function to create Excel workbook with payslip data
    function createPayslipWorkbook(employeeName, year, month, workData) {
        const workbook = XLSX.utils.book_new();
        
        // Create summary sheet
        const summaryData = createSummarySheet(employeeName, year, month, workData);
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        
        // Create detailed records sheet
        const detailedData = createDetailedSheet(employeeName, year, month, workData);
        const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Daily Records');
        
        return workbook;
    }
    
    // Function to create summary sheet
    function createSummarySheet(employeeName, year, month, workData) {
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        
        return [
            ['EMPLOYEE PAYSLIP'],
            [''],
            ['Employee Name:', employeeName],
            ['Period:', `${monthName} ${year}`],
            ['Generated Date:', new Date().toLocaleDateString()],
            [''],
            ['MONTHLY SUMMARY'],
            [''],
            ['Total Work Days:', workData.monthlyTotals.workDays],
            ['Total Work Hours:', workData.monthlyTotals.workHours.toFixed(2)],
            ['Total Break Hours:', workData.monthlyTotals.breakHours.toFixed(2)],
            ['Total Net Hours:', workData.monthlyTotals.netHours.toFixed(2)],
            [''],
            ['Average Hours per Day:', workData.monthlyTotals.workDays > 0 ? 
                (workData.monthlyTotals.netHours / workData.monthlyTotals.workDays).toFixed(2) : '0.00'],
            [''],
            ['Note: This is a work record summary. Please consult with HR for actual pay calculations.']
        ];
    }
    
    // Function to create detailed daily records sheet
    function createDetailedSheet(employeeName, year, month, workData) {
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        
        const headers = [
            'Date',
            'Sign In Time',
            'End Time',
            'Work Hours',
            'Break Hours',
            'Net Hours',
            'Break Details'
        ];
        
        const data = [headers];
        
        // Add daily records
        workData.dailyRecords.forEach(record => {
            const breakDetails = record.breaks.map(b => {
                if (b.endTime) {
                    const start = b.startTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    const end = b.endTime.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    return `${start}-${end}`;
                }
                return '';
            }).filter(detail => detail !== '').join('; ');
            
            data.push([
                record.date,
                record.signInTime,
                record.endTime,
                record.workHours,
                record.breakHours,
                record.netHours,
                breakDetails
            ]);
        });
        
        // Add totals row
        data.push([
            'TOTALS',
            '',
            '',
            workData.totalWorkHours.toFixed(2),
            workData.totalBreakHours.toFixed(2),
            workData.totalNetHours.toFixed(2),
            ''
        ]);
        
        return data;
    }
    
    // Function to add payslip button to employee history modal
    function addPayslipButton(employeeName, year, month) {
        const payslipButton = document.createElement('button');
        payslipButton.textContent = 'Generate Payslip';
        payslipButton.style.padding = '10px 20px';
        payslipButton.style.backgroundColor = '#28a745';
        payslipButton.style.color = 'white';
        payslipButton.style.border = 'none';
        payslipButton.style.borderRadius = '5px';
        payslipButton.style.cursor = 'pointer';
        payslipButton.style.fontWeight = 'bold';
        payslipButton.style.marginTop = '15px';
        payslipButton.style.width = '100%';
        
        payslipButton.addEventListener('click', () => {
            generatePayslipWithOptions(employeeName, year, month);
        });
        
        return payslipButton;
    }
    
    // Function to generate PDF payslip
    function generatePDFPayslip(employeeName, year, month, workData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Format month and year for Japanese format
        const monthStr = (month + 1).toString().padStart(2, '0');
        const nextMonth = month === 11 ? 1 : month + 1;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        const yearStr = year.toString();
        
        // Set font for Japanese characters
        doc.setFont('helvetica');
        
        // Title
        doc.setFontSize(16);
        doc.text(`給与明細書（${yearStr}年${monthStr}月分）`, 105, 20, { align: 'center' });
        
        // Period information
        doc.setFontSize(12);
        doc.text(`${yearStr}年${nextMonthStr}月01日`, 150, 35);
        doc.text(`${yearStr}年${monthStr}月31日`, 150, 40);
        
        // Employee information
        doc.setFontSize(14);
        doc.text('従業員名:', 20, 60);
        doc.text(employeeName, 50, 60);
        
        // Work summary
        doc.setFontSize(12);
        doc.text('勤務日数:', 20, 80);
        doc.text(workData.monthlyTotals.workDays.toString(), 50, 80);
        
        doc.text('総勤務時間:', 20, 90);
        const roundedTotalHours = calculateRoundedTotalHours(workData.dailyRecords);
        doc.text(`${roundedTotalHours}時間`, 50, 90);
        
        doc.text('時給:', 20, 100);
        doc.text('要設定', 50, 100);
        
        // Daily records table
        doc.setFontSize(10);
        const tableData = workData.dailyRecords.map(record => [
            record.date,
            record.signInTime,
            record.endTime,
            roundToNearestQuarter(parseFloat(record.workHours)),
            roundToNearestQuarter(parseFloat(record.breakHours)),
            roundToNearestQuarter(parseFloat(record.netHours))
        ]);
        
        // Add headers
        const headers = ['日付', '開始時間', '終了時間', '勤務時間', '休憩時間', '実働時間'];
        tableData.unshift(headers);
        
        // Create table
        doc.autoTable({
            startY: 120,
            head: [headers],
            body: tableData.slice(1),
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [111, 78, 55],
                textColor: 255
            }
        });
        
        // Footer
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`生成日: ${new Date().toLocaleDateString('ja-JP')}`, 20, finalY);
        doc.text('※この明細書は勤務記録に基づいて生成されています。', 20, finalY + 10);
        
        return doc;
    }
    
    // Function to generate payslip with both Excel and PDF options
    async function generatePayslipWithOptions(employeeName, year, month) {
        try {
            // Show loading message
            showCustomAlert('データを処理中...', 'info');
            
            const db = window.firebaseDb;
            const { collection, getDocs, query, where } = window.firebaseServices;
            
            // Get the date range for the month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            
            const startDateStr = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            const endDateStr = endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            
            // Fetch employee sign-ins for the month
            // Use a simpler query to avoid indexing issues
            const querySnapshot = await getDocs(query(
                collection(db, 'employeeSignIns'),
                where('date', '>=', startDateStr),
                where('date', '<=', endDateStr)
            ));
            
            // Filter by employee name in JavaScript to avoid indexing issues
            const filteredSnapshot = {
                docs: querySnapshot.docs.filter(doc => doc.data().employeeName === employeeName)
            };
            
            // Calculate work data
            const workData = calculateWorkData(filteredSnapshot);
            
            // Show format selection modal
            showFormatSelectionModal(employeeName, year, month, workData);
            
        } catch (error) {
            console.error('Error generating payslip:', error);
            showCustomAlert('給与明細書の生成中にエラーが発生しました。もう一度お試しください。', 'error');
        }
    }
    
    // Function to show format selection modal
    function showFormatSelectionModal(employeeName, year, month, workData) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'format-selection-overlay';
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
        modal.className = 'format-selection-modal';
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
        title.textContent = '給与明細書の形式を選択';
        title.style.marginBottom = '25px';
        title.style.color = 'var(--primary)';
        title.style.textAlign = 'center';

        // Create options
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexDirection = 'column';
        optionsContainer.style.gap = '15px';

        // Option 1: Excel with Japanese template
        const option1 = document.createElement('button');
        option1.textContent = '日本語テンプレートを使用';
        option1.style.padding = '15px';
        option1.style.backgroundColor = 'var(--primary)';
        option1.style.color = 'white';
        option1.style.border = 'none';
        option1.style.borderRadius = '8px';
        option1.style.cursor = 'pointer';
        option1.style.fontSize = '16px';
        option1.style.fontWeight = 'bold';
        option1.onclick = () => {
            document.body.removeChild(overlay);
            generateExcelWithJapaneseTemplate(employeeName, year, month, workData);
        };

        // Option 2: PDF
        const option2 = document.createElement('button');
        option2.textContent = 'PDFで生成';
        option2.style.padding = '15px';
        option2.style.backgroundColor = '#28a745';
        option2.style.color = 'white';
        option2.style.border = 'none';
        option2.style.borderRadius = '8px';
        option2.style.cursor = 'pointer';
        option2.style.fontSize = '16px';
        option2.style.fontWeight = 'bold';
        option2.onclick = async () => {
            document.body.removeChild(overlay);
            
            // Show loading spinner
            showLoadingSpinner('Converting Excel to PDF...');
            
            try {
                // Generate Excel buffer without downloading
                const excelBuffer = await generateExcelBufferOnly(employeeName, year, month, workData);
                
                // Convert to PDF and download only PDF
                await generatePDFFromExcel(excelBuffer, employeeName, year, month, workData);
                
                // Hide loading spinner
                hideLoadingSpinner();
                
            } catch (error) {
                console.error('Error in PDF generation workflow:', error);
                hideLoadingSpinner();
                showCustomAlert('PDF生成中にエラーが発生しました。', 'error');
            }
        };

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'キャンセル';
        cancelButton.style.padding = '15px';
        cancelButton.style.backgroundColor = '#f0f0f0';
        cancelButton.style.color = '#333';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.fontWeight = 'bold';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
        };

        // Assemble modal
        optionsContainer.appendChild(option1);
        optionsContainer.appendChild(option2);
        optionsContainer.appendChild(cancelButton);
        
        modal.appendChild(closeButton);
        modal.appendChild(title);
        modal.appendChild(optionsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
    
    // Function to generate Excel with template
    function generateExcelWithTemplate(employeeName, year, month, workData) {
        try {
            // Create Excel workbook
            const workbook = createPayslipWorkbook(employeeName, year, month, workData);
            
            // Generate filename
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const filename = `Payslip_${employeeName}_${monthName}_${year}.xlsx`;
            
            // Download the file with formatting preserved
            XLSX.writeFile(workbook, filename, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary',
                cellStyles: true,
                cellDates: true,
                cellNF: true,
                cellHTML: true
            });
            
            showCustomAlert('Excel給与明細書が正常に生成されました！', 'success');
        } catch (error) {
            console.error('Error generating Excel:', error);
            showCustomAlert('Excelファイルの生成中にエラーが発生しました。', 'error');
        }
    }
    
    // Function to convert Excel to PDF using CloudConvert API
    async function generatePDFFromExcel(excelBuffer, employeeName, year, month, workData) {
        try {
            console.log('Converting Excel to PDF using CloudConvert...');
            
            // Create blob from Excel buffer
            const excelBlob = new Blob([excelBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            // Convert blob to base64
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(excelBlob);
            });
            
            // CloudConvert API configuration
            const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODg5MWQyMGI4MDE5NjA1N2QyMjIxNTMwNjQ4MjkwYjZiYzY3ZjIyNjAwMGI5Zjg4ZDJkMjYxYjVjMzdiMmJlZGEzZjI0OGU5OTM2NzhlY2MiLCJpYXQiOjE3NTQwMTM2MDAuMjk0NTExLCJuYmYiOjE3NTQwMTM2MDAuMjk0NTEzLCJleHAiOjQ5MDk2ODcyMDAuMjg5NjYzLCJzdWIiOiI3MjU2MzQ3OCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQud3JpdGUiLCJwcmVzZXQucmVhZCJdfQ.IQIRSRu4BSeUzXgvaqbkXpGSvd4kLfrqjvPRP0rCyh_r6QLL2lMPIJUwWPqw0xWKWt-yjtyOGxmnwDxe4_RiSmGw_ehNhROOz568cs-YVucI3Rw5bBuX1kk-08zzppBZ2n1pL-mF-jRE3J3TQ0T484wRTwqeUl-Joyc63ix0NkmC0R9sroGQOzauByCz3OPf9NwTR9gDuNg4ZYKOo416oiz14deVh6GWVn0bv-ETvApEYN0JiQrKW-4gUMIYC_609-HEMhO26a9CI6FmGlcQOiov5f96Vljat8IwX2286DJIOPdDdSqIIxKRSi56Xp3TukFl4USa_xOxGdRwzpqHNbRBvf6q0pzAOzfRp1RoW_DXzxLw3MhAVUhDY_6apdBTs1c122ce4aMgP2MpHVNyTIVILbvGHG3nlbilJQ6PoSRpRB6nXHXRLH7M8ih0Gnb1l9fKbS6SXCTNk54xPAP5d3CUmpTHcNpHEPpCdIVnyrTkBgAcU24VGdfZls1hiwwAG_KR4hym5Equbcfr0en4O9UL_lgSdpMx8Rnc6z8nS1_uEGc3580XzuQqp83htJt9AK-wSRLZ38usGzY8KTBdSMbfyBA3dbBXlXfvuKUgLAA9ryY9Mn8WPtJmkFpNYyOVzzAH4Bg3m9cl7P636OZUyYTrHDbw9yTForOi3m1jAcg';
            const API_URL = 'https://sync.api.cloudconvert.com/v2/jobs';
            
            // Prepare the conversion request using the correct API format
            const conversionData = {
                tasks: {
                    'import-excel-file': {
                        operation: 'import/base64',
                        file: base64,
                        filename: `payslip_${employeeName}_${year}_${String(month + 1).padStart(2, '0')}.xlsx`
                    },
                    'convert-to-pdf': {
                        operation: 'convert',
                        input: 'import-excel-file',
                        input_format: 'xlsx',
                        output_format: 'pdf'
                    },
                    'export-pdf': {
                        operation: 'export/url',
                        input: 'convert-to-pdf'
                    }
                },
                redirect: true
            };
            
            // Make API request
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(conversionData)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            // Check if response is JSON or PDF
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/pdf')) {
                // Direct PDF response - download it
                const pdfBlob = await response.blob();
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Payslip_${employeeName}_${year}-${String(month + 1).padStart(2, '0')}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
                
                showCustomAlert('Excel converted to PDF successfully!', 'success');
                return;
            }
            
            // JSON response - get the export URL
            const result = await response.json();
            
            if (result.tasks && result.tasks['export-pdf'] && result.tasks['export-pdf'].result) {
                const exportUrl = result.tasks['export-pdf'].result.files[0].url;
                
                // Download the converted PDF
                const pdfResponse = await fetch(exportUrl);
                const pdfBlob = await pdfResponse.blob();
                
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Payslip_${employeeName}_${year}-${String(month + 1).padStart(2, '0')}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
                
                showCustomAlert('Excel converted to PDF successfully!', 'success');
            } else {
                throw new Error('Invalid API response format');
            }
            
        } catch (error) {
            console.error('Error converting Excel to PDF:', error);
            
            // Fallback to simple PDF if API fails
            showCustomAlert('API conversion failed. Creating simple PDF...', 'warning');
            await createSimplePDF(employeeName, year, month, workData);
        }
    }
    
    // Loading spinner functions
    function showLoadingSpinner(message = 'Processing...') {
        // Remove existing spinner if any
        hideLoadingSpinner();
        
        const spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '0';
        spinner.style.left = '0';
        spinner.style.width = '100%';
        spinner.style.height = '100%';
        spinner.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        spinner.style.zIndex = '9999';
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.style.alignItems = 'center';
        spinner.style.flexDirection = 'column';
        
        const spinnerContent = document.createElement('div');
        spinnerContent.style.backgroundColor = 'white';
        spinnerContent.style.padding = '30px';
        spinnerContent.style.borderRadius = '10px';
        spinnerContent.style.textAlign = 'center';
        spinnerContent.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        
        const spinnerIcon = document.createElement('div');
        spinnerIcon.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#e0e0e0" stroke-width="4" fill="none"/>
                <circle cx="20" cy="20" r="18" stroke="#007bff" stroke-width="4" fill="none" 
                        stroke-dasharray="113" stroke-dashoffset="113">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="113;0;113" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        spinnerIcon.style.marginBottom = '15px';
        
        const spinnerText = document.createElement('div');
        spinnerText.textContent = message;
        spinnerText.style.fontSize = '16px';
        spinnerText.style.color = '#333';
        spinnerText.style.fontWeight = 'bold';
        
        spinnerContent.appendChild(spinnerIcon);
        spinnerContent.appendChild(spinnerText);
        spinner.appendChild(spinnerContent);
        document.body.appendChild(spinner);
    }
    
    function hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            document.body.removeChild(spinner);
        }
    }
    
    // Fallback function to create simple PDF
    async function createSimplePDF(employeeName, year, month, workData) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            doc.setFont('helvetica');
            doc.setFontSize(16);
            doc.text(`Payslip - ${employeeName}`, 105, 25, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text(`Period: ${year}-${String(month + 1).padStart(2, '0')}`, 20, 40);
            doc.text(`Work Days: ${workData.monthlyTotals.workDays}`, 20, 50);
            doc.text(`Total Hours: ${calculateRoundedTotalHours(workData.dailyRecords)}`, 20, 60);
            
            const filename = `Payslip_${employeeName}_${year}-${String(month + 1).padStart(2, '0')}.pdf`;
            doc.save(filename);
            
            showCustomAlert('Simple PDF created successfully!', 'success');
            
        } catch (error) {
            console.error('Error creating simple PDF:', error);
            showCustomAlert('Error creating PDF. Please use the Excel file.', 'error');
        }
    }
    
    // Legacy PDF function (kept for compatibility)
    function generatePDF(employeeName, year, month, workData) {
        try {
            const doc = generatePDFPayslip(employeeName, year, month, workData);
            
            // Generate filename
            const monthStr = (month + 1).toString().padStart(2, '0');
            const filename = `Payslip_${employeeName}_${year}_${monthStr}.pdf`;
            
            // Download the file
            doc.save(filename);
            
            showCustomAlert('PDF給与明細書が正常に生成されました！', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showCustomAlert('PDFファイルの生成中にエラーが発生しました。', 'error');
        }
    }
    
    // Function to generate standard Excel
    function generateStandardExcel(employeeName, year, month, workData) {
        try {
            // Create Excel workbook
            const workbook = createPayslipWorkbook(employeeName, year, month, workData);
            
            // Generate filename
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const filename = `Payslip_${employeeName}_${monthName}_${year}.xlsx`;
            
            // Download the file with formatting preserved
            XLSX.writeFile(workbook, filename, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary',
                cellStyles: true,
                cellDates: true,
                cellNF: true,
                cellHTML: true
            });
            
            showCustomAlert('標準Excel給与明細書が正常に生成されました！', 'success');
        } catch (error) {
            console.error('Error generating standard Excel:', error);
            showCustomAlert('標準Excelファイルの生成中にエラーが発生しました。', 'error');
        }
    }
    
    // ExcelJS-based payslip generator (replaces SheetJS logic)
    async function generateExcelWithJapaneseTemplate(employeeName, year, month, workData) {
        const buffer = await generateExcelBufferOnly(employeeName, year, month, workData);
        
        // Download the file
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `給与明細書_${employeeName}_${year}年${String(month + 1).padStart(2, '0')}月.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        console.log('Payslip generated successfully!');
        return buffer;
    }
    
    // Generate Excel buffer without downloading
    async function generateExcelBufferOnly(employeeName, year, month, workData) {
        try {
            console.log('Loading template file...');
            
            // 1. Load the existing template file
            const response = await fetch('PAYSLIP TEMPLATE.xlsx');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status} ${response.statusText}`);
            }
            
            const templateBuffer = await response.arrayBuffer();
            console.log('Template loaded, size:', templateBuffer.byteLength);
            
            // 2. Load the workbook using ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(templateBuffer);
            
            console.log('Workbook loaded with sheets:', workbook.worksheetNames);
            
            // 3. Get the worksheet
            const worksheet = workbook.getWorksheet('給与明細書');
            if (!worksheet) {
                throw new Error('Worksheet "給与明細書" not found in template');
            }
            
            // 4. Fetch employee wage from database
            const db = window.firebaseDb;
            const { collection, getDocs, query, where } = window.firebaseServices;
            
            let employeeWage = 0;
            try {
                const employeesRef = collection(db, 'employees');
                const employeeQuery = query(employeesRef, where('name', '==', employeeName));
                const employeeSnapshot = await getDocs(employeeQuery);
                
                if (!employeeSnapshot.empty) {
                    const employeeData = employeeSnapshot.docs[0].data();
                    employeeWage = employeeData.wage || 0;
                    console.log('Employee wage found:', employeeWage);
                } else {
                    console.log('Employee not found in database, using default wage');
                }
            } catch (error) {
                console.warn('Error fetching employee wage:', error);
                console.log('Using default wage of 0');
            }
            
            console.log('Filling template with data:', {
                employeeName,
                year,
                month,
                workDays: workData.monthlyTotals.workDays,
                totalHours: calculateRoundedTotalHours(workData.dailyRecords),
                wage: employeeWage
            });
            
            // 5. Calculate the required values
            const monthStr = String(month + 1).padStart(2, '0');
            const nextMonth = month === 11 ? 1 : month + 2;
            const nextMonthYear = month === 11 ? year + 1 : year;
            const nextMonthStr = String(nextMonth).padStart(2, '0');
            const roundedTotalHours = calculateRoundedTotalHours(workData.dailyRecords);
            
            console.log('Specific cells mapping:', {
                A2: `給与明細書（${year}年${monthStr}月分）`,
                I4: `${nextMonthYear}年${nextMonthStr}月01日`,
                I5: `${year}年${monthStr}月31日`,
                B11: workData.monthlyTotals.workDays,
                B13: roundedTotalHours,
                B20: employeeWage > 0 ? employeeWage.toString() : '要設定'
            });
            
            // 5. Modify only the specific cells while preserving all formatting
            console.log('Setting cell A2 to:', `給与明細書（${year}年${monthStr}月分）`);
            const cellA2 = worksheet.getCell('A2');
            cellA2.value = `給与明細書（${year}年${monthStr}月分）`;
            console.log('Updated existing cell A2:', {
                value: cellA2.value,
                style: cellA2.style,
                type: cellA2.type
            });
            
            console.log('Setting cell I4 to:', `${nextMonthYear}年${nextMonthStr}月01日`);
            const cellI4 = worksheet.getCell('I4');
            cellI4.value = `${nextMonthYear}年${nextMonthStr}月01日`;
            console.log('Updated existing cell I4:', {
                value: cellI4.value,
                style: cellI4.style,
                type: cellI4.type
            });
            
            console.log('Setting cell I5 to:', `${year}年${monthStr}月31日`);
            const cellI5 = worksheet.getCell('I5');
            cellI5.value = `${year}年${monthStr}月31日`;
            console.log('Updated existing cell I5:', {
                value: cellI5.value,
                style: cellI5.style,
                type: cellI5.type
            });
            
            console.log('Setting cell B11 to:', workData.monthlyTotals.workDays);
            const cellB11 = worksheet.getCell('B11');
            cellB11.value = workData.monthlyTotals.workDays;
            console.log('Updated existing cell B11:', {
                value: cellB11.value,
                style: cellB11.style,
                type: cellB11.type
            });
            
            console.log('Setting cell B13 to:', roundedTotalHours);
            const cellB13 = worksheet.getCell('B13');
            cellB13.value = roundedTotalHours;
            console.log('Updated existing cell B13:', {
                value: cellB13.value,
                style: cellB13.style,
                type: cellB13.type
            });
            
            console.log('Setting cell B20 to:', employeeWage > 0 ? employeeWage.toString() : '要設定');
            const cellB20 = worksheet.getCell('B20');
            cellB20.value = employeeWage > 0 ? employeeWage.toString() : '要設定';
            console.log('Updated existing cell B20:', {
                value: cellB20.value,
                style: cellB20.style,
                type: cellB20.type
            });
            
            // 6. Verify the final data before writing
            console.log('Final worksheet data before download:');
            console.log('A2:', worksheet.getCell('A2').value);
            console.log('I4:', worksheet.getCell('I4').value);
            console.log('I5:', worksheet.getCell('I5').value);
            console.log('B11:', worksheet.getCell('B11').value);
            console.log('B13:', worksheet.getCell('B13').value);
            console.log('B20:', worksheet.getCell('B20').value);
            
            // 7. Write the modified workbook to buffer
            console.log('Writing modified workbook...');
            const buffer = await workbook.xlsx.writeBuffer();
            
            console.log('Excel buffer created successfully!');
            
            // Return the buffer for PDF conversion (no download)
            return buffer;
            
        } catch (error) {
            console.error('Error generating payslip:', error);
            alert(`Error generating payslip: ${error.message}`);
            throw error;
        }
    }
    
    // Create payslip using ExcelJS with perfect formatting
    function createExcelJSPayslip(worksheet, employeeName, yearStr, monthStr, nextMonthStr, yearForI4, workData, roundedTotalHours) {
        // Set column widths
        worksheet.columns = [
            { key: 'A', width: 15 },
            { key: 'B', width: 12 },
            { key: 'C', width: 12 },
            { key: 'D', width: 12 },
            { key: 'E', width: 12 },
            { key: 'F', width: 12 },
            { key: 'G', width: 12 },
            { key: 'H', width: 12 },
            { key: 'I', width: 12 },
            { key: 'J', width: 12 },
            { key: 'K', width: 12 }
        ];
        
        // Define styles
        const blueHeaderStyle = {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F3' }
            },
            border: {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            },
            font: {
                bold: true,
                size: 12
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        };
        
        const dataCellStyle = {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F3' }
            },
            border: {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        };
        
        const labelStyle = {
            font: {
                bold: true,
                size: 11
            },
            alignment: {
                horizontal: 'left',
                vertical: 'middle'
            }
        };
        
        // Add data to worksheet
        worksheet.addRow(['給与明細書（' + yearStr + '年' + monthStr + '月分）', '', '', '', '', '', '', '', '株式会社SABOTEN']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '給与支給日']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '給与締日']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['部署', 'パート・アルバイト', '', '', '', '', '', '', '']);
        worksheet.addRow(['氏名', employeeName, '', '', '', '', '', '', '様']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '出勤日数', '', '休日出勤日数', '', '有給日数', '', '欠勤日数', '', '遅刻・早退回数']);
        worksheet.addRow(['', workData.monthlyTotals.workDays, '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '所定労働時間', '', '時間外労働時間', '', '休日労働時間', '', '深夜時間', '', '遅刻・早退時間']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', roundedTotalHours, '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['勤怠項目', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '時間単価', '', '●●手当', '', '●×手当', '', '', '', '基本給']);
        worksheet.addRow(['', '要設定', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '普通残業手当', '', '休日手当', '', '深夜手当', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '通勤手当(1日)', '', '', '', '', '', '', '', '課税通勤手当']);
        worksheet.addRow(['', '600', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '非課税通勤手当', '', '', '', '', '', '', '', '支給額合計']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '健康保険', '', '介護保険', '', '厚生年金', '', '雇用保険', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '所得税', '', '住民税', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '社会保険合計', '', '課税対象額', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['合計', '振込支給額', '', '現金支給額', '', '差引支給額', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '']);
        
        // Apply styles to specific cells
        const rows = worksheet.getRows();
        
        // Apply blue header style to title row
        if (rows[0]) {
            rows[0].getCell(1).style = blueHeaderStyle;
            rows[0].getCell(9).style = blueHeaderStyle;
        }
        
        // Apply data cell style to key data cells
        if (rows[10]) rows[10].getCell(2).style = dataCellStyle; // B11 - work days
        if (rows[12]) rows[12].getCell(2).style = dataCellStyle; // B13 - total hours
        if (rows[19]) rows[19].getCell(2).style = dataCellStyle; // B20 - wage
        if (rows[3]) rows[3].getCell(9).style = dataCellStyle;   // I4 - payment date
        if (rows[4]) rows[4].getCell(9).style = dataCellStyle;   // I5 - closing date
        
        // Set specific cell values
        if (rows[3]) rows[3].getCell(9).value = yearForI4 + '年' + nextMonthStr + '月01日';
        if (rows[4]) rows[4].getCell(9).value = yearStr + '年' + monthStr + '月31日';
        
        // Apply label styles to headers
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row) {
                if (row.getCell(1).value && typeof row.getCell(1).value === 'string' && 
                    (row.getCell(1).value.includes('部署') || row.getCell(1).value.includes('氏名') || 
                     row.getCell(1).value.includes('勤怠項目') || row.getCell(1).value.includes('合計'))) {
                    row.getCell(1).style = labelStyle;
                }
            }
        }
    }
    
    // Create a new Excel file with exact formatting from scratch
    function createFormattedExcelPayslip(employeeName, year, month, workData) {
        try {
            const workbook = XLSX.utils.book_new();
            
            // Create worksheet data with proper structure
            const wsData = [
                ['給与明細書（2025年07月分）', '', '', '', '', '', '', '', '株式会社SABOTEN'],
                ['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '給与支給日'],
                ['', '', '', '', '', '', '', '', '給与締日'],
                ['', '', '', '', '', '', '', '', ''],
                ['部署', 'パート・アルバイト', '', '', '', '', '', '', ''],
                ['氏名', employeeName, '', '', '', '', '', '', '様'],
                ['', '', '', '', '', '', '', '', ''],
                ['', '出勤日数', '', '休日出勤日数', '', '有給日数', '', '欠勤日数', '', '遅刻・早退回数'],
                ['', workData.monthlyTotals.workDays, '', '', '', '', '', '', '', ''],
                ['', '所定労働時間', '', '時間外労働時間', '', '休日労働時間', '', '深夜時間', '', '遅刻・早退時間'],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', workData.monthlyTotals.netHours.toFixed(2), '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['勤怠項', '', '', '', '', '', '', '', '', ''],
                ['', '時間単価', '', '●●手当', '', '●×手当', '', '', '', '基本給'],
                ['', '要設定', '', '', '', '', '', '', '', ''],
                ['', '普通残業手当', '', '休日手当', '', '深夜手当', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '通勤手当(1日)', '', '', '', '', '', '', '', '課税通勤手当'],
                ['', '600', '', '', '', '', '', '', '', ''],
                ['', '非課税通勤手当', '', '', '', '', '', '', '', '支給額合計'],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '健康保険', '', '介護保険', '', '厚生年金', '', '雇用保険', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '所得税', '', '住民税', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '社会保険合計', '', '課税対象額', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['合計', '振込支給額', '', '現金支給額', '', '差引支給額', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '']
            ];
            
            const worksheet = XLSX.utils.aoa_to_sheet(wsData);
            
            // Add some basic formatting
            worksheet['!cols'] = [
                { width: 15 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 },
                { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }
            ];
            
            XLSX.utils.book_append_sheet(workbook, worksheet, '給与明細書');
            
            return workbook;
        } catch (error) {
            console.error('Error creating formatted Excel:', error);
            throw error;
        }
    }
    
    // Function to fill ONLY the specific cells in Japanese template
    function fillJapaneseTemplateCells(workbook, employeeName, year, month, workData) {
        // Get the first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Format month and year for Japanese format
        const monthStr = (month + 1).toString().padStart(2, '0');
        const nextMonth = month === 11 ? 1 : month + 1;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        const yearStr = year.toString();
        
        // For I4, we need the NEXT month (August for July payslip)
        // month is 0-based, so July is 6, we want August which is 7
        const nextMonthForI4 = month === 11 ? 1 : month + 1;
        const nextMonthStrForI4 = (nextMonthForI4 + 1).toString().padStart(2, '0');
        const yearForI4 = month === 11 ? year + 1 : year;
        
        console.log('Month calculation debug:', {
            month,
            nextMonthForI4,
            nextMonthStrForI4,
            yearForI4,
            yearStr
        });
        
        // Calculate the rounded total hours
        const roundedTotalHours = calculateRoundedTotalHours(workData.dailyRecords);
        
        console.log('Filling template with data:', {
            employeeName,
            year,
            month,
            workDays: workData.monthlyTotals.workDays,
            totalHours: roundedTotalHours
        });
        
        // ONLY edit the specific cells you mentioned, preserving all other formatting
        const specificCells = {
            // A2: 給与明細書（２０２５年０X月分）- where X is the month
            'A2': `給与明細書（${yearStr}年${monthStr}月分）`,
            
            // I4: ２０２５年０X月０1日 - Where X is the next month (August for July payslip)
            'I4': `${yearForI4}年${nextMonthStrForI4}月01日`,
            
            // I5: ２０２５年０X月３１日 - where X is this month
            'I5': `${yearStr}年${monthStr}月31日`,
            
            // B11: days/shifts worked
            'B11': workData.monthlyTotals.workDays,
            
            // B13: total hours worked (rounded to nearest 15 minutes per day)
            'B13': roundedTotalHours,
            
            // B20: Wage (should be input in employee info) - placeholder for now
            'B20': '要設定', // This will need to be configured with actual wage data
        };
        
        console.log('Specific cells mapping:', specificCells);
        
        // Fill ONLY these specific cells, preserving all existing formatting
        Object.keys(specificCells).forEach(cellAddress => {
            console.log(`Setting cell ${cellAddress} to:`, specificCells[cellAddress]);
            
            if (worksheet[cellAddress]) {
                // Preserve ALL existing cell properties and only update the value
                const existingCell = worksheet[cellAddress];
                const originalStyle = existingCell.s; // Save the original style
                const originalFormat = existingCell.z; // Save the original format
                
                // Update only the value, preserving everything else
                existingCell.v = specificCells[cellAddress];
                
                // Force correct cell type for numbers and strings
                if (typeof specificCells[cellAddress] === 'number') {
                    existingCell.t = 'n';
                } else if (typeof specificCells[cellAddress] === 'string') {
                    existingCell.t = 's';
                }
                
                // Ensure style is preserved
                if (originalStyle) {
                    existingCell.s = originalStyle;
                }
                if (originalFormat) {
                    existingCell.z = originalFormat;
                }
                
                console.log(`Updated existing cell ${cellAddress}:`, existingCell);
            } else {
                // Create cell if it doesn't exist, but keep minimal formatting
                const cellType = typeof specificCells[cellAddress] === 'number' ? 'n' : 's';
                worksheet[cellAddress] = { 
                    v: specificCells[cellAddress],
                    t: cellType
                };
                console.log(`Created new cell ${cellAddress}:`, worksheet[cellAddress]);
            }
        });
        
        // Special debugging for B11
        console.log('B11 cell after update:', worksheet['B11']);
        console.log('B11 value type:', typeof worksheet['B11']?.v);
        console.log('B11 cell type:', worksheet['B11']?.t);
        console.log('B11 style:', worksheet['B11']?.s);
        console.log('B11 format:', worksheet['B11']?.z);
        
        // Debug a few other cells to see their styles
        console.log('A2 style:', worksheet['A2']?.s);
        console.log('I4 style:', worksheet['I4']?.s);
        console.log('B13 style:', worksheet['B13']?.s);
        
        // Copy the exact style from A2 to other cells that should have the same formatting
        const a2Style = worksheet['A2']?.s;
        if (a2Style) {
            console.log('Copying A2 style to data cells');
            
            // Apply A2's exact style to data cells
            if (worksheet['B11']) {
                worksheet['B11'].s = JSON.parse(JSON.stringify(a2Style)); // Deep copy
                console.log('Applied A2 style to B11');
            }
            if (worksheet['B13']) {
                worksheet['B13'].s = JSON.parse(JSON.stringify(a2Style)); // Deep copy
                console.log('Applied A2 style to B13');
            }
            if (worksheet['B20']) {
                worksheet['B20'].s = JSON.parse(JSON.stringify(a2Style)); // Deep copy
                console.log('Applied A2 style to B20');
            }
            if (worksheet['I4']) {
                worksheet['I4'].s = JSON.parse(JSON.stringify(a2Style)); // Deep copy
                console.log('Applied A2 style to I4');
            }
            if (worksheet['I5']) {
                worksheet['I5'].s = JSON.parse(JSON.stringify(a2Style)); // Deep copy
                console.log('Applied A2 style to I5');
            }
        } else {
            console.log('A2 style not found, using fallback style');
            // Fallback style if A2 style is not available
            const fallbackStyle = {
                patternType: "solid",
                fgColor: {theme: 8, tint: 0.7999816888943144, rgb: 'DEEBF7', raw_rgb: '5B9BD5'},
                bgColor: {indexed: 64},
                border: {
                    top: {style: 'thin', color: {rgb: '000000'}},
                    bottom: {style: 'thin', color: {rgb: '000000'}},
                    left: {style: 'thin', color: {rgb: '000000'}},
                    right: {style: 'thin', color: {rgb: '000000'}}
                }
            };
            
            if (worksheet['B11']) worksheet['B11'].s = fallbackStyle;
            if (worksheet['B13']) worksheet['B13'].s = fallbackStyle;
            if (worksheet['B20']) worksheet['B20'].s = fallbackStyle;
            if (worksheet['I4']) worksheet['I4'].s = fallbackStyle;
            if (worksheet['I5']) worksheet['I5'].s = fallbackStyle;
        }
        
        // Force the workbook to recognize style changes
        if (workbook.Styles) {
            console.log('Workbook has Styles object, ensuring styles are preserved');
        }
        
        // Ensure the worksheet knows about the style changes
        const worksheetName = workbook.SheetNames[0];
        if (workbook.Sheets[worksheetName]) {
            console.log('Worksheet exists, styles should be preserved');
        }
        
        // Try to preserve the workbook's style information more explicitly
        if (workbook.Styles && workbook.Styles.CellXf) {
            console.log('Workbook has CellXf styles, preserving them');
            // Ensure the workbook's style information is preserved
            if (!workbook.Styles.CellXf.length) {
                workbook.Styles.CellXf = [{}]; // Ensure at least one style exists
            }
        }
        
        // Force SheetJS to recognize the changes
        if (worksheet['!ref']) {
            // Update the sheet range if needed
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const maxRow = Math.max(range.e.r, ...Object.keys(specificCells).map(addr => XLSX.utils.decode_cell(addr).r));
            const maxCol = Math.max(range.e.c, ...Object.keys(specificCells).map(addr => XLSX.utils.decode_cell(addr).c));
            worksheet['!ref'] = XLSX.utils.encode_range({s: {r: 0, c: 0}, e: {r: maxRow, c: maxCol}});
        }
        
        // DO NOT add daily records or modify any other cells
        // This preserves the exact template layout and formatting
    }
    
    // Helper function to convert string to array buffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    
    // Make functions available globally
    window.generatePayslip = generatePayslip;
    window.generatePayslipFromTemplate = generatePayslipFromTemplate;
    window.addPayslipButton = addPayslipButton;
    window.calculateWorkData = calculateWorkData;
    window.createPayslipWorkbook = createPayslipWorkbook;
    window.fillTemplateWithData = fillTemplateWithData;
    window.showTemplateSelectionModal = showTemplateSelectionModal;
    window.generatePDFPayslip = generatePDFPayslip;
    window.generatePayslipWithOptions = generatePayslipWithOptions;
    window.showFormatSelectionModal = showFormatSelectionModal;
    window.generateExcelWithTemplate = generateExcelWithTemplate;
    window.generatePDF = generatePDF;
    window.generateStandardExcel = generateStandardExcel;
    window.generateExcelWithJapaneseTemplate = generateExcelWithJapaneseTemplate;
    window.fillJapaneseTemplateCells = fillJapaneseTemplateCells;
    window.createFormattedExcelPayslip = createFormattedExcelPayslip;
}); 