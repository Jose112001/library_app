import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qxhbsqqpwmowzjfgoqfv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aGJzcXFwd21vd3pqZmdvcWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjMyNTYsImV4cCI6MjA2NjQzOTI1Nn0.tgl40DHGa-YYpt1lowNX7lzCwtdT7BslEWHN8ClwxEM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);