// --- Utilitaires de date ---
function formatDateISO(date) {
    return date.toISOString().split("T")[0];
}

function getMonthLabel(date) {
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return months[date.getMonth()] + " " + date.getFullYear();
}

// --- Stockage des événements dans localStorage ---
function loadEvents() {
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

// --- Rendu du calendrier ---
let currentDate = new Date();

function renderCalendar() {
    const calendarEl = document.getElementById("calendar");
    const monthLabelEl = document.getElementById("monthLabel");
    calendarEl.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthLabelEl.textContent = getMonthLabel(currentDate);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay(); // 0 = dimanche
    const totalDays = lastDay.getDate();

    const weekdays = ["D", "L", "M", "M", "J", "V", "S"];
    weekdays.forEach(w => {
        const wd = document.createElement("div");
        wd.className = "weekday";
        wd.textContent = w;
        calendarEl.appendChild(wd);
    });

    // Cases vides avant le 1er du mois
    for (let i = 0; i < (startWeekday === 0 ? 6 : startWeekday - 1); i++) {
        const empty = document.createElement("div");
        empty.className = "day";
        empty.style.visibility = "hidden";
        calendarEl.appendChild(empty);
    }

    const todayISO = formatDateISO(new Date());
    const events = loadEvents();

    for (let d = 1; d <= totalDays; d++) {
        const cellDate = new Date(year, month, d);
        const iso = formatDateISO(cellDate);

        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.dataset.date = iso;

        const numEl = document.createElement("div");
        numEl.className = "day-number";
        numEl.textContent = d;
        dayEl.appendChild(numEl);

        // Marquage des jours avec activité
        if (events[iso] && events[iso].length > 0) {
            dayEl.classList.add("has-event");
        }

        // Marquage du jour actuel
        if (iso === todayISO) {
            dayEl.classList.add("today");
        }

        // Clic sur un jour -> affiche les activités de ce jour
        dayEl.addEventListener("click", () => {
            updateEventList(iso);
            const eventDateInput = document.getElementById("eventDate");
            eventDateInput.value = iso;
        });

        calendarEl.appendChild(dayEl);
    }
}

// --- Affichage des activités pour une date ---
function updateEventList(dateISO) {
    const eventListEl = document.getElementById("eventList");
    const events = loadEvents();
    const list = events[dateISO] || [];

    if (list.length === 0) {
        eventListEl.textContent = "Aucune activité pour ce jour.";
        return;
    }

    eventListEl.innerHTML = "";
    list.forEach(evt => {
        const item = document.createElement("div");
        item.className = "event-item";
        item.innerHTML = `
            <span><strong>${evt.title}</strong></span>
            <span>${evt.desc || ""}</span>
        `;
        eventListEl.appendChild(item);
    });
}

// --- Création d'une activité ---
function setupEventForm() {
    const dateInput = document.getElementById("eventDate");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const saveBtn = document.getElementById("saveEventBtn");

    // Par défaut, date du jour
    dateInput.value = formatDateISO(new Date());

    saveBtn.addEventListener("click", () => {
        const dateISO = dateInput.value;
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!dateISO || !title) {
            alert("Merci de renseigner au minimum la date et le titre.");
            return;
        }

        const events = loadEvents();
        if (!events[dateISO]) {
            events[dateISO] = [];
        }

        events[dateISO].push({ title, desc });
        saveEvents(events);

        // Met à jour le calendrier et la liste
        renderCalendar();
        updateEventList(dateISO);

        // Petit feedback
        alert("Activité enregistrée pour le " + dateISO + ".");

        // Reset titre/description
        titleInput.value = "";
        descInput.value = "";
    });
}

// --- Navigation mois précédent / suivant ---
function setupMonthNavigation() {
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

// --- Popup à l'ouverture si des événements existent aujourd'hui ---
function showTodayEventsPopup() {
    const todayISO = formatDateISO(new Date());
    const events = loadEvents();

    if (events[todayISO] && events[todayISO].length > 0) {
        const lines = events[todayISO].map(e => `• ${e.title}`).join("\n");
        alert("Activités prévues aujourd'hui (" + todayISO + ") :\n\n" + lines);
    }
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
    setupMonthNavigation();
    setupEventForm();
    renderCalendar();

    // Affiche les activités du jour dans le panneau
    const todayISO = formatDateISO(new Date());
    updateEventList(todayISO);

    // Popup si activités aujourd'hui
    showTodayEventsPopup();
});
