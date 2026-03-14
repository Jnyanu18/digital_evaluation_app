import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminContext from "./context/AdminContext.jsx";
import TeacherContext from "./context/TeacherContext.jsx";
import StudentContext from "./context/StudentContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AdminContext>
        <TeacherContext>
          <StudentContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </StudentContext>
        </TeacherContext>
      </AdminContext>
    </ToastProvider>
  </StrictMode>
);
