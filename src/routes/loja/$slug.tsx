import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { merchants, getMerchantPublicPath } from "@/data/merchants";
import { useEffect, useState } from "react";
import { MerchantDetailsSkeleton } from "@/components/MerchantDetailsSkeleton";
import { TopBar } from "@/components/TopBar";
import { DetailPageContent } from "@/components/DetailPageContent";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { isValidSlug } from "@/lib/slugs";


export const Route = createFileRoute("/loja/$slug")({
  component: SlugDetailPage,
});

function SlugDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const merchant = merchants.find((m) => m.slug === slug);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <TopBar />
        <MerchantDetailsSkeleton />
      </div>
    );
  }

  if (!merchant) {
    // If not found by slug, maybe it was a raw ID? Try finding by ID
    const merchantById = merchants.find((m) => m.id === slug);
    if (merchantById) {
      // If we found it by ID, and it has a slug, redirect to the correct slug path
      // If it doesn't have a slug, we still allow viewing it here as a fallback or redirect back to negocios
      navigate({ to: getMerchantPublicPath(merchantById), replace: true });
      return null;
    }

    // Truly not found - show error or redirect
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100">
          <Search className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Loja não encontrada</h1>
        <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">
          Ops! Não conseguimos localizar esse estabelecimento pelo link informado.
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
