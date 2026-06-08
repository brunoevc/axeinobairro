import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useFollowCommunities } from "@/hooks/useFollowCommunities";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { communitiesRepository } from "@/repositories/communitiesRepository";
import { Heart, Store, Wrench, Users, ArrowRight, Bookmark } from "lucide-react";
import { MerchantCard } from "@/components/MerchantCard";
import { Button } from "@/components/ui/button";
import { Community } from "@/types/communities";

export const Route = createFileRoute("/painel/")({
  component: UserPanelHome,
});

function UserPanelHome() {
  const { favorites } = useFavorites();
  const { followedIds } = useFollowCommunities();
  
  const [favoriteMerchants, setFavoriteMerchants] = useState<any[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
  const [followedCommunities, setFollowedCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Sync merchants (still localStorage/mock for now)
    const mIds = favorites.filter(f => f.type === 'merchant').map(f => f.id);
    setFavoriteMerchants(merchantsRepository.getAll().filter(m => mIds.includes(m.id)));

    const sIds = favorites.filter(f => f.type === 'service').map(f => f.id);
    setFavoriteServices(servicesRepository.getAll().filter(s => sIds.includes(s.id)));

    // Sync communities (Real Supabase)
    communitiesRepository.getAll().then(all => {
      setFollowedCommunities(all.filter(c => followedIds.includes(c.id)));
    });
  }, [favorites, followedIds]);

  const hasAnySaved = favoriteMerchants.length > 0 || favoriteServices.length > 0 || followedCommunities.length > 0;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meu Axêi</h1>
        <p className="text-slate-500 mt-2 font-medium">Seu hub central de conteúdos e conexões locais.</p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-orange-600" /> Meus Salvos e Favoritos
          </h2>
        </div>

        {!hasAnySaved ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Você ainda não salvou nada</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
              Favorite lojas, serviços e siga comunidades para encontrá-los rapidamente aqui.
            </p>
            <Button asChild className="rounded-2xl h-14 px-8 bg-orange-600 hover:bg-orange-700 font-black">
              <Link to="/">Explorar o Bairro</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {favoriteMerchants.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Store className="w-4 h-4" /> Lojas Favoritas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoriteMerchants.map(m => <MerchantCard key={m.id} merchant={m} />)}
                </div>
              </div>
            )}

            {favoriteServices.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Serviços Salvos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteServices.map(s => (
                    <Link 
                      key={s.id} 
                      to="/servicos"
                      className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 leading-tight">{s.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.category}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-orange-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {followedCommunities.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Comunidades que Sigo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {followedCommunities.map(c => (
                    <Link 
                      key={c.id} 
                      to="/comunidades"
                      className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 leading-tight">{c.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.neighborhood}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-orange-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
