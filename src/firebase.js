// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }                   from 'firebase/firestore';
import { getAuth }                        from 'firebase/auth';
import { getDatabase }                    from 'firebase/database';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7yEofc6jbwK0QJN14O-QdhJAGpD1dgRE",
  authDomain: "seems-c0797.firebaseapp.com",
  databaseURL: "https://seems-c0797-default-rtdb.firebaseio.com",
  projectId: "seems-c0797",
  storageBucket: "seems-c0797.firebasestorage.app",
  messagingSenderId: "1068064809876",
  appId: "1:1068064809876:web:fb67107de1b2ead4df2581",
  measurementId: "G-35CB9407PG"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore
export const db   = getFirestore(app);
// Auth (web SDK entrypoint)
export const auth = getAuth(app);
// Realtime Database
export const rtdb = getDatabase(app);