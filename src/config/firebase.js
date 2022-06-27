


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



  export const firebaseConfig = {
    apiKey: "AIzaSyBC-dRicNx359F3Hfy4gLt_btAeYilKdd4",
    authDomain: "ft25-53163.firebaseapp.com",
    databaseURL: "https://ft25-53163-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ft25-53163",
    storageBucket: "ft25-53163.appspot.com",
    messagingSenderId: "890612947282",
    appId: "1:890612947282:web:fa5c31fcea201e242b828b",
    measurementId: "G-2KPEY72G0Z"
  };
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
  
export default db;