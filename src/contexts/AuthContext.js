import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      console.log('Setting auth persistence...');
      // Try session persistence first, fallback to in-memory if needed
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (persistenceError) {
        console.warn('Session persistence not available, using in-memory:', persistenceError);
        await setPersistence(auth, inMemoryPersistence);
      }
      
      console.log('Signing in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user) {
        throw new Error('No user returned from sign in');
      }
      
      console.log('Login successful, user:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      });
      
      return userCredential;
    } catch (error) {
      console.error('Login error details:', {
        code: error.code,
        message: error.message,
        email: email,
        time: new Date().toISOString()
      });
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const handleAuthStateChanged = async (user) => {
      console.log('Auth state changed:', user ? `User logged in (${user.email})` : 'No user');
      
      if (user) {
        // Force token refresh to ensure valid session
        try {
          const idToken = await user.getIdToken(true);
          console.log('Refreshed ID token:', idToken ? 'Token received' : 'No token');
        } catch (tokenError) {
          console.error('Error refreshing token:', tokenError);
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(
      auth,
      handleAuthStateChanged,
      (error) => {
        console.error('Auth state error:', {
          code: error.code,
          message: error.message,
          time: new Date().toISOString()
        });
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
