
import { firebaseAuth, firestore } from "../firebase";
import { handleResponse } from "./utils";

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
