import { Skeleton } from "@/components/ui/skeleton";

export function MerchantDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-[40vh] md:h-[50vh] w-full rounded-3xl" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
