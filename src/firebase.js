// src/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7yEofc6jbwK0QJN14O-QdhJAGpD1dgRE",
  authDomain: "seems-c0797.firebaseapp.com",
  databaseURL: "https://seems-c0797-default-rtdb.firebaseio.com",
  projectId: "seems-c0797",
  storageBucket: "seems-c0797.appspot.com",
  messagingSenderId: "1068064809876",
  appId: "1:1068064809876:web:fb67107de1b2ead4df2581",
  measurementId: "G-35CB9407PG",
};

// Initialize Firebase App (prevents re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
