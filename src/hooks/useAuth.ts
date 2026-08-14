import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/users";
import { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  neighborhood?: string;
  interests?: string[];
  avatar?: string;
  plan?: 'free' | 'community';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabaseUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
      }

      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: (profile?.role as UserRole) || 'morador',
        neighborhood: profile?.neighborhood || undefined,
        interests: (profile?.interests as any) || undefined,
        avatar: profile?.avatar_url || undefined,
        plan: (profile as any)?.plan || 'free',
      } as AuthUser;
    } catch (err) {
      console.error("Auth initialization error:", err);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user).then(profile => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.success("Você saiu com sucesso.");
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'master_admin' || user?.role === 'admin',
    isPartner: user?.role === 'lojista' || user?.role === 'profissional' || user?.role === 'motorista',
    loading,
    signOut,
  };
}
