import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, passwordAtom, recoveryRequestsAtom, authUserAtom } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail, User, ArrowRight, ShieldAlert, X } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [, setIsAuth] = useAtom(isAuthenticatedAtom);
  const [, setAuthUser] = useAtom(authUserAtom);
  const [adminPassword] = useAtom(passwordAtom);
  const [, setRecoveryRequests] = useAtom(recoveryRequestsAtom);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === adminPassword) {
      setIsAuth(true);
      setAuthUser({
        name: "Administrador",
        email: "admin@axeinobairro.com",
        provider: "local"
      });
      toast.success("Login realizado com sucesso!");
      navigate({ to: "/admin" });
    } else {
      toast.error("Credenciais inválidas. Tente admin / admin.");
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    setIsAuth(true);
    setAuthUser({
      name: "Administrador Google",
      email: "admin@axeinobairro.com",
      provider: "google",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    });
    toast.success("Login com Google simulado com sucesso!");
    navigate({ to: "/admin" });
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    
    setRecoveryRequests(prev => [
      ...prev,
      { email: recoveryEmail, date: new Date().toISOString(), status: "solicitado" }
    ]);
    
    toast.success("Se este e-mail estiver cadastrado, enviaremos as instruções.");
    setShowRecovery(false);
    setRecoveryEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo className="justify-center mb-4" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-200">
            <ShieldAlert className="w-3 h-3" />
            Painel Administrativo
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          {showRecovery ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Recuperar Senha</h2>
                <button onClick={() => setShowRecovery(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Digite seu e-mail abaixo. Se você tiver uma conta, enviaremos um link de recuperação.
              </p>
              <form onSubmit={handleRecovery} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="email" 
                      placeholder="seu@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-xl shadow-orange-100 transition-all active:scale-95">
                  Enviar Instruções
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Bem-vindo</h2>
                <p className="text-slate-500 font-medium mt-1">Acesse sua conta para gerenciar a plataforma.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="text" 
                      placeholder="admin"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha</label>
                    <button 
                      type="button"
                      onClick={() => setShowRecovery(true)}
                      className="text-[10px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95 group">
                  Entrar no Painel
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">ou</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-full h-16 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold shadow-lg shadow-slate-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                </Button>

                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider">
                  Login Google real será ativado na próxima fase.
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-orange-800 leading-relaxed uppercase tracking-wider">
            <span className="font-black">Acesso de demonstração:</span> Use o usuário <span className="underline italic">admin</span> e senha <span className="underline italic">admin</span>. Troque a senha antes de usar em produção.
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="text-xs font-black text-slate-400 hover:text-orange-600 uppercase tracking-[0.2em] transition-colors">
            ← Voltar para o Site
          </Link>
        </div>
      </div>
    </div>
  );
}
