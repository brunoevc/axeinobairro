import { useState } from "react";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { Store, CheckCircle2, XCircle, Edit3, MessageCircle, MapPin, Tag, ShieldCheck, Clock, ChevronDown } from "lucide-react";
import React from "react";

type ApprovalQueueProps = {
  merchants: MerchantAdmin[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onChangeStatus: (id: string, status: Merchant["status"]) => void;
  onChangePlan: (id: string, plan: MerchantAdmin["plan"]) => void;
  onEdit: (merchant: MerchantAdmin) => void;
};


export function ApprovalQueue({
  merchants,
  onApprove,
  onReject,
  onEdit,
}: ApprovalQueueProps) {
  const pending = merchants.filter((m) => m.status === "pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  if (pending.length === 0) {
    return (
      <div className="rounded-[3rem] bg-white p-20 border border-slate-100 text-center shadow-sm">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
           <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Tudo em Dia!</h3>
        <p className="text-slate-500 font-medium text-lg">
          Não há lojas pendentes de aprovação na fila.
        </p>
      </div>
    );
  }

  const selectedMerchant = pending.find((m) => m.id === selectedId);

  const handleConfirmApprove = () => {
    if (selectedId) {
      onApprove(selectedId);
      setSelectedId(null);
      setActionType(null);
    }
  };

  const handleConfirmReject = () => {
    if (selectedId) {
      onReject(selectedId, rejectReason || "Sem justificativa");
      setSelectedId(null);
      setRejectReason("");
      setActionType(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {pending.map((merchant) => (
          <div
            key={merchant.id}
            className="rounded-[2.5rem] bg-white p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 group-hover:bg-violet-600 transition-colors duration-500 group-hover:shadow-lg group-hover:shadow-violet-100">
                    <Store className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-slate-900 tracking-tighter leading-none mb-1">
                      {merchant.name}
                    </h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{merchant.category}</span>
                       <span className="text-slate-200 text-xs">•</span>
                       <div className="flex items-center gap-1 text-[10px] font-black text-violet-500 uppercase tracking-widest">
                          <MapPin className="w-3 h-3" />
                          {merchant.neighborhood}
                       </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 italic">
                   "{merchant.description}"
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                       <MessageCircle className="w-3 h-3" /> WhatsApp
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {merchant.whatsapp}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                       <Tag className="w-3 h-3" /> Documento
                    </div>
                    <p className="font-bold text-violet-600 text-xs truncate">
                      {merchant.document || "Não informado"}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                       <ShieldCheck className="w-3 h-3" /> Responsável
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {merchant.responsibleName || "Não informado"}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                       <Clock className="w-3 h-3" /> Status
                    </div>
                    <p className="font-bold text-slate-900 text-xs">
                      {merchant.status}
                    </p>
                  </div>
                </div>

              </div>

              <div className="lg:w-64 flex flex-col gap-3 lg:border-l lg:border-slate-50 lg:pl-10">
                <div className="text-left mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cadastrado em</p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date().toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedId(merchant.id);
                    setActionType("approve");
                  }}
                  className="w-full rounded-2xl h-14 font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 active:scale-95 transition-all gap-3"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Aprovar Agora
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedId(merchant.id);
                      setActionType("reject");
                    }}
                    className="rounded-2xl h-14 font-black border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 flex flex-col items-center justify-center p-0"
                  >
                    <XCircle className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] uppercase tracking-widest">Rejeitar</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onEdit(merchant)}
                    className="rounded-2xl h-14 font-black border-slate-200 text-slate-500 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-all active:scale-95 flex flex-col items-center justify-center p-0"
                  >
                    <Edit3 className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] uppercase tracking-widest">Editar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modais */}
      {actionType === "approve" && selectedMerchant && (
        <AdminModal
          title="Aprovar Publicação"
          message={`Confirmar a publicação da loja "${selectedMerchant.name}" no marketplace?`}
          onConfirm={handleConfirmApprove}
          onCancel={() => {
            setActionType(null);
            setSelectedId(null);
          }}
          confirmText="Confirmar Aprovação"
        />
      )}

      {actionType === "reject" && selectedMerchant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
               <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter leading-none">
              Rejeitar Cadastro
            </h3>
            <p className="text-slate-500 font-medium mb-8">
               Identificou algum erro no cadastro de <span className="text-slate-900 font-black">"{selectedMerchant.name}"</span>? Informe o motivo abaixo.
            </p>

            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Justificativa da Rejeição
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Descrição muito curta, imagem de má qualidade..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-600 focus:bg-white transition-all resize-none shadow-sm"
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleConfirmReject}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl h-16 font-black shadow-xl shadow-red-200 active:scale-95 transition-all"
              >
                Confirmar Rejeição
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setActionType(null);
                  setSelectedId(null);
                  setRejectReason("");
                }}
                className="w-full text-slate-400 hover:text-slate-900 h-12 font-bold"
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
