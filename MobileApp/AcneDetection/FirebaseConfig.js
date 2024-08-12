// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import getDatabase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZthLO2Qk7wK57UKAePTdUSoSDsmKHJBs",
  authDomain: "test-bafb0.firebaseapp.com",
  projectId: "test-bafb0",
  storageBucket: "test-bafb0.appspot.com",
  messagingSenderId: "86299391945",
  appId: "1:86299391945:web:f18ddd9e181596c7915a18"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);

// Get a reference to the Firestore service
const db = getFirestore(app);

// Get a reference to the Realtime Database service
const rtdb = getDatabase(app, "https://test-bafb0-default-rtdb.firebaseio.com/");

export { auth, db, rtdb };
