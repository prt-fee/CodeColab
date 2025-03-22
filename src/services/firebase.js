
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEcXDRdwLijOZcqakGVELIaPhM55dsLAA",
  authDomain: "code-collab-dedbb.firebaseapp.com",
  projectId: "code-collab-dedbb",
  storageBucket: "code-collab-dedbb.firebasestorage.app",
  messagingSenderId: "239531618637",
  appId: "1:239531618637:web:f24724b61e53a7048a8704",
  measurementId: "G-3FPFPW0VZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
const firebaseAuth = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Firebase login error:", error);
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user profile with the name
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential.user;
    } catch (error) {
      console.error("Firebase registration error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Firebase logout error:", error);
      throw error;
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};

// Firestore database functions
const firestore = {
  // Project functions
  projects: {
    getAll: async (userId) => {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error getting projects:", error);
        throw error;
      }
    },

    getById: async (projectId) => {
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          };
        } else {
          throw new Error("Project not found");
        }
      } catch (error) {
        console.error("Error getting project:", error);
        throw error;
      }
    },

    create: async (projectData) => {
      try {
        const projectsRef = collection(db, 'projects');
        const newProjectRef = doc(projectsRef);
        
        await setDoc(newProjectRef, {
          ...projectData,
          id: newProjectRef.id,
          createdAt: new Date().toISOString()
        });
        
        return {
          id: newProjectRef.id,
          ...projectData
        };
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    },

    update: async (projectId, projectData) => {
      try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          ...projectData,
          updatedAt: new Date().toISOString()
        });
        
        return {
          id: projectId,
          ...projectData
        };
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },

    delete: async (projectId) => {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        return true;
      } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
      }
    }
  },

  // Task functions
  tasks: {
    getAll: async (projectId = null) => {
      try {
        const tasksRef = collection(db, 'tasks');
        let q;
        
        if (projectId) {
          q = query(tasksRef, where("projectId", "==", projectId));
        } else {
          q = query(tasksRef);
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error getting tasks:", error);
        throw error;
      }
    },

    create: async (taskData) => {
      try {
        const tasksRef = collection(db, 'tasks');
        const newTaskRef = doc(tasksRef);
        
        await setDoc(newTaskRef, {
          ...taskData,
          id: newTaskRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return {
          id: newTaskRef.id,
          ...taskData
        };
      } catch (error) {
        console.error("Error creating task:", error);
        throw error;
      }
    },

    update: async (taskId, taskData) => {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
          ...taskData,
          updatedAt: new Date().toISOString()
        });
        
        return {
          id: taskId,
          ...taskData
        };
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    },

    delete: async (taskId) => {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        return true;
      } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    }
  },

  // Meeting functions
  meetings: {
    getAll: async (projectId = null) => {
      try {
        const meetingsRef = collection(db, 'meetings');
        let q;
        
        if (projectId) {
          q = query(meetingsRef, where("projectId", "==", projectId));
        } else {
          q = query(meetingsRef);
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error getting meetings:", error);
        throw error;
      }
    },

    create: async (meetingData) => {
      try {
        const meetingsRef = collection(db, 'meetings');
        const newMeetingRef = doc(meetingsRef);
        
        await setDoc(newMeetingRef, {
          ...meetingData,
          id: newMeetingRef.id,
          createdAt: new Date().toISOString()
        });
        
        return {
          id: newMeetingRef.id,
          ...meetingData
        };
      } catch (error) {
        console.error("Error creating meeting:", error);
        throw error;
      }
    },

    update: async (meetingId, meetingData) => {
      try {
        const meetingRef = doc(db, 'meetings', meetingId);
        await updateDoc(meetingRef, {
          ...meetingData,
          updatedAt: new Date().toISOString()
        });
        
        return {
          id: meetingId,
          ...meetingData
        };
      } catch (error) {
        console.error("Error updating meeting:", error);
        throw error;
      }
    },

    delete: async (meetingId) => {
      try {
        await deleteDoc(doc(db, 'meetings', meetingId));
        return true;
      } catch (error) {
        console.error("Error deleting meeting:", error);
        throw error;
      }
    }
  }
};

// Storage functions
const firebaseStorage = {
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  getFileUrl: async (path) => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw error;
    }
  }
};

export { firebaseAuth, firestore, firebaseStorage };
