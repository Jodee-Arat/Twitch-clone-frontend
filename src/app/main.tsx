import { StrictMode } from "react";
import "/src/styles/global.css";
import { createRoot } from "react-dom/client";
import { router } from "./router.tsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
