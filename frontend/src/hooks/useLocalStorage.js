
// Custom hook to handle localStorage operations
const useLocalStorage = () => {
  const USER_STORAGE_KEY = 'projectify_user';
  const PROJECTS_STORAGE_KEY = 'projectify_projects';
  const TASKS_STORAGE_KEY = 'projectify_tasks';
  const MEETINGS_STORAGE_KEY = 'projectify_meetings';
  
  // User data storage functions
  const saveUser = (user) => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      console.log('User data saved to localStorage:', user.id);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log('User data removed from localStorage');
    }
  };
  
  const getUser = () => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error);
      return null;
    }
  };
  
  // Project data storage functions
  const saveProjects = (projects) => {
    if (projects && Array.isArray(projects)) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      console.log(`${projects.length} projects saved to localStorage`);
    }
  };
  
  const getProjects = () => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return storedProjects ? JSON.parse(storedProjects) : [];
    } catch (error) {
      console.error('Error retrieving projects from localStorage:', error);
      return [];
    }
  };
  
  // Task data storage functions
  const saveTasks = (tasks) => {
    if (tasks && Array.isArray(tasks)) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      console.log(`${tasks.length} tasks saved to localStorage`);
    }
  };
  
  const getTasks = () => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error retrieving tasks from localStorage:', error);
      return [];
    }
  };
  
  // Meeting data storage functions
  const saveMeetings = (meetings) => {
    if (meetings && Array.isArray(meetings)) {
      localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
      console.log(`${meetings.length} meetings saved to localStorage`);
    }
  };
  
  const getMeetings = () => {
    try {
      const storedMeetings = localStorage.getItem(MEETINGS_STORAGE_KEY);
      return storedMeetings ? JSON.parse(storedMeetings) : [];
    } catch (error) {
      console.error('Error retrieving meetings from localStorage:', error);
      return [];
    }
  };
  
  // Clear all stored data
  const clearAllData = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(TASKS_STORAGE_KEY);
    localStorage.removeItem(MEETINGS_STORAGE_KEY);
    console.log('All localStorage data cleared');
  };

  return { 
    saveUser, 
    getUser, 
    saveProjects, 
    getProjects, 
    saveTasks, 
    getTasks, 
    saveMeetings, 
    getMeetings,
    clearAllData 
  };
};

export default useLocalStorage;
