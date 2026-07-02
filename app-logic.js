// Récupération du rôle et des infos utilisateur
const role = localStorage.getItem("role");
const grade = localStorage.getItem("grade");
const nom = localStorage.getItem("nom");

const userInfo = document.getElementById("userInfo");
const createSection = document.getElementById("createSection");
const eventsList = document.getElementById("eventsList");

// Affichage des infos utilisateur
userInfo.innerHTML = `<strong>${grade} ${nom}</strong> (${role})`;

// Si commandement → afficher la création d'événements
if (role === "commandement") {
    createSection.style.display = "block";
}

// Charger les événements depuis localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    eventsList.innerHTML = "";

    events.forEach((ev, index) => {
        const div = document.createElement("div");
        div.className = "event";

        div.innerHTML = `
            <h3>${ev.title}</h3>
            <p>${ev.desc}</p>
            <p><strong>Participants :</strong> ${ev.participants.join(", ") || "Aucun"}</p>
        `;

        // Bouton "Je participe" pour accès simple
        if (role === "simple") {
            const btn = document.createElement("button");
            btn.textContent = "Je participe";
            btn.onclick = () => {
                ev.participants.push(`${grade} ${nom}`);
                saveEvents(events);
                loadEvents();
            };
            div.appendChild(btn);
        }

        // Commandement → supprimer l'événement
        if (role === "commandement") {
            const del = document.createElement("button");
            del.textContent = "Supprimer";
            del.style.background = "red";
            del.onclick = () => {
                events.splice(index, 1);
                saveEvents(events);
                loadEvents();
            };
            div.appendChild(del);
        }

        eventsList.appendChild(div);
    });
}

// Sauvegarder les événements
function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

// Création d'un événement (commandement)
const createEventBtn = document.getElementById("createEventBtn");
if (createEventBtn) {
    createEventBtn.onclick = () => {
        const title = document.getElementById("eventTitle").value.trim();
        const desc = document.getElementById("eventDesc").value.trim();

        if (!title || !desc) return;

        const events = JSON.parse(localStorage.getItem("events") || "[]");

        events.push({
            title,
            desc,
            participants: []
        });

        saveEvents(events);
        loadEvents();

        document.getElementById("eventTitle").value = "";
        document.getElementById("eventDesc").value = "";
    };
}

// Charger les événements au démarrage
loadEvents();
