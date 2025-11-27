import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore"
import { auth, db } from "../config/firebase"

export interface UserData {
  uid: string
  email: string
  displayName?: string
  phone?: string
  organizationName?: string
  organizationType?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  contactPerson?: string
  designation?: string
  kycVerified?: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLogin?: Timestamp
}

// Sign up new user
export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Create user document in Firestore immediately after user creation
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: false,
        profileComplete: false
      })
    } catch (firestoreError: any) {
      console.error("Firestore write error:", firestoreError)
      // Continue even if Firestore write fails - the auth account is created
    }
    
    // Send email verification (optional, can fail without blocking signup)
    try {
      await sendEmailVerification(user)
    } catch (emailError: any) {
      console.error("Email verification error:", emailError)
      // Continue even if email verification fails
    }
    
    return { success: true, user }
  } catch (error: any) {
    console.error("Sign up error:", error)
    
    // Provide user-friendly error messages
    let errorMessage = error.message
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Please sign in instead."
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format."
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters long."
    }
    
    return { success: false, error: errorMessage }
  }
}

// Sign in existing user
export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Update last login time (check if document exists first)
    try {
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      } else {
        // Create the document if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          emailVerified: user.emailVerified,
          profileComplete: false
        })
      }
    } catch (firestoreError: any) {
      console.error("Firestore update error:", firestoreError)
      // Continue even if Firestore update fails
    }
    
    return { success: true, user }
  } catch (error: any) {
    console.error("Sign in error:", error)
    
    // Provide user-friendly error messages
    let errorMessage = error.message
    if (error.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password. Please check your credentials and try again."
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email. Please sign up first."
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again."
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later."
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format."
    }
    
    return { success: false, error: errorMessage }
  }
}

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error("Sign out error:", error)
    return { success: false, error: error.message }
  }
}

// Update user profile in Firebase Auth
export const updateUserProfile = async (user: User, displayName: string) => {
  try {
    await updateProfile(user, { displayName })
    return { success: true }
  } catch (error: any) {
    console.error("Update profile error:", error)
    return { success: false, error: error.message }
  }
}

// Save user data to Firestore
export const saveUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error: any) {
    console.error("Save user data error:", error)
    return { success: false, error: error.message }
  }
}

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData
    }
    return null
  } catch (error: any) {
    console.error("Get user data error:", error)
    return null
  }
}

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error: any) {
    console.error("Password reset error:", error)
    return { success: false, error: error.message }
  }
}

// Save organization details
export const saveOrganizationDetails = async (uid: string, orgData: {
  organizationName: string
  organizationType: string
  address: string
  city: string
  state: string
  zipCode: string
}) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...orgData,
      organizationSetupComplete: true,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error: any) {
    console.error("Save organization error:", error)
    return { success: false, error: error.message }
  }
}

// Save contact details
export const saveContactDetails = async (uid: string, contactData: {
  contactPerson: string
  designation: string
  phone: string
  email: string
}) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...contactData,
      contactSetupComplete: true,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error: any) {
    console.error("Save contact error:", error)
    return { success: false, error: error.message }
  }
}

// Save KYC details
export const saveKYCDetails = async (uid: string, kycData: {
  documentType: string
  documentNumber: string
  kycVerified: boolean
}) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...kycData,
      kycSetupComplete: true,
      profileComplete: true,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error: any) {
    console.error("Save KYC error:", error)
    return { success: false, error: error.message }
  }
}
