
// import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// dotenv.config({ path: '.env.local' });


// console.log('console log de linea 10 de config de firebase',process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

// const firebaseConfig = {
//   apiKey: "AIzaSyDYJ08Cx8jRW__Rnz6t4Y9OlljiFDWx4Rs",
//   authDomain: "santaineslogin.firebaseapp.com",
//   projectId: "santaineslogin",
//   storageBucket: "santaineslogin.firebasestorage.app",
//   messagingSenderId: "997509647243",
//   appId: "1:997509647243:web:cfe3d5926354bbe77dfd8e"
// };


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
