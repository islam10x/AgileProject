import React, { useState } from "react";
import "./Login.css"; // Import CSS for styling
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import H4 from "./CustomTags/H4";
import styled from "styled-components";
import { validateEmail } from "./Helper/helpers";
const LoginLink = styled(Link)`
  text-decoration: underline;
`;
const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [email, setEmail] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignup = () => {
    setError("");
    if (email === "" || !username || !password || !confirmpassword) {
      setError("please fill all the fields");
    } else if (validateEmail(email) === false) {
      setError("invalid email");
    } else if (password !== confirmpassword) {
      setError("Passwords do not match");
      setLoading(false);
    } else {
      setError(null);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>
          Login to <span className="app-name">My App</span>
        </h2>
      </div>

      <div className="login-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`input-field ${error ? "error-border" : ""}`}
          />
          <input
            type={"email"}
            required
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-field ${error ? "error-border" : ""}`}
          />
          <div className="password-wrapper">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <div onClick={togglePasswordVisibility} className="icon-btn">
              {!isPasswordVisible ? (
                <FaEye className="eye-icon" />
              ) : (
                <FaEyeSlash className="eye-icon" />
              )}
            </div>
          </div>
          <div className="password-wrapper">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="confirm password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <div onClick={togglePasswordVisibility} className="icon-btn">
              {!isPasswordVisible ? (
                <FaEye className="eye-icon" />
              ) : (
                <FaEyeSlash className="eye-icon" />
              )}
            </div>
          </div>
        </div>

        <button
          className={`login-btn ${loading ? "disabled" : ""}`}
          onClick={handleSignup}
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
        <H4>
          Don't have an account click here{" "}
          <LoginLink to={"/login"}>Login</LoginLink>
        </H4>
      </div>
    </div>
  );
};

export default Signup;
