let currentDate = new Date();

// --- Rendu du calendrier ---
function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const label = document.getElementById("monthLabel");
    calendar.innerHTML = "";

    label.textContent = monthLabel(currentDate);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const startDay = first.getDay();
    const totalDays = last.getDate();

    const weekdays = ["D","L","M","M","J","V","S"];
    weekdays.forEach(w => {
        const el = document.createElement("div");
        el.className = "weekday";
        el.textContent = w;
        calendar.appendChild(el);
    });

    const emptyCells = (startDay === 0 ? 6 : startDay - 1);
    for (let i = 0; i < emptyCells; i++) {
        const empty = document.createElement("div");
        empty.className = "day";
        empty.style.visibility = "hidden";
        calendar.appendChild(empty);
    }

    const todayISO = formatISO(new Date());
    const events = loadEvents();

    for (let d = 1; d <= totalDays; d++) {
        const date = new Date(year, month, d);
        const iso = formatISO(date);

        const day = document.createElement("div");
        day.className = "day";
        day.dataset.date = iso;

        const num = document.createElement("div");
        num.className = "day-number";
        num.textContent = d;
        day.appendChild(num);

        if (events[iso]) day.classList.add("has-event");
        if (iso === todayISO) day.classList.add("today");

        day.addEventListener("click", () => {
            updateEventList(iso);
            document.getElementById("eventDate").value = iso;
        });

        calendar.appendChild(day);
    }
}

// --- Affichage des activités ---
function updateEventList(dateISO) {
    const list = document.getElementById("eventList");
    const events = getEventsFor(dateISO);

    if (events.length === 0) {
        list.textContent = "Aucune activité pour ce jour.";
        return;
    }

    list.innerHTML = "";
    events.forEach(evt => {
        const item = document.createElement("div");
        item.className = "event-item";
        item.innerHTML = `<strong>${evt.title}</strong><br>${evt.desc || ""}`;
        list.appendChild(item);
    });
}

// --- Formulaire ---
function setupForm() {
    const dateInput = document.getElementById("eventDate");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const saveBtn = document.getElementById("saveEventBtn");

    dateInput.value = formatISO(new Date());

    saveBtn.addEventListener("click", () => {
        const dateISO = dateInput.value;
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title) {
            alert("Le titre est obligatoire.");
            return;
        }

        addEvent(dateISO, title, desc);

        renderCalendar();
        updateEventList(dateISO);

        alert("Activité enregistrée !");
        titleInput.value = "";
        descInput.value = "";
    });
}

// --- Navigation ---
function setupNavigation() {
    document.getElementById("prevMonthBtn").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };

    document.getElementById("nextMonthBtn").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };
}

// --- Popup au démarrage ---
function startupPopup() {
    const todayISO = formatISO(new Date());
    const events = getEventsFor(todayISO);

    if (events.length > 0) {
        const txt = events.map(e => "• " + e.title).join("\n");
        alert("Activités prévues aujourd'hui :\n\n" + txt);
    }
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupForm();
    renderCalendar();

    updateEventList(formatISO(new Date()));
    startupPopup();
});
