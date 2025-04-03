
import { auth, database } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';

// This function can be used to create a test user in the Firebase console
// or can be modified to run from a development tool
export const createTestUser = async () => {
  try {
    // Test user credentials
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';
    
    console.log('Creating test user...');
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, {
      displayName: name,
      photoURL: 'https://randomuser.me/api/portraits/men/1.jpg'
    });
    
    // Save user data to Firebase Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    const userData = {
      id: user.uid,
      name: name,
      email: email,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      createdAt: new Date().toISOString()
    };
    
    await set(userRef, userData);
    
    console.log('Test user created successfully:', user.uid);
    console.log('Email:', email);
    console.log('Password:', password);
    
    return user.uid;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

// You can run this function from the browser console during development:
// import { createTestUser } from './utils/createTestUser.js';
// createTestUser().then(userId => console.log('Created user ID:', userId));
