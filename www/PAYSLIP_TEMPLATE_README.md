# Payslip Template Setup Guide

## Overview
The payslip generator can work with your custom Excel template. Here's how to set it up:

## Template Structure

Create an Excel file with the following structure:

### Sheet 1: Payslip Summary
- **A1**: "EMPLOYEE PAYSLIP"
- **A2**: "Employee Name:"
- **B2**: [Will be filled with employee name]
- **A3**: "Period:"
- **B3**: [Will be filled with month/year]
- **A4**: "Generated Date:"
- **B4**: [Will be filled with current date]

- **A7**: "MONTHLY SUMMARY"
- **A8**: "Total Work Days:"
- **B8**: [Will be filled with total work days]
- **A9**: "Total Work Hours:"
- **B9**: [Will be filled with total work hours]
- **A10**: "Total Break Hours:"
- **B10**: [Will be filled with total break hours]
- **A11**: "Total Net Hours:"
- **B11**: [Will be filled with net hours]
- **A13**: "Average Hours per Day:"
- **B13**: [Will be filled with average hours]

### Sheet 2: Daily Records (Optional)
- **A1**: "Date"
- **B1**: "Sign In Time"
- **C1**: "End Time"
- **D1**: "Work Hours"
- **E1**: "Break Hours"
- **F1**: "Net Hours"
- **G1**: "Break Details"

## How to Use

1. **Create your Excel template** with the structure above
2. **Save it** as `payslip-template.xlsx` in the Izumiya folder
3. **Use the system**: When you click "Generate Payslip" in the employee history, you'll have two options:
   - **Generate Standard Payslip**: Creates a new Excel file from scratch
   - **Use Custom Template**: Uses your template and fills it with data

## Customization Options

### Adding More Fields
You can add additional fields to your template and modify the `fillTemplateWithData` function in `payslip-generator.js`:

```javascript
const templateFields = {
    'B2': employeeName, // Employee Name
    'B3': `${monthName} ${year}`, // Period
    'B4': new Date().toLocaleDateString(), // Generated Date
    'B8': workData.monthlyTotals.workDays, // Total Work Days
    // Add your custom fields here:
    'B15': 'Your Custom Field',
    'B16': 'Your Custom Value',
};
```

### Company Branding
- Add your company logo to the template
- Include company name, address, and contact information
- Add your company's color scheme and formatting

### Additional Calculations
You can extend the system to include:
- Hourly rate calculations
- Overtime calculations
- Deductions and taxes
- Benefits and allowances

## Data Available

The system provides the following data for your template:

### Employee Information
- Employee Name
- Period (Month/Year)
- Generated Date

### Work Summary
- Total Work Days
- Total Work Hours
- Total Break Hours
- Total Net Hours
- Average Hours per Day

### Daily Records
- Date
- Sign In Time
- End Time
- Work Hours
- Break Hours
- Net Hours
- Break Details (formatted as "start-end; start-end")

## Example Template Fields

Here are some common fields you might want to include:

```javascript
// Basic employee info
'B2': employeeName,
'B3': `${monthName} ${year}`,
'B4': new Date().toLocaleDateString(),

// Work summary
'B8': workData.monthlyTotals.workDays,
'B9': workData.monthlyTotals.workHours.toFixed(2),
'B10': workData.monthlyTotals.breakHours.toFixed(2),
'B11': workData.monthlyTotals.netHours.toFixed(2),
'B13': averageHoursPerDay,

// You can add more fields like:
'B15': 'Hourly Rate:',
'B16': '$15.00', // You would need to add this data
'B17': 'Total Pay:',
'B18': (workData.monthlyTotals.netHours * 15).toFixed(2), // Example calculation
```

## Troubleshooting

### Template Not Loading
- Make sure the file is in `.xlsx` format
- Check that the file path is correct
- Ensure the file is not corrupted

### Data Not Filling Correctly
- Verify that the cell addresses in your template match the ones in the `fillTemplateWithData` function
- Check that the data structure matches what the system expects

### File Download Issues
- Make sure your browser allows file downloads
- Check that you have sufficient disk space
- Try refreshing the page if the download doesn't start 