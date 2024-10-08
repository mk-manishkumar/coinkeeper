// button effect if screen size decreases
function checkScreenWidth() {
  const screenWidth = window.innerWidth;
  const addBtn = document.getElementById("add-btn");

  if (screenWidth < 850) {
    addBtn.classList.remove("fas", "fa-check-circle", "tick");
    addBtn.textContent = "ADD";
  } else {
    addBtn.classList.add("fas", "fa-check-circle", "tick");
    addBtn.textContent = "";
  }
}

window.addEventListener("resize", checkScreenWidth);


