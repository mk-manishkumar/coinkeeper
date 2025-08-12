import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ExpenseForm } from "./childComponents/ExpenseForm";
import { ExpenseList } from "./childComponents/ExpenseList";
import { ExpenseStats } from "./childComponents/ExpenseStats";
import { addExpense as addExpenseApi, deleteExpense as deleteExpenseApi, deleteAllExpenses as deleteAllExpensesApi, getProfile } from "@/services/profileService";
import {  deleteExpense, clearExpenses, setProfileData } from "@/store/profileSlice";
import { toast } from "react-toastify";

export const RightPanel = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.user);
  const expenses = useAppSelector((state) => state.profile.expenses);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth?.username) return;
      const res = await getProfile(auth.username);
      dispatch(setProfileData(res.data));
    };
    fetchData();
  }, [auth?.username, dispatch]);

  const handleAdd = async (data: { description: string; amount: number; expense: string }) => {
    try {
      await addExpenseApi(data); 
      const res = await getProfile(auth!.username); 
      dispatch(setProfileData(res.data)); 
      toast.success("Expense added");
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpenseApi(id);
      dispatch(deleteExpense(id));
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllExpensesApi();
      dispatch(clearExpenses()); 
      toast.success("All expenses deleted");
    } catch {
      toast.error("Failed to clear expenses");
    }
  };

  const savings = expenses.filter((e) => e.expense === "Savings").reduce((sum, e) => sum + e.amount, 0);
  const expenditure = expenses.filter((e) => e.expense === "Expenditure").reduce((sum, e) => sum + e.amount, 0);
  const investment = expenses.filter((e) => e.expense === "Investment").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="w-full md:w-2/3 p-6 bg-[#c7d6e0]">
      <ExpenseForm onSubmit={handleAdd} />
      <ExpenseStats savings={savings} expenditure={expenditure} investment={investment} onClearAll={handleClearAll} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
};
