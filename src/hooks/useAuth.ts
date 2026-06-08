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
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const { toast } = useToast(); // Replaced with sonner toast

  const fetchProfile = async (supabaseUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: (profile?.role as UserRole) || 'morador',
        neighborhood: profile?.neighborhood || undefined,
        interests: profile?.interests || undefined,
        avatar: profile?.avatar_url || undefined,
      } as AuthUser;
    } catch (err) {
      console.error("Auth initialization error:", err);
      return null;
    }
  };

  useEffect(() => {
    // Check active sessions
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

    // Listen for auth changes
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
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      toast({
        title: "Até logo!",
        description: "Você saiu com sucesso.",
      });
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'master_admin',
    isPartner: user?.role === 'lojista' || user?.role === 'profissional' || user?.role === 'motorista',
    loading,
    signOut,
  };
}
