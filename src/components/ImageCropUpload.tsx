import React, { useState, useCallback, useRef } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  RefreshCw, 
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageCropUploadProps {
  label: string;
  description?: string;
  value: string;
  onChange: (base64: string) => void;
  recommendedSize?: string;
  aspectRatio: number;
  id?: string;
}

export function ImageCropUpload({
  label,
  description,
  value,
  onChange,
  recommendedSize,
  aspectRatio,
  id
}: ImageCropUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validation: Type
      if (!file.type.match(/image\/(png|jpg|jpeg|webp)/)) {
        toast.error("Formato inválido. Use PNG, JPG ou WebP.");
        return;
      }

      // Validation: Size (3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Imagem muito grande. Limite de 3MB.");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      
      // Test if it fits in localStorage (rough estimate)
      try {
        onChange(croppedImage);
        setIsCropping(false);
        setImage(null);
        toast.success("Imagem atualizada!");
      } catch (e) {
        console.error("Storage error:", e);
        toast.error("Não foi possível salvar esta imagem. Tente uma imagem menor.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao processar imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4" id={id}>
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

      <div className="relative">
        {!value ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-orange-200 transition-all flex flex-col items-center justify-center gap-4 py-12 group",
              aspectRatio === 1 ? "aspect-square" : aspectRatio === 16/9 ? "aspect-video" : "aspect-[4/3]"
            )}
            style={aspectRatio === 3 ? { aspectRatio: '3/1' } : {}}
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-900">Escolha uma foto</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG ou WebP</p>
            </div>
          </button>
        ) : (
          <div className="relative group overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm">
            <img 
              src={value} 
              alt={label} 
              className={cn(
                "w-full object-cover",
                aspectRatio === 1 ? "aspect-square" : aspectRatio === 16/9 ? "aspect-video" : "aspect-[4/3]"
              )}
              style={aspectRatio === 3 ? { aspectRatio: '3/1' } : {}}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-xl font-black text-[10px] uppercase h-10 px-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Trocar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-xl font-black text-[10px] uppercase h-10 px-4"
                onClick={removeImage}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-1">
          <span className="text-orange-600 font-black mr-1">Dica:</span>
          Use uma imagem clara e bem iluminada.
        </p>
        
        <button 
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-orange-600 transition-colors self-start px-1"
        >
          {showAdvanced ? "Ocultar URL avançada" : "Usar URL avançada"}
        </button>

        {showAdvanced && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
            <input
              type="url"
              placeholder="Ou cole a URL da imagem aqui..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-600 transition-all"
              value={value.startsWith('data:') ? '' : value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Cropping Modal */}
      {isCropping && image && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Ajuste o enquadramento</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Arraste para reposicionar ou use o zoom</p>
              </div>
              <button 
                onClick={() => { setIsCropping(false); setImage(null); }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="relative flex-1 bg-slate-100 min-h-[300px] md:min-h-[400px]">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => { setIsCropping(false); setImage(null); }}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl font-black border-slate-200 text-slate-500"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={createCroppedImage}
                  disabled={isProcessing}
                  className="flex-1 h-14 rounded-2xl font-black bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-100"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Salvar imagem
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Utility function to crop and compress image
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the cropped size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Compress if needed. We aim for a reasonable balance.
  // If the resulting image is still too large for localStorage, 
  // we might need more aggressive compression or downscaling.
  
  // Max dimension 800px for performance/storage efficiency
  const maxDim = 800;
  if (canvas.width > maxDim || canvas.height > maxDim) {
    const scale = maxDim / Math.max(canvas.width, canvas.height);
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const sCtx = scaledCanvas.getContext("2d");
    if (sCtx) {
      sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      return scaledCanvas.toDataURL("image/jpeg", 0.6); // 60% quality JPEG
    }
  }

  return canvas.toDataURL("image/jpeg", 0.7); // 70% quality JPEG
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
