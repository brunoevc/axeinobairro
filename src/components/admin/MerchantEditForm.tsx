import { useState } from "react";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { Store, MapPin, MessageCircle, FileText, Save, X, Info } from "lucide-react";
import React from "react";

type MerchantEditFormProps = {
  merchant: MerchantAdmin;
  onSave: (updated: Partial<MerchantAdmin>) => void;
  onCancel: () => void;
};

export function MerchantEditForm({
  merchant,
  onSave,
  onCancel,
}: MerchantEditFormProps) {
  const [formData, setFormData] = useState({
    name: merchant.name,
    description: merchant.description,
    whatsapp: merchant.whatsapp,
    neighborhood: merchant.neighborhood,
    notes: merchant.notes || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="w-full">
      <div className="bg-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
          <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
             <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Editar Estabelecimento</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Ref: {merchant.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-8">
                {/* Nome */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                {/* Bairro */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Bairro Ativo
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-600" />
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) =>
                        setFormData({ ...formData, neighborhood: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 pl-12 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    WhatsApp de Contato
                  </label>
                  <div className="relative group">
                    <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-600" />
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 pl-12 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm"
                      placeholder="5511999990001"
                    />
                  </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* Descrição */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Descrição Pública
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm resize-none"
                  />
                </div>

                {/* Notas Internas */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Notas Administrativas (Privado)
                  </label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-6 w-4 h-4 text-slate-400 group-focus-within:text-violet-600" />
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 pl-12 py-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm resize-none"
                      placeholder="Observações internas..."
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Metadata Grid */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Info className="w-3.5 h-3.5" /> Metadados do Registro
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoria</p>
                <p className="font-black text-slate-900 text-sm">{merchant.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Atual</p>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${merchant.status !== 'pending' && merchant.status !== 'rejected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                   <p className="font-black text-slate-900 text-sm">
                    {merchant.status}
                   </p>

                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plano</p>
                <p className="font-black text-violet-600 text-sm uppercase tracking-widest">{merchant.plan || "free"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Cliques</p>
                <p className="font-black text-slate-900 text-sm">{merchant.whatsappClicks || 0}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-16 rounded-2xl font-black bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 active:scale-95 transition-all gap-3"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 h-16 rounded-2xl font-black border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all gap-3"
            >
              <X className="w-5 h-5" />
              Descartar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
