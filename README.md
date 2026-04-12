# Sumit Kumawat - Portfolio with Backend

A modern portfolio website with a fully functional contact form backend to store and manage visitor queries.

## Features

- **Frontend**: Beautiful, responsive portfolio with multiple pages
- **Backend**: Node.js/Express server with JSON file database
- **Admin Dashboard**: View and manage all contact submissions
- **Real-time Updates**: Auto-refreshing admin panel
- **Status Management**: Track contact status (new, read, replied)

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Git** (for cloning)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

   The server will automatically create a `contacts.json` file to store all submissions.

3. **Access the Application**
   - **Portfolio**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin

## File Structure

```
Sumit portfolio/
|-- home.html              # Main landing page
|-- skills.html            # Skills page
|-- projects.html          # Projects page
|-- experience.html        # Education & Experience
|-- certifications.html     # Certifications page
|-- contact.html           # Contact form page
|-- admin.html            # Admin dashboard
|-- server-simple.js      # Backend server (JSON database)
|-- server.js              # Original MongoDB server (optional)
|-- contacts.json          # Database file (auto-created)
|-- package.json          # Node.js dependencies
|-- README.md             # This file
```

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com", 
    "message": "Your message here"
  }
  ```

### Admin Management
- **GET** `/api/contacts` - Get all contacts
- **PUT** `/api/contacts/:id` - Update contact status
- **DELETE** `/api/contacts/:id` - Delete contact

## Admin Dashboard Features

### Statistics Overview
- Total contacts
- New messages
- Read messages  
- Replied messages

### Contact Management
- **View all submissions** with date, name, email, message
- **Status management**: Mark as read/replied
- **Delete contacts** with confirmation
- **Auto-refresh** every 30 seconds
- **Responsive design** for mobile devices

### Status Types
- **New**: Unread contact submissions
- **Read**: Viewed but not yet replied
- **Replied**: Contact has been responded to

## Contact Form Features

### Frontend Validation
- Required field validation
- Email format validation
- Real-time feedback

### Backend Processing
- Server-side validation
- MongoDB storage
- Error handling
- Success confirmation

### User Experience
- Loading states during submission
- Form clearing after successful submission
- Visual feedback for success/error states

## Database Schema

The contacts are stored in `contacts.json` file with the following structure:

```json
{
  "id": "unique_timestamp_id",
  "name": "Contact Name",
  "email": "email@example.com", 
  "message": "Contact message",
  "date": "2026-04-12T09:47:24.297Z",
  "status": "new" // new, read, replied
}
```

## Customization

### Port Configuration
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your preferred port
```

### MongoDB Connection
Update the MongoDB connection string in `server.js`:
```javascript
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

### Styling
All styles are embedded in the HTML files using CSS custom properties. Modify the `:root` section in any HTML file to change colors:
```css
:root {
  --accent: #00ffaa;     /* Primary green */
  --accent2: #00c4ff;    /* Secondary blue */
  --accent3: #ff6b6b;    /* Accent red */
  /* ... other colors */
}
```

## Deployment

### Local Development
1. Install dependencies: `npm install`
2. Start MongoDB
3. Run: `npm run dev`

### Production Deployment
1. Install dependencies: `npm install --production`
2. Set environment variables
3. Start: `npm start`

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string

## Security Considerations

- Input validation on both frontend and backend
- Email format validation
- XSS prevention through proper escaping
- CORS configuration for API access

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in server.js
- Verify database permissions

### Port Already in Use
- Change the PORT in server.js
- Kill processes using the port: `netstat -ano | findstr :3000`

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

## Support

For any issues or questions:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check network connectivity for API calls

---

**Built with**: Node.js, Express, MongoDB, HTML5, CSS3, JavaScript
**Author**: Sumit Kumawat
**Version**: 1.0.0
