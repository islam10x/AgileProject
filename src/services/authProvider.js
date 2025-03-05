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
  console.log(profile);
  if (user === null) return null;
  return profile;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
