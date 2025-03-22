
import { firebaseAuth, firestore } from "../firebase";
import { handleResponse } from "./utils";

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
