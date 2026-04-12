const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/portfolio_contacts', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'new' } // new, read, replied
});

const Contact = mongoose.model('Contact', contactSchema);

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

        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Contact form submitted successfully' 
        });
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
        const contacts = await Contact.find().sort({ date: -1 });
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
        
        await Contact.findByIdAndUpdate(id, { status });
        
        res.json({ 
            success: true, 
            message: 'Contact status updated successfully' 
        });
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
        
        await Contact.findByIdAndDelete(id);
        
        res.json({ 
            success: true, 
            message: 'Contact deleted successfully' 
        });
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Portfolio: http://localhost:${PORT}`);
    console.log(`Admin Dashboard: http://localhost:${PORT}/admin`);
});
