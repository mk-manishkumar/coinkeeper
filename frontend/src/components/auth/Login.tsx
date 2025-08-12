import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { checkAuth, loginUser } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const [checking, setChecking] = useState(true); 

  // Redirect if already logged in
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await checkAuth();
        if (res.status === 200) {
          navigate(`/profile/${res.data.username}`, { replace: true });
        } else {
          setChecking(false);
        }
      } catch {
        setChecking(false);
      }
    };

    checkIfLoggedIn();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(input);
      if (response.status === 200) {
        toast.success("Login successful!");

        dispatch(
          setUser({
            username: response.data.username,
            fullname: response.data.fullname,
            role: "user",
            token: response.data.token,
          })
        );

        navigate(`/profile/${input.username}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50">
      <header className="bg-blue-600 text-white w-full py-4 text-center text-3xl font-bold shadow">CoinKeeper</header>

      <div className="bg-white flex flex-col items-center justify-center flex-grow w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-md space-y-5 shadow-md mt-16">
          <h2 className="text-center text-2xl font-semibold">Login</h2>

          <Input type="text" placeholder="Username" name="username" value={input.username} onChange={handleChange} required />
          <Input type="password" placeholder="Password" name="password" value={input.password} onChange={handleChange} required />

          <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">Login</Button>

          <p className="text-center text-sm text-gray-600">
            Not registered?{" "}
            <Link to={"/register"} className="text-blue-600 hover:underline cursor-pointer">
              Register here
            </Link>
          </p>
        </form>
      </div>

      <footer className="mt-10 text-center text-sm text-white bg-blue-600 w-full py-4">
        <p>© 2025 CoinKeeper. All rights reserved.</p>
      </footer>
    </div>
  );
};
