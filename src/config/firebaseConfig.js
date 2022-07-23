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

  /*
  friendlychat
  apiKey: "AIzaSyCwKjjAb52fKhw5AA8Hy_ODNfKAqRWcLhI",
  authDomain: "friendlychat-207d8.firebaseapp.com",
  projectId: "friendlychat-207d8",
  storageBucket: "friendlychat-207d8.appspot.com",
  messagingSenderId: "391541009774",
  appId: "1:391541009774:web:0f7b9038375b2579b3657f"
  */
 /*
  apiKey: "AIzaSyCOyksS_sp7GoFRZ_4I4ej9Gej2tbLLFHA",
  authDomain: "neworbital-3f9a5.firebaseapp.com",
  projectId: "neworbital-3f9a5",
  storageBucket: "neworbital-3f9a5.appspot.com",
  messagingSenderId: "977165520795",
  appId: "1:977165520795:web:18fc224ceeee53a2d29b3e",
  measurementId: "G-7XM4NNDMBG"
  */
};

// Initialize Firebase
const app = initializeApp(config);
const projectStorage = getStorage(app);

export { app, projectStorage };

