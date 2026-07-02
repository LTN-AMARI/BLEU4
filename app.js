// Sélecteurs
const simpleBtn = document.getElementById("simpleBtn");
const cmdBtn = document.getElementById("cmdBtn");

const simpleForm = document.getElementById("simpleForm");
const cmdForm = document.getElementById("cmdForm");

const loginSimple = document.getElementById("loginSimple");
const loginCmd = document.getElementById("loginCmd");

const errorBox = document.getElementById("error");

// Affichage des formulaires
simpleBtn.onclick = () => {
    simpleForm.classList.remove("hidden");
    cmdForm.classList.add("hidden");
    errorBox.textContent = "";
};

cmdBtn.onclick = () => {
    cmdForm.classList.remove("hidden");
    simpleForm.classList.add("hidden");
    errorBox.textContent = "";
};

// --- ACCÈS SIMPLE ---
loginSimple.onclick = () => {
    const grade = document.getElementById("gradeSimple").value.trim();
    const nom = document.getElementById("nomSimple").value.trim();

    if (!grade || !nom) {
        errorBox.textContent = "Veuillez remplir grade et nom.";
        return;
    }

    // Stockage du rôle
    localStorage.setItem("role", "simple");
    localStorage.setItem("grade", grade);
    localStorage.setItem("nom", nom);

    window.location.href = "app.html";
};

// --- ACCÈS COMMANDEMENT ---
loginCmd.onclick = () => {
    const grade = document.getElementById("gradeCmd").value.trim();
    const nom = document.getElementById("nomCmd").value.trim();
    const pass = document.getElementById("passCmd").value.trim();

    if (!grade || !nom || !pass) {
        errorBox.textContent = "Tous les champs sont obligatoires.";
        return;
    }

    // Mot de passe commandement
    const PASS_CMD = "BLEU4CMD";

    if (pass !== PASS_CMD) {
        errorBox.textContent = "Mot de passe incorrect.";
        return;
    }

    localStorage.setItem("role", "commandement");
    localStorage.setItem("grade", grade);
    localStorage.setItem("nom", nom);

    window.location.href = "app.html";
};
