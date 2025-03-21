import styled from "styled-components";
import { colors, palette } from "../Styles/colors";

function Button({ onClick, children }) {
  const CButton = styled.button`
    padding: 10px;
    border-radius: 5px;
    background-color: ${palette.mainBlue};
    &:hover {
      filter: brightness(0.8);
    }
  `;
  return <CButton onClick={onClick}>{children}</CButton>;
}

export default Button;
