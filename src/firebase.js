// src/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

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

const app = initializeApp(firebaseConfig);

// Persist auth state across restarts:
import { getAuth } from 'firebase/auth';
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Real‑time database:
export const db = getDatabase(app);
