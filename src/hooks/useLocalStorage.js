
// Custom hook to handle localStorage operations
const useLocalStorage = () => {
    const USER_STORAGE_KEY = 'projectify_user';
    
    const saveUser = (user) => {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    };
    
    const getUser = () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    };
    
    return { saveUser, getUser };
  };
  
  export default useLocalStorage;