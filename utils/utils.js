// to get background color for each expense
function getBackgroundColor(expenseType) {
  switch (expenseType) {
    case "Savings":
      return "green";
    case "Expenditure":
      return "red";
    case "Investment":
      return "#2A324B";
  }
}

// for calculating total of each expenses
function calculateTotals(expenses) {
  let savingsTotal = 0;
  let expenditureTotal = 0;
  let investmentTotal = 0;

  expenses.forEach((expense) => {
    switch (expense.expense) {
      case "Savings":
        savingsTotal += expense.amount;
        break;
      case "Expenditure":
        expenditureTotal += expense.amount;
        break;
      case "Investment":
        investmentTotal += expense.amount;
        break;
    }
  });

  return {
    savingsTotal: savingsTotal,
    expenditureTotal: expenditureTotal,
    investmentTotal: investmentTotal,
  };
}

module.exports = {
  getBackgroundColor,
  calculateTotals,
};
