// --- INITIALISATION FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ⚠️ Mets ici TES vraies valeurs Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCOTja98aA-0umXrqm2c2k4frUFn6why1o",
  authDomain: "bleu-4.firebaseapp.com",
  databaseURL: "https://bleu-4-default-rtdb.firebaseio.com",
  projectId: "bleu-4",
  storageBucket: "bleu-4.firebasestorage.app",
  messagingSenderId: "788139266954",
  appId: "1:788139266954:web:c1896f25eb57687846ae73"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- LOGIQUE DE CONNEXION ---
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");

loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorBox.textContent = "";

    if (!email || !password) {
        errorBox.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);

        // Connexion OK → redirection vers l'application
        window.location.href = "app.html";

    } catch (err) {
        console.error(err);
        errorBox.textContent = "Identifiants incorrects ou compte inexistant.";
    }
});
