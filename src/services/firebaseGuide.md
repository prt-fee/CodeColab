
# Firebase Integration Guide

This project has been integrated with Firebase for backend functionality. Follow these steps to properly set up and use Firebase with this application.

## Setup Steps

1. **Firebase Project Setup**
   - Make sure your Firebase project is created at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage services

2. **Firebase Authentication**
   - In the Firebase Console, go to Authentication
   - Enable Email/Password authentication
   - (Optional) Configure any other authentication methods you want to use

3. **Firestore Database**
   - In the Firebase Console, go to Firestore Database
   - Create a database if you haven't already
   - Start in test mode initially, then configure security rules

4. **Storage Setup**
   - In the Firebase Console, go to Storage
   - Initialize Storage if not already done
   - Configure appropriate security rules

## Database Structure

The application uses the following Firestore collections:

1. **users**
   - Document ID: User's UID from Firebase Auth
   - Fields:
     - name: User's display name
     - email: User's email
     - avatar: URL to user's avatar image
     - createdAt: Timestamp

2. **projects**
   - Document ID: Auto-generated
   - Fields:
     - title: Project title
     - description: Project description
     - color: Project color theme
     - dueDate: Due date (timestamp)
     - userId: Owner's user ID
     - members: Array of user IDs or user objects
     - tasksCount: Object with total and completed counts
     - files: Array of file metadata
     - collaborators: Array of user objects
     - createdAt: Timestamp
     - updatedAt: Timestamp

3. **tasks**
   - Document ID: Auto-generated
   - Fields:
     - title: Task title
     - description: Task description
     - status: "todo", "in-progress", or "completed"
     - priority: "low", "medium", or "high"
     - projectId: Associated project ID
     - userId: Creator's user ID
     - assignedTo: User ID task is assigned to
     - dueDate: Due date (timestamp)
     - createdAt: Timestamp
     - updatedAt: Timestamp

4. **meetings**
   - Document ID: Auto-generated
   - Fields:
     - title: Meeting title
     - description: Meeting description
     - date: Meeting date and time (timestamp)
     - duration: Duration in minutes
     - projectId: Associated project ID
     - attendees: Array of user IDs or user objects
     - createdAt: Timestamp

## Security Rules

Here are the recommended security rules for Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Project rules
    match /projects/{projectId} {
      // Users can read projects they own or are members of
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid in resource.data.members);
      
      // Only authenticated users can create projects
      allow create: if request.auth != null;
      
      // Only the owner can update or delete projects
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Task rules
    match /tasks/{taskId} {
      // Get the project this task belongs to
      function getProject() {
        return get(/databases/$(database)/documents/projects/$(resource.data.projectId));
      }
      
      // Users can read tasks for projects they own or are members of
      allow read: if request.auth != null && 
        (getProject().data.userId == request.auth.uid || 
         request.auth.uid in getProject().data.members);
      
      // Only authenticated users can create tasks
      allow create: if request.auth != null;
      
      // Users can update tasks if they created them or are project owners
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         getProject().data.userId == request.auth.uid);
    }
    
    // Meeting rules - similar to tasks
    match /meetings/{meetingId} {
      function getProject() {
        return get(/databases/$(database)/documents/projects/$(resource.data.projectId));
      }
      
      allow read: if request.auth != null && 
        (getProject().data.userId == request.auth.uid || 
         request.auth.uid in getProject().data.members);
      
      allow create: if request.auth != null;
      
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         getProject().data.userId == request.auth.uid);
    }
  }
}
```

And for Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{userId}/{allPaths=**} {
      // Users can read/write only their own project files
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /avatars/{userId} {
      // Anyone can read avatar images, only the owner can write
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Important Notes

1. This integration preserves the existing functionality while moving data storage to Firebase.
2. The first time you run the application with Firebase, mock data will be created in your Firestore database.
3. The app uses Firebase Authentication for user management.
4. File uploads in the project deployment feature use Firebase Storage.

## Troubleshooting

If you encounter issues:

1. Check the browser console for specific error messages
2. Verify your Firebase project configuration in `src/services/firebase.js`
3. Ensure you've enabled all required Firebase services (Auth, Firestore, Storage)
4. Verify your security rules are properly configured
5. Check if your Firebase project billing plan supports the features you're using
