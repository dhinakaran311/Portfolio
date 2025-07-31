
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvm1mHc6p7rD0M6CHvNiwN23GESP3PU1E",
  authDomain: "portfolio-7eccd.firebaseapp.com",
  projectId: "portfolio-7eccd",
  storageBucket: "portfolio-7eccd.firebasestorage.app",
  messagingSenderId: "424069962166",
  appId: "1:424069962166:web:244d4d4b2886f218e1c917",
  measurementId: "G-YCW0TPE1GJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
