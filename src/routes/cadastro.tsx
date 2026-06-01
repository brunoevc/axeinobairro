import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Store, 
  Image as ImageIcon, 
  Tag, 
  Clock, 
  MapPin, 
  Instagram, 
  MessageCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Rocket,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { categories, neighborhoods } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";

export const Route = createFileRoute("/cadastro")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    neighborhood: "",
    address: "",
    whatsapp: "",
    instagram: "",
    description: "",
    hours: "",
    image: "",
    promoTitle: "",
    promoDesc: "",
    promoActive: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          Tudo certo! <br /> <span className="text-violet-600">Sua loja está na fila.</span>
        </h1>
        <p className="text-slate-500 mb-12 max-w-xs leading-relaxed font-medium text-lg">
          Seu negócio foi cadastrado para análise. Em breve ele estará visível para todos no bairro.
        </p>
        <div className="flex flex-col w-full max-w-sm gap-4">
          <Button 
            onClick={() => navigate({ to: '/' })} 
            className="rounded-2xl h-16 text-lg font-black bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 transition-all active:scale-95"
          >
            Voltar para o Início
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/admin/lojas' })} 
            className="rounded-2xl h-16 text-lg font-black border-slate-200 text-slate-600 hover:bg-white"
          >
            Ver minhas lojas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      <header className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="mb-8 p-3 bg-slate-50 rounded-full border border-slate-100 hover:bg-white hover:shadow-md transition-all active:scale-90 inline-flex group"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-violet-600" />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 shadow-lg shadow-violet-200">
                <Rocket className="w-3 h-3" />
                Cresça com a gente
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter">
                Anuncie no <br /><span className="text-violet-600">Axêi no Bairro</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium mt-6 max-w-xl leading-relaxed">
                Junte-se a centenas de comerciantes locais e comece a atrair clientes qualificados hoje mesmo.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 pb-2">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">Cadastro Grátis</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">WhatsApp Direto</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Sessão 1: Básico */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-600 flex items-center gap-3">
              <Store className="h-5 w-5" />
              Informações da Loja
            </h2>
            
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">Nome do Negócio</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Cantina da Nonna"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Categoria</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Selecionar</option>
                    {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Bairro</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  >
                    <option value="">Selecionar</option>
                    {neighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">Endereço Completo</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                <input 
                  required
                  type="text" 
                  placeholder="Rua, Número, Referência"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Sessão 2: Contato */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-600 flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              Contato e Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">WhatsApp (com DDD)</label>
                <div className="relative group">
                  <MessageCircle className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                  <input 
                    required
                    type="tel" 
                    placeholder="11999990000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Instagram (@usuario)</label>
                <div className="relative group">
                  <Instagram className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="@seunegocio"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessão 3: Detalhes */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-600 flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              Apresentação
            </h2>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1">Descrição do Negócio</label>
              <textarea 
                required
                placeholder="Conte para a vizinhança o que torna seu negócio especial..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all h-40 resize-none shadow-sm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Horário de Funcionamento</label>
                <div className="relative group">
                  <Clock className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                  <input 
                    required
                    type="text" 
                    placeholder="Seg a Sáb, 08h às 18h"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 ml-1">Link da Foto Principal</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                  <input 
                    type="url" 
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessão 4: Promoção */}
          <section className="bg-violet-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-violet-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-200 flex items-center gap-3">
                  <Tag className="h-5 w-5" />
                  Promoção Especial
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-violet-200">Ativar agora?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.promoActive}
                      onChange={(e) => setFormData({...formData, promoActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-violet-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className={`space-y-6 transition-all duration-500 ${formData.promoActive ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-4'}`}>
                <div className="space-y-3">
                  <label className="text-sm font-black text-violet-100 ml-1">Título Chamativo da Oferta</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Compre 1 Leve 2 / 30% de Desconto"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:text-slate-900 focus:border-white transition-all placeholder:text-violet-300"
                    disabled={!formData.promoActive}
                    value={formData.promoTitle}
                    onChange={(e) => setFormData({...formData, promoTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-violet-100 ml-1">Regras da Promoção</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Válido apenas para novos clientes..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:text-slate-900 focus:border-white transition-all placeholder:text-violet-300"
                    disabled={!formData.promoActive}
                    value={formData.promoDesc}
                    onChange={(e) => setFormData({...formData, promoDesc: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 text-violet-200">
                 <ShieldCheck className="w-5 h-5 opacity-60" />
                 <p className="text-[11px] font-bold leading-relaxed">Sua promoção será destacada com um selo especial nos resultados de busca.</p>
              </div>
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-20 rounded-[2rem] text-xl font-black bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Finalizar e Cadastrar Loja
          </Button>
        </form>
      </main>

      <FloatingNav />
    </div>
  );
}
