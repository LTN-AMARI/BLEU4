// --- Gestion des dates ---
function formatISO(date) {
    return date.toISOString().split("T")[0];
}

function monthLabel(date) {
    const m = [
        "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
    ];
    return m[date.getMonth()] + " " + date.getFullYear();
}

// --- Stockage des événements ---
function loadEvents() {
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

// --- Récupération des événements d'une date ---
function getEventsFor(dateISO) {
    const events = loadEvents();
    return events[dateISO] || [];
}

// --- Ajout d'un événement ---
function addEvent(dateISO, title, desc) {
    const events = loadEvents();
    if (!events[dateISO]) events[dateISO] = [];
    events[dateISO].push({ title, desc });
    saveEvents(events);
}
