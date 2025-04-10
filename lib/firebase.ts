import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app, auth, db, storage

// Check if we're in a browser environment before initializing Firebase
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Auth functions
export async function registerUser(email: string, password: string, userData: any) {
  try {
    if (!auth) throw new Error("Firebase auth not initialized")

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      createdAt: serverTimestamp(),
      role: "user", // Default role
    })

    return user
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export async function loginUser(email: string, password: string) {
  try {
    if (!auth) throw new Error("Firebase auth not initialized")

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function logoutUser() {
  try {
    if (!auth) throw new Error("Firebase auth not initialized")

    await signOut(auth)
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

// Document upload function
export async function uploadDocument(file: File, path: string) {
  try {
    if (!storage) throw new Error("Firebase storage not initialized")

    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading document:", error)
    throw error
  }
}

// Current user
export function getCurrentUser(): User | null {
  if (!auth) return null
  return auth.currentUser
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    if (!db) return false

    const userDoc = await doc(db, "users", userId)
    // In a real app, you would check the user's role
    // For demo purposes, return false
    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Function to add a new advocate (for onboarding)
export async function onboardAdvocate(advocateData: any): Promise<string> {
  try {
    // In a real app, this would add to Firebase
    // For demo, we'll just return success
    return advocateData.regNo
  } catch (error) {
    console.error("Error onboarding advocate:", error)
    throw error
  }
}

// Export db for use in other files
export { db }
