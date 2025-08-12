type Props = {
  date: string;
  description: string;
  amount: number;
  type: "Savings" | "Expenditure" | "Investment";
  onDelete: () => void;
};

export const ExpenseItem = ({ date, description, amount, type, onDelete }: Props) => {
  const bgMap = {
    Savings: "bg-green-700",
    Expenditure: "bg-red-600",
    Investment: "bg-slate-800",
  };

  return (
    <li className={`text-white w-60 p-4 rounded shadow-md space-y-2 mx-auto ${bgMap[type]}`}>
      {/* Top Row - Date */}
      <div className="text-sm font-semibold">{date}</div>

      {/* Middle Row - Description & Amount */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">{description}</span>
        <span className="text-lg font-bold">{amount}</span>
      </div>

      {/* Bottom Row - Type & Delete */}
      <div className="flex justify-between items-center">
        <span className="italic">{type}</span>
        <button onClick={onDelete} className="text-xl hover:text-red-300 transition">
          🗑
        </button>
      </div>
    </li>
  );
};
