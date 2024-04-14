
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

