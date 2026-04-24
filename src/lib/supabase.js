import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ditgpeemiyzllycwyzem.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpdGdwZWVtaXl6bGx5Y3d5emVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDA5MjMsImV4cCI6MjA5MjYxNjkyM30.L7JCGTlCU6HpQPjyZJnsm1nNauk76cmv7iTF2jxDd-I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);