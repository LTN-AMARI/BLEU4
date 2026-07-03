import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOTja98aO-0umXrqm2c2k4frUFn6why1o",
  authDomain: "bleu-4.firebaseapp.com",
  databaseURL: "https://bleu-4-default-rtdb.firebaseio.com",
  projectId: "bleu-4",
  storageBucket: "bleu-4.firebasestorage.app",
  messagingSenderId: "788139266954",
  appId: "1:788139266954:web:c1896f25eb57687846ae73"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.currentUser = JSON.parse(localStorage.getItem("BLEU4_USER"));
if (!window.currentUser) location.href = "index.html";

window.logout = () => {
  localStorage.clear();
  location.href = "index.html";
};

let events = [];
window.events = events;

onValue(ref(db, "events"), (snap) => {
  events = [];
  snap.forEach((c) => {
    events.push({ id: c.key, ...c.val() });
  });

  if (window.refreshUI) window.refreshUI();
});

window.addEvent = (title, start, end, concerned) => {
  push(ref(db, "events"), {
    title,
    start,
    end,
    concerned,
    participants: {},
    indisponibles: {}
  });
};

window.getEventsByDate = (date) => {
  return events.filter(
    (e) => e.start <= date && e.end >= date
  );
};

window.deleteEvent = (id) => {
  remove(ref(db, "events/" + id));
};

window.setParticipation = (id, status) => {
  const ev = events.find((e) => e.id === id);
  if (!ev) return;

  if (!ev[status]) ev[status] = {};
  ev[status][window.currentUser.login] = window.currentUser;

  set(ref(db, "events/" + id), ev);
};
