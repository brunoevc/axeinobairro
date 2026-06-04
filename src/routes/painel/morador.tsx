import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  Users, 
  Car, 
  Wrench, 
  Megaphone,
  ShieldCheck,
  Zap,
  Tag,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassifiedsManager } from "@/components/ClassifiedsManager";

export const Route = createFileRoute("/painel/morador")({
  component: MoradorPanel,
});

function MoradorPanel() {
  const [authUser] = useAtom(authUserAtom);
  const interests = authUser?.interests || [];
  const neighborhood = authUser?.neighborhood || "Meu Bairro";

  // Simulação de conteúdo baseado em interesses
  const hasInterest = (interest: string) => interests.includes(interest);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Olá, <span className="text-orange-600">{authUser?.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Personalizando sua experiência em <span className="text-slate-900 font-bold">{neighborhood}</span>.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {interests.map(interest => (
            <span key={interest} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
              {interest.replace('_', ' ')}
            </span>
          ))}
          {interests.length === 0 && (
            <span className="px-3 py-1 bg-orange-50 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">
              Conteúdo Geral
            </span>
          )}
        </div>
      </div>

      {/* Grid de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <Heart className="w-5 h-5 text-red-500 mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Favoritos</p>
          <p className="text-2xl font-black text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <MessageSquare className="w-5 h-5 text-blue-500 mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações</p>
          <p className="text-2xl font-black text-slate-900">4</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <Users className="w-5 h-5 text-violet-500 mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comunidades</p>
          <p className="text-2xl font-black text-slate-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <Tag className="w-5 h-5 text-emerald-500 mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ofertas Salvas</p>
          <p className="text-2xl font-black text-slate-900">7</p>
        </div>
      </div>

      {/* Blocos de Conteúdo por Interesse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bloco de Comunidades Religiosas (Opcional por Interesse) */}
        {hasInterest('eventos_religiosos') && (
          <div className="bg-violet-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-violet-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-violet-200" />
                <h3 className="text-xl font-black tracking-tight">Suas Comunidades</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">Fé e União</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Missa de Sábado</p>
                  <p className="text-[10px] text-violet-200 uppercase font-black">Igreja Matriz • 19:00</p>
                </div>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">Ver</Button>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Ação Social de Inverno</p>
                  <p className="text-[10px] text-violet-200 uppercase font-black">Recolhimento de Mantas</p>
                </div>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">Participar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Transporte (Se interesse em transporte) */}
        {hasInterest('transporte') && (
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-black tracking-tight">Mobilidade no Bairro</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">3 Motoristas Online</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">Próximos a {neighborhood}</p>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs font-black uppercase">Chamar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Notícias (Se interesse em noticias) */}
        {hasInterest('noticias') && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Notícias para Você</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative">
                    <div className="absolute top-3 left-3 bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase">Bairro</div>
                  </div>
                  <h4 className="font-black text-slate-900 leading-tight">Nova praça será inaugurada na Vila Nova em Julho.</h4>
               </div>
               <div className="space-y-2">
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative">
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase">Serviços</div>
                  </div>
                  <h4 className="font-black text-slate-900 leading-tight">Manutenção programada de rede elétrica no final de semana.</h4>
               </div>
            </div>
          </div>
        )}

        {/* Bloco Geral (Sempre visível ou se sem interesses) */}
        <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 shadow-sm lg:col-span-2">
           <div className="flex items-center gap-4 mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-black text-emerald-900 tracking-tight">Oportunidades Locais</h3>
           </div>
           <p className="text-emerald-700 font-medium mb-8">
              Aproveite os melhores negócios e serviços perto de você, {authUser?.name.split(' ')[0]}.
           </p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 rounded-2xl border-emerald-200 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest flex flex-col gap-1 items-center justify-center">
                 <ShoppingBag className="w-4 h-4" />
                 Lojas
              </Button>
              <Button variant="outline" className="h-16 rounded-2xl border-emerald-200 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest flex flex-col gap-1 items-center justify-center">
                 <Wrench className="w-4 h-4" />
                 Serviços
              </Button>
              <Button variant="outline" className="h-16 rounded-2xl border-emerald-200 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest flex flex-col gap-1 items-center justify-center">
                 <Zap className="w-4 h-4" />
                 Ofertas
              </Button>
              <Button variant="outline" className="h-16 rounded-2xl border-emerald-200 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest flex flex-col gap-1 items-center justify-center">
                 <MapPin className="w-4 h-4" />
                 Eventos
              </Button>
           </div>
        </div>
      </div>

      {/* Meus Anúncios */}
      <ClassifiedsManager 
        userId={authUser?.id || ""} 
        userName={authUser?.name || ""}
        planType={authUser?.plan === 'community' ? 'community' : 'free'} 
      />

      {/* Banner Institucional */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            O Axêi no Bairro usa comunidades e interesses apenas para personalizar a experiência local. O conteúdo geral continua acessível para todos, promovendo a união e diversidade da nossa região.
         </p>
      </div>
    </div>
  );
}
