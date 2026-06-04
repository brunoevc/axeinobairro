import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, authUserAtom } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail, User, ArrowRight, ShieldAlert, X, Eye, EyeOff, Key } from "lucide-react";
import { usersRepository } from "@/repositories/usersRepository";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [, setIsAuth] = useAtom(isAuthenticatedAtom);
  const [, setAuthUser] = useAtom(authUserAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = usersRepository.getByEmail(email);
    
    if (user && user.password === password) {
      if (user.mustChangePassword) {
        setTempUser(user);
        setMustChangePassword(true);
        toast.info("Você precisa alterar sua senha no primeiro acesso.");
        return;
      }
      
      performLogin(user);
    } else {
      toast.error("Credenciais inválidas. Use brunoevc@gmail.com / 123456");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const updatedUser = { ...tempUser, password: newPassword, mustChangePassword: false };
    usersRepository.save(updatedUser);
    
    toast.success("Senha atualizada com sucesso!");
    performLogin(updatedUser);
  };

  const performLogin = (user: any) => {
    setIsAuth(true);
    setAuthUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: "local"
    });
    
    toast.success(`Bem-vindo, ${user.name}!`);
    
    if (user.role === 'master_admin') {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/painel" });
    }
  };

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
          {mustChangePassword ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Alterar Senha</h2>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  Por segurança, crie uma nova senha para sua conta.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                  <div className="relative group">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative group">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-xl shadow-orange-100 transition-all active:scale-95">
                  Salvar e Entrar
                </Button>
              </form>
            </div>
          ) : showRecovery ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Recuperar Senha</h2>
                <button onClick={() => setShowRecovery(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Esta funcionalidade está em modo mock. Em breve integrada com Supabase.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                <Button onClick={() => toast.info("Modo demonstração: Email não enviado.")} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black transition-all">
                  Simular Envio
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Login</h2>
                <p className="text-slate-500 font-medium mt-1">Acesse seu painel administrativo local.</p>
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

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-800 uppercase tracking-wider leading-none">
              Autenticação Temporária Local
            </p>
            <p className="text-[10px] font-medium text-blue-600 leading-relaxed uppercase tracking-wider">
              A segurança real será implementada com Supabase Auth na próxima fase.
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
