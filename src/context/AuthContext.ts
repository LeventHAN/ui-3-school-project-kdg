import { SupabaseClient, createClient, Session } from "@supabase/supabase-js";
import React from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface IAuthSessionContext {
  supabase: SupabaseClient;
  session: Session | null;
}

const AuthContext = React.createContext<IAuthSessionContext>({
  supabase,
  session: null,
});

export { supabase, AuthContext };
