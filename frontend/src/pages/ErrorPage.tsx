import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  code: number;
  title: string;
  message: string;
};

export const ErrorPage = ({ code, title, message }: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-red-500">{code}</h1>
      <h2 className="text-2xl mt-4">{title}</h2>
      <p className="text-gray-400 mt-2">{message}</p>
      <Button onClick={() => navigate("/")} className="mt-6">
        Go Back Home
      </Button>
    </div>
  );
};

