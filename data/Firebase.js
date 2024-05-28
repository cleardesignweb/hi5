import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyAEThe3nrNBD_mQj_yPs2CbA8KyDiqZj3M",
  authDomain: "thlorall-4e04b.firebaseapp.com",
  projectId: "thlorall-4e04b",
  storageBucket: "thlorall-4e04b.appspot.com",
  messagingSenderId: "610132871617",
  appId: "1:610132871617:web:7f66522a80d33ac0718740"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const loginAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Export Firebase Auth separately
export { loginAuth };

// Export other Firebase modules
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance (optional)
export default app;








 