# Firebase Setup Instructions

## 🔥 Firebase Integration Complete!

Your VoltEdge Hub application is now integrated with Firebase for authentication and database storage.

## 📋 What Was Set Up

1. **Firebase Authentication** - User login, signup, and session management
2. **Cloud Firestore** - NoSQL database for storing user data
3. **Auth Context** - Global authentication state management
4. **Auth Service** - Helper functions for Firebase operations

## ⚙️ Firebase Configuration Needed

### Step 1: Get Firebase Config from Console

You need to update the Firebase configuration in `src/config/firebase.ts` with your actual values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **consumer-b6814**
3. Click on the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. Click on the web app (</> icon) or create one
6. Copy the config values and update in `firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "consumer-b6814.firebaseapp.com",
  projectId: "consumer-b6814",
  storageBucket: "consumer-b6814.firebasestorage.app",
  messagingSenderId: "115631988481130807632",
  appId: "YOUR_ACTUAL_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
}
```

### Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Click "Save"

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (e.g., us-central)
5. Click "Enable"

### Step 4: Set Firestore Security Rules

Replace the default rules with these (in Firestore → Rules tab):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test collection for Firebase connection testing
    match /test/{document=**} {
      allow read, write: if true; // For testing only, remove in production
    }
  }
}
```

## 🧪 Testing Firebase Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/test-firebase`

3. You should see:
   - ✅ Firebase Authentication initialized successfully
   - ✅ Firestore working! X test documents found

If you see errors, check the console and verify your Firebase configuration.

## 📱 Features Implemented

### Login Page (`/`)
- ✅ Sign in with existing account
- ✅ Sign up for new account  
- ✅ Firebase Authentication integration
- ✅ Auto-redirect to dashboard after login
- ✅ Error handling with alerts

### Organization Setup (`/profile-setup-org`)
- ✅ Save organization details to Firestore
- ✅ Fields: name, type, address, city, state, zip
- ✅ Linked to user's UID
- ✅ Real-time validation

### Data Storage Structure

```
users/
  {userId}/
    uid: string
    email: string
    displayName: string
    phone: string
    organizationName: string
    organizationType: string
    address: string
    city: string
    state: string
    zipCode: string
    contactPerson: string
    designation: string
    kycVerified: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
    lastLogin: Timestamp
    emailVerified: boolean
    profileComplete: boolean
    organizationSetupComplete: boolean
    contactSetupComplete: boolean
    kycSetupComplete: boolean
```

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- Never commit `firebase.ts` with real API keys to public repositories
- Add `.env` file for environment variables in production
- Update Firestore rules before production deployment
- Enable email verification for production

## 🚀 Next Steps

1. Update `firebase.ts` with your actual Firebase config
2. Test the Firebase connection at `/test-firebase`
3. Try signing up a new user at `/`
4. Complete the profile setup flow
5. Verify data in Firebase Console → Firestore

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure authentication methods are enabled
4. Check Firestore security rules
5. Verify internet connection

## 🎉 You're All Set!

Once you update the Firebase config, all login data will be automatically saved to Firebase Firestore!
