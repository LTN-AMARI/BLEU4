// ============================================================
// data.js - BLEU 4
// Gère l'utilisateur, les missions (events), et leur synchronisation
// EN TEMPS RÉEL avec Firebase, partagée entre tous les membres.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  const firebaseConfig = {
  apiKey: "AIzaSyCOTja98aA-0umXrqm2c2k4frUFn6why1o",
  authDomain: "bleu-4.firebaseapp.com",
  databaseURL: "https://bleu-4-default-rtdb.firebaseio.com",
  projectId: "bleu-4",
  storageBucket: "bleu-4.firebasestorage.app",
  messagingSenderId: "788139266954",
  appId: "1:788139266954:web:c1896f25eb57687846ae73"
};

const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);
const auth = getAuth(fbApp);

// ------------------------------------------------------------
// UTILISATEUR CONNECTÉ (chargé depuis localStorage)
// ------------------------------------------------------------
let currentUser = {
    login: "",
    nom: "",
    grade: "",
    role: "membre"
};
const saved = localStorage.getItem("BLEU4_USER");
if (saved) {
    try { currentUser = JSON.parse(saved); } catch (e) {}
}
if (!currentUser.login) {
    // Personne connectée : retour à l'écran de connexion
    window.location.href = "index.html";
}
window.currentUser = currentUser;

window.logout = function() {
    localStorage.removeItem("BLEU4_USER");
    window.location.href = "index.html";
};

// ------------------------------------------------------------
// MISSIONS (synchronisées en direct depuis Firebase)
// ------------------------------------------------------------
let events = [];
window.events = events;

function addEvent(title, start, end, concernedStr) {
    let concerned;
    if (concernedStr.trim().toLowerCase() === "tous") {
        concerned = "tous";
    } else {
        concerned = concernedStr.split(",").map(s => s.trim().toUpperCase());
    }
    const evRef = push(ref(db, "events"));
    set(evRef, {
        title,
        start,
        end,
        concerned,
        participants: {},
        indisponibles: {}
    });
}
window.addEvent = addEvent;

function canUserParticipate(ev) {
    if (ev.concerned === "tous") return true;
    return ev.concerned.includes(currentUser.login);
}
window.canUserParticipate = canUserParticipate;

// Firebase n'accepte pas certains caractères dans les clés (. # $ / [ ])
function safeKey(login) {
    return login.replace(/[.#$/\[\]]/g, "_");
}

function setParticipation(eventId, status) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    if (!canUserParticipate(ev)) {
        alert("Vous n'êtes pas concerné par cette mission");
