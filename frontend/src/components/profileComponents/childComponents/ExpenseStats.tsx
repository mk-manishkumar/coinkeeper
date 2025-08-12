type ExpenseStatsProps = {
  savings: number;
  expenditure: number;
  investment: number;
  onClearAll: () => void;
};

export const ExpenseStats = ({ savings, expenditure, investment, onClearAll }: ExpenseStatsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4">
      <button className="bg-green-700 text-white px-4 py-2 rounded">Savings: {savings}</button>
      <button className="bg-red-600 text-white px-4 py-2 rounded">Expenditure: {expenditure}</button>
      <button className="bg-slate-800 text-white px-4 py-2 rounded">Investment: {investment}</button>
      <button onClick={onClearAll} className="text-xl text-black cursor-pointer">
        ✖
      </button>
    </div>
  );
};
