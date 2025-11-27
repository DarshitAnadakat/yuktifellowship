import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEx4AJViRe60uGI2yllJ7FbgSNIHfxwLQ",
  authDomain: "consumer-b6814.firebaseapp.com",
  databaseURL: "https://consumer-b6814-default-rtdb.firebaseio.com",
  projectId: "consumer-b6814",
  storageBucket: "consumer-b6814.firebasestorage.app",
  messagingSenderId: "679759162190",
  appId: "1:679759162190:web:71310d19fa95cf399c4c1f",
  measurementId: "G-WD13JRSC06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and set persistence
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Analytics (optional)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { analytics }
export default app
