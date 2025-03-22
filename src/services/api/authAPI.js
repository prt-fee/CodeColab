
import { firebaseAuth } from "../firebase";
import { handleResponse } from "./utils";

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
