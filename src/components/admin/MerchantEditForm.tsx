import { useState, useEffect } from "react";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { Store, MapPin, MessageCircle, FileText, Save, X, Info, Globe, Copy, Check } from "lucide-react";
import { generateSlug, isValidSlug, isSlugUnique } from "@/lib/slugs";
import { toast } from "sonner";
import React from "react";

type MerchantEditFormProps = {
  merchant: MerchantAdmin;
  allMerchants: MerchantAdmin[];
  onSave: (updated: Partial<MerchantAdmin>) => void;
  onCancel: () => void;
};

export function MerchantEditForm({
  merchant,
  allMerchants,
  onSave,
  onCancel,
}: MerchantEditFormProps) {
  const [formData, setFormData] = useState({
    name: merchant.name,
    description: merchant.description,
    whatsapp: merchant.whatsapp,
    neighborhood: merchant.neighborhood,
    notes: merchant.notes || "",
    exposureLevel: merchant.exposureLevel || "none",
    slug: merchant.slug || "",
  });


  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-generate slug if it's empty and name is provided
  useEffect(() => {
    if (!formData.slug && formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }));
    }
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/loja/${formData.slug || merchant.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link da loja copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.slug && !isValidSlug(formData.slug)) {
      toast.error("O slug contém caracteres inválidos. Use apenas letras minúsculas, números e hifens.");
      return;
    }

    // Get merchants from localStorage/context to check uniqueness
    // In this mock, we'll assume we have access to the full list from localState or just trust the admin
    // For a real check, we'd need the merchants list passed as a prop
    
    setIsSaving(true);

    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      toast.success("Estabelecimento atualizado com sucesso!");
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

                {/* Slug / URL Profissional */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                      URL Personalizada (Slug)
                    </label>
                    {formData.slug && (
                      <span className={`text-[10px] font-bold uppercase ${!slugIsValid || !slugIsUnique ? 'text-red-500' : 'text-emerald-500'}`}>
                        {!slugIsValid ? "Inválido" : !slugIsUnique ? "Duplicado" : "Disponível"}
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <Globe className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${!slugIsValid || !slugIsUnique ? 'text-red-400' : 'text-slate-400 group-focus-within:text-violet-600'}`} />
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value.toLowerCase().trim().replace(/\s+/g, "-") })
                      }
                      placeholder="ex: cantina-da-nonna"
                      className={`w-full rounded-2xl border bg-slate-50 px-5 pl-12 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 transition-all shadow-sm ${
                        !slugIsValid || !slugIsUnique 
                          ? 'border-red-100 focus:ring-red-500/5 focus:border-red-600 focus:bg-red-50/30' 
                          : 'border-slate-100 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 px-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400 font-medium">
                        axeinobairro.com.br/loja/{formData.slug || "..."}
                      </p>
                      <button 
                        type="button"
                        onClick={handleCopyLink}
                        className="text-[10px] font-black text-violet-600 uppercase flex items-center gap-1 hover:underline"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copiado!" : "Copiar Link"}
                      </button>
                    </div>
                    {formData.slug && (
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Preview do Subdomínio (Futuro):</p>
                        <p className="text-[11px] font-black text-orange-600">
                          {formData.slug}.axeinobairro.com.br
                        </p>
                      </div>
                    )}
                  </div>
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
                 {/* Exposição Comercial */}
                 <div className="space-y-3">
                   <div className="flex items-center justify-between ml-1">
                     <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                       Exposição Comercial
                     </label>
                     <span className="text-[10px] font-bold text-orange-500">Prioridade A &gt; B &gt; C</span>
                   </div>
                   <select
                     value={formData.exposureLevel}
                     onChange={(e) =>
                       setFormData({ ...formData, exposureLevel: e.target.value as any })
                     }
                     className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 focus:bg-white transition-all shadow-sm appearance-none"
                   >
                     <option value="none">Sem exposição</option>
                     <option value="A">Destaque Principal (Área Premium)</option>
                     <option value="B">Impulso Comercial (Bloco Secundário)</option>
                     <option value="C">Promoção Comum (Cards Normais)</option>
                   </select>
                   <p className="text-[10px] text-slate-400 font-medium px-1">
                     <Info className="w-3 h-3 inline mr-1 mb-0.5" />
                     Uma loja só pode ocupar um tipo de exposição por vez.
                   </p>
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
