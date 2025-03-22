import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getOffers } from "../services/infoProvider";
import Spinner from "./Spinner";
import Offer from "./Offer";
const OffersDiv = styled.div`
  display: flex;
  flex-wrap: wrap; /* Ensures proper wrapping */
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
`;

function Offers() {
  const { data: offers, isPending } = useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  // const offersArray = [...offers, ...offers, ...offers];
  return (
    <OffersDiv>
      {isPending ? (
        <Spinner />
      ) : (
        offers.map((offer, index) => {
          return <Offer offer={offer} key={index} />;
        })
      )}
    </OffersDiv>
  );
}

export default Offers;
