import { useState, useEffect } from "react";
import { getPixCharges, createPixCharge, updatePixStatus } from "@/lib/payments";
import { merchants } from "@/data/merchants";
import { PixCharge, TransactionStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  DollarSign,
  FileSearch
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCobrancas() {
  const [charges, setCharges] = useState<PixCharge[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    merchantId: merchants[0]?.id || "",
    amount: "",
    customerName: "",
    description: ""
  });

  useEffect(() => {
    setCharges(getPixCharges());
  }, []);

  const handleCreateCharge = () => {
    if (!formData.amount || !formData.customerName) {
      toast.error("Preencha o valor e nome do cliente");
      return;
    }

    const merchant = merchants.find(m => m.id === formData.merchantId);
    
    const newCharge = createPixCharge({
      merchantId: formData.merchantId,
      merchantName: merchant?.name || "Loja Parceira",
      amount: parseFloat(formData.amount),
      customerName: formData.customerName,
      description: formData.description,
      status: "aguardando_pagamento"
    });

    setCharges(getPixCharges());
    setIsDialogOpen(false);
    toast.success("Link de cobrança manual gerado!");
    
    const url = `${window.location.origin}/checkout/pix/${newCharge.id}`;
    navigator.clipboard.writeText(url);
    toast.info("Link copiado para o clipboard");
  };

  const handleStatusChange = (id: string, status: TransactionStatus) => {
    updatePixStatus(id, status);
    setCharges(getPixCharges());
    toast.success(`Pagamento ${status.replace('_', ' ')} com sucesso!`);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const config = {
      aguardando_pagamento: "bg-orange-100 text-orange-700",
      comprovante_enviado: "bg-blue-100 text-blue-700",
      aprovado: "bg-green-100 text-green-700",
      recusado: "bg-red-100 text-red-700",
      cancelado: "bg-slate-100 text-slate-700"
    };
    return (
      <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${config[status]}`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-32">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Cobranças Manuais</h1>
            <p className="text-slate-500 font-bold text-sm">Links para pagamento Pix e conferência de comprovante</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 font-black rounded-2xl h-12 px-6 shadow-lg shadow-orange-100">
                <Plus className="w-5 h-5 mr-2" />
                Novo Link de Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Cobrança Pix Manual</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Valor do Pedido (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-10 h-12 rounded-xl font-bold border-slate-200"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Nome do Cliente</Label>
                  <Input 
                    placeholder="Ex: João Silva" 
                    className="h-12 rounded-xl font-bold border-slate-200"
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateCharge} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-12 rounded-xl">
                  Gerar e Copiar Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-[2rem] flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0" />
          <p className="text-xs text-orange-800 font-black uppercase tracking-tight">
            Ambiente de Simulação. Nenhum pagamento real será processado.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Cliente</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Valor</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold">
                    Nenhuma cobrança gerada.
                  </TableCell>
                </TableRow>
              ) : (
                [...charges].reverse().map((c) => (
                  <TableRow key={c.id} className="group hover:bg-slate-50/50">
                    <TableCell>
                      <div className="font-bold text-slate-900">{c.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{c.id}</div>
                    </TableCell>
                    <TableCell className="font-black text-slate-700">R$ {c.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            const url = `${window.location.origin}/checkout/pix/${c.id}`;
                            navigator.clipboard.writeText(url);
                            toast.success("Link copiado!");
                          }}
                          className="h-8 w-8 text-slate-400 hover:text-orange-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          className="h-8 w-8 text-slate-400 hover:text-orange-600"
                        >
                          <a href={`/checkout/pix/${c.id}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        {c.status === 'comprovante_enviado' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleStatusChange(c.id, 'aprovado')}
                              className="h-8 w-8 text-green-600 hover:bg-green-50"
                              title="Aprovar Pagamento"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleStatusChange(c.id, 'recusado')}
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              title="Recusar"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
