import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { merchants, getMerchantPublicPath } from "@/data/merchants";
import { useEffect, useState } from "react";
import { MerchantDetailsSkeleton } from "@/components/MerchantDetailsSkeleton";
import { TopBar } from "@/components/TopBar";
import { DetailPageContent } from "@/components/DetailPageContent";

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
    if (merchantById && merchantById.slug) {
      // Redirect to correct slug path
      navigate({ to: getMerchantPublicPath(merchantById), replace: true });
      return null;
    }

    
    // Truly not found
    navigate({ to: "/negocios" });
    return null;
  }

  return <DetailPageContent merchant={merchant} />;
}
