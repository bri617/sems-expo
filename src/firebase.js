// src/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth }                         from 'firebase/auth';
import { getDatabase }                     from 'firebase/database';
import { getFirestore }                    from 'firebase/firestore';

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

// Initialize the app once (avoids HMR duplicate‑init)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export Auth instance (so `import { auth } from '../src/firebase'` works)
export const auth = getAuth(app);

// Export Realtime Database instance
export const rtdb = getDatabase(app);

// (Optional) Export Firestore if you’re still using it elsewhere
export const db = getFirestore(app);
