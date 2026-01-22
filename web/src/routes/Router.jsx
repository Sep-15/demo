import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const Home = lazy(() => import("../pages/HomePage.jsx"));
const Login = lazy(() => import("../pages/LoginPage.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Profile = lazy(() => import("../pages/ProfilePage.jsx"));
const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,

        children: [
          { index: true, element: <Home /> },
          { path: "profile/:userId", element: <Profile /> },
        ],
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
    ],
  },
]);
export default Router;
