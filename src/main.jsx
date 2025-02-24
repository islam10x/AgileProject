import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
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
  </StrictMode>
);
