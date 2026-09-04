// assets/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIK4xjuinngQ7wV2oDNrn8qCMxVNhJimE",
  authDomain: "bm-crafting-edbb5.firebaseapp.com",
  projectId: "bm-crafting-edbb5",
  storageBucket: "bm-crafting-edbb5.firebasestorage.app",
  messagingSenderId: "5221516481",
  appId: "1:5221516481:web:d957bd93abbb06d137c040",
  measurementId: "G-0SSM4FQHDE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const historyCol = collection(db, "craftHistory");
const provider = new GoogleAuthProvider();

/* ---------- AUTH ---------- */

window.fbSignIn = async function () {
  await signInWithPopup(auth, provider);
};

window.fbSignOut = async function () {
  await signOut(auth);
};

// Called by index.html whenever login state changes
window.onAuthStateChanged = function (callback) {
  onAuthStateChanged(auth, callback);
};

function currentUid() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  return user.uid;
}

/* ---------- HISTORY (now scoped per user) ---------- */

window.fbSaveHistory = async function (entry) {
  const docRef = await addDoc(historyCol, {
    ...entry,
    uid: currentUid(),
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

window.fbLoadHistory = async function () {``
  const q = query(
    historyCol,
    where("uid", "==", currentUid()),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), __docId: d.id }));
};

window.fbDeleteHistory = async function (docId) {
  await deleteDoc(doc(db, "craftHistory", docId));
};

window.resolveFirebaseReady();