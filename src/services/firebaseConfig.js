import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyU3qph__ntGT8a_ApSeLrf74-_1SXRj0",
  authDomain: "expoapp-bc742.firebaseapp.com",
  projectId: "expoapp-bc742",
  storageBucket: "expoapp-bc742.appspot.com",
  messagingSenderId: "581305971283",
  appId: "1:581305971283:web:7f7b829e1dd239c843cca6",
  measurementId: "G-T2K6MTEFQR"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const storage = getStorage(app);




export { db, auth, app, storage };
