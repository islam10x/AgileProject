import React, { useState } from "react";
import "./Login.css"; // Import CSS for styling
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import H4 from "./CustomTags/H4";
import styled from "styled-components";
import { validateEmail } from "./Helper/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, signup } from "./services/authProvider";
import { toast } from "react-toastify";
const LoginLink = styled(Link)`
  text-decoration: underline;
`;
const Signup = () => {
  const [name, setName] = useState("");
  const [last_name, setlast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { mutate, isPending: loading } = useMutation({
    mutationFn: signup,
    mutationKey: ["user"],
    onSuccess: async () => {
      toast("check your email inbox to verify your account");
    },
  });
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignup = () => {
    setError("");
    if (!email || !name || !last_name || !password || !confirmpassword) {
      setError("please fill all the fields");
      return;
    } else if (validateEmail(email) === false) {
      setError("invalid email");
      return;
    } else if (password !== confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    mutate({ email, password, name, last_name });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>
          Sign up to <span className="app-name">My App</span>
        </h2>
      </div>

      <div className="login-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input-field ${error ? "error-border" : ""}`}
          />
          <input
            type="text"
            placeholder="Enter your last name"
            value={last_name}
            onChange={(e) => setlast_name(e.target.value)}
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
          {loading ? "Signing up..." : "Sign up"}
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
