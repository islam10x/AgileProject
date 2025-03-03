import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://khqyjobamsjvowjhqqbz.supabase.co", // replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocXlqb2JhbXNqdm93amhxcWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTcxMjUsImV4cCI6MjA1NjIzMzEyNX0.kEokOSTD_libgsMaHqRX8DCx9Lha7PH31iH2JzVFYnM" // replace with your Supabase anon key
);

export default supabase;
