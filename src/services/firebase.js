// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzQS4co3zs8D2kOCSM26Kapfjes391Qqg",
  authDomain: "my-chat-app-c6275.firebaseapp.com",
  databaseURL: "https://my-chat-app-c6275-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-chat-app-c6275",
  storageBucket: "my-chat-app-c6275.appspot.com",
  messagingSenderId: "79805884591",
  appId: "1:79805884591:web:abde406a3621188e34cc5a",
  measurementId: "G-DK4D3R9KJP"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Firestore and Firebase Storage instances
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Firestore collection for Text Entries
const textCollection = collection(db, 'TextEntries');

// Export Firebase services
export { db, storage, textCollection };
