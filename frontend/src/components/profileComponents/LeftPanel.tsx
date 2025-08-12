import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { getProfile, deleteAccount } from "@/services/profileService";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/authSlice";
import { clearProfile, setProfileData } from "@/store/profileSlice";
import { ShowModal } from "./ShowModal";
import axios from "axios";
import { logoutUser } from "@/services/authService";

export const LeftPanel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  const auth = useAppSelector((state) => state.auth.user);
  const expenses = useAppSelector((state) => state.profile.expenses);

  const fetchProfile = useCallback(async () => {
    if (!auth?.username) return;

    try {
      const response = await getProfile(auth.username);
      dispatch(setProfileData(response.data));
    } catch (error) {
      console.error("Error fetching profile:", error);

      if (axios.isAxiosError(error)) {
        if ((error.response?.status === 404 || error.response?.status === 401) && auth?.role === "guest") {
          toast.info("Your guest session has expired. Please register to continue.");
          dispatch(clearUser());
          dispatch(clearProfile());
          navigate("/register");
        } else {
          toast.error("Failed to load profile");
        }
      } else {
        toast.error("Failed to load profile");
      }
    }
  }, [auth?.username, auth?.role, dispatch, navigate]);


  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  useEffect(() => {
    setTotal(totalAmount);
  }, [totalAmount]);

  const displayName = auth?.role === "guest" ? "User" : auth?.fullname?.split(" ")[0] || "User";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      dispatch(clearUser());
      dispatch(clearProfile());
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(password);
      toast.success("Account deleted successfully");
      dispatch(clearUser());
      dispatch(clearProfile());
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete account");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setPassword("");
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="bg-blue-600 text-white w-full md:w-1/3 p-6 flex flex-col gap-5 items-center justify-between">
        <h2 className="text-2xl font-bold">Hello {displayName}</h2>
        <h3 className="text-2xl border border-white px-3 py-1 mt-3 rounded">
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div className="bg-white text-green-700 text-2xl font-bold rounded-full w-32 h-32 mt-6 flex items-center justify-center shadow-lg p-5">{total}</div>

        <Button onClick={handleLogout} className="bg-transparent border cursor-pointer text-xl">
          Log Out
        </Button>

        <Button onClick={() => setShowModal(true)} className="bg-transparent border cursor-pointer text-xl">
          Delete Account
        </Button>

        <div className="hidden md:block mt-10 text-center text-2xl leading-relaxed">
          <p style={{ fontFamily: "cursive" }}>
            Keep <br /> Track <br /> of your <br /> Finances
          </p>
        </div>
      </div>

      {showModal && <ShowModal role={auth?.role} password={password} setPassword={setPassword} onCancel={() => setShowModal(false)} onConfirm={handleConfirmDelete} />}
    </>
  );
};
