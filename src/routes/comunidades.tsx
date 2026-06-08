import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { communitiesRepository } from "@/repositories/communitiesRepository";
import { Community } from "@/types/communities";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Users, MapPin, ArrowLeft, Heart, ChevronRight, MessageSquare, ShieldCheck, Info, UserCheck } from "lucide-react";
import { useFollowCommunities } from "@/hooks/useFollowCommunities";

import { PixDisplayCard } from "@/components/PixDisplayCard";
import { Footer } from "@/components/Footer";
import { EcosystemLoops } from "@/components/EcosystemLoops";


export const Route = createFileRoute("/comunidades")({
  component: CommunitiesPage,
});

function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const { isFollowing, toggleFollow } = useFollowCommunities();
  const navigate = useNavigate();


  useEffect(() => {
    communitiesRepository.getAll().then(all => {
      setCommunities(all.filter(c => c.isActive));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Comunidades de Interesse</h1>
              <p className="text-slate-500 mt-4 text-lg max-w-2xl leading-relaxed">
                Conecte-se com grupos que compartilham dos seus interesses e fortaleça os laços no seu bairro.
              </p>
              <div className="h-1.5 w-20 bg-violet-600 mt-6 rounded-full" />
            </div>
            
            <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-lg">
              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
                Criar Nova Comunidade
              </a>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map(comm => (
            <div key={comm.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{comm.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-black uppercase text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100">
                      {comm.type}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3" />
                      {comm.city}{comm.neighborhood ? ` • ${comm.neighborhood}` : ""}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
                {comm.description}
              </p>

              {comm.pixConfig?.enabled && (
                <div className="mb-6">
                  <PixDisplayCard pixConfig={comm.pixConfig} className="rounded-2xl p-4 md:p-4" />
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => toggleFollow(comm.id, comm.name)}
                  className={`w-full h-14 rounded-2xl font-black uppercase text-xs shadow-lg transition-all active:scale-95 ${
                    isFollowing(comm.id)
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                      : "bg-violet-600 hover:bg-violet-700 shadow-violet-200"
                  }`}
                >
                  {isFollowing(comm.id) ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Seguindo
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Seguir Comunidade
                    </>
                  )}
                </Button>

                
                {comm.whatsapp && (
                  <Button 
                    variant="outline"
                    className="w-full h-12 rounded-2xl border-slate-100 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all"
                    asChild
                  >
                    <a href={`https://wa.me/${comm.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
                      Grupo no WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-violet-400" />
                <h4 className="text-xl font-black uppercase tracking-tight">Comunidade Segura e Inclusiva</h4>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                O Axêi no Bairro promove a união local respeitando a diversidade. Comunidades religiosas, sociais ou esportivas são tratadas de forma opcional e aberta, visando sempre o fortalecimento do bairro.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
               <Info className="w-5 h-5 text-violet-400" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Respeito e União</p>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-20">
        <EcosystemLoops />
      </section>

      <Footer />
      <FloatingNav />
    </div>
  );
}
