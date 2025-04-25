import { toast } from "react-toastify";
import Offer from "../Components/Offer";
import supabase from "./supabase";

async function checkOfferRequestAvailability({ userId, OfferId }) {
  const { data: offerRequest, error } = await supabase
    .from("offerRequests")
    .select("*")
    .eq("userId", userId)
    .eq("OfferId", OfferId)
    .single();
  if (error) {
    console.log("offer is available ");
    return "available";
  }
  return "unavailable";
}

async function requestOfferApplication({ userId, offerId }) {
  const { error: offerApplicationError } = await supabase
    .from("offerRequests")
    .insert([{ OfferId: offerId, userId: userId, status: "pending" }]);

  if (offerApplicationError) throw new Error(offerApplicationError.message);
  else {
    toast.success("Application sent successfully");
  }
}

export async function getRequests(userId) {
  const { data: requests, error: requetsError } = await supabase
    .from("offerRequests")
    .select("*")
    .eq("userId", userId);
  if (requetsError) throw new Error(requetsError.message);
  return requests;
}

export { checkOfferRequestAvailability, requestOfferApplication };
