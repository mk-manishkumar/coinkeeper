import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { House } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  onSubmit: (data: { description: string; amount: number; expense: string }) => void;
};

export const ExpenseForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState({ description: "", amount: "", expense: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.description.length > 10) {
      toast.error("Description must be 10 characters or less");
      return;
    }

    if (!form.expense) {
      toast.error("Please select an expense type");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    onSubmit({
      description: form.description,
      amount: Number(form.amount),
      expense: form.expense,
    });

    setForm({ description: "", amount: "", expense: "" });
  };

  return (
    <>
      <div className="text-center mb-4 w-full">
        <h1 className="text-3xl font-extrabold">🪙CoinKeeper</h1>
      </div>
      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-10">
        <div className="">
          <Select value={form.expense} onValueChange={(val) => setForm({ ...form, expense: val })}>
            <SelectTrigger className="w-[200px] mx-auto text-xl bg-white cursor-pointer">
              <SelectValue placeholder="Expense Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="Savings">
                Savings
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Expenditure">
                Expenditure
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Investment">
                Investment
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="">
          <h2 className="flex items-center justify-center text-2xl text-[#535b5c] gap-2">
            Tracking Expenses <House className="text-blue-600 font-extrabold" />
          </h2>
        </div>

        <hr className="my-5 border-t border-blue-500" />

        <div className="flex flex-col sm:flex-row gap-4">
          <Input maxLength={10} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-none border border-gray-800 bg-white text-2xl text-[#535b5c] [&::placeholder]:text-lg" required />
          <Input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-none border border-gray-800 bg-white text-2xl text-[#535b5c] [&::placeholder]:text-xl" required />
          <Button type="submit" className="px-4 py-2 cursor-pointer w-fit mx-auto text-white bg-black rounded">
            {/* Show ✔ on medium screens and up */}
            <span className="hidden sm:inline">✔</span>
            {/* Show ADD on small screens */}
            <span className="inline sm:hidden">ADD</span>
          </Button>
        </div>

        <hr className="my-5 border-t border-blue-500" />
      </form>
    </>
  );
};
