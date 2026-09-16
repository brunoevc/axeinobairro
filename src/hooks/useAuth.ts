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
      const [profileResult, rolesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', supabaseUser.id),
      ]);

      if (profileResult.error) {
        console.error("Error fetching profile:", profileResult.error);
      }

      if (rolesResult.error) {
        console.error("Error fetching access roles:", rolesResult.error);
      }

      const accessRoles = rolesResult.data?.map(({ role }) => role) ?? [];
      const privilegedRole: UserRole | undefined = accessRoles.includes('master_admin')
        ? 'master_admin'
        : accessRoles.includes('admin')
          ? 'admin'
          : undefined;
      const profile = profileResult.data;

      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: privilegedRole || (profile?.role as UserRole) || 'morador',
        neighborhood: profile?.neighborhood || undefined,
        interests: (profile?.interests as string[] | null) || undefined,
        avatar: profile?.avatar_url || undefined,
        plan: (profile as typeof profile & { plan?: 'free' | 'community' })?.plan || 'free',
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
