# Shift Migration Script

Simple Node.js script to migrate old employee data to the new shifts collection.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your Firebase config:**
   - Open `migrate-shifts.js`
   - Replace the `firebaseConfig` object with your actual Firebase config
   - You can get this from Firebase Console > Project Settings > General > Your apps

## Usage

```bash
# Run migration only
npm run migrate

# Clean up old collections only
npm run cleanup

# Run migration + cleanup
npm run full
```

Or directly:
```bash
node migrate-shifts.js migrate
node migrate-shifts.js cleanup
node migrate-shifts.js full
```

## What it does

- Migrates `scheduledShifts` collection to new `shifts` collection
- Migrates `employeeSignIns` collection to new `shifts` collection
- Preserves all data including breaks, durations, and timestamps
- Optionally deletes old collections after successful migration 