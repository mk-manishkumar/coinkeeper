import {instance} from "./axiosInstance";

export const getProfile = (username: string) =>
  instance.get(`/profile/${username}`);

export const addExpense = (data: {description: string;amount: number;expense: string; }) =>
  instance.post("/profile/addamount", {...data,expense: data.expense as "Savings" | "Expenditure" | "Investment"
  });


export const deleteExpense = (expenseId: string) =>
  instance.delete(`/profile/deleteexpense/${expenseId}`);

export const deleteAllExpenses = () =>
  instance.delete("/profile/deleteallexpenses");

export const deleteAccount = (password: string) =>
  instance.delete("/profile/deleteaccount", {data: { password }});
