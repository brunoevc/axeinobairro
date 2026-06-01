import { useState, useEffect } from "react";
import { Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  recommendedSize?: string;
  aspectRatio?: "square" | "video" | "card" | "horizontal";
}

export function ImageUploadPreview({
  label,
  description,
  value,
  onChange,
  recommendedSize,
  aspectRatio = "square",
}: ImageUploadPreviewProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [previewUrl, setPreviewUrl] = useState(value);

  useEffect(() => {
    if (!value) {
      setStatus("idle");
      setPreviewUrl("");
      return;
    }

    setStatus("loading");
    const img = new Image();
    img.src = value;
    img.onload = () => {
      setStatus("success");
      setPreviewUrl(value);
    };
    img.onerror = () => {
      setStatus("error");
      setPreviewUrl("");
    };
  }, [value]);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    card: "aspect-[4/3]",
    horizontal: "aspect-[3/1]",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <label className="text-sm font-black text-slate-700 ml-1">{label}</label>
          {description && <p className="text-xs text-slate-400 font-medium ml-1 mt-0.5">{description}</p>}
        </div>
        {recommendedSize && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
            {recommendedSize}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-8 space-y-3">
          <div className="relative group">
            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="url"
              placeholder="Cole a URL da imagem aqui..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-1">
            <span className="text-orange-600 font-black mr-1">Dica:</span>
            Use imagens claras, bem iluminadas e sem excesso de texto.
          </p>
        </div>

        <div className="md:col-span-4">
          <div className={cn(
            "relative w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center overflow-hidden transition-all",
            aspectClasses[aspectRatio],
            status === 'error' && "border-red-200 bg-red-50",
            status === 'success' && "border-emerald-200 bg-white"
          )}>
            {status === "idle" && (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <ImageIcon className="w-8 h-8 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest">Aguardando URL</span>
              </div>
            )}

            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-2 text-red-500 p-4 text-center">
                <AlertCircle className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">URL Inválida</span>
                <p className="text-[9px] font-medium text-red-400 leading-tight">Não foi possível carregar a imagem</p>
              </div>
            )}

            {status === "success" && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
