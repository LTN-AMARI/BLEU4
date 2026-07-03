// UTILISATEUR CONNECTÉ
let currentUser = {
    login: "",
    nom: "",
    grade: "",
    role: "membre"
};

// BASE DE DONNÉES ACTIVITÉS
let events = [];
// {
//   id, title, start, end,
//   concerned: "tous" ou ["login1","login2"],
//   participants: [ {login, grade, nom} ],
//   indisponibles: [ {login, grade, nom} ]
// }

// CRÉATION D’UNE MISSION
function addEvent(title, start, end, concernedStr) {
    const id = Date.now();

    let concerned;
    if (concernedStr.trim().toLowerCase() === "tous") {
        concerned = "tous";
    } else {
        concerned = concernedStr.split(",").map(s => s.trim());
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

// VÉRIFICATION SI CONCERNÉ
function canUserParticipate(ev) {
    if (ev.concerned === "tous") return true;
    return ev.concerned.includes(currentUser.login);
}

// PARTICIPATION / INDISPO
function setParticipation(eventId, status) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    if (!canUserParticipate(ev)) {
        alert("Vous n'êtes pas concerné par cette mission");
        return;
    }

    ev.participants = ev.participants.filter(u => u.login !== currentUser.login);
    ev.indisponibles = ev.indisponibles.filter(u => u.login !== currentUser.login);

    if (status === "participant") {
        ev.participants.push({
            login: currentUser.login,
            grade: currentUser.grade,
            nom: currentUser.nom
        });
    } else {
        ev.indisponibles.push({
            login: currentUser.login,
            grade: currentUser.grade,
            nom: currentUser.nom
        });
    }
}

// ACTIVITÉS D’UN JOUR
function getEventsByDate(dateStr) {
    return events.filter(ev => dateStr >= ev.start && dateStr <= ev.end);
}
