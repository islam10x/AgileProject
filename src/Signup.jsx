import React, { useState } from "react";
import "./Login.css"; // Import CSS for styling
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      if (
        password !== confirmpassword ||
        password === "" ||
        confirmpassword === ""
      ) {
        setError("Passwords do not match");
        setLoading(false);
      } else {
        alert("Signup successful!");
        setError(null);
        setLoading(false);
      }
    }, 1500);
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
          <div className="password-wrapper">
            <input
              type={!isPasswordVisible ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <button
              onClick={togglePasswordVisibility}
              className="icon-btn"
            ></button>
          </div>
          <div className="password-wrapper">
            <input
              type={!isPasswordVisible ? "text" : "password"}
              placeholder="********"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              className={`input-field ${error ? "error-border" : ""}`}
            />
            <button onClick={togglePasswordVisibility} className="icon-btn">
              {!isPasswordVisible ? (
                <FaEye className="eye-icon" />
              ) : (
                <FaEyeSlash className="eye-icon" />
              )}
            </button>
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
        <Link to={"/login"}>
          <button className={`login-btn `} disabled={loading}>
            Have an account? sign in
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
