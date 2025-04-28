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
import { palette, colors } from "../Styles/colors";
import { useContext } from "react";
import { Homecontext } from "../Context/LoginContext";
//import { backgroundImg } from "../assets/images/budev.jpg";

const CustomDiv = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  background: url("budev.jpg"), ${colors.backGroundColor.mainWhite};
  background-size: cover;
  background-position: center;
  position: relative;

  /* Dark overlay layer */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.53);
    z-index: 0;
  }

  /* Pulse animation layer */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 50%,
      ${palette.purple} 0%,
      transparent 50%
    );
    opacity: 0.1;
    animation: pulse 8s infinite;
    z-index: 1;
    pointer-events: none;
  }

  /* Content must be above both layers */
  > * {
    position: relative;
    z-index: 2;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0.1;
    }
  }
`;

const Header = styled.div`
  padding: 1rem 2rem;
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${colors.backGroundColor.mainWhite};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${palette.lightGray};
  position: relative;
  z-index: 1;

  color: white;
  & h1 {
    cursor: pointer;
    margin-left: 1%;
    color: ${palette.black};
    font-weight: 600;
    letter-spacing: 1px;
    transition: all 0.3s ease;

    &:hover {
      color: ${palette.purple};
      transform: translateY(-2px);
    }
  }

  & h2 {
    cursor: pointer;
    margin-left: 1%;
    color: ${palette.black};
    font-weight: 600;
    letter-spacing: 1px;
    transition: all 0.3s ease;

    &:hover {
      color: ${palette.purple};
      transform: translateY(-2px);
    }
  }

  & > Button {
    margin-right: 1%;
    background: ${colors.button.buttonBackGroundColor.primary};
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    color: ${palette.white};
    font-weight: 600;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        ${palette.white},
        transparent
      );
      transition: 0.5s;
    }

    &:hover::before {
      left: 100%;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px ${palette.purple}66;
    }
  }
`;

const OffersContainer = styled.div`
  background: #cbd4dd;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  z-index: 1;

  & h2 {
    color: ${palette.black};
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(
      135deg,
      ${palette.mainBlue},
      ${palette.lightBlue}
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: bold;
  }
`;

const LandingPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 2rem;

  & h1 {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: ${palette.black};
    background: linear-gradient(135deg, #e0e3ff, #ffffff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: bold;
    text-shadow: 0 0 15px ${palette.mainBlue}4d;
  }

  & p {
    font-size: 1.5rem;
    color: ${palette.white};
    max-width: 600px;
    line-height: 1.6;
    font-weight: 500;
  }
`;

function HomePage() {
  const { setHomePass } = useContext(Homecontext);
  const navigate = useNavigate();
  return (
    <CustomDiv>
      <Header>
        <h2
          onClick={() => {
            navigate("/home");
          }}
        >
          AAMMI
        </h2>
        <Button
          onClick={() => {
            navigate("/login");
            setHomePass(true);
          }}
        >
          Log in
        </Button>
      </Header>
      <LandingPage>
        <h1>Welcome to the AAMMI</h1>
        <p>Explore our offers and find the perfect job for you!</p>
      </LandingPage>
      <OffersContainer>
        <h2>Our Offers</h2>
        <Offers />
      </OffersContainer>
    </CustomDiv>
  );
}

export default HomePage;
