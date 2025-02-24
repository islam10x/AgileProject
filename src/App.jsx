import React from "react";
import Signup from "./Signup";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayOut from "./Pages/AppLayOut";
import Login from "./Login";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" index element={<Login />} />
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
