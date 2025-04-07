
import { auth, database } from '@/services/firebase';
import { ref, get } from 'firebase/database';

/**
 * Utility function to debug Firebase access permissions and connectivity
 * @returns {Promise<Object>} Firebase debug information
 */
export const debugFirebase = async () => {
  const debugInfo = {
    auth: {
      initialized: !!auth,
      currentUser: null,
      error: null
    },
    database: {
      initialized: !!database,
      connected: false,
      error: null
    },
    permissions: {
      readProjects: false,
      writeProjects: false,
      readTasks: false,
      writeTasks: false,
      error: null
    }
  };

  try {
    // Check auth status
    if (auth.currentUser) {
      debugInfo.auth.currentUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName
      };
    }

    // Check database connection
    const connectedRef = ref(database, '.info/connected');
    const connectedSnapshot = await get(connectedRef);
    debugInfo.database.connected = connectedSnapshot.val() === true;

    // Check permissions
    if (auth.currentUser) {
      // Try to read projects
      try {
        const projectsRef = ref(database, 'projects');
        await get(projectsRef);
        debugInfo.permissions.readProjects = true;
      } catch (error) {
        debugInfo.permissions.error = error.message;
      }

      // Try to read tasks
      try {
        const tasksRef = ref(database, 'tasks');
        await get(tasksRef);
        debugInfo.permissions.readTasks = true;
      } catch (error) {
        if (!debugInfo.permissions.error) {
          debugInfo.permissions.error = error.message;
        }
      }
    }

    console.log('Firebase debug info:', debugInfo);
    return debugInfo;

  } catch (error) {
    console.error('Error in debugFirebase:', error);
    return {
      ...debugInfo,
      error: error.message
    };
  }
};

export default debugFirebase;
