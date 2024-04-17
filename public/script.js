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

// to clear everything in dB

document.getElementById("clear-all").addEventListener("click", async () => {
  try {
    const response = await fetch("/clear-all", {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Failed to clear database");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// delete expense by ID
async function handleDelete(event) {
  try {
    const listItem = event.target.closest("li");
    const expenseId = listItem.getAttribute("data-id");

    const response = await fetch(`/delete/${expenseId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      listItem.remove();
    } else {
      console.error("Failed to delete expense");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

// Adding click event listener to delete icons
const deleteIcons = document.querySelectorAll("#delete-icon");
deleteIcons.forEach((icon) => {
  icon.addEventListener("click", handleDelete);
});

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

// for filtering expenses
document.addEventListener("DOMContentLoaded", () => {
  const expenseList = document.getElementById("expense-list");
  const savingBtn = document.getElementById("saving-btn");
  const expenditureBtn = document.getElementById("expenditure-btn");
  const investmentBtn = document.getElementById("investment-btn");

  function filterExpenses(type) {
    const listItems = expenseList.querySelectorAll("li");
    listItems.forEach((item) => {
      if (item.getAttribute("data-type") === type || type === "all") {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  savingBtn.addEventListener("click", () => {
    filterExpenses("Savings");
  });

  expenditureBtn.addEventListener("click", () => {
    filterExpenses("Expenditure");
  });

  investmentBtn.addEventListener("click", () => {
    filterExpenses("Investment");
  });
});
