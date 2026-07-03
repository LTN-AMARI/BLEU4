function render() {
  const cal = document.getElementById("calendar");
  if (!cal) return;

  cal.innerHTML = "";

  for (let i = 1; i <= 30; i++) {
    const d = document.createElement("div");
    d.className = "day";
    d.innerText = i;
    cal.appendChild(d);
  }
}

function updateUser() {
  const u = document.getElementById("userLabel");
  if (u && window.currentUser) {
    u.innerText =
      window.currentUser.grade +
      " " +
      window.currentUser.nom +
      " (" +
      window.currentUser.role +
      ")";
  }
}

window.refreshUI = function () {
  render();
  updateUser();
};

window.onload = () => {
  render();
  updateUser();

  if (window.currentUser?.role === "commandement") {
    document.getElementById("create").style.display = "block";
  }
};
