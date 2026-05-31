import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface ProfileMetadata {
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  blood_type?: string;
  allergies?: string;
  chronic_diseases?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileMetadata | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveProfileFromUser = (currentUser: User) => {
    const meta = currentUser.user_metadata || {};
    setProfile({
      first_name: meta.first_name || "",
      last_name: meta.last_name || "",
      full_name: meta.full_name || meta.first_name ? `${meta.first_name} ${meta.last_name}` : "Patient User",
      phone: meta.phone || "",
      blood_type: meta.blood_type || "",
      allergies: meta.allergies || "",
      chronic_diseases: meta.chronic_diseases || "",
    });
  };

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      setUser(currentUser);
      resolveProfileFromUser(currentUser);
    }
  };

  useEffect(() => {
    // 1. Fetch initial session details
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        resolveProfileFromUser(currentUser);
      }
      setLoading(false);
    });

    // 2. Register real-time session state subscriber
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          resolveProfileFromUser(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAuthenticated,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
