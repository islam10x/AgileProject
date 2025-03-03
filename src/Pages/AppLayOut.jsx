import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";
const Div = styled.div`
  height: 100vh;
  width: 100%;
`;
// const CustomOutlet = styled(Outlet)``;
function AppLayOut() {
  return (
    <Div>
      <Outlet />
    </Div>
  );
}

export default AppLayOut;
