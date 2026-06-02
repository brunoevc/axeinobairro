import { useState, useEffect } from "react";
import { getPixCharges, createPixCharge, updatePixStatus, savePixCharges } from "@/lib/payments";
import { merchants } from "@/data/merchants";
import { PixCharge, TransactionStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Copy, ExternalLink, DollarSign, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCobrancas() {
  const [charges, setCharges] = useState<PixCharge[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ merchantId: merchants[0]?.id || "", amount: "", customerName: "", description: "" });

  useEffect(() => { setCharges(getPixCharges()); }, []);

  const handleCreateCharge = () => {
    if (!formData.amount || !formData.customerName) return toast.error("Preencha o valor e nome");
    const newCharge = createPixCharge({
      merchantId: formData.merchantId,
      merchantName: merchants.find(m => m.id === formData.merchantId)?.name || "Loja",
      amount: parseFloat(formData.amount),
      customerName: formData.customerName,
      status: "aguardando_pagamento"
    });
    setCharges(getPixCharges());
    setIsDialogOpen(false);
    toast.success("Link gerado!");
  };

  const handleCancel = (id: string) => {
    updatePixStatus(id, "cancelado");
    setCharges(getPixCharges());
    toast.info("Cobrança cancelada");
  };

  const handleStatusChange = (id: string, status: TransactionStatus) => {
    updatePixStatus(id, status);
    setCharges(getPixCharges());
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Cobranças Manuais</h1>
          <p className="text-slate-500 font-bold text-sm">Conferência manual de comprovantes Pix</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button className="bg-orange-600 font-black rounded-2xl h-12 px-6 shadow-lg">Novo Link</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Cobrança Manual</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Input type="number" placeholder="Valor (R$)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              <Input placeholder="Nome do Cliente" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              <Button onClick={handleCreateCharge} className="w-full h-12 font-black rounded-xl">Gerar Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="bg-white rounded-[2rem] border p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-bold">{c.customerName}</TableCell>
                <TableCell className="font-black text-slate-700">R$ {c.amount.toFixed(2)}</TableCell>
                <TableCell><Badge className="uppercase">{c.status.replace('_', ' ')}</Badge></TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                   {(c.status === 'aguardando_pagamento' || c.status === 'comprovante_enviado') && (
                     <Button variant="ghost" size="sm" onClick={() => handleCancel(c.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4"/></Button>
                   )}
                   {c.status === 'comprovante_enviado' && (
                     <Button variant="ghost" size="sm" onClick={() => handleStatusChange(c.id, 'aprovado')} className="text-green-600"><CheckCircle className="w-4 h-4"/></Button>
                   )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}