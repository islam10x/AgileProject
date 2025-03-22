import styled from "styled-components";
import { palette } from "../Styles/colors";
import { useNavigate } from "react-router";

const CustomDiv = styled.div`
  background-color: ${palette.mainBlue};
  border-radius: 5px;
  margin: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 20%;
  transition: all 0.2s linear;
  &:hover {
    background-color: ${palette.lightBlue};
    cursor: pointer;
  }
`;
const OfferTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const OfferInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* border: 1px solid red; */
  width: 50%;
`;
function Offer({ offer }) {
  // eslint-disable-next-line no-unused-vars
  const { title, description, company_name, location, salary, currency, type } =
    { ...offer };
  const navigate = useNavigate();
  return (
    <CustomDiv
      onClick={() => {
        navigate("/login");
      }}
    >
      <OfferTitle>
        <h2>{title}</h2>
      </OfferTitle>
      <OfferInfo>
        <p>{company_name}</p>
        <p>{location}</p>
        <p>{salary + " " + currency}</p>
      </OfferInfo>
    </CustomDiv>
  );
}

export default Offer;
