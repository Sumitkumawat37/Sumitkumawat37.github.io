const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'contacts.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Initialize database file if it doesn't exist
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(DB_FILE, JSON.stringify([]));
        console.log('Created contacts database file');
    }
}

// Read contacts from file
async function readContacts() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

// Write contacts to file
async function writeContacts(contacts) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(contacts, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing contacts:', error);
        return false;
    }
}

// Routes
// Save contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        const contacts = await readContacts();
        const newContact = {
            id: Date.now().toString(), // Simple ID generation
            name,
            email,
            message,
            date: new Date().toISOString(),
            status: 'new'
        };

        contacts.push(newContact);
        
        const saved = await writeContacts(contacts);
        if (saved) {
            res.status(201).json({ 
                success: true, 
                message: 'Contact form submitted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error saving contact' 
            });
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
});

// Get all contacts (for admin dashboard)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await readContacts();
        // Sort by date (newest first)
        contacts.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({ success: true, contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching contacts' 
        });
    }
});

// Update contact status
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const contacts = await readContacts();
        const contactIndex = contacts.findIndex(c => c.id === id);
        
        if (contactIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
            });
        }
        
        contacts[contactIndex].status = status;
        
        const saved = await writeContacts(contacts);
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Contact status updated successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error updating contact status' 
            });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating contact status' 
        });
    }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const contacts = await readContacts();
        const filteredContacts = contacts.filter(c => c.id !== id);
        
        const saved = await writeContacts(filteredContacts);
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Contact deleted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error deleting contact' 
            });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting contact' 
        });
    }
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Initialize database and start server
async function startServer() {
    await initDB();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Portfolio: http://localhost:${PORT}`);
        console.log(`Admin Dashboard: http://localhost:${PORT}/admin`);
        console.log(`Database: ${DB_FILE}`);
    });
}

startServer().catch(console.error);
