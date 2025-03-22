
import { firebaseStorage } from "../firebase";
import { handleResponse } from "./utils";

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
