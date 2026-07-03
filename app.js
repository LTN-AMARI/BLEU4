let currentDate = new Date();
let role = localStorage.getItem("bleu4_role") || "simple";
let selectedDate = null;

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
            selectedDate = iso;
            updateEventList(iso);
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
        item.innerHTML = `
            <strong>${evt.title}</strong><br>
            ${evt.desc}<br>
            <small>Du ${evt.start} au ${evt.end}</small><br><br>
            <strong>Participants :</strong> ${evt.participants.join(", ") || "Aucun"}<br>
            <strong>Indisponibles :</strong> ${evt.unavailable.join(", ") || "Aucun"}
        `;
        list.appendChild(item);
    });
}

function setupParticipation() {
    const box = document.getElementById("participationBox");

    if (role !== "simple") {
        box.style.display = "none";
        return;
    }

    document.getElementById("participateBtn").onclick = () => {
        if (!selectedDate) return alert("Sélectionne un jour.");
        setParticipation(selectedDate, "ok");
        updateEventList(selectedDate);
        alert("Participation enregistrée.");
    };

    document.getElementById("notAvailableBtn").onclick = () => {
        if (!selectedDate) return alert("Sélectionne un jour.");
        setParticipation(selectedDate, "no");
        updateEventList(selectedDate);
        alert("Indisponibilité enregistrée.");
    };
}

function setupForm() {
    const form = document.getElementById("eventForm");

    if (role !== "cmd") {
        form.style.display = "none";
        return;
    }

    const startInput = document.getElementById("eventStart");
    const endInput = document.getElementById("eventEnd");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const saveBtn = document.getElementById("saveEventBtn");

    startInput.value = formatISO(new Date());
    endInput.value = formatISO(new Date());

    saveBtn.onclick = () => {
        const startISO = startInput.value;
        const endISO = endInput.value;
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title) return alert("Titre obligatoire.");

        addEvent(startISO, endISO, title, desc);

        renderCalendar();
        updateEventList(startISO);

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

window.onload = () => {
    setupNavigation();
    setupForm();
    setupParticipation();
    renderCalendar();
};
