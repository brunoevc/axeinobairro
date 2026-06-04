import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Car, MapPin, Star } from "lucide-react";

interface Props {
  count?: number;
  type?: 'merchant' | 'service' | 'ride';
}

export function ListingSkeleton({ count = 6, type = 'merchant' }: Props) {
  return (
    <div className={`grid grid-cols-1 ${type === 'ride' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-8`}>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="rounded-[2.5rem] border-slate-100 overflow-hidden relative shadow-sm h-[400px]">
          <div className="h-48 bg-slate-100 animate-pulse" />
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-24 h-4 bg-slate-100 rounded-full animate-pulse" />
              <div className="w-16 h-4 bg-slate-100 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-6 bg-slate-100 rounded-lg animate-pulse" />
                <div className="w-20 h-4 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="w-full h-4 bg-slate-100 rounded-lg animate-pulse" />
              <div className="w-2/3 h-4 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="pt-4 flex gap-2">
              <div className="flex-1 h-12 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
