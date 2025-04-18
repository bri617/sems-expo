// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase }     from 'firebase/database';

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
const auth = getAuth(app); 
const db = getDatabase(app); 

export { auth, db };
