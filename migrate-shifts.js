const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, getDoc, doc, setDoc, deleteDoc, Timestamp } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD8nS3tRM8e6eeztv0l7XK9nyjsB9vjRTs",
    authDomain: "izumiya-pos.firebaseapp.com",
    projectId: "izumiya-pos",
    storageBucket: "izumiya-pos.firebasestorage.app",
    messagingSenderId: "548021570883",
    appId: "1:548021570883:web:0c9e5057613edd9067f3f6",
    measurementId: "G-H7F3BEJRQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to determine shift classification based on times
function determineShiftClassification(startHour, startMinute, endHour, endMinute) {
    const startTime = startHour * 60 + startMinute;
    
    // Define shift time ranges (in minutes from midnight)
    const cafeOpenStart = 7 * 60 + 30; // 07:30
    const cafeOpenEnd = 11 * 60 + 30; // 11:30
    
    const cafeMorningStart = 9 * 60; // 09:00
    const cafeMorningEnd = 13 * 60; // 13:00
    
    const cafeAfternoonStart = 13 * 60; // 13:00
    const cafeAfternoonEnd = 16 * 60; // 16:00
    
    const cafeCloseStart = 14 * 60; // 14:00
    const cafeCloseEnd = 18 * 60; // 18:00
    
    const tenCleaningStart = 10 * 60; // 10:00
    const tenCleaningEnd = 14 * 60; // 14:00
    
    // Determine classification based on start time
    if (startTime >= cafeOpenStart && startTime <= cafeOpenEnd) {
        return 'Cafe Open';
    } else if (startTime >= cafeMorningStart && startTime <= cafeMorningEnd) {
        return 'Cafe Morning';
    } else if (startTime >= cafeAfternoonStart && startTime <= cafeAfternoonEnd) {
        return 'Cafe Afternoon';
    } else if (startTime >= cafeCloseStart && startTime <= cafeCloseEnd) {
        return 'Cafe Close';
    } else if (startTime >= tenCleaningStart && startTime <= tenCleaningEnd) {
        return Math.random() > 0.5 ? 'TEN Cleaning 1' : 'TEN Cleaning 2';
    } else {
        return 'Cafe Morning';
    }
}

// Convert date format (MM/DD/YYYY to YYYY-MM-DD)
function convertToFirestoreDate(dateStr) {
    if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
    
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function migrateData() {
    console.log('🚀 Starting migration...');
    
    let totalMigrated = 0;
    let totalErrors = 0;
    
    try {
        // 1. Migrate scheduledShifts
        console.log('📋 Migrating scheduledShifts...');
        const scheduledShiftsSnapshot = await getDocs(collection(db, 'scheduledShifts'));
        
        for (const docSnapshot of scheduledShiftsSnapshot.docs) {
            try {
                const data = docSnapshot.data();
                console.log(`Processing scheduled shift: ${data.employeeName} - ${data.date}`);
                
                // Convert date format
                const [month, day, year] = data.date.split('/');
                const firestoreDate = `${year}-${month}-${day}`;
                
                // Parse start and end times
                const [startHour, startMinute] = data.startTime.split(':').map(Number);
                const [endHour, endMinute] = data.endTime.split(':').map(Number);
                
                // Create Date objects
                const shiftStartTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), startHour, startMinute);
                const shiftFinishTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), endHour, endMinute);
                
                // Determine shift classification
                const shiftClassification = determineShiftClassification(startHour, startMinute, endHour, endMinute);
                
                // Calculate total duration
                const totalDuration = Math.floor((shiftFinishTime - shiftStartTime) / (1000 * 60));
                
                // Create new shift object
                const newShift = {
                    shiftClassification: shiftClassification,
                    shiftStartTime: Timestamp.fromDate(shiftStartTime),
                    shiftFinishTime: Timestamp.fromDate(shiftFinishTime),
                    employeeName: data.employeeName,
                    employeeId: data.employeeId,
                    signInTime: null,
                    signOutTime: null,
                    breaks: [],
                    totalDuration: totalDuration,
                    isScheduled: true,
                    isCurrent: false,
                    isCompleted: false,
                    createdAt: data.createdAt || Timestamp.now(),
                    migratedFrom: 'scheduledShifts',
                    originalDocId: docSnapshot.id
                };
                
                // Add to new shifts collection
                const dateDocRef = doc(db, 'shifts', firestoreDate);
                const dateDoc = await getDoc(dateDocRef);
                
                if (dateDoc.exists()) {
                    const existingData = dateDoc.data();
                    const shifts = existingData.shifts || [];
                    shifts.push(newShift);
                    await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
                } else {
                    await setDoc(dateDocRef, { shifts: [newShift] });
                }
                
                totalMigrated++;
                console.log(`✅ Migrated scheduled shift for ${data.employeeName}`);
                
            } catch (error) {
                console.error(`❌ Error migrating scheduled shift:`, error);
                totalErrors++;
            }
        }
        
        // 2. Migrate employeeSignIns
        console.log('👥 Migrating employeeSignIns...');
        const employeeSignInsSnapshot = await getDocs(collection(db, 'employeeSignIns'));
        
        for (const docSnapshot of employeeSignInsSnapshot.docs) {
            try {
                const data = docSnapshot.data();
                console.log(`Processing employee sign-in: ${data.employeeName} - ${data.date}`);
                
                // Convert date format
                const [month, day, year] = data.date.split('/');
                const firestoreDate = `${year}-${month}-${day}`;
                
                // Get sign-in time
                const signInTime = data.signInTime.toDate();
                const signOutTime = data.endTime ? data.endTime.toDate() : null;
                
                // Determine shift classification based on sign-in time
                const startHour = signInTime.getHours();
                const startMinute = signInTime.getMinutes();
                const endHour = signOutTime ? signOutTime.getHours() : startHour + 4;
                const endMinute = signOutTime ? signOutTime.getMinutes() : startMinute;
                
                const shiftClassification = determineShiftClassification(startHour, startMinute, endHour, endMinute);
                
                // Create shift start and end times
                const shiftStartTime = signInTime;
                const shiftFinishTime = signOutTime || new Date(signInTime.getTime() + (4 * 60 * 60 * 1000));
                
                // Determine shift status
                let isScheduled = false;
                let isCurrent = false;
                let isCompleted = false;
                
                if (signOutTime) {
                    isCompleted = true;
                } else {
                    isCurrent = true;
                }
                
                // Convert breaks to new format
                const newBreaks = (data.breaks || []).map(breakData => ({
                    startTime: breakData.startTime,
                    endTime: breakData.endTime || null
                }));
                
                // Calculate total duration
                let totalDuration = 0;
                if (signOutTime) {
                    totalDuration = Math.floor((signOutTime - signInTime) / (1000 * 60));
                } else {
                    const now = new Date();
                    totalDuration = Math.floor((now - signInTime) / (1000 * 60));
                }
                
                // Create new shift object
                const newShift = {
                    shiftClassification: shiftClassification,
                    shiftStartTime: Timestamp.fromDate(shiftStartTime),
                    shiftFinishTime: Timestamp.fromDate(shiftFinishTime),
                    employeeName: data.employeeName,
                    employeeId: data.employeeId,
                    signInTime: data.signInTime,
                    signOutTime: data.endTime || null,
                    breaks: newBreaks,
                    totalDuration: totalDuration,
                    isScheduled: isScheduled,
                    isCurrent: isCurrent,
                    isCompleted: isCompleted,
                    createdAt: data.createdAt || Timestamp.now(),
                    migratedFrom: 'employeeSignIns',
                    originalDocId: docSnapshot.id
                };
                
                // Add to new shifts collection
                const dateDocRef = doc(db, 'shifts', firestoreDate);
                const dateDoc = await getDoc(dateDocRef);
                
                if (dateDoc.exists()) {
                    const existingData = dateDoc.data();
                    const shifts = existingData.shifts || [];
                    shifts.push(newShift);
                    await setDoc(dateDocRef, { shifts: shifts }, { merge: true });
                } else {
                    await setDoc(dateDocRef, { shifts: [newShift] });
                }
                
                totalMigrated++;
                console.log(`✅ Migrated employee sign-in for ${data.employeeName}`);
                
            } catch (error) {
                console.error(`❌ Error migrating employee sign-in:`, error);
                totalErrors++;
            }
        }
        
        console.log('🎉 Migration completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Total migrated: ${totalMigrated}`);
        console.log(`   - Total errors: ${totalErrors}`);
        console.log(`   - Success rate: ${((totalMigrated / (totalMigrated + totalErrors)) * 100).toFixed(1)}%`);
        
        return { totalMigrated, totalErrors };
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

async function cleanupOldCollections() {
    console.log('🧹 Cleaning up old collections...');
    
    let deletedCount = 0;
    
    try {
        // Delete scheduledShifts
        console.log('🗑️ Deleting scheduledShifts...');
        const scheduledShiftsSnapshot = await getDocs(collection(db, 'scheduledShifts'));
        for (const docSnapshot of scheduledShiftsSnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
            deletedCount++;
        }
        
        // Delete employeeSignIns
        console.log('🗑️ Deleting employeeSignIns...');
        const employeeSignInsSnapshot = await getDocs(collection(db, 'employeeSignIns'));
        for (const docSnapshot of employeeSignInsSnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
            deletedCount++;
        }
        
        console.log(`✅ Cleanup completed! Deleted ${deletedCount} documents.`);
        return deletedCount;
        
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        throw error;
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'migrate') {
        await migrateData();
    } else if (command === 'cleanup') {
        await cleanupOldCollections();
    } else if (command === 'full') {
        await migrateData();
        console.log('\n--- Starting cleanup ---\n');
        await cleanupOldCollections();
    } else {
        console.log('Usage:');
        console.log('  node migrate-shifts.js migrate    - Run migration only');
        console.log('  node migrate-shifts.js cleanup    - Clean up old collections only');
        console.log('  node migrate-shifts.js full       - Run migration + cleanup');
    }
}

main().catch(console.error);
