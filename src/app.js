const selectElement = document.getElementById("expenseType");
selectElement.options[0].disabled = true;

selectElement.addEventListener("change", () => {
  console.log(selectElement.value);
});

// to display month and year
const currentDate = new Date();
const month = currentDate.toLocaleString("default", { month: "long" });
const year = currentDate.getFullYear();

const currentMonthYear = `${month} ${year}`;

const displayMonthYear = document.querySelector(".month-year");
displayMonthYear.innerHTML = currentMonthYear;
