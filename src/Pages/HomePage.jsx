// import styled from "styled-components";
// import Offers from "../Components/Offers";
// import Button from "../CustomTags/Button";

// const CustomDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;
// `;
// const Header = styled.div`
//   padding-left: 20px;
//   padding-right: 20px;
//   width: 100%;
//   height: 10%;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
//   background-color: #6c6b6b;
// `;

// function HomePage() {
//   return (
//     <CustomDiv>
//       <Header>
//         <h3>Application Title</h3>
//         <Button
//           onClick={() => {
//             alert("navigate to dashboard w saybou yokl ba3dhou  ");
//           }}
//         >
//           Log in
//         </Button>
//       </Header>
//       <Offers />
//     </CustomDiv>
//   );
// }

// export default HomePage;

import styled from "styled-components";
import Offers from "../Components/Offers";
import Button from "../CustomTags/Button";
import { useNavigate } from "react-router";
import { palette } from "../Styles/colors";

const CustomDiv = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh; /* Ensures full-page height */
  width: 100%;
`;

const Header = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #4f4f4f;
  & h2 {
    cursor: pointer;
    margin-left: 1%;
    color: ${palette.white};
  }
  & > Button {
    margin-right: 1%;
  }
`;

const OffersContainer = styled.div`
  background-color: ${palette.mainWhite};
  min-height: 100vh;
  width: 100%; /* Ensures full width */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* padding: 20px 0; */
`;
const LandingPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  & h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${palette.black};
  }

  & p {
    font-size: 1.5rem;
    color: ${palette.black};
  }
`;
function HomePage() {
  const navigate = useNavigate();
  return (
    <CustomDiv>
      <Header>
        <h2
          onClick={() => {
            navigate("/home");
          }}
        >
          App 9lewi
        </h2>
        <Button
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in
        </Button>
      </Header>
      <LandingPage>
        <h1>Welcome to the 9lewi App</h1>
        <p>Explore our offers and find the perfect job for you!</p>
      </LandingPage>
      <OffersContainer>
        <h2>Our Offers: </h2>
        <Offers />
      </OffersContainer>
    </CustomDiv>
  );
}

export default HomePage;
