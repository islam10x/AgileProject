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

const CustomDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh; /* Ensures full-page height */
  width: 100%;
`;

const Header = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #6c6b6b;
`;

const OffersContainer = styled.div`
  width: 100%; /* Ensures full width */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

function HomePage() {
  return (
    <CustomDiv>
      <Header>
        <h3>Application Title</h3>
        <Button
          onClick={() => {
            alert("navigate to dashboard w saybou yokl ba3dhou ");
          }}
        >
          Log in
        </Button>
      </Header>
      <OffersContainer>
        <Offers />
      </OffersContainer>
    </CustomDiv>
  );
}

export default HomePage;
