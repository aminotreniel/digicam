import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * This project shares one Firestore instance with several other demos.
 * Everything it touches lives under `apps/{APP_ID}` — see firestore.rules.
 */
export const APP_ID = "grain";

/**
 * Firebase web config is public by design: these values ship to the browser in
 * every Firebase app and are identifiers, not secrets. Access is controlled by
 * security rules, not by hiding this object. They are still read from env so a
 * fork can point at its own project without touching code — the literals are
 * the fallback so the demo runs with zero configuration.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCxucNZL7FHZO7fS2pzshnB5veACKZaJ1I",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "alldb-a1804.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "alldb-a1804",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "alldb-a1804.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "397138423193",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:397138423193:web:88a338e16f85761112b708",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-36J426EF7F",
};

/** Reuse the existing app across HMR reloads and server renders. */
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);

/** Collection path helper — keeps the namespace in exactly one place. */
export const appPath = (...segments: string[]) => ["apps", APP_ID, ...segments];
