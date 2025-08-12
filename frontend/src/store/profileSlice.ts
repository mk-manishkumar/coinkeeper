import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type Expense = {
  _id: string;
  description: string;
  amount: number;
  expense: "Savings" | "Expenditure" | "Investment";
  createdAt: string;
};

type ProfileState = {
  fullname: string;
  expenses: Expense[];
};

const initialState: ProfileState = {
  fullname: "",
  expenses: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    clearProfile: () => initialState,
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((e) => e._id !== action.payload);
    },
    clearExpenses: (state) => {
      state.expenses = [];
    },
  },
})

export const { setProfileData, clearProfile, addExpense, deleteExpense, clearExpenses } = profileSlice.actions;
export default profileSlice.reducer;
