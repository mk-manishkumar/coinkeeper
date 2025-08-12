import { ExpenseItem } from "./ExpenseItem";

type Expense = {
  _id: string;
  description: string;
  amount: number;
  expense: "Savings" | "Expenditure" | "Investment";
  createdAt: string;
};

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export const ExpenseList = ({ expenses, onDelete }: Props) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {expenses.map((exp) => (
        <ExpenseItem key={exp._id} date={new Date(exp.createdAt).toLocaleDateString("en-GB")} description={exp.description} amount={exp.amount} type={exp.expense} onDelete={() => onDelete(exp._id)} />
      ))}
    </ul>
  );
};
