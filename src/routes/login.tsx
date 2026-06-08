import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, ShieldAlert, X, Eye, EyeOff, Key } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/painel" });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error(error.message || "Credenciais inválidas.");
      return;
    }
    
    if (data.user) {
      toast.success(`Bem-vindo!`);
      navigate({ to: "/painel" });
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("E-mail de recuperação enviado!");
      setShowRecovery(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo className="justify-center mb-4" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-200">
            <Lock className="w-3 h-3" />
            Acesso Restrito
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
                Digite seu e-mail para receber um link de recuperação.
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
                <Button type="submit" className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black transition-all">
                  Enviar Link
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Login</h2>
                <p className="text-slate-500 font-medium mt-1">Acesse seu painel Axêi.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="email" 
                      placeholder="seu@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95 group">
                  Entrar
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-800 uppercase tracking-wider leading-none">
              Portal Comunitário Axêi
            </p>
            <p className="text-[10px] font-medium text-orange-600 leading-relaxed uppercase tracking-wider">
              Autenticação oficial via Lovable Cloud habilitada.
            </p>
          </div>
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
