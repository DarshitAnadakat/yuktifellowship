import { useEffect, useState } from "react"
import { auth, db } from "../config/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"

const FirebaseTest = () => {
  const [testStatus, setTestStatus] = useState<string>("")
  const [authStatus, setAuthStatus] = useState<string>("")
  const [firestoreStatus, setFirestoreStatus] = useState<string>("")

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    setTestStatus("Testing Firebase connection...")
    
    // Test Auth
    try {
      if (auth) {
        setAuthStatus("✅ Firebase Authentication initialized successfully")
      } else {
        setAuthStatus("❌ Firebase Authentication failed to initialize")
      }
    } catch (error: any) {
      setAuthStatus(`❌ Auth Error: ${error.message}`)
    }

    // Test Firestore
    try {
      const testCollection = collection(db, "test")
      const testDoc = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "Firebase connection test"
      }
      
      await addDoc(testCollection, testDoc)
      const snapshot = await getDocs(testCollection)
      
      if (snapshot.size > 0) {
        setFirestoreStatus(`✅ Firestore working! ${snapshot.size} test documents found`)
      } else {
        setFirestoreStatus("⚠️ Firestore initialized but no documents found")
      }
    } catch (error: any) {
      setFirestoreStatus(`❌ Firestore Error: ${error.message}`)
    }

    setTestStatus("Firebase connection test completed!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Firebase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium mb-2">Overall Status:</p>
            <p className="text-white/80">{testStatus}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium mb-2">Firebase Authentication:</p>
            <p className="text-white/80">{authStatus || "Testing..."}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium mb-2">Firestore Database:</p>
            <p className="text-white/80">{firestoreStatus || "Testing..."}</p>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> If you see errors, please check:
            </p>
            <ul className="text-blue-200 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Firebase API Key is correctly configured in firebase.ts</li>
              <li>Firebase project settings in Console</li>
              <li>Firestore database is created and rules are set</li>
              <li>Authentication is enabled in Firebase Console</li>
            </ul>
          </div>

          <button
            onClick={testFirebaseConnection}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirebaseTest
