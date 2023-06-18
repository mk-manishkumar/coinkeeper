const selectElement = document.getElementById("expenseType");
selectElement.options[0].disabled = true;

selectElement.addEventListener("change", () => {
  console.log(selectElement.value);
});

// to display month and year
function monthYear() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const currentMonthYear = `${month} ${year}`;
  return currentMonthYear;
}

const displayMonthYear = document.querySelector(".month-year");
displayMonthYear.innerHTML = monthYear();

// function for date format
function fullDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

// for button-toggle
const tickIcon = document.querySelector(".tick.add-button.fas.fa-check-circle");

function toggleTickAndText() {
  if (window.innerWidth < 850) {
    tickIcon.classList.add("add-button");
    tickIcon.classList.remove("tick");
    tickIcon.classList.remove("fas");
    tickIcon.classList.remove("fa-check-circle");
    tickIcon.textContent = "ADD";
  } else {
    tickIcon.classList.remove("add-button");
    tickIcon.classList.add("tick");
    tickIcon.classList.add("fas");
    tickIcon.classList.add("fa-check-circle");
    tickIcon.textContent = "";
  }
}

toggleTickAndText();

window.addEventListener("resize", toggleTickAndText);

// tick-icon event-listener
tickIcon.addEventListener("click", () => {
  showExpenses();
});
