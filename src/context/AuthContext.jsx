import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const APP_NAME = 'Web-Hub-Tech-Partner';

  const logActivity = (action, user = currentUser) => {
    if (!user) return;
    const logRef = doc(db, APP_NAME, 'root', 'activityLogs', Date.now().toString() + Math.random().toString(36).substring(7));
    setDoc(logRef, {
      uid: user.uid,
      email: user.email,
      action,
      timestamp: serverTimestamp()
    }).catch(() => {}); // non-blocking
  };

  const createUserProfile = async (user, additionalData = {}) => {
    if (!user || !user.email) return;
    const emailKey = user.email;
    const userRef = doc(db, APP_NAME, 'root', 'users', emailKey);
    const configRef = doc(db, APP_NAME, 'root', 'appMeta', 'config');

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (userDoc.exists()) {
          return; // User already exists
        }

        const configDoc = await transaction.get(configRef);
        let isFirstUser = true;
        let totalUsers = 0;

        if (configDoc.exists()) {
          const configData = configDoc.data();
          isFirstUser = !configData.firstUserRegistered;
          totalUsers = configData.totalUsers || 0;
        }

        const { email, displayName, photoURL, uid } = user;
        const nameParts = (displayName || additionalData.firstName || '').split(' ');
        const firstName = additionalData.firstName || nameParts[0] || '';
        const lastName = additionalData.lastName || nameParts.slice(1).join(' ') || '';

        const newProfile = {
          uid,
          email,
          firstName,
          lastName,
          position: additionalData.position || '',
          role: isFirstUser ? ['MasterAdmin'] : ['User'],
          status: isFirstUser ? 'approved' : 'pending',
          assignedProjects: [],
          createdAt: serverTimestamp(),
          photoURL: photoURL || '',
          isFirstUser
        };

        transaction.set(userRef, newProfile);
        
        transaction.set(configRef, {
          firstUserRegistered: true,
          totalUsers: totalUsers + 1,
          createdAt: configDoc.exists() ? configDoc.data().createdAt : serverTimestamp()
        }, { merge: true });

      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  const fetchUserData = async (email) => {
    try {
      const userRef = doc(db, APP_NAME, 'root', 'users', email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const refreshProfile = async () => {
    if (currentUser && currentUser.email) {
      await fetchUserData(currentUser.email);
    }
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    logActivity('LOGIN', cred.user);
    return cred;
  };

  const register = async (email, password, firstName, lastName, position) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(userCredential.user, { displayName });
    await createUserProfile(userCredential.user, { firstName, lastName, position });
    logActivity('REGISTER', userCredential.user);
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    logActivity('LOGIN', result.user);
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        try {
           await fetchUserData(user.email);
        } catch (e) {
           console.error("Error fetching user data", e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    refreshProfile,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Expose children even if user Profile is still fetching, let ProtectedRoute handle spinners */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
