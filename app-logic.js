// =========================
// UTILISATEUR CONNECTÉ
// =========================

let currentUser = {
    login: "",
    grade: "",
    nom: "",
    role: "membre" // ou "commandement"
};

// =========================
// BASE DE DONNÉES ACTIVITÉS
// =========================

let events = [];
// {
//   id: number,
//   title: string,
//   start: string (YYYY-MM-DD),
//   end: string (YYYY-MM-DD),
//   concerned: "tous" ou [ "login1", "login2", ... ],
//   participants: [ {login, grade, nom} ],
//   indisponibles: [ {login, grade, nom} ]
// }

// =========================
// CRÉATION D’ÉVÈNEMENT
// =========================

function addEvent(title, start, end, concernedStr) {
    const id = Date.now();

    let concerned;
    if (concernedStr.trim().toLowerCase() === "tous") {
        concerned = "tous";
    } else {
        concerned = concernedStr
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    events.push({
        id,
        title,
        start,
        end,
        concerned,
        participants: [],
        indisponibles: []
    });
}

// =========================
// PARTICIPATION / INDISPO
// =========================

function canUserParticipate(ev) {
    if (ev.concerned === "tous") return true;
    return ev.concerned.includes(currentUser.login);
}

function setParticipation(eventId, status) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    if (!canUserParticipate(ev)) {
        alert("Vous n'êtes pas concerné par cette mission");
        return;
    }

    // Retirer des deux listes
    ev.participants = ev.participants.filter(u => u.login !== currentUser.login);
    ev.indisponibles = ev.indisponibles.filter(u => u.login !== currentUser.login);

    // Ajouter dans la bonne
    if (status === "participant") {
        ev.participants.push({
            login: currentUser.login,
            grade: currentUser.grade,
            nom: currentUser.nom
        });
    } else if (status === "indisponible") {
        ev.indisponibles.push({
            login: currentUser.login,
            grade: currentUser.grade,
            nom: currentUser.nom
        });
    }
}

// =========================
// RÉCUPÉRER LES ACTIVITÉS D’UN JOUR
// =========================

function getEventsByDate(dateStr) {
    return events.filter(ev => dateStr >= ev.start && dateStr <= ev.end);
}
