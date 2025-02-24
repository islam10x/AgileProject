import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
<<<<<<< HEAD
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-center" // Toast position at the top center
      hideProgressBar={true} // Hide the progress bar at the bottom
      autoClose={5000} // Toast auto-close time
      closeOnClick={true} // Close toast when clicked
      pauseOnHover={true} // Pause toast when hovering
      draggable={true} // Allow dragging of toast
    />
=======
import { Route, Routes, BrowserRouter } from "react-router";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
>>>>>>> f60a740 (first commit)
  </StrictMode>
);
