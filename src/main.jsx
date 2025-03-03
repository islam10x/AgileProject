import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer
        position="top-center" // Toast position at the top center
        hideProgressBar={true} // Hide the progress bar at the bottom
        autoClose={5000} // Toast auto-close time
        closeOnClick={true} // Close toast when clicked
        pauseOnHover={true} // Pause toast when hovering
        draggable={true} // Allow dragging of toast
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter> */}
  </StrictMode>
);
