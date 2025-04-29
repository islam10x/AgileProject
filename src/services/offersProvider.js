import supabase from "./supabase";

export const fetchJobOpenings = async () => {
  const { data, error } = await supabase.from("offers").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const postNewJob = async (jobData) => {
  const { data, error } = await supabase.from("offers").insert(jobData).select();
  if (error) throw new Error(error.message);
  return data;
};

export const fetchRecentCandidates = async () => {
  let { data: employees, error } = await supabase
    .from("Users")
    .select("*")
    .limit(3)
    .eq("role", "candidate")
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  
  const candidatesWithAvatars = await Promise.all(
    employees.map(async (e) => {
      let { data: fileData } = await supabase.storage
        .from("avatars")
        .list("", { search: `${e.id}` });
      
      if (fileData.length === 0) {
        return { ...e, image: null };
      } else {
        const { data: imageData } = await supabase.storage
          .from("avatars")
          .getPublicUrl(`${e.id}.png`);
        const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
        return { ...e, image: imageUrl };
      }
    })
  );
  
  return candidatesWithAvatars;
};