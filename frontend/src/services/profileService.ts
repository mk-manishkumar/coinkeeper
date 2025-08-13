import {instance} from "./axiosInstance";

export const getProfile = (username: string) =>
  instance.get(`/api/v1/profile/${username}`);

export const addExpense = (data: {description: string;amount: number;expense: string; }) =>
  instance.post("/api/v1/profile/addamount", {...data,expense: data.expense as "Savings" | "Expenditure" | "Investment"
  });


export const deleteExpense = (expenseId: string) =>
  instance.delete(`/api/v1/profile/deleteexpense/${expenseId}`);

export const deleteAllExpenses = () =>
  instance.delete("/api/v1/profile/deleteallexpenses");

export const deleteAccount = (password: string) =>
  instance.delete("/api/v1/profile/deleteaccount", {data: { password }});
