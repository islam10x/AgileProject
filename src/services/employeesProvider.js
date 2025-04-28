import supabase from "./supabase";

export async function getEmployees() {
  let { data: employees, error } = await supabase
    .from("Users")
    .select("*")
    .neq("role", "candidate");
  if (error) throw new Error(error.message);
  //   console.log(employees);
  const returnData = [];
  for (let e of employees) {
    let { data: fileData, error: statError } = await supabase.storage
      .from("avatars")
      .list("", { search: `${e.id}` });
    console.log(fileData);
    if (statError || fileData.length === 0) {
      returnData.push({ ...e, image: null });
    } else {
      const { data: imageData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(`${e.id}.png`);
      const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
      returnData.push({ ...e, image: imageUrl });
    }
  }
  console.log(returnData);
  return returnData;
}
