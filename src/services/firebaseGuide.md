
# Firebase Integration Guide

This guide explains how the Firebase integration works in this project and how to complete the setup.

## 1. Prerequisites

1. Create a Firebase account if you don't have one at [firebase.google.com](https://firebase.google.com)
2. Create a new Firebase project in the Firebase console
3. Enable Authentication, Firestore Database, and Storage services

## 2. Configure Firebase

In `src/services/firebase.js`, update the `firebaseConfig` object with your project's credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

You can find these values in the Firebase console by:
1. Going to Project Settings (gear icon)
2. Scrolling down to "Your apps" section 
3. Click on the web app you created (or create one if you haven't)
4. Copy the values from the `firebaseConfig` object

## 3. Firebase Authentication

Our app uses Firebase Email/Password authentication, already implemented in `AuthContext.jsx`. Enable Email/Password sign-in in the Firebase console:

1. Go to Authentication > Sign-in method
2. Click on Email/Password and enable it
3. Save the changes

## 4. Firestore Database

Set up your Firestore Database security rules:

1. Go to Firestore Database > Rules
2. Update with the following rules (basic setup, enhance as needed):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.collaborators);
    }
  }
}
```

## 5. Firebase Storage

Set up Storage security rules:

1. Go to Storage > Rules
2. Update with the following rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{projectId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Firestore Data Structure

The application uses the following collections:

### Users Collection
- Document ID: User's UID from Firebase Auth
- Fields:
  - id: String (same as document ID)
  - name: String
  - email: String
  - avatar: String (URL)
  - createdAt: Timestamp

### Projects Collection
- Document ID: Auto-generated
- Fields:
  - title: String
  - description: String
  - ownerId: String (User ID)
  - color: String
  - dueDate: Timestamp
  - collaborators: Array of user IDs
  - members: Array of objects (user info)
  - files: Array of file objects
  - meetings: Array of meeting objects
  - commits: Array of commit objects
  - tasks: Array of task objects
  - collaborationActivity: Array of activity objects
  - createdAt: Timestamp
  - updatedAt: Timestamp

## 7. Deployed Services

This application interacts with Firebase through the following services:

1. `AuthContext.jsx` - User authentication
2. `projectsService.js` - Project CRUD operations
3. `ProjectDeployment.jsx` - File uploads to Firebase Storage
4. `MeetingScheduler.jsx` - Meeting management

## 8. Local Development

For local development:

1. Make sure you have the Firebase configuration set up
2. Use the Firebase emulators for local testing (optional):
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Run emulators: `firebase emulators:start`
   - Connect your app to emulators (requires additional code changes)

## 9. Production Deployment

For deploying to production:

1. Ensure your Firebase project is set up for production
2. Secure your API keys as needed
3. Consider setting up Firebase Hosting for your frontend
4. Implement proper error handling and user feedback

## 10. Further Enhancements

Consider these enhancements:

1. Implement more robust security rules
2. Set up Firebase Functions for server-side operations
3. Add real-time data syncing using Firestore's onSnapshot
4. Implement Firebase Analytics to track user behavior
