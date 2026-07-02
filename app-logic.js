// Rôle et infos utilisateur
const role = localStorage.getItem("role");
const grade = localStorage.getItem("grade");
const nom = localStorage.getItem("nom");

document.getElementById("userInfo").innerHTML =
    `<strong>${grade} ${nom}</strong> — Accès ${role.toUpperCase()}`;

// --- CALENDRIER ---
const calendar = document.getElementById("calendar");
const eventPanel = document.getElementById("eventPanel");
const panelDate = document.getElementById("panelDate");
const eventList = document.getElementById("eventList");
const cmdCreate = document.getElementById("cmdCreate");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

// Génération du calendrier
function generateCalendar() {
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement("div");
        div.className = "day";
        div.textContent = d;

        div.onclick = () => openDay(d);

        calendar.appendChild(div);
    }
}

generateCalendar();

// --- ÉVÉNEMENTS ---
function getEvents() {
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function openDay(day) {
    const dateKey = `${year}-${month + 1}-${day}`;
    panelDate.textContent = `Événements du ${dateKey}`;
    eventPanel.style.display = "block";

    const events = getEvents();
    const dayEvents = events[dateKey] || [];

    eventList.innerHTML = "";

    dayEvents.forEach((ev, index) => {
        const box = document.createElement("div");
        box.className = "eventBox";

        box.innerHTML = `
            <strong>${ev.title}</strong><br>
            ${ev.desc}<br>
            <em>Participants :</em> ${ev.participants.join(", ") || "Aucun"}
        `;

        // Participation (simple)
        if (role === "simple") {
            const btnYes = document.createElement("button");
            btnYes.textContent = "Je participe";
            btnYes.onclick = () => {
                ev.participants.push(`${grade} ${nom}`);
                saveEvents(events);
                openDay(day);
            };

            const btnNo = document.createElement("button");
            btnNo.textContent = "Je ne participe pas";
            btnNo.onclick = () => {
                ev.participants = ev.participants.filter(p => p !== `${grade} ${nom}`);
                saveEvents(events);
                openDay(day);
            };

            box.appendChild(btnYes);
            box.appendChild(btnNo);
        }

        // Commandement → supprimer
        if (role === "commandement") {
            const del = document.createElement("button");
            del.textContent = "Supprimer";
            del.style.background = "red";
            del.onclick = () => {
                dayEvents.splice(index, 1);
                events[dateKey] = dayEvents;
                saveEvents(events);
                openDay(day);
            };
            box.appendChild(del);
        }

        eventList.appendChild(box);
    });

    // Création d’événements (commandement)
    if (role === "commandement") {
        cmdCreate.style.display = "block";

        document.getElementById("createEventBtn").onclick = () => {
            const title = document.getElementById("eventTitle").value.trim();
            const desc = document.getElementById("eventDesc").value.trim();

            if (!title || !desc) return;

            if (!events[dateKey]) events[dateKey] = [];

            events[dateKey].push({
                title,
                desc,
                participants: []
            });

            saveEvents(events);
            openDay(day);

            document.getElementById("eventTitle").value = "";
            document.getElementById("eventDesc").value = "";
        };
    }
}
