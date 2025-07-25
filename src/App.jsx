import Signup from "./Signup";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayOut from "./Pages/AppLayOut";
import Login from "./Login";
import Dashboard from "./Pages/Dashboard";
import PageNotFound from "./Pages/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import HomePage from "./Pages/HomePage";
import { useQuery } from "@tanstack/react-query";
import supabase from "./services/supabase";
import "./styles/modern.css";
import HomeProvider from "./Context/LoginContext";
import JobApplicationForm from "./Pages/JobApplicationForm";

function App() {
  return (
    <HomeProvider>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayOut />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="home" />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="home" index element={<HomePage />} />
            <Route path="Form" index element={<JobApplicationForm />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HomeProvider>
  );
}

export default App;
