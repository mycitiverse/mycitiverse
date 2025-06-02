import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBM8stT-o8n9leesvTxZL-ZJir-45_Llc8",
  authDomain: "my-citiverse.firebaseapp.com",
  projectId: "my-citiverse",
  storageBucket: "my-citiverse.firebasestorage.app",
  messagingSenderId: "615341535943",
  appId: "1:615341535943:web:2c604fd77ece481f8c04e2",
  measurementId: "G-89JFJMJH1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Safely initialize analytics only if supported (i.e., in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, provider, analytics };
