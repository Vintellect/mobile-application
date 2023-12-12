// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOutUser, auth } from './firebaseAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for user state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if(authUser && authUser['stsTokenManager'] && authUser['stsTokenManager']['accessToken']) {
        handleIsAdmin(authUser);
      }
      
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  

  const handleSignUp = async (email, password, displayName) => {
    try {
      setUser( await signUp(email, password, displayName));
    } catch (error) {
      console.error('Sign-up error:', error);
    }
  };



  const handleIsAdmin = async (authenticatedUser) => {
    const response = await fetch(`https://vintellect.ew.r.appspot.com/isAdmin?token=${authenticatedUser['stsTokenManager']['accessToken']}`);
      if (!response.ok) {
        throw new Error('Failed to verify admin status');
      }
      const is_admin = await response.json();
      console.log(is_admin)
      setIsAdmin(is_admin["is_admin"]);
  }

  const handleSignIn = async (email, password) => {
    try {
      const authenticatedUser = await signIn(email, password); 
      // TODO: Wait for this     
      handleIsAdmin(authenticatedUser);
      setUser(authenticatedUser);
      console.log(`Access Token ==> ${authenticatedUser['stsTokenManager']['accessToken']}`)
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const authContextValue = {
    user,
    loading,
    isAdmin,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}

