import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  tc_kimlik: string;
  ad_soyad: string;
  unvan: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authTimeoutId: number | null = null;

    console.log('[Auth] Initializing auth state listener and session check');

    try {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          console.log('[Auth] Auth state changed:', event, session?.user?.email);

          // Cancel watchdog
          if (authTimeoutId) {
            clearTimeout(authTimeoutId);
            authTimeoutId = null;
          }

          setSession(session);
          setUser(session?.user ?? null);

          // Profile fetch
          if (session?.user) {
            try {
              await fetchProfile(session.user.id);
            } catch (e) {
              console.error('[Auth] Error fetching profile after auth change:', e);
            }
          } else {
            setProfile(null);
          }

          setLoading(false);
        }
      );

      // THEN check for existing session
      supabase.auth.getSession().then(async ({ data: { session }, error }) => {
        if (!mounted) return;

        // Cancel watchdog
        if (authTimeoutId) {
          clearTimeout(authTimeoutId);
          authTimeoutId = null;
        }

        if (error) {
          console.error('[Auth] Session error:', error);
          setLoading(false);
          return;
        }

        console.log('[Auth] Initial session check:', session?.user?.email);

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            await fetchProfile(session.user.id);
          } catch (e) {
            console.error('[Auth] Error fetching profile during initial session:', e);
          }
        }

        setLoading(false);
      }).catch((e) => {
        console.error('[Auth] getSession failed:', e);
        if (mounted) setLoading(false);
      });

      // Watchdog timeout: if auth initialization doesn't finish, stop loading so UI can show login
      authTimeoutId = window.setTimeout(() => {
        console.warn('[Auth] Auth initialization timed out — showing login fallback');
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }, 8000);

      return () => {
        mounted = false;
        try {
          subscription.unsubscribe();
        } catch (e) {
          console.warn('[Auth] Error unsubscribing:', e);
        }
        if (authTimeoutId) {
          clearTimeout(authTimeoutId);
          authTimeoutId = null;
        }
      };
    } catch (err) {
      console.error('[Auth] Unexpected error during auth setup:', err);
      if (mounted) setLoading(false);
      return () => {
        mounted = false;
      };
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
