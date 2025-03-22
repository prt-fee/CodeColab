
import { firebaseAuth, firestore } from "../firebase";
import { handleResponse } from "./utils";

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
