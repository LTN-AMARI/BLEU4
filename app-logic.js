// =========================
// BASE DE DONNÉES ACTIVITÉS
// =========================

let events = []; 
// Structure :
// {
//   id: number,
//   title: string,
//   description: string,
//   start: string,
//   end: string,
//   participants: [ {login, grade, nom} ],
//   indisponibles: [ {login, grade, nom} ]
// }

// =========================
// UTILISATEUR CONNECTÉ
// =========================

let currentUser = {
    login: "",
    grade: "",
    nom: "",
    role: "membre" // "membre" ou "commandement"
};

// =========================
// AJOUT D’UNE ACTIVITÉ
// =========================

function addEvent(title, description, start, end) {
    const id = Date.now();
    events.push({
        id,
        title,
        description,
        start,
        end,
        participants: [],
        indisponibles: []
    });
}

// =========================
// PARTICIPATION / INDISPO
// =========================

function setParticipation(eventId, status) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    // Supprimer l’utilisateur des deux listes
    ev.participants = ev.participants.filter(u => u.login !== currentUser.login);
    ev.indisponibles = ev.indisponibles.filter(u => u.login !== currentUser.login);

    // Ajouter dans la bonne liste
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
