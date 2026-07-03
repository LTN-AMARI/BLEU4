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

function loadEvents() {
    return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function getEventsFor(dateISO) {
    const events = loadEvents();
    return events[dateISO] || [];
}

function addEvent(startISO, endISO, title, desc) {
    const events = loadEvents();

    let current = new Date(startISO);
    const end = new Date(endISO);

    while (current <= end) {
        const iso = formatISO(current);
        if (!events[iso]) events[iso] = [];
        events[iso].push({
            title,
            desc,
            start: startISO,
            end: endISO,
            participants: [],
            unavailable: []
        });
        current.setDate(current.getDate() + 1);
    }

    saveEvents(events);
}

function setParticipation(dateISO, status) {
    const role = localStorage.getItem("bleu4_role");
    const name = localStorage.getItem("bleu4_name") || "Membre";

    const events = loadEvents();
    const list = events[dateISO] || [];

    list.forEach(evt => {
        evt.participants = evt.participants || [];
        evt.unavailable = evt.unavailable || [];

        evt.participants = evt.participants.filter(n => n !== name);
        evt.unavailable = evt.unavailable.filter(n => n !== name);

        if (status === "ok") evt.participants.push(name);
        if (status === "no") evt.unavailable.push(name);
    });

    events[dateISO] = list;
    saveEvents(events);
}
