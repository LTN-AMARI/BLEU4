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

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

document.getElementById("currentMonth").textContent =
    `${monthNames[currentMonth]} ${currentYear}`;

document.getElementById("prevMonth").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
};

document.getElementById("nextMonth").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
};

function updateCalendar() {
    document.getElementById("currentMonth").textContent =
        `${monthNames[currentMonth]} ${currentYear}`;
    generateCalendar();
}

// Génération du calendrier
function generateCalendar() {
    calendar.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    const events = getEvents();

    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement("div");
        div.className = "day";
        div.textContent = d;

        const dateKey = `${currentYear}-${currentMonth + 1}-${d}`;

        if (events[dateKey] && events[dateKey].length > 0) {
            div.classList.add("hasEvent");
        }

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
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
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
                if (!ev.participants.includes(`${grade} ${nom}`)) {
                    ev.participants.push(`${grade} ${nom}`);
                }
                saveEvents(events);
                saveHistory(dateKey, ev.title, "PARTICIPE");
                openDay(day);
            };

            const btnNo = document.createElement("button");
            btnNo.textContent = "Je ne participe pas";
            btnNo.onclick = () => {
                ev.participants = ev.participants.filter(p => p !== `${grade} ${nom}`);
                saveEvents(events);
                saveHistory(dateKey, ev.title, "NE PARTICIPE PAS");
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

// --- HISTORIQUE DES PARTICIPATIONS ---
function saveHistory(date, eventTitle, status) {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    history.push({
        date,
        eventTitle,
        status,
        user: `${grade} ${nom}`
    });

    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    const list = document.getElementById("historyList");

    list.innerHTML = "";

    history.forEach(h => {
        const div = document.createElement("div");
        div.className = "eventBox";
        div.innerHTML = `
            <strong>${h.user}</strong><br>
            ${h.date} — ${h.eventTitle}<br>
            <em>${h.status}</em>
        `;
        list.appendChild(div);
    });
}

loadHistory();
