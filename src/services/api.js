
import { toast } from "@/hooks/use-toast";

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Helper to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || response.statusText;
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    });
    throw new Error(error);
  }
  
  return data;
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },
  
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Project API calls
export const projectAPI = {
  getProjects: async () => {
    const response = await fetch(`${API_URL}/projects`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  createProject: async (projectData) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },
  
  updateProject: async (id, projectData) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },
  
  deleteProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Task API calls
export const taskAPI = {
  getTasks: async (projectId) => {
    const url = projectId 
      ? `${API_URL}/tasks?projectId=${projectId}` 
      : `${API_URL}/tasks`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  createTask: async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },
  
  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },
  
  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// User API calls
export const userAPI = {
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getUser: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Meeting API calls (to be implemented)
export const meetingAPI = {
  getMeetings: async (projectId) => {
    const url = projectId 
      ? `${API_URL}/meetings?projectId=${projectId}` 
      : `${API_URL}/meetings`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  createMeeting: async (meetingData) => {
    const response = await fetch(`${API_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(meetingData)
    });
    return handleResponse(response);
  },
  
  updateMeeting: async (id, meetingData) => {
    const response = await fetch(`${API_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(meetingData)
    });
    return handleResponse(response);
  },
  
  deleteMeeting: async (id) => {
    const response = await fetch(`${API_URL}/meetings/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};
