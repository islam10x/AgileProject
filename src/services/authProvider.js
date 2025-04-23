// import { toast } from "react-toastify";
import { toast } from "react-toastify";
import supabase from "./supabase";

export async function signup({ email, password, name, last_name }) {
  const { data: newUser, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message === "user already registered") {
      toast.error("user already registered");
    } else {
      toast.error(error.message);
    }
  }

  const { data: user, error: userError } = await supabase
    .from("Users")
    .insert([
      {
        id: newUser.user.id,
        email: email,
        name: name,
        last_name: last_name,
        role: "candidate",
      },
    ])
    .select();

  return newUser.user; // Return user object directly
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(data);
  if (error) throw new Error(error.message);
  return data.user;
}

export async function fetchCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  console.log(user);
  const { data: profile } = await supabase
    .from("Users")
    .select()
    .eq("id", user.id)
    .single();
  // console.log(profile);
  if (user === null) return null;
  const { data: fileData, error: statError } = await supabase.storage
    .from("avatars")
    .list("", { search: `${profile.id}` });
  if (statError || fileData.length === 0) return profile;
  const { data: imageData } = await supabase.storage
    .from("avatars")
    .getPublicUrl(`${profile.id}.png`);
  const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
  return { ...profile, image: imageUrl };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getUserCountByRole(role) {
  const { count, error } = await supabase
    .from("Users")
    .select("*", { count: "exact", head: true })
    .eq("role", role);

  if (error) {
    toast.error(`Error retrieving user count: ${error.message}`);
    throw new Error(error.message);
  }

  return count;
}

export async function updateData({ userId, currentData, newData }) {
  console.log("currentData: ", currentData);
  console.log("newData: ", newData);
  // Upload image if provided
  if (newData.image) {
    const imageName = `${userId}.png`;
    const { error: imageUploadError } = await supabase.storage
      .from("avatars")
      .upload(imageName, newData.image, {
        upsert: true,
      });

    if (imageUploadError) {
      toast.error(`Error uploading image: ${imageUploadError.message}`);
      throw new Error(imageUploadError.message);
    }
  }

  // Update first name if changed
  if (currentData.first_name !== newData.first_name) {
    const { error: nameError } = await supabase
      .from("Users")
      .update({ name: newData.first_name })
      .eq("id", userId);

    if (nameError) {
      toast.error(`Error updating first name: ${nameError.message}`);
      throw new Error(nameError.message);
    }
  }

  // Update last name if changed
  if (currentData.last_name !== newData.last_name) {
    const { error: lastNameError } = await supabase
      .from("Users")
      .update({ last_name: newData.last_name })
      .eq("id", userId);

    if (lastNameError) {
      toast.error(`Error updating last name: ${lastNameError.message}`);
      throw new Error(lastNameError.message);
    }
  }

  // Update email if changed
  if (currentData.email !== newData.email) {
    if (!newData.password) {
      toast.error("Password is required to update your email");
      throw new Error("Password is required to update your email");
    }
    // Re-authenticate the user first
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: currentData.email,
      password: newData.password, // newData must contain current password
    });

    if (reauthError) {
      toast.error(`Reauthentication failed: ${reauthError.message}`);
      throw new Error(reauthError.message);
    }

    // Now perform the email update
    const { error: emailError } = await supabase.auth.updateUser({
      email: newData.email,
    });

    if (emailError) {
      toast.error(`Error updating email: ${emailError.message}`);
      throw new Error(emailError.message);
    } else {
      toast.success("Confirmation link sent to new email.");
    }
  }
}
