import { supabase } from "./supabase";
import { generateSessionId } from './uuid';

const LOCATION_CACHE_KEY = "wordspack_user_location";
const LOCAL_STATS_KEY = "wordspack_local_stats";

export const trackEvent = async (toolName: string) => {
  try {
    // 1. Get user location with caching to avoid rate limits
    let country = "Unknown";
    const cached = sessionStorage.getItem(LOCATION_CACHE_KEY);
    
    if (cached) {
      country = cached;
    } else {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          country = data.country_name || "Unknown";
          sessionStorage.setItem(LOCATION_CACHE_KEY, country);
        }
      } catch (e) {
        console.warn("Location tracking service unavailable.");
      }
    }

    const sessionId = generateSessionId();
    const event = {
      tool_name: toolName,
      country: country,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
    };

    // 2. Insert event into Supabase
    if (!supabase) {
      console.info("Supabase not configured. Using local storage for:", toolName);
      const localStats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || "[]");
      localStats.push(event);
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(localStats));
      return;
    }

    const { error } = await supabase.from("usage_stats").insert([event]);

    if (error) {
      console.warn("Supabase tracking error (check if table exists):", error.message);
      // Fallback to local storage if Supabase fails (e.g. table missing)
      const localStats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || "[]");
      localStats.push(event);
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(localStats));
    }
  } catch (error) {
    console.error("Tracking error:", error);
  }
};

export const getStats = async () => {
  try {
    const localStats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || "[]");

    if (!supabase) {
      return localStats;
    }

    const { data, error } = await supabase
      .from("usage_stats")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.warn("Could not fetch from Supabase, using local stats.");
      return localStats;
    }
    
    // Merge local and remote stats for a complete view in dev
    return [...(data || []), ...localStats].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || "[]");
  }
};

export const clearLocalStats = () => {
  localStorage.removeItem(LOCAL_STATS_KEY);
};

export const isSupabaseConfigured = () => !!supabase;

