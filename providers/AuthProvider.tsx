import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import {Session} from "@supabase/supabase-js";

type Key = string | symbol;

export type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profile: any;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | Record<Key, any>>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false
});


export default function AuthProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {data: {
        session
      }} = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', session.user.id)
         .single();

        setProfile(data || null);
      }

      setLoading(false);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
     value=
      {{
        session,
        loading,
        profile,
        isAdmin: profile?.group === "ADMIN"
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
