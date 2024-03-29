import {
 GoogleAuthProvider, getAuth, signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,
 sendPasswordResetEmail, signOut, updateProfile, updatePassword, sendEmailVerification, deleteUser,} from "firebase/auth"

import {
getFirestore,query,getDocs,collection,where,setDoc, doc, updateDoc} from "firebase/firestore";

import React, { useState, useEffect, useContext, createContext } from "react";
import { app } from "../config/firebaseConfig.js";

// Code edited from https://usehooks.com/useAuth/ and
// https://firebase.google.com/docs/auth/web/start#add-initialize-sdk
// Not my original work.



// Initialize Firebase Authentication and get a reference to the service
const firebaseAuth = getAuth(app);

export const db = getFirestore(app);

const googleAuthProvider = new GoogleAuthProvider();


const authContext = createContext();
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};


// Provider hook that creates auth object and handles state
export function ProvideAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signout = () => {
    return firebaseAuth.signOut().then(() => {
      setUser(false);
    });
  };

  const sendPassResetEmail = (email) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  };

  const confirmPasswordReset = (code, password) => {
    return firebaseAuth.confirmPasswordReset(code, password).then(() => {
      return true;
    });
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          authProvider: "google",
          rooms: [],
          time: "",
        });
        await setDoc(doc(db, "friends", user.uid), {
          friends: [],
          friendRequest: [],
          sendRequest: [],
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = res.user;
      //await addDoc(collection(db, "users"), {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: user.photoURL,
        photoName: "",
        authProvider: "local",
        rooms: [],
        time: "",
      });

      await setDoc(doc(db, "friends", user.uid), {
        friends: [],
        friendRequest: [],
        sendRequest: [],
      });
    } catch (err) {
      alert(err.message);
    }
    updateProfile(firebaseAuth.currentUser, { displayName: name })
      .then()
      .catch((error) => {
        alert(error.message);
      });
    sendEmailVerification(firebaseAuth.currentUser).then(() => {
    });
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(firebaseAuth);
  };

  const updateDisplayName = async (name) => {
    await updateProfile(firebaseAuth.currentUser, { displayName: name });
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { name: name });
  };

  const changePassword = async (newPassword) => {
    await updatePassword(firebaseAuth.currentUser, newPassword);
  };

  const updateProfilePic = async (url) => {
    updateProfile(firebaseAuth.currentUser, {
      photoURL: url,
    });
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { photoURL: url });
  };

  const deleteAccount = () => {
    deleteUser(firebaseAuth.currentUser)
      .then(() => {})
      .catch((error) => {
        alert(error);
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  const value = {
    db,
    user,
    signout,
    sendPassResetEmail,
    confirmPasswordReset,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    updateDisplayName,
    changePassword,
    updateProfilePic,
    deleteAccount,
  };
  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
}
