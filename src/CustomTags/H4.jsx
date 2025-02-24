import styled from "styled-components";

const StyledH4 = styled.h4`
  color: black;
  text-align: center;
`;
function H4({ children }) {
  return <StyledH4>{children}</StyledH4>;
}

export default H4;
