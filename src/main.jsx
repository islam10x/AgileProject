import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App/>
    <ToastContainer
      position="top-center" // Toast position at the top center
      hideProgressBar={true} // Hide the progress bar at the bottom
      autoClose={5000} // Toast auto-close time
      closeOnClick={true} // Close toast when clicked
      pauseOnHover={true} // Pause toast when hovering
      draggable={true} // Allow dragging of toast
    />
    {/*<BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="Dashboard" element={<HRMDashboard />} />
      </Routes>
    </BrowserRouter>;*/}
  </StrictMode>
);
