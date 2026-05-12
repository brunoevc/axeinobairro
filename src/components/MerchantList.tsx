import { Zap } from "lucide-react";
import { MerchantCard } from "@/components/MerchantCard";
import { SectionHeader } from "@/components/SectionHeader";
import { NothingFound } from "@/components/NothingFound";
import type { Merchant } from "@/data/merchants";

type MerchantListProps = {
  filtered: Merchant[];
  onClearFilters: () => void;
};

export function MerchantList({ filtered, onClearFilters }: MerchantListProps) {
  return (
    <section className="mt-6 px-5">
      <SectionHeader
        icon={<Zap className="h-4 w-4 text-accent" />}
        title={`${filtered.length} comércios`}
        subtitle="Próximos de você agora"
      />
      {filtered.length === 0 ? (
        <NothingFound onClearFilters={onClearFilters} />
      ) : (
        <div className="mt-3 grid gap-3">
          {filtered.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      )}
    </section>
  );
}
