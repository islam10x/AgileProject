import React from "react";
import Signup from "./Signup";
import "./App.css";
<<<<<<< HEAD
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
=======
import { Link } from "react-router";
function App() {
  return (
    <div className="container">
      <Link to={"signup"}>go to SIgn up page</Link>
      <Link to={"login"}>go to login page</Link>
>>>>>>> f60a740 (first commit)
    </div>
  );
}

export default App;
