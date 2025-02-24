/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Login.css"; // Import CSS for styling
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { palette } from "./Styles/colors";
const Button = styled.button`
  margin: 5px;
  text-align: center;
  border-radius: 3px;
  background-color: ${palette.mainBlue};
`;
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (username !== "admin" || password !== "password") {
        setError("Invalid username or password");
        setLoading(false);
      } else {
        alert("Login successful!");
        setError(null);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/logo.png" alt="App Logo" className="login-logo" />
        <h2>
          Login to <span className="app-name">CraftEd</span>
        </h2>
      </div>

      <div className="login-form">
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`input-field ${error ? "error-border" : ""}`}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <button onClick={togglePasswordVisibility} className="icon-btn">
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <button
          className={`login-btn ${loading ? "disabled" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div className="error-message">
            <FaExclamationCircle color="red" /> <span>{error}</span>
          </div>
        )}
        <br />
        <Link to={"/signup"}>
          <button className={`login-btn`}>Create an account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
