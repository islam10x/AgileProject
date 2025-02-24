import { CiHome } from "react-icons/ci";
import styled from "styled-components";

const HeaderDiv = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Header() {
  return (
    <HeaderDiv>
      <CiHome />
    </HeaderDiv>
  );
}

export default Header;
