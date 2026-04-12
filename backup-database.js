const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'contacts.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Create backup directory if it doesn't exist
async function ensureBackupDir() {
    try {
        await fs.access(BACKUP_DIR);
    } catch (error) {
        await fs.mkdir(BACKUP_DIR);
        console.log('Created backup directory');
    }
}

// Create backup of contacts database
async function backupDatabase() {
    try {
        await ensureBackupDir();
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `contacts-backup-${timestamp}.json`);
        
        const data = await fs.readFile(DB_FILE, 'utf8');
        await fs.writeFile(backupFile, data);
        
        console.log(`Database backed up to: ${backupFile}`);
        return true;
    } catch (error) {
        console.error('Backup failed:', error);
        return false;
    }
}

// Run backup
backupDatabase().then(success => {
    if (success) {
        console.log('Backup completed successfully');
    } else {
        console.log('Backup failed');
    }
});
