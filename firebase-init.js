/* ================================================
   firebase-init.js — Shared Firebase initialisation
   Imported as an ES module by all course pages
   ================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBBZeNnPzS3cNGzuoIZNvB5oiVUn0nd5a4",
  authDomain: "johnblogin-fdcc6.firebaseapp.com",
  projectId: "johnblogin-fdcc6",
  storageBucket: "johnblogin-fdcc6.firebasestorage.app",
  messagingSenderId: "510548408095",
  appId: "1:510548408095:web:bd9a204bb7de785203222a",
  measurementId: "G-XDR9MJ7S6E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
