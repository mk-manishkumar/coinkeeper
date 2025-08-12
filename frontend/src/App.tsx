import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import { Profile } from "./pages/Profile";
import { ErrorPage } from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import './App.css'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile/:username",
    element: <Profile />,
  },
  {
    path: "/500",
    element: <ErrorPage code={500} title="Something Went Wrong" message="An unexpected error has occurred. Please try again later." />,
  },
  {
    path: "*",
    element: <ErrorPage code={404} title="Page Not Found" message="The page you're looking for doesn't exist or has been moved." />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
};

export default App;
