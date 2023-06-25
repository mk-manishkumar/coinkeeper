const totalAmount = document.querySelector(".amount-value");
totalAmount.innerHTML = 0;

const selectElement = document.getElementById("expenseType");
selectElement.options[0].disabled = true;

function chooseExpense() {
  let expenseChoice = selectElement.value;

  if (expenseChoice === "Expense Type") {
    alert("Choose an expense type");
    selectElement.selectedIndex = 0;
    selectElement.options[0].disabled = true;
  } else {
    selectElement.options[0].disabled = false;
    return expenseChoice;
  }
}

selectElement.addEventListener("change", chooseExpense);

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
const leftHead = document.querySelector(".left-head");
const rightHead = document.querySelector(".right-head");

function toggleTickAndText() {
  if (window.innerWidth < 850) {
    tickIcon.classList.add("add-button");
    tickIcon.classList.remove("tick");
    tickIcon.classList.remove("fas");
    tickIcon.classList.remove("fa-check-circle");
    tickIcon.textContent = "ADD";
    leftHead.innerHTML = "&#x1FA99;CoinKeeper";
    rightHead.innerHTML = "";
  } else {
    tickIcon.classList.remove("add-button");
    tickIcon.classList.add("tick");
    tickIcon.classList.add("fas");
    tickIcon.classList.add("fa-check-circle");
    tickIcon.textContent = "";
    leftHead.innerHTML = "Your Budget &#x1F4B0;";
    rightHead.innerHTML = "&#x1FA99;CoinKeeper";
  }
}

toggleTickAndText();

window.addEventListener("resize", toggleTickAndText);

// budget list
let expenses = [];
const budgetList = document.querySelector(".budget-list");
const budgetDesc = document.querySelector(".description");
const budgetAmount = document.querySelector(".amount");
const clearAll = document.querySelector("#clear-all");
let choice;
budgetList.innerHTML = "";

function showExpenses() {
  choice = chooseExpense();
  clearAll.style.display = "inline";

  let content = "";

  if (
    choice !== undefined &&
    budgetDesc.value !== "" &&
    budgetAmount.value !== ""
  ) {
    if (budgetAmount.value > 0) {
      const expense = `
      <div class="budget">
        <p class="date">${fullDate()}</p>
        <p class="desc">${budgetDesc.value}</p>
        <strong>${choice}</strong>
        <p class="amount-values">₹${budgetAmount.value}</p>
        <i class="fa-sharp fa-solid fa-trash" id="delete"></i>
      </div>
    `;

      content += expense;
      budgetList.innerHTML += content;
      expenses.push(expense);

      // for adding in total budget amount
      totalAmount.innerHTML =
        Number(totalAmount.innerHTML) + Number(budgetAmount.value);

      saveExpensesToLocalStorage(); // Update the stored expenses in local storage
      deleteExpense(); // Add event listener to the delete icon
    } else {
      alert("Amount can't be less than 1");
    }
  } else if (choice === undefined) {
    return;
  } else if (budgetDesc.value === "") {
    alert("Please fill the description");
  } else {
    alert("Please fill the amount");
  }
}

// tick-icon event-listener
tickIcon.addEventListener("click", () => {
  showExpenses();
  if (budgetAmount.value !== "" && budgetAmount.value > 0) {
    budgetDesc.value = "";
    budgetAmount.value = "";
  } else {
    budgetAmount.value = "";
  }
});

// delete expense function
function deleteExpense() {
  const deleteIcons = document.querySelectorAll(".fa-trash");
  deleteIcons.forEach((del, index) => {
    del.addEventListener("click", () => {
      const deletedExpense = expenses[index];
      const amount = Number(deletedExpense.match(/₹(\d+)/)[1]);

      expenses.splice(index, 1);
      budgetList.innerHTML = ""; // Clear the budget list
      expenses.forEach((expense) => {
        budgetList.innerHTML += expense;
      });
      saveExpensesToLocalStorage(); // Update the stored expenses in local storage

      // Deduct the amount from totalAmount
      totalAmount.innerHTML = Number(totalAmount.innerHTML) - amount;
      toggleClearBtn();
      deleteExpense();
    });
  });
}

// clear all event listener
clearAll.addEventListener("click", () => {
  budgetList.innerHTML = "";
  localStorage.clear();
  clearAll.style.display = "none";
  totalAmount.innerHTML = Number(0);
});

function toggleClearBtn() {
  if (budgetList.innerHTML === "" && expenses.length === 0) {
    clearAll.style.display = "none";
  } else if (expenses.length > 0) {
    clearAll.style.display = "inline";
  }
}

toggleClearBtn();

// for saving into local storage
function saveExpensesToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// to load expenses from local storage
function loadExpensesFromLocalStorage() {
  const storedExpenses = localStorage.getItem("expenses");

  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);

    expenses.forEach((expense) => {
      budgetList.innerHTML += expense;
    });

    // Update the total amount based on the loaded expenses
    const total = expenses.reduce((sum, expense) => {
      const amount = Number(expense.match(/₹(\d+)/)[1]);
      return sum + amount;
    }, 0);
    totalAmount.innerHTML = total;

    deleteExpense(); // Add event listener to the delete icon

    toggleClearBtn();
  }
}

loadExpensesFromLocalStorage();
