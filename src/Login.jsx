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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, login } from "./services/authProvider";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending: loading } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },

    onError: (err) => {
      toast(`❌ error ${err}`);
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  function handleLogin() {
    mutate({ email, password });
  }
  return (
    <div className="login-container">
      <div className="login-header">
        <h2>
          Login to <span className="app-name">CraftEd</span>
        </h2>
      </div>

      <div className="login-form">
        <div className="input-group">
          <label>email</label>
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-field ${error ? "error-border" : ""}`}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              autoComplete="off"
              type={isPasswordVisible ? "text" : "password"}
              // type={isPasswordVisible ? "text" : "password"}
              // type="password"
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
