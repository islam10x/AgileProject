import React from "react";
import Signup from "./Signup";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayOut from "./Pages/AppLayOut";
import Login from "./Login";
import HRMDashboard from "./Components/Dashboard";



function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<HRMDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
