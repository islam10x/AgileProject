import { CiHome } from "react-icons/ci";
import styled from "styled-components";
import { palette } from "../Styles/colors";

const HeaderDiv = styled.div`
  background-color: ${palette.cyan};
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Header() {
  return (
    <HeaderDiv>
      <CiHome size={30} />
    </HeaderDiv>
  );
}

export default Header;
