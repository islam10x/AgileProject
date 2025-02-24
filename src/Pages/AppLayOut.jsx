import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import styled from "styled-components";
// import Header from "../Components/Header";
const LayOut = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  border: 1px solid red;
`;
function AppLayOut() {
  return (
    <LayOut>
      <Header />
      <Outlet />
    </LayOut>
  );
}

export default AppLayOut;
