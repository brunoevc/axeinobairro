import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  MessageCircle,
  Sparkles,
  HelpCircle,
  PlusCircle,
  User,
  ChevronDown,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/ui/Logo";
import { feedbackRepository } from "@/repositories/feedbackRepository";
import { toast } from "sonner";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

const profiles = [
  { id: 'morador', label: 'Morador' },
  { id: 'comerciante', label: 'Comerciante' },
  { id: 'profissional', label: 'Profissional' },
  { id: 'motorista', label: 'Motorista' },
  { id: 'representante', label: 'Representante' },
  { id: 'lider_comunidade', label: 'Líder de Comunidade' },
];

function FeedbackPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    liked: "",
    notUnderstood: "",
    missing: "",
    profile: "",
    whatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profile) {
      toast.error("Por favor, selecione seu perfil.");
      return;
    }
    
    feedbackRepository.add(formData);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-xl shadow-emerald-200">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight tracking-tighter">
          Obrigado! <br /> <span className="text-orange-600">Feedback recebido.</span>
        </h1>
        <p className="text-slate-500 mb-12 max-w-xs leading-relaxed font-medium text-lg">
          Sua opinião é fundamental para construirmos um bairro melhor para todos.
        </p>
        <div className="flex flex-col w-full max-w-sm gap-4">
          <Button 
            onClick={() => navigate({ to: '/' })} 
            className="rounded-2xl h-16 text-lg font-black bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-200 transition-all active:scale-95"
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      <header className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="mb-8 p-3 bg-slate-50 rounded-full border border-slate-100 hover:bg-white hover:shadow-md transition-all active:scale-90 inline-flex group"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-orange-600" />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 shadow-lg shadow-violet-200">
                <Sparkles className="w-3 h-3" />
                Fase de Homologação
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter">
                Sua opinião <br className="hidden md:block" /> importa muito
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium mt-6 max-w-xl leading-relaxed">
                Ajude-nos a melhorar o <Logo className="inline-flex h-6 mx-1" /> compartilhando sua experiência.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-3">
              <User className="h-5 w-5" />
              Quem é você?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Seu Perfil</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:border-orange-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                    value={formData.profile}
                    onChange={(e) => setFormData({...formData, profile: e.target.value})}
                  >
                    <option value="">Selecionar Perfil</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">WhatsApp (opcional)</label>
                <div className="relative group">
                  <Smartphone className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="22 99999-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              Sua Experiência
            </h2>
            
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">O que você gostou?</label>
              <textarea 
                required
                placeholder="Conte-nos o que funcionou bem para você..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all h-32 resize-none shadow-sm"
                value={formData.liked}
                onChange={(e) => setFormData({...formData, liked: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">O que você não entendeu?</label>
              <div className="relative group">
                <HelpCircle className="absolute left-6 top-6 h-5 w-5 text-slate-400" />
                <textarea 
                  required
                  placeholder="Houve algo confuso ou difícil de usar?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-14 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all h-32 resize-none shadow-sm"
                  value={formData.notUnderstood}
                  onChange={(e) => setFormData({...formData, notUnderstood: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">O que está faltando?</label>
              <div className="relative group">
                <PlusCircle className="absolute left-6 top-6 h-5 w-5 text-slate-400" />
                <textarea 
                  required
                  placeholder="Que funcionalidade ou informação você gostaria de ver aqui?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-14 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all h-32 resize-none shadow-sm"
                  value={formData.missing}
                  onChange={(e) => setFormData({...formData, missing: e.target.value})}
                />
              </div>
            </div>
          </section>

          <Button 
            type="submit"
            className="w-full h-20 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white text-xl font-black shadow-2xl shadow-orange-200 transition-all active:scale-[0.98] group"
          >
            Enviar Feedback
            <Sparkles className="ml-3 w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          </Button>
        </form>
      </main>
    </div>
  );
}
