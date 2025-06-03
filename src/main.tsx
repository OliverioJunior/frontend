import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import "./styles/global.css";
import { StudentsProvider } from "./context/StudentsProvider";
import { TeacherProvider } from "./context/TeacherProvider";
import { SchedulingProvider } from "./context/SchedulingProvider";
import { ToastProvider } from "./context/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <SchedulingProvider>
        <TeacherProvider>
          <StudentsProvider>
            <RouterProvider router={router} />
          </StudentsProvider>
        </TeacherProvider>
      </SchedulingProvider>
    </ToastProvider>
  </StrictMode>
);
