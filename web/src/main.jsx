import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={Router} />
      <Toaster position="top-center" />
    </AuthProvider>
  </StrictMode>,
);
