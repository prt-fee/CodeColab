
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Create the context
// const AuthContext = createContext(null);

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check if user is already logged in
//   useEffect(() => {
//     const checkAuth = () => {
//       const storedUser = localStorage.getItem('projectify_user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Login function
//   const login = (email, password) => {
//     setIsLoading(true);
    
//     try {
//       // In a real app, you would validate credentials with your API
//       if (email && password) {
//         // Instead of using MOCK_USER, create a user with the provided email
//         const loginUser = {
//           id: '1',
//           name: email.split('@')[0], // Use the part before @ as a simple name
//           email: email,
//           avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
//         };
        
//         setUser(loginUser);
//         localStorage.setItem('projectify_user', JSON.stringify(loginUser));
//         setIsLoading(false);
//         return true;
//       } else {
//         throw new Error('Invalid credentials');
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Register function
//   const register = (name, email, password) => {
//     setIsLoading(true);
    
//     try {
//       // In a real app, you would register the user with your API
//       if (name && email && password) {
//         const newUser = {
//           id: '1',
//           name: name,
//           email: email,
//           avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
//         };
//         setUser(newUser);
//         localStorage.setItem('projectify_user', JSON.stringify(newUser));
//         setIsLoading(false);
//         return true;
//       } else {
//         throw new Error('Invalid registration data');
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   // Logout function - updated to redirect to index page
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('projectify_user');
//     navigate('/'); // Changed from /login to / (index page)
//   };

//   // Update user function
//   const updateUser = (updatedUserData) => {
//     if (user) {
//       const updatedUser = {...user, ...updatedUserData};
//       setUser(updatedUser);
//       localStorage.setItem('projectify_user', JSON.stringify(updatedUser));
//       return true;
//     }
//     return false;
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       isAuthenticated: !!user, 
//       loading: isLoading, 
//       login, 
//       register, 
//       logout,
//       updateUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };







import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  logoutUser, 
  getUserData,
  subscribeToAuthChanges,
  updateUserProfile,
  createTestUser
} from '@/services/authService';
import useLocalStorage from '@/hooks/useLocalStorage';
import { showSuccessToast, showErrorToast } from '@/services/toastService';
import { debugFirebase } from '@/utils/debugFirebase';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { saveUser, getUser } = useLocalStorage();

  // Check if user is already logged in
  useEffect(() => {
    console.log("AuthProvider: Checking authentication status");
    
    // Try to load user from localStorage first as a fallback
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          console.log("AuthProvider: User is logged in:", firebaseUser.uid);
          try {
            const userDetails = await getUserData(firebaseUser);
            setUser(userDetails);
            saveUser(userDetails);
          } catch (dataError) {
            console.error("Error getting user data:", dataError);
            
            // If we get a permission denied error, attempt to create the user in the database
            if (dataError.message && dataError.message.includes('Permission denied')) {
              try {
                // Create basic user profile since it doesn't exist
                const basicUserInfo = {
                  id: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  email: firebaseUser.email,
                  avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg',
                  createdAt: new Date().toISOString()
                };
                
                // Try to update the user profile
                await updateUserProfile(firebaseUser.uid, basicUserInfo);
                setUser(basicUserInfo);
                saveUser(basicUserInfo);
              } catch (createError) {
                console.error("Failed to create user profile:", createError);
                
                // Fallback to basic user info if all fails
                const fallbackUserInfo = {
                  id: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  email: firebaseUser.email,
                  avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
                };
                setUser(fallbackUserInfo);
                saveUser(fallbackUserInfo);
              }
            } else {
              // Fallback to basic user info
              const basicUserInfo = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                email: firebaseUser.email,
                avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
              };
              setUser(basicUserInfo);
              saveUser(basicUserInfo);
            }
          }
        } else {
          console.log("AuthProvider: No user logged in");
          setUser(null);
          saveUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        saveUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    // For development, create a test user automatically if in development mode
    if (process.env.NODE_ENV === 'development') {
      // Uncomment the next line to create test user on startup
      // createTestUser();
    }
    
    // Debugging - can be removed in production
    if (process.env.NODE_ENV === 'development') {
      window.debugFirebase = debugFirebase;
    }

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      const userDetails = await loginWithEmailPassword(email, password);
      console.log("Login successful:", userDetails);
      
      setUser(userDetails);
      saveUser(userDetails);
      
      showSuccessToast(
        "Login successful",
        "Welcome back!"
      );
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific Firebase error codes
      let errorMessage;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please register first.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else {
        errorMessage = error.message || "Invalid credentials";
      }
      
      showErrorToast(
        "Login failed",
        errorMessage
      );
      
      throw new Error(errorMessage, { cause: error });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting registration for:", email);
      const userDetails = await registerWithEmailPassword(name, email, password);
      setUser(userDetails);
      saveUser(userDetails);
      
      showSuccessToast(
        "Registration successful",
        "Your account has been created"
      );
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific Firebase error codes
      let errorMessage;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please log in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else {
        errorMessage = error.message || "Could not create account";
      }
      
      showErrorToast(
        "Registration failed",
        errorMessage
      );
      
      throw new Error(errorMessage, { cause: error });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      saveUser(null);
      
      showSuccessToast(
        "Logged out",
        "You've been successfully logged out"
      );
      
      navigate('/');
    } catch (error) {
      showErrorToast(
        "Logout failed",
        error.message || "Could not log out"
      );
    }
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    if (!user) return false;
    
    try {
      await updateUserProfile(user.id, updatedUserData);
      const updatedUser = {...user, ...updatedUserData};
      setUser(updatedUser);
      saveUser(updatedUser);
      
      showSuccessToast(
        "Profile updated",
        "Your profile has been successfully updated"
      );
      
      return true;
    } catch (error) {
      showErrorToast(
        "Update failed",
        error.message || "Could not update profile"
      );
      return false;
    }
  };

  // Context value
  const contextValue = {
    user, 
    isAuthenticated: !!user, 
    loading: isLoading, 
    login, 
    register, 
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};