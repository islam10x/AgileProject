/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Login.css"; // Import CSS for styling
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { palette } from "./Styles/colors";
import H4 from "./CustomTags/H4";
import { toast } from "react-toastify";
import Spinner from "./Components/Spinner";
import PasswordInput from "./CustomTags/PasswordField";
const Button = styled.button`
  margin: 5px;
  text-align: center;
  border-radius: 3px;
  background-color: ${palette.mainBlue};
`;

const LoginLink = styled(Link)`
  text-decoration: underline;
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
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Data Fetched Successfully");
      }, 1500);
    });
    toast.promise(
      mockPromise,
      {
        pending: "Sending to database",
        success: "successfullly logged in",
        error: "error",
      },
      {
        position: "top-center",
        autoClose: "3000",
      }
    );

    setLoading(true);
    setTimeout(() => {
      if (username !== "admin" || password !== "password") {
        setError("Invalid username or password");
        setLoading(false);
      } else {
        setError(null);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>
          Login to <span className="app-name">CraftEd</span>
        </h2>
      </div>

      <div className="login-form">
        <div className="input-group">
          <label>Username</label>
          <input
            autoComplete="off"
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
              autoComplete="off"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <div onClick={togglePasswordVisibility} className="icon-btn">
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
        </div>

        <button
          className={`login-btn ${loading ? "disabled" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "logging in" : "Login"}
        </button>

        {error && (
          <div className="error-message">
            <FaExclamationCircle color="red" /> <span>{error}</span>
          </div>
        )}
        <br />
        <H4>
          Don't have an account click here{" "}
          <LoginLink to={"/signup"}>Sign up</LoginLink>
        </H4>
      </div>
    </div>
  );
};

export default Login;
