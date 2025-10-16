import { supabase } from "@/lib/supabaseClient";

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInWithGoogle(redirectTo?: string): Promise<void> {
  // Use the current origin (works for both localhost and production)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUrl = redirectTo || `${origin}/chat`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

