import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, guestSignIn, checkAuth } from "@/services/authService";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "@/store/authSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const Register = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = user?.token;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(true);

  const [input, setInput] = useState({
    username: "",
    fullname: "",
    password: "",
  });

  // Redirect if already logged in
 useEffect(() => {
   if (!token) {
     setChecking(false);
     return;
   }

   const checkIfLoggedIn = async () => {
     try {
       const res = await checkAuth();
       if (res.status === 200) {
         navigate(`/profile/${res.data.username}`, { replace: true });
       } else {
         setChecking(false);
       }
     } catch (err) {
       if (axios.isAxiosError(err) && err.response?.status !== 401 && import.meta.env.VITE_NODE_ENV === "development") {
         console.error(err);
       }

       setChecking(false);
     }
   };

   checkIfLoggedIn();
 }, [navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Function to handle form submission for normal users
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await registerUser(input);
      if (response.status === 201) {
        toast.success("Registration successful!");

        dispatch(
          setUser({
            username: input.username,
            fullname: input.fullname,
            role: "user",
            token: response.data.token,
          })
        );

        navigate(`/profile/${input.username}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  // Type for the decoded JWT token payload
  type GuestTokenPayload = {
    username: string;
    id: string;
    role: "guest";
  };

  // Function to handle guest sign-in
  const handleGuestSignin = async () => {
    try {
      const response = await guestSignIn();

      if (response.status === 201) {
        const token = response.data.token;
        const decoded = jwtDecode<GuestTokenPayload>(token);

        dispatch(
          setUser({
            username: decoded.username,
            fullname: "Guest User",
            role: decoded.role,
            token,
          })
        );

        toast.success("Guest sign-in successful!");
        navigate(`/profile/${decoded.username}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Guest sign-in failed. Please try again.");
      } else {
        toast.error("Guest sign-in failed. Please try again.");
      }
    }
  };

  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50">
      <header className="bg-blue-600 text-white w-full py-4 text-center text-3xl font-bold shadow">CoinKeeper</header>

      <div className="flex flex-col items-center flex-grow w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-md mt-16 p-6 bg-white rounded-md shadow-md space-y-5">
          <h2 className="text-center text-2xl font-semibold">Register</h2>

          <Input type="text" placeholder="Username" name="username" value={input.username} onChange={handleChange} required />
          <Input type="text" placeholder="Full Name" name="fullname" value={input.fullname} onChange={handleChange} required />
          <Input type="password" placeholder="Password" name="password" value={input.password} onChange={handleChange} required />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-800 cursor-pointer">
            Register Now
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 hover:underline cursor-pointer">
              Login here
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <Button onClick={handleGuestSignin} type="button" className="bg-green-700 hover:bg-green-900 text-white cursor-pointer">
            Guest Signin
          </Button>
        </div>
      </div>

      <footer className="mt-10 text-center text-sm text-white bg-blue-600 w-full py-4">
        <p>© 2025 CoinKeeper. All rights reserved.</p>
      </footer>
    </div>
  );
};
