import supabase from "./supabase";

export async function getOffers() {
  let { data: offers, error } = await supabase.from("offers").select("*");
  if (error) throw new Error(error.message);
  return offers;
}

export async function getOffer(id) {
  let { data: offer, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return offer;
}
