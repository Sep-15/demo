// File: src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";
import { FollowProvider } from "./contexts/FollowContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FollowProvider>
        <RouterProvider router={Router} />
        <Toaster position="top-center" />
      </FollowProvider>
    </AuthProvider>
  </StrictMode>,
);
