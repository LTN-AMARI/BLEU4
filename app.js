let currentDate = new Date();

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

        if (events[iso]) day.classList.add("has-event");
        if (iso === todayISO) day.classList.add("today");

        day.textContent = d;

        day.onclick = () => {
            updateEventList(iso);
            document.getElementById("eventDate").value = iso;
        };

        calendar.appendChild(day);
    }
}

function updateEventList(dateISO) {
    const list = document.getElementById("eventList");
    const events = getEventsFor(dateISO);

    if (events.length === 0) {
        list.textContent = "Aucune activité.";
        return;
    }

    list.innerHTML = "";
    events.forEach(evt => {
        const item = document.createElement("div");
        item.innerHTML = `<strong>${evt.title}</strong><br>${evt.desc}`;
        list.appendChild(item);
    });
}

function setupForm() {
    const dateInput = document.getElementById("eventDate");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const saveBtn = document.getElementById("saveEventBtn");

    dateInput.value = formatISO(new Date());

    saveBtn.onclick = () => {
        const dateISO = dateInput.value;
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title) {
            alert("Titre obligatoire.");
            return;
        }

        addEvent(dateISO, title, desc);

        renderCalendar();
        updateEventList(dateISO);

        alert("Activité enregistrée !");
        titleInput.value = "";
        descInput.value = "";
    };
}

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

function startupPopup() {
    const todayISO = formatISO(new Date());
    const events = getEventsFor(todayISO);

    if (events.length > 0) {
        const txt = events.map(e => "• " + e.title).join("\n");
        alert("Activités aujourd'hui :\n\n" + txt);
    }
}

window.onload = () => {
    setupNavigation();
    setupForm();
    renderCalendar();
    updateEventList(formatISO(new Date()));
    startupPopup();
};
