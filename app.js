// =========================
// AFFICHER LES ACTIVITÉS DU JOUR
// =========================

function showDayActivities(dateStr) {
    const list = document.getElementById("activities");
    list.innerHTML = "";

    const dayEvents = getEventsByDate(dateStr);

    if (dayEvents.length === 0) {
        list.innerHTML = "<p>Aucune activité ce jour.</p>";
        return;
    }

    dayEvents.forEach(ev => {
        const div = document.createElement("div");
        div.className = "event-box";

        div.innerHTML = `
            <h3>${ev.title}</h3>
            <p>${ev.description}</p>
            <p><strong>Du :</strong> ${ev.start} <strong>Au :</strong> ${ev.end}</p>
        `;

        // Boutons pour les membres simples
        if (currentUser.role === "membre") {
            div.innerHTML += `
                <button class="btn-green" onclick="setParticipation(${ev.id}, 'participant'); showDayActivities('${dateStr}')">Participer</button>
                <button class="btn-red" onclick="setParticipation(${ev.id}, 'indisponible'); showDayActivities('${dateStr}')">Indisponible</button>
            `;
        }

        // Vue commandement
        if (currentUser.role === "commandement") {
            div.innerHTML += `
                <h4>Participants (${ev.participants.length})</h4>
                <ul>
                    ${ev.participants.map(u => `<li class="green">${u.grade} ${u.nom} (${u.login})</li>`).join("")}
                </ul>

                <h4>Indisponibles (${ev.indisponibles.length})</h4>
                <ul>
                    ${ev.indisponibles.map(u => `<li class="red">${u.grade} ${u.nom} (${u.login})</li>`).join("")}
                </ul>
            `;
        }

        list.appendChild(div);
    });
}

// =========================
// CLIQUE SUR UN JOUR DU CALENDRIER
// =========================

function onDayClick(day, month, year) {
    const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    showDayActivities(dateStr);
}
