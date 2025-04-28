import styled from "styled-components";
import { palette } from "../Styles/colors";
import { useNavigate } from "react-router";
import { FaBuilding } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { useContext } from "react";
import { Homecontext } from "../Context/LoginContext";

const CustomDiv = styled.div`
  padding: 5px 20px;
  /*background-color: ${palette.mainBlue};*/
  border-radius: 15px;
  margin: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 20%;
  transition: all 0.2s linear;
  color: black;
  box-shadow: 0 0 45px rgba(0, 0, 0, 0.09);
  border: 1px solid ${palette.mainBlue};
  &:hover {
    /*background-color: ${palette.lightBlue};*/
    cursor: pointer;
    border: 1px solid ${palette.lightBlue};
    box-shadow: none;
  }
`;
const OfferTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const OfferInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  text-align: center;

  div:first-child {
    display: grid;
    gap: 15px;
    align-items: flex-start;
  }

  & .icon {
    margin-right: 5px;
    color: ${palette.mainBlue};
  }
  div:last-child {
    margin-top: 5px; /* Space between rows */
  }
`;
function Offer({ offer }) {
  // eslint-disable-next-line no-unused-vars
  const { title, description, company_name, location, salary, currency, type } =
    { ...offer };
  const { setHomePass } = useContext(Homecontext);
  const navigate = useNavigate();
  return (
    <CustomDiv
      onClick={() => {
        setHomePass(true);
        navigate("/Form");
      }}
    >
      <OfferTitle>
        <h2>{title}</h2>
      </OfferTitle>
      <OfferInfo>
        <div>
          <p>
            <span class="icon">
              <FaBuilding />
            </span>
            {company_name}
          </p>
          <p>
            <span class="icon">
              <MdLocationOn />
            </span>
            {location}
          </p>
          <p>
            <span class="icon">
              <FaMoneyBill />
            </span>
            {salary + " " + currency}
          </p>
        </div>

        <div>
          <p>{description}</p>
        </div>
        <div>
          <p>{type}</p>
        </div>
      </OfferInfo>
    </CustomDiv>
  );
}

export default Offer;
