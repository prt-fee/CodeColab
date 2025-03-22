
import { toast } from "@/hooks/use-toast";
import { firebaseAuth, firestore, firebaseStorage } from "./firebase";

// Helper to handle API responses
const handleResponse = async (promise) => {
  try {
    const data = await promise;
    return data;
  } catch (error) {
    const errorMessage = error.message || "An error occurred";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    return handleResponse(
      firebaseAuth.login(credentials.email, credentials.password)
    );
  },
  
  register: async (userData) => {
    return handleResponse(
      firebaseAuth.register(userData.name, userData.email, userData.password)
    );
  },
  
  logout: async () => {
    return handleResponse(firebaseAuth.logout());
  },
  
  getCurrentUser: () => {
    return firebaseAuth.getCurrentUser();
  }
};

// Project API calls
export const projectAPI = {
  getProjects: async () => {
    const user = firebaseAuth.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    
    return handleResponse(
      firestore.projects.getAll(user.uid)
    );
  },
  
  getProject: async (id) => {
    return handleResponse(
      firestore.projects.getById(id)
    );
  },
  
  createProject: async (projectData) => {
    const user = firebaseAuth.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    
    return handleResponse(
      firestore.projects.create({
        ...projectData,
        userId: user.uid
      })
    );
  },
  
  updateProject: async (id, projectData) => {
    return handleResponse(
      firestore.projects.update(id, projectData)
    );
  },
  
  deleteProject: async (id) => {
    return handleResponse(
      firestore.projects.delete(id)
    );
  }
};

// Task API calls
export const taskAPI = {
  getTasks: async (projectId) => {
    return handleResponse(
      firestore.tasks.getAll(projectId)
    );
  },
  
  getTask: async (id) => {
    // Implement when needed
    throw new Error("Not implemented");
  },
  
  createTask: async (taskData) => {
    const user = firebaseAuth.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    
    return handleResponse(
      firestore.tasks.create({
        ...taskData,
        userId: user.uid
      })
    );
  },
  
  updateTask: async (id, taskData) => {
    return handleResponse(
      firestore.tasks.update(id, taskData)
    );
  },
  
  deleteTask: async (id) => {
    return handleResponse(
      firestore.tasks.delete(id)
    );
  }
};

// User API calls
export const userAPI = {
  getUsers: async () => {
    // Implement when needed - for now return empty array
    return [];
  },
  
  getUser: async (id) => {
    // Implement when needed
    throw new Error("Not implemented");
  }
};

// Meeting API calls
export const meetingAPI = {
  getMeetings: async (projectId) => {
    return handleResponse(
      firestore.meetings.getAll(projectId)
    );
  },
  
  createMeeting: async (meetingData) => {
    const user = firebaseAuth.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    
    return handleResponse(
      firestore.meetings.create({
        ...meetingData,
        userId: user.uid
      })
    );
  },
  
  updateMeeting: async (meetingId, meetingData) => {
    return handleResponse(
      firestore.meetings.update(meetingId, meetingData)
    );
  },
  
  deleteMeeting: async (meetingId) => {
    return handleResponse(
      firestore.meetings.delete(meetingId)
    );
  }
};

// File storage API
export const storageAPI = {
  uploadFile: async (file, path) => {
    return handleResponse(
      firebaseStorage.uploadFile(file, path)
    );
  },
  
  getFileUrl: async (path) => {
    return handleResponse(
      firebaseStorage.getFileUrl(path)
    );
  }
};
