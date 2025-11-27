// Script to add admin user to Firestore
// Run with: node add-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function addAdmin() {
  try {
    const adminEmail = "asonal379@gmail.com";
    
    console.log(`Looking up user with email: ${adminEmail}`);
    
    // First, we need to get the UID for this email
    // Since we can't directly query auth by email from client SDK,
    // we'll need to manually sign in or get the UID
    
    // For now, let's try to sign in with this account
    // You'll need to provide the password when running this script
    const password = process.argv[2];
    
    if (!password) {
      console.error('Please provide the password as argument: node add-admin.js YOUR_PASSWORD');
      process.exit(1);
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, password);
    const userId = userCredential.user.uid;
    
    console.log(`Found user ID: ${userId}`);
    console.log(`Adding ${adminEmail} to admins collection...`);
    
    // Add user to admins collection
    await setDoc(doc(db, 'admins', userId), {
      email: adminEmail,
      role: 'admin',
      createdAt: new Date(),
      permissions: ['read_all', 'write_all', 'delete_all', 'manage_users']
    });
    
    console.log(`✅ Successfully added ${adminEmail} as admin!`);
    console.log(`User ID: ${userId}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding admin:', error.message);
    process.exit(1);
  }
}

addAdmin();
