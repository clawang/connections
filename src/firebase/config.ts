// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvrQH0JPqTgPmnpUDCfAKvkNs3rS3wfk4",
  authDomain: "custom-connections-77f94.firebaseapp.com",
  projectId: "custom-connections-77f94",
  storageBucket: "custom-connections-77f94.appspot.com",
  messagingSenderId: "945333365190",
  appId: "1:945333365190:web:1f1d9c778e59e8b2ccaac7",
  measurementId: "G-1ZCXY945VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let database = getFirestore(app);

export {app as firebase_app, database};