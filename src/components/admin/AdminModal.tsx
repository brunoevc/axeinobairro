import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle } from "lucide-react";
import React from "react";

type AdminModalProps = {
  title: string;
  description?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
};

export function AdminModal({
  title,
  description,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDangerous = false,
}: AdminModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    onConfirm();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isDangerous ? 'bg-red-50 text-red-600 shadow-red-100' : 'bg-emerald-50 text-emerald-600 shadow-emerald-100'}`}>
           {isDangerous ? <AlertCircle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter leading-none">{title}</h3>
        {description && (
          <p className="text-slate-500 font-medium mb-4">{description}</p>
        )}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant={isDangerous ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full h-16 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${!isDangerous ? 'bg-violet-600 hover:bg-violet-700 shadow-violet-200' : 'shadow-red-100'}`}
          >
            {isLoading ? (
               <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : confirmText}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full h-12 rounded-xl font-bold text-slate-400 hover:text-slate-900"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
