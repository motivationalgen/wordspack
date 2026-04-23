import { createClient } from "@supabase/supabase-js";

// Use environment variables for security. 
// These will need to be added to your deployment platform (e.g. Vercel, Netlify) 
// or a .env file locally.
console.log("Vite Env Check:", import.meta.env);

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Final check: Is the key a valid JWT format?
const isValidKey = supabaseAnonKey.startsWith("eyJ");

export const supabase = (supabaseUrl && isValidKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("Supabase is not configured. Real-time tracking is disabled.");
} else {
  console.info("Supabase initialized.");
}
