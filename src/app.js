const totalAmount = document.querySelector(".amount-value");
totalAmount.innerHTML = 0;

const selectElement = document.getElementById("expenseType");
selectElement.options[0].disabled = true;

function chooseExpense() {
  let expenseChoice = selectElement.value;

  if (expenseChoice === "Expense Type") {
    alert("Choose expense type");
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

// budget list
let expenses = [];
const budgetList = document.querySelector(".budget-list");
const budgetDesc = document.querySelector(".description");
const budgetAmount = document.querySelector(".amount");
budgetList.innerHTML = "";

function showExpenses() {
  let choice = chooseExpense();
  console.log(choice);

  let content = "";

  if (
    choice !== undefined &&
    budgetDesc.value !== "" &&
    budgetAmount.value !== ""
  ) {
    if (budgetAmount.value > 0) {
      const budgetElement = document.createElement("div");
      budgetElement.classList.add("budget");

      const dateElement = document.createElement("p");
      dateElement.textContent = fullDate();

      const descElement = document.createElement("p");
      descElement.classList.add("desc");
      descElement.textContent = budgetDesc.value;

      const amountElement = document.createElement("p");
      amountElement.textContent = `₹${budgetAmount.value}`;

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-sharp", "fa-solid", "fa-trash");

      budgetElement.appendChild(dateElement);
      budgetElement.appendChild(descElement);
      budgetElement.appendChild(amountElement);
      budgetElement.appendChild(trashIcon);

      // for adding in total budget amount
      budgetList.appendChild(budgetElement);
      totalAmount.innerHTML =
        Number(totalAmount.innerHTML) + Number(budgetAmount.value);

      if (choice === "Expenditure") {
        descElement.style.color = "#E21717";
        amountElement.style.color = "#E21717";
        dateElement.style.color = "#E21717";
      } else if (choice === "Savings") {
        descElement.style.color = "#22CB5C";
        amountElement.style.color = "#22CB5C";
        dateElement.style.color = "#22CB5C";
      } else if (choice === "Investment") {
        descElement.style.color = "#1b98f5";
        amountElement.style.color = "#1b98f5";
        dateElement.style.color = "#1b98f5";
      }
    } else {
      alert("Amount can't be less than 1");
    }
  } else if (choice === undefined) {
    return;
  } else if (budgetDesc.value === "") {
    alert("Please fill description");
  } else {
    alert("Please fill amount");
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
