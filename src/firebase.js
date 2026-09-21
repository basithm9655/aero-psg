/**
 * Firebase Client & Data Manager
 * 
 * Supports both live Firebase Firestore & Storage when configured,
 * and high-speed local caching so the application runs immediately
 * before API keys are plugged in.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp, 
    onSnapshot 
} from 'firebase/firestore';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

// Default config template - Set with user credentials
export const DEFAULT_FIREBASE_CONFIG = {
    apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAGnO7N3Dm1dVkUhE5DsvMfNL7NP6PBMKI",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "dsdaea-aero.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "dsdaea-aero",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "dsdaea-aero.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "114399136057",
    appId: env.VITE_FIREBASE_APP_ID || "1:114399136057:web:976ee13204a73ce8d340e8"
};

const STORAGE_KEY_CONFIG = 'aeroweb_firebase_config';
const STORAGE_KEY_CADETS = 'aeroweb_cadets_cache';
const STORAGE_KEY_CONTENT = 'aeroweb_content_cache';
const STORAGE_KEY_CERTS = 'aeroweb_certs_cache';

// Load stored config or default
export function getFirebaseConfig() {
    try {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.apiKey && !parsed.apiKey.includes("YOUR_")) {
                    return parsed;
                }
            }
        }
    } catch (e) {
        console.warn("Could not read stored Firebase config", e);
    }
    return DEFAULT_FIREBASE_CONFIG;
}

// Check if valid API key is present
export function isFirebaseConfigured() {
    const cfg = getFirebaseConfig();
    return Boolean(cfg.apiKey && !cfg.apiKey.includes("YOUR_") && cfg.projectId && !cfg.projectId.includes("YOUR_"));
}

// Initialize Firebase App & Firestore safely
let app = null;
let db = null;

export function initFirebase() {
    const config = getFirebaseConfig();
    if (!isFirebaseConfigured()) {
        return { app: null, db: null, configured: false };
    }

    try {
        app = getApps().length === 0 ? initializeApp(config) : getApp();
        db = getFirestore(app);
        return { app, db, configured: true };
    } catch (error) {
        console.warn("Firebase initialization skipped or encountered error:", error.message);
        return { app: null, db: null, configured: false };
    }
}

// Run initial init
const fbState = initFirebase();
app = fbState.app;
db = fbState.db;

export function getDb() {
    if (!db && isFirebaseConfigured()) {
        const res = initFirebase();
        app = res.app;
        db = res.db;
    }
    return db;
}

// Save new configuration from Admin Panel
export function saveFirebaseConfig(newConfig) {
    try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
        const res = initFirebase();
        app = res.app;
        db = res.db;
        return { success: true, configured: res.configured };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/* ==========================================================================
   CADET REGISTRATIONS & ATTENDANCE
   ========================================================================== */

export async function registerCadet(cadetData, options = {}) {
    const timestamp = new Date().toISOString();
    const cleanRoll = (cadetData.roll || cadetData.rollNo || '').toUpperCase();
    
    // Check if cadet already exists in local cache to preserve existing attendance/rank unless explicitly updated
    const current = getLocalCadets();
    const existingIdx = current.findIndex(c => (c.roll || c.rollNo || '').toUpperCase() === cleanRoll);
    const existing = existingIdx >= 0 ? current[existingIdx] : null;

    if (existing && options.preventDuplicate) {
        throw new Error(`Roll number ${cleanRoll} is already registered. Each roll number can register only one time.`);
    }

    const record = {
        ...existing,
        ...cadetData,
        roll: cleanRoll,
        rollNo: cleanRoll,
        phone: cadetData.phone || existing?.phone || '',
        attendance: cadetData.attendance !== undefined ? cadetData.attendance : (existing?.attendance || ''),
        place: cadetData.place !== undefined ? cadetData.place : (existing?.place || ''),
        registeredAt: existing?.registeredAt || timestamp,
        updatedAt: timestamp
    };

    // 1. Always save to LocalStorage cache immediately for lightning-fast responsiveness
    try {
        if (existingIdx >= 0) {
            current[existingIdx] = record;
        } else {
            current.unshift(record);
        }
        localStorage.setItem(STORAGE_KEY_CADETS, JSON.stringify(current));
    } catch (e) {
        console.warn("Local cache save error:", e);
    }

    // 2. If Firebase is active, sync with Firestore collection 'cadet_registrations'
    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            const docRef = doc(firestore, 'cadet_registrations', cleanRoll);
            await setDoc(docRef, { ...record, timestamp: serverTimestamp() }, { merge: true });
        } catch (e) {
            console.warn("Firestore sync skipped/failed:", e.message);
        }
    }

    return record;
}

export function getLocalCadets() {
    try {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY_CADETS);
            if (saved) return JSON.parse(saved);
        }
    } catch (e) {
        console.warn(e);
    }
    return [];
}

export async function fetchAllCadets() {
    const localCadets = getLocalCadets();
    const firestore = getDb();

    if (firestore && isFirebaseConfigured()) {
        try {
            const snap = await getDocs(collection(firestore, 'cadet_registrations'));
            const cloudCadets = [];
            snap.forEach(d => {
                cloudCadets.push({ id: d.id, ...d.data() });
            });
            if (cloudCadets.length > 0) {
                localStorage.setItem(STORAGE_KEY_CADETS, JSON.stringify(cloudCadets));
                return cloudCadets;
            }
        } catch (e) {
            console.warn("Firestore fetch error, falling back to local:", e.message);
        }
    }

    return localCadets;
}

/**
 * Real-time listener for registered cadets
 * Updates automatically when any student registers or attendance/place changes
 */
export function subscribeCadets(callback) {
    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            return onSnapshot(collection(firestore, 'cadet_registrations'), (snapshot) => {
                const list = [];
                snapshot.forEach(docSnap => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });
                localStorage.setItem(STORAGE_KEY_CADETS, JSON.stringify(list));
                callback(list);
            }, (err) => {
                console.warn("Firestore onSnapshot error:", err);
                callback(getLocalCadets());
            });
        } catch (e) {
            console.warn("Could not setup Firestore onSnapshot:", e);
        }
    }
    callback(getLocalCadets());
    return () => {};
}

export async function getCadetByRoll(rollNo) {
    const cleanRoll = (rollNo || '').trim().toUpperCase();
    if (!cleanRoll) return null;

    // Check Firebase if configured
    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            const docRef = doc(firestore, 'cadet_registrations', cleanRoll);
            const snap = await getDocs(query(collection(firestore, 'cadet_registrations'), where('roll', '==', cleanRoll)));
            if (!snap.empty) {
                return snap.docs[0].data();
            }
        } catch (e) {
            console.warn("Firestore cadet lookup error:", e.message);
        }
    }

    // Check local storage cache
    const current = getLocalCadets();
    const found = current.find(c => (c.roll || c.rollNo || '').toUpperCase() === cleanRoll);
    return found || null;
}

export async function updateCadetRecord(rollNo, updates) {
    const cleanRoll = rollNo.toUpperCase();
    const current = getLocalCadets();
    const idx = current.findIndex(c => (c.roll || c.rollNo) === cleanRoll);
    if (idx >= 0) {
        current[idx] = { ...current[idx], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY_CADETS, JSON.stringify(current));
    }

    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            const docRef = doc(firestore, 'cadet_registrations', cleanRoll);
            await setDoc(docRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
        } catch (e) {
            console.warn("Firestore update failed:", e.message);
        }
    }
    return true;
}

export async function deleteCadetRecord(rollNo) {
    const cleanRoll = rollNo.toUpperCase();
    let current = getLocalCadets();
    current = current.filter(c => (c.roll || c.rollNo) !== cleanRoll);
    localStorage.setItem(STORAGE_KEY_CADETS, JSON.stringify(current));

    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            await deleteDoc(doc(firestore, 'cadet_registrations', cleanRoll));
        } catch (e) {
            console.warn("Firestore delete failed:", e.message);
        }
    }
    return true;
}

export async function clearAllCadetsData() {
    localStorage.removeItem(STORAGE_KEY_CADETS);
    const firestore = getDb();
    if (firestore && isFirebaseConfigured()) {
        try {
            const snap = await getDocs(collection(firestore, 'cadet_registrations'));
            const promises = [];
            snap.forEach(d => promises.push(deleteDoc(d.ref)));
            await Promise.all(promises);
        } catch (e) {
            console.warn("Firestore clearAll failed:", e.message);
        }
    }
    return true;
}

/* ==========================================================================
   CONTENT & PHOTO STUDIO (LOCAL CACHE - NO FIREBASE NEEDED)
   ========================================================================== */

export function getLocalContent() {
    try {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY_CONTENT);
            if (saved) return JSON.parse(saved);
        }
    } catch (e) {
        console.warn(e);
    }
    return [];
}

export async function fetchPublishedContent() {
    return getLocalContent();
}

export async function saveContentWithPhoto(contentItem) {
    const id = contentItem.id || `content-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const item = {
        ...contentItem,
        id,
        updatedAt: timestamp,
        publishedAt: contentItem.publishedAt || timestamp
    };

    // Save strictly to local storage
    const current = getLocalContent();
    const idx = current.findIndex(c => c.id === id);
    if (idx >= 0) {
        current[idx] = item;
    } else {
        current.unshift(item);
    }
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(current));
    return item;
}

export async function deleteContentItem(id) {
    let current = getLocalContent();
    current = current.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(current));
    return true;
}

/* ==========================================================================
   DIGITAL CERTIFICATE VAULT
   ========================================================================== */

export async function fetchCertificateFromDb(rollNo) {
    const cleanRoll = (rollNo || '').trim().toUpperCase();
    if (!cleanRoll) return null;

    // Check Firebase if configured
    if (db && isFirebaseConfigured()) {
        try {
            const docRef = doc(db, 'certificates', cleanRoll);
            const snap = await getDocs(query(collection(db, 'certificates'), where('rollNo', '==', cleanRoll)));
            if (!snap.empty) {
                return snap.docs[0].data();
            }
        } catch (e) {
            console.warn("Firestore certificate query error:", e.message);
        }
    }

    // Check local certificate cache
    try {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY_CERTS);
            if (saved) {
                const certs = JSON.parse(saved);
                if (certs[cleanRoll]) return certs[cleanRoll];
            }
        }
    } catch (e) {
        console.warn(e);
    }

    return null;
}

export async function saveCertificateToDb(certData) {
    const cleanRoll = certData.rollNo.trim().toUpperCase();
    const record = {
        ...certData,
        rollNo: cleanRoll,
        updatedAt: new Date().toISOString()
    };

    // Save locally
    try {
        if (typeof localStorage !== 'undefined') {
            let certs = {};
            const saved = localStorage.getItem(STORAGE_KEY_CERTS);
            if (saved) certs = JSON.parse(saved);
            certs[cleanRoll] = record;
            localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certs));
        }
    } catch (e) {
        console.warn(e);
    }

    // Save to Firestore
    if (db && isFirebaseConfigured()) {
        try {
            const docRef = doc(db, 'certificates', cleanRoll);
            await setDoc(docRef, { ...record, timestamp: serverTimestamp() }, { merge: true });
        } catch (e) {
            console.warn("Firestore certificate save error:", e.message);
        }
    }

    return record;
}
