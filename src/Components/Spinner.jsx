// import styled, { keyframes } from "styled-components";

// const rotate = keyframes`
//   to {
//     transform: rotate(1turn)
//   }
// `;

// const Spinner = styled.div`
//   color: #000;
//   margin: 4.8rem auto;

//   width: 6.4rem;
//   aspect-ratio: 1;
//   border-radius: 50%;
//   background: radial-gradient(farthest-side, var(--color-brand-600) 94%, #0000)
//       top/10px 10px no-repeat,
//     conic-gradient(#0000 30%, var(--color-brand-600));
//   -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
//   animation: ${rotate} 1.5s infinite linear;
// `;

// export default Spinner;

import styled, { keyframes } from "styled-components";
import { palette } from "../Styles/colors";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SpinnerCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid ${palette.mainBlue};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerCircle />
    </SpinnerContainer>
  );
};

export default Spinner;
