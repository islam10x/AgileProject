import supabase from "./supabase";

export async function getOffers() {
  let { data: offers, error } = await supabase.from("offers").select("*");
  if (error) throw new Error(error.message);
  return offers;
}
