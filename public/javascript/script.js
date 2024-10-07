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

// handling error message
// window.addEventListener("load", () => {
//   const url = new URL(window.location.href);
//   if (url.searchParams.has("errorMessage")) {
//     url.searchParams.delete("errorMessage");
//     window.history.replaceState({}, document.title, url.toString());
//   }
// });
