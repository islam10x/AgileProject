import React, { useState } from "react";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

// Styled components for input and icon
const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid red;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const EyeIcon = styled.div`
  width: 19%;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

function PasswordInput() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <PasswordWrapper>
      <Input
        type={passwordVisible ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <EyeIcon onClick={togglePasswordVisibility}>
        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
      </EyeIcon>
    </PasswordWrapper>
  );
}

export default PasswordInput;
