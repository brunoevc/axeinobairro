import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { merchants, getMerchantPublicPath } from "@/data/merchants";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { MerchantDetailsSkeleton } from "@/components/MerchantDetailsSkeleton";
import { DetailPageContent } from "@/components/DetailPageContent";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Route = createFileRoute("/negocios/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const merchant = merchants.find((m) => m.id === id);

  useEffect(() => {
    // If merchant has a slug, redirect to the professional URL
    if (merchant?.slug) {
      navigate({ to: getMerchantPublicPath(merchant), replace: true });
      return;
    }

    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id, merchant, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <TopBar />
        <MerchantDetailsSkeleton />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100">
          <Search className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Negócio não encontrado</h1>
        <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">
          Ops! Não conseguimos localizar esse estabelecimento. Ele pode ter sido removido ou o link está incorreto.
        </p>
        <Button 
          onClick={() => navigate({ to: '/negocios' })} 
          className="bg-orange-600 hover:bg-orange-700 rounded-2xl h-14 px-10 font-black text-white shadow-xl shadow-orange-200 transition-all active:scale-95"
        >
          Ver todos os negócios
        </Button>
      </div>
    );
  }

  return <DetailPageContent merchant={merchant} />;
}
