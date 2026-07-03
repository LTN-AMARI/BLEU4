let currentMonth = new Date().getMonth(); // 0-11
let currentYear  = new Date().getFullYear();

// =========================
// RENDU CALENDRIER
// =========================

function renderCalendar() {
    const calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = "";

    const monthNames = [
        "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
    ];

    const header = document.createElement("div");
    header.className = "cal-header";
    header.innerHTML = `
        <button onclick="prevMonth()">◀</button>
        <span>${monthNames[currentMonth]} ${currentYear}</span>
        <button onclick="nextMonth()">▶</button>
    `;
    calendarDiv.appendChild(header);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>L</th><th>M</th><th>M</th><th>J</th><th>V</th><th>S</th><th>D</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = (firstDay.getDay() + 6) % 7; // Lundi=0
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let day = 1;
    for (let week = 0; week < 6; week++) {
        const tr = document.createElement("tr");
        for (let d = 0; d < 7; d++) {
            const td = document.createElement("td");
            if (week === 0 && d < startDay || day > daysInMonth) {
                td.textContent = "";
            } else {
                td.textContent = day;
                td.onclick = () => onDayClick(day, currentMonth + 1, currentYear);
            }
            tr.appendChild(td);
            if (day <= daysInMonth && !(week === 0 && d < startDay)) day++;
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    calendarDiv.appendChild(table);
}

// =========================
// CHANGEMENT DE MOIS
// =========================

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// =========================
// ACTIVITÉS DU JOUR
// =========================

function onDayClick(day, month, year) {
    const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    showDayActivities(dateStr);
}

function showDayActivities(dateStr) {
    const list = document.getElementById("activities");
    list.innerHTML = `<h2>Activités du ${dateStr}</h2>`;

    const dayEvents = getEventsByDate(dateStr);

    if (dayEvents.length === 0) {
        list.innerHTML += "<p>Aucune activité ce jour.</p>";
        return;
    }

    dayEvents.forEach(ev => {
        const div = document.createElement("div");
        div.className = "event-box";

        div.innerHTML = `
            <h3>${ev.title}</h3>
            <p><strong>Du :</strong> ${ev.start} <strong>Au :</strong> ${ev.end}</p>
            <p><strong>Personnel concernés :</strong> ${
                ev.concerned === "tous" ? "Tous" : ev.concerned.join(", ")
            }</p>
        `;

        // Membres : boutons JE PARTICIPE / INDISPONIBLE
        if (currentUser.role === "membre") {
            div.innerHTML += `
                <button class="btn-green" onclick="setParticipation(${ev.id}, 'participant'); showDayActivities('${dateStr}')">JE PARTICIPE</button>
                <button class="btn-red" onclick="setParticipation(${ev.id}, 'indisponible'); showDayActivities('${dateStr}')">INDISPONIBLE</button>
            `;
        }

        // Commandement : vue détaillée
        if (currentUser.role === "commandement") {
            div.innerHTML += `
                <h4>JE PARTICIPE (${ev.participants.length})</h4>
                <ul>
                    ${ev.participants.map(u => `<li class="green">${u.grade} ${u.nom} (${u.login})</li>`).join("")}
                </ul>

                <h4>INDISPONIBLE (${ev.indisponibles.length})</h4>
                <ul>
                    ${ev.indisponibles.map(u => `<li class="red">${u.grade} ${u.nom} (${u.login})</li>`).join("")}
                </ul>
            `;
        }

        list.appendChild(div);
    });
}

// =========================
// FORMULAIRE CRÉATION MISSION
// =========================

function initCreateForm() {
    const box = document.getElementById("createEvent");
    if (currentUser.role !== "commandement") {
        box.style.display = "none";
        return;
    }
    box.style.display = "block";
}

function createMission() {
    const title = document.getElementById("mission-title").value;
    const start = document.getElementById("mission-start").value;
    const end   = document.getElementById("mission-end").value;
    const concerned = document.getElementById("mission-concerned").value;

    if (!title || !start || !end || !concerned) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    addEvent(title, start, end, concerned);
    alert("Mission créée.");
    renderCalendar();
}

// =========================
// INIT
// =========================

window.onload = function() {
    renderCalendar();
    initCreateForm();
};
