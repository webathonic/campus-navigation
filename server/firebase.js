// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
require("dotenv").config();
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIGS_apiKey,
  authDomain: process.env.FIREBASE_CONFIGS_authDomain,
  projectId: process.env.FIREBASE_CONFIGS_projectId,
  storageBucket: process.env.FIREBASE_CONFIGS_storageBucket,
  messagingSenderId: process.env.FIREBASE_CONFIGS_messagingSenderId,
  appId: process.env.FIREBASE_CONFIGS_appId,
  measurementId: process.env.FIREBASE_CONFIGS_measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
