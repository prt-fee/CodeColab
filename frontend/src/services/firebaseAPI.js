import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off
} from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from "./firebase";
import { toast } from "@/hooks/use-toast";

// Helper to convert Firebase snapshot to array
const snapshotToArray = (snapshot) => {
  const items = [];
  snapshot.forEach((childSnapshot) => {
    items.push({
      id: childSnapshot.key,
      ...childSnapshot.val()
    });
  });
  return items;
};

// Auth API methods
export const authAPI = {
  login: async (credentials) => {
    try {
      const { email, password } = credentials;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user data from database if needed
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return {
          id: user.uid,
          name: userData.name || user.displayName,
          email: user.email,
          avatar: userData.avatar || user.photoURL
        };
      } else {
        // Create user data if it doesn't exist
        const newUser = {
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email: user.email,
          avatar: user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        await set(userRef, newUser);
        return newUser;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  },
  
  register: async (userData) => {
    try {
      const { name, email, password } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, {
        displayName: name
      });
      
      // Save additional user data
      const userRef = ref(database, `users/${user.uid}`);
      const newUser = {
        id: user.uid,
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date().toISOString()
      };
      
      await set(userRef, newUser);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Failed to register");
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  },
  
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          // Get user data from database
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            resolve({
              id: user.uid,
              name: userData.name || user.displayName,
              email: user.email,
              avatar: userData.avatar || user.photoURL
            });
          } else {
            resolve({
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              avatar: user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
            });
          }
        } else {
          resolve(null);
        }
      }, reject);
    });
  }
};

// Project API methods
export const projectAPI = {
  getProjects: async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const projectsRef = ref(database, 'projects');
      const userProjectsQuery = query(projectsRef, orderByChild('owner'), equalTo(userId));
      
      const snapshot = await get(userProjectsQuery);
      if (snapshot.exists()) {
        return snapshotToArray(snapshot);
      }
      return [];
    } catch (error) {
      console.error("Get projects error:", error);
      throw new Error(error.message || "Failed to fetch projects");
    }
  },
  
  getProject: async (id) => {
    try {
      const projectRef = ref(database, `projects/${id}`);
      const snapshot = await get(projectRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.key,
          ...snapshot.val()
        };
      } else {
        throw new Error("Project not found");
      }
    } catch (error) {
      console.error("Get project error:", error);
      throw new Error(error.message || "Failed to fetch project");
    }
  },
  
  createProject: async (projectData) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const projectsRef = ref(database, 'projects');
      const newProjectRef = push(projectsRef);
      
      const project = {
        ...projectData,
        owner: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newProjectRef, project);
      
      return {
        id: newProjectRef.key,
        ...project
      };
    } catch (error) {
      console.error("Create project error:", error);
      throw new Error(error.message || "Failed to create project");
    }
  },
  
  updateProject: async (id, projectData) => {
    try {
      const projectRef = ref(database, `projects/${id}`);
      
      const updates = {
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      
      await update(projectRef, updates);
      
      return {
        id,
        ...updates
      };
    } catch (error) {
      console.error("Update project error:", error);
      throw new Error(error.message || "Failed to update project");
    }
  },
  
  deleteProject: async (id) => {
    try {
      const projectRef = ref(database, `projects/${id}`);
      await remove(projectRef);
      
      return { success: true };
    } catch (error) {
      console.error("Delete project error:", error);
      throw new Error(error.message || "Failed to delete project");
    }
  }
};

// Task API methods
export const taskAPI = {
  getTasks: async (projectId) => {
    try {
      const tasksRef = ref(database, 'tasks');
      let taskQuery;
      
      if (projectId) {
        taskQuery = query(tasksRef, orderByChild('projectId'), equalTo(projectId));
      } else {
        // If no projectId is provided, get tasks for current user
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User not authenticated");
        
        taskQuery = query(tasksRef, orderByChild('assignedTo'), equalTo(userId));
      }
      
      const snapshot = await get(taskQuery);
      
      if (snapshot.exists()) {
        return snapshotToArray(snapshot);
      }
      return [];
    } catch (error) {
      console.error("Get tasks error:", error);
      throw new Error(error.message || "Failed to fetch tasks");
    }
  },
  
  getTask: async (id) => {
    try {
      const taskRef = ref(database, `tasks/${id}`);
      const snapshot = await get(taskRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.key,
          ...snapshot.val()
        };
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error("Get task error:", error);
      throw new Error(error.message || "Failed to fetch task");
    }
  },
  
  createTask: async (taskData) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const tasksRef = ref(database, 'tasks');
      const newTaskRef = push(tasksRef);
      
      const task = {
        ...taskData,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newTaskRef, task);
      
      // Update project task count
      if (taskData.projectId) {
        const projectRef = ref(database, `projects/${taskData.projectId}`);
        const projectSnapshot = await get(projectRef);
        
        if (projectSnapshot.exists()) {
          const project = projectSnapshot.val();
          const tasksCount = project.tasksCount || { total: 0, completed: 0 };
          
          await update(projectRef, {
            tasksCount: {
              total: tasksCount.total + 1,
              completed: taskData.status === 'completed' ? tasksCount.completed + 1 : tasksCount.completed
            }
          });
        }
      }
      
      return {
        id: newTaskRef.key,
        ...task
      };
    } catch (error) {
      console.error("Create task error:", error);
      throw new Error(error.message || "Failed to create task");
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      const taskRef = ref(database, `tasks/${id}`);
      const taskSnapshot = await get(taskRef);
      
      if (!taskSnapshot.exists()) {
        throw new Error("Task not found");
      }
      
      const oldTask = taskSnapshot.val();
      const updates = {
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      
      await update(taskRef, updates);
      
      // Update project task count if status changed to/from completed
      if (oldTask.projectId && updates.status !== undefined && oldTask.status !== updates.status) {
        const projectRef = ref(database, `projects/${oldTask.projectId}`);
        const projectSnapshot = await get(projectRef);
        
        if (projectSnapshot.exists()) {
          const project = projectSnapshot.val();
          const tasksCount = project.tasksCount || { total: 0, completed: 0 };
          
          let completedDelta = 0;
          if (oldTask.status !== 'completed' && updates.status === 'completed') {
            completedDelta = 1;
          } else if (oldTask.status === 'completed' && updates.status !== 'completed') {
            completedDelta = -1;
          }
          
          if (completedDelta !== 0) {
            await update(projectRef, {
              tasksCount: {
                total: tasksCount.total,
                completed: Math.max(0, tasksCount.completed + completedDelta)
              }
            });
          }
        }
      }
      
      return {
        id,
        ...updates
      };
    } catch (error) {
      console.error("Update task error:", error);
      throw new Error(error.message || "Failed to update task");
    }
  },
  
  deleteTask: async (id) => {
    try {
      const taskRef = ref(database, `tasks/${id}`);
      const taskSnapshot = await get(taskRef);
      
      if (!taskSnapshot.exists()) {
        throw new Error("Task not found");
      }
      
      const task = taskSnapshot.val();
      
      await remove(taskRef);
      
      // Update project task count
      if (task.projectId) {
        const projectRef = ref(database, `projects/${task.projectId}`);
        const projectSnapshot = await get(projectRef);
        
        if (projectSnapshot.exists()) {
          const project = projectSnapshot.val();
          const tasksCount = project.tasksCount || { total: 0, completed: 0 };
          
          await update(projectRef, {
            tasksCount: {
              total: Math.max(0, tasksCount.total - 1),
              completed: task.status === 'completed' ? Math.max(0, tasksCount.completed - 1) : tasksCount.completed
            }
          });
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Delete task error:", error);
      throw new Error(error.message || "Failed to delete task");
    }
  }
};

// User API methods
export const userAPI = {
  getUsers: async () => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        return snapshotToArray(snapshot);
      }
      return [];
    } catch (error) {
      console.error("Get users error:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  },
  
  getUser: async (id) => {
    try {
      const userRef = ref(database, `users/${id}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.key,
          ...snapshot.val()
        };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Get user error:", error);
      throw new Error(error.message || "Failed to fetch user");
    }
  }
};

// Meeting API methods
export const meetingAPI = {
  getMeetings: async (projectId) => {
    try {
      const meetingsRef = ref(database, 'meetings');
      let meetingQuery;
      
      if (projectId) {
        meetingQuery = query(meetingsRef, orderByChild('projectId'), equalTo(projectId));
      } else {
        // If no projectId is provided, get meetings for current user
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User not authenticated");
        
        // This is a simplified approach - in a real app you might need a more complex query
        meetingQuery = query(meetingsRef, orderByChild('createdBy'), equalTo(userId));
      }
      
      const snapshot = await get(meetingQuery);
      
      if (snapshot.exists()) {
        return snapshotToArray(snapshot);
      }
      return [];
    } catch (error) {
      console.error("Get meetings error:", error);
      throw new Error(error.message || "Failed to fetch meetings");
    }
  },
  
  createMeeting: async (meetingData) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const meetingsRef = ref(database, 'meetings');
      const newMeetingRef = push(meetingsRef);
      
      const meeting = {
        ...meetingData,
        createdBy: userId,
        createdAt: new Date().toISOString()
      };
      
      await set(newMeetingRef, meeting);
      
      return {
        id: newMeetingRef.key,
        ...meeting
      };
    } catch (error) {
      console.error("Create meeting error:", error);
      throw new Error(error.message || "Failed to create meeting");
    }
  },
  
  updateMeeting: async (id, meetingData) => {
    try {
      const meetingRef = ref(database, `meetings/${id}`);
      
      const updates = {
        ...meetingData,
        updatedAt: new Date().toISOString()
      };
      
      await update(meetingRef, updates);
      
      return {
        id,
        ...updates
      };
    } catch (error) {
      console.error("Update meeting error:", error);
      throw new Error(error.message || "Failed to update meeting");
    }
  },
  
  deleteMeeting: async (id) => {
    try {
      const meetingRef = ref(database, `meetings/${id}`);
      await remove(meetingRef);
      
      return { success: true };
    } catch (error) {
      console.error("Delete meeting error:", error);
      throw new Error(error.message || "Failed to delete meeting");
    }
  }
};

// Utilities for real-time listeners
export const listenTo = (path, callback) => {
  const dbRef = ref(database, path);
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      if (Array.isArray(snapshot.val())) {
        callback(snapshot.val());
      } else {
        callback({
          id: snapshot.key,
          ...snapshot.val()
        });
      }
    } else {
      callback(null);
    }
  });
  
  // Return function to unsubscribe
  return () => off(dbRef);
};

export const listenToList = (path, orderBy = null, equalToValue = null, callback, errorCallback = () => {}) => {
  let dbRef = ref(database, path);
  
  if (orderBy && equalToValue) {
    dbRef = query(dbRef, orderByChild(orderBy), equalTo(equalToValue));
  } else if (orderBy) {
    dbRef = query(dbRef, orderByChild(orderBy));
  }
  
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const items = snapshotToArray(snapshot);
      callback(items);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error in Firebase listener:', error);
    errorCallback(error);
  });
  
  // Return function to unsubscribe
  return () => off(dbRef);
};