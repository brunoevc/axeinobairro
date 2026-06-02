import { Skeleton } from "@/components/ui/skeleton";
import { TopBar } from "./TopBar";

export function MerchantDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Cover Skeleton */}
      <div className="relative w-full max-w-7xl mx-auto md:mt-8 md:px-6">
        <Skeleton className="h-[40vh] md:h-[50vh] w-full md:rounded-3xl" />
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Skeletons */}
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <div className="space-y-6">
          {/* Sidebar Skeleton */}
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </main>
    </div>
  );
}
