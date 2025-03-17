# Backend Database Integration Guide

This document provides guidance on how to integrate a backend database with the project, replacing the current frontend-only data handling.

## Current Data Flow

Currently, the application uses:
- Mock data in JavaScript files
- LocalStorage for persistence
- Frontend state management

## Step 1: Setup Server API Endpoints

The `server/index.js` file already has routes set up for:
- `/api/auth` - Authentication
- `/api/projects` - Project management
- `/api/tasks` - Task management
- `/api/users` - User management
- `/api/chats` - Chat functionality

## Step 2: Connect to Database

In `server/index.js`, MongoDB connection is already configured:

```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
```

Ensure you have:
1. MongoDB installed or a MongoDB Atlas account
2. Set the `MONGODB_URI` in your `.env` file

## Step 3: Define Models

The server already has model files in `server/models/`:
- `User.js`
- `Project.js`
- `Task.js`
- `Chat.js`
- `Meeting.js`
- `Message.js`
- `Notification.js`

Make sure these models match your data structure requirements.

## Step 4: Implement Controllers

Create controller files for each model in `server/controllers/`:

Example for `projectController.js`:
```javascript
const Project = require('../models/Project');

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other CRUD operations...
```

## Step 5: Connect API Routes

Update routes in `server/routes/` to use your controllers.

## Step 6: Update Frontend API Service

The frontend already has an API service in `src/services/api.js` that is set up to communicate with the backend. The service includes methods for:

- Authentication (login, register, logout)
- Project operations (CRUD)
- Task operations (CRUD)
- User operations
- Meeting operations

When the backend is fully implemented, these methods will automatically work.

## Step 7: Replace Mock Data With API Calls

Files to update:
1. `src/hooks/useDashboard.jsx`
2. `src/hooks/useProjectData.jsx`
3. `src/hooks/useTaskManager.tsx`
4. Other data fetching hooks

Example update in `useDashboard.jsx`:
```javascript
// Replace this:
const savedProjects = localStorage.getItem('user_projects');
// With this:
const data = await projectAPI.getProjects();
setProjects(data);
```

## Step 8: Add Authentication Middleware

Ensure protected routes use authentication middleware:

```javascript
// In server/routes/projects.js
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, projectController.getProjects);
```

## Step 9: Testing

1. Test each API endpoint with Postman or similar tool
2. Test frontend integration
3. Verify data persistence

## Step 10: Deployment

When deploying:
1. Set up environment variables on your hosting provider
2. Ensure MongoDB connection is properly configured
3. Set up proper CORS settings for production

## Additional Resources

- MongoDB Documentation: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- Mongoose Documentation: [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
- Express.js Documentation: [https://expressjs.com/](https://expressjs.com/)
