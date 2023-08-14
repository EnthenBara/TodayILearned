import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uznesebegtwxvjrdzwkh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bmVzZWJlZ3R3eHZqcmR6d2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE4NDM4OTMsImV4cCI6MjAwNzQxOTg5M30.bmHJ9iwwtzFeNQ2e-dApY_UoJr7gPb7Lh26UhGifXT8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
