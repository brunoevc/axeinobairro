import { Skeleton } from "@/components/ui/skeleton";

export function MerchantSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col p-5 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
