import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const config = {
  apiKey: "AIzaSyBC-dRicNx359F3Hfy4gLt_btAeYilKdd4",
  authDomain: "ft25-53163.firebaseapp.com",
  projectId: "ft25-53163",
  storageBucket: "ft25-53163.appspot.com",
  messagingSenderId: "890612947282",
  appId: "1:890612947282:web:fa5c31fcea201e242b828b",
  databaseURL: "https://ft25-53163-default-rtdb.asia-southeast1.firebasedatabase.app",
  measurementId: "G-2KPEY72G0Z",

};

// Initialize Firebase
const app = initializeApp(config);
const projectStorage = getStorage(app);

export { app, projectStorage };

