
import { db, storage } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Projects Collection Reference
const projectsCollection = collection(db, 'projects');

// Get all projects for a user
export const getUserProjects = async (userId) => {
  try {
    const q = query(
      projectsCollection, 
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
};

// Get projects where user is a collaborator
export const getCollaboratorProjects = async (userId) => {
  try {
    const q = query(
      projectsCollection, 
      where('collaborators', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting collaborator projects:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProject = async (projectId) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData, userId) => {
  try {
    const newProject = {
      ...projectData,
      ownerId: userId,
      collaborators: [],
      members: [],
      files: [],
      meetings: [],
      commits: [],
      tasks: [],
      collaborationActivity: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(projectsCollection, newProject);
    return {
      id: docRef.id,
      ...newProject
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: projectId,
      ...projectData
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Upload a file to a project
export const uploadProjectFile = async (projectId, userId, file) => {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `projects/${projectId}/files/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Add file info to project document
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    
    const projectData = projectDoc.data();
    const updatedFiles = [...(projectData.files || []), {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: downloadUrl,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString()
    }];
    
    // Update project with new file
    await updateDoc(projectRef, {
      files: updatedFiles,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: downloadUrl
    };
  } catch (error) {
    console.error('Error uploading project file:', error);
    throw error;
  }
};

// Add a meeting to a project
export const addProjectMeeting = async (projectId, meetingData) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    
    const projectData = projectDoc.data();
    const updatedMeetings = [...(projectData.meetings || []), {
      id: Date.now().toString(),
      ...meetingData,
      createdAt: new Date().toISOString()
    }];
    
    await updateDoc(projectRef, {
      meetings: updatedMeetings,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: Date.now().toString(),
      ...meetingData
    };
  } catch (error) {
    console.error('Error adding project meeting:', error);
    throw error;
  }
};

// Delete a meeting from a project
export const deleteProjectMeeting = async (projectId, meetingId) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    
    const projectData = projectDoc.data();
    const updatedMeetings = (projectData.meetings || []).filter(
      meeting => meeting.id !== meetingId
    );
    
    await updateDoc(projectRef, {
      meetings: updatedMeetings,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting project meeting:', error);
    throw error;
  }
};
