import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/")({
  beforeLoad: () => {
    const authStatus = localStorage.getItem("axei_auth_status");
    const isAuthenticated = authStatus === "true";
    
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    const authUserStr = localStorage.getItem("axei_auth_user");
    let authUser = null;
    try {
      authUser = authUserStr ? JSON.parse(authUserStr) : null;
    } catch (e) {}

    if (authUser) {
      if (authUser.role === 'master_admin') {
        throw redirect({ to: '/admin' });
      }
      
      const rolePaths: Record<string, string> = {
        lojista: '/painel/lojista',
        profissional: '/painel/profissional',
        motorista: '/painel/motorista',
        representante: '/painel/representante',
        morador: '/painel/morador',
        lider_comunidade: '/painel/comunidade',
      };

      const targetPath = rolePaths[authUser.role];
      if (targetPath) {
        throw redirect({ to: targetPath });
      }
    }
    
    // Fallback if no role matched
    throw redirect({ to: "/perfil" });
  },
});
