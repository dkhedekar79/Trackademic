// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  // Run once when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // Auth functions
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // Profile functions
  const updateUserName = async (newName) => {
    if (!user) throw new Error("No user logged in");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: newName,
        updatedAt: new Date()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, name: newName, updatedAt: new Date() }));
      return true;
    } catch (error) {
      console.error("Error updating user name:", error);
      throw error;
    }
  };

  const deleteUserAccount = async () => {
    if (!user) throw new Error("No user logged in");

    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Delete Firebase Auth account
      await deleteUser(user);

      // Clear local state
      setUser(null);
      setUserProfile(null);
      return true;
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
