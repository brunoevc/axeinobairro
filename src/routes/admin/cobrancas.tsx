import { useState, useEffect } from "react";
import { getPixCharges, createPixCharge, updatePixStatus, getPixLinks, createPixLink, savePixLinks } from "@/lib/payments";
import { merchants } from "@/data/merchants";
import { PixCharge, TransactionStatus, PixLink, PixPurpose } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Copy, ExternalLink, DollarSign, AlertTriangle, CheckCircle, XCircle, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminCobrancas() {
  const [charges, setCharges] = useState<PixCharge[]>([]);
  const [links, setLinks] = useState<PixLink[]>([]);
  const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  
  // Charge Form
  const [chargeForm, setChargeForm] = useState({ merchantId: merchants[0]?.id || "", amount: "", customerName: "" });
  
  // Link Form
  const [linkForm, setLinkForm] = useState({ 
    merchantId: merchants[0]?.id || "", 
    title: "", 
    purposes: [{ id: "1", name: "", fixedAmount: undefined, allowFreeValue: false }] as PixPurpose[]
  });

  useEffect(() => { 
    setCharges(getPixCharges()); 
    setLinks(getPixLinks());
  }, []);

  const handleCreateCharge = () => {
    if (!chargeForm.amount || !chargeForm.customerName) return toast.error("Preencha todos os campos");
    const newCharge = createPixCharge({
      merchantId: chargeForm.merchantId,
      merchantName: merchants.find(m => m.id === chargeForm.merchantId)?.name || "Loja",
      amount: parseFloat(chargeForm.amount),
      customerName: chargeForm.customerName,
      status: "aguardando_pagamento"
    });
    setCharges(getPixCharges());
    setIsChargeDialogOpen(false);
    toast.success("Cobrança gerada!");
    navigator.clipboard.writeText(`${window.location.origin}/checkout/pix/${newCharge.id}`);
  };

  const handleCreateLink = () => {
    if (!linkForm.title || linkForm.purposes.some(p => !p.name)) return toast.error("Preencha o título e nomes das finalidades");
    if (linkForm.purposes.some(p => !p.fixedAmount && !p.allowFreeValue)) return toast.error("Cada finalidade deve ter valor fixo ou permitir valor livre");
    
    const newLink = createPixLink({
      merchantId: linkForm.merchantId,
      merchantName: merchants.find(m => m.id === linkForm.merchantId)?.name || "Loja",
      title: linkForm.title,
      purposes: linkForm.purposes
    });
    
    setLinks(getPixLinks());
    setIsLinkDialogOpen(false);
    toast.success("Link Recorrente gerado!");
    navigator.clipboard.writeText(`${window.location.origin}/checkout/pix/${newLink.id}`);
  };

  const addPurpose = () => {
    if (linkForm.purposes.length >= 5) return toast.error("Máximo de 5 finalidades atingido");
    setLinkForm({
      ...linkForm,
      purposes: [...linkForm.purposes, { id: Math.random().toString(), name: "", fixedAmount: undefined, allowFreeValue: false }]
    });
  };

  const removePurpose = (id: string) => {
    if (linkForm.purposes.length <= 1) return;
    setLinkForm({ ...linkForm, purposes: linkForm.purposes.filter(p => p.id !== id) });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestão de Pix Manual</h1>
          <p className="text-slate-500 font-bold text-sm">Cobranças diretas e Links de finalidades</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isChargeDialogOpen} onOpenChange={setIsChargeDialogOpen}>
            <DialogTrigger asChild><Button variant="outline" className="font-black rounded-2xl h-12 border-slate-200"><Plus className="w-4 h-4 mr-2"/>Cobrança Única</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Cobrança Direta</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Input type="number" placeholder="Valor (R$)" value={chargeForm.amount} onChange={e => setChargeForm({...chargeForm, amount: e.target.value})} />
                <Input placeholder="Nome do Cliente" value={chargeForm.customerName} onChange={e => setChargeForm({...chargeForm, customerName: e.target.value})} />
                <Button onClick={handleCreateCharge} className="w-full h-12 font-black rounded-xl">Gerar e Copiar Link</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild><Button className="bg-orange-600 hover:bg-orange-700 font-black rounded-2xl h-12 shadow-lg shadow-orange-100"><LinkIcon className="w-4 h-4 mr-2"/>Link Recorrente</Button></DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Novo Link por Finalidade</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Título do Link (Ex: Dízimos e Ofertas)</Label>
                  <Input placeholder="Título" value={linkForm.title} onChange={e => setLinkForm({...linkForm, title: e.target.value})} className="h-12 rounded-xl font-bold" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Finalidades (Máx 5)</Label>
                    <Button variant="ghost" size="sm" onClick={addPurpose} className="text-orange-600 font-black h-8 text-[10px] uppercase tracking-wider">
                      <Plus className="w-3 h-3 mr-1"/> Adicionar
                    </Button>
                  </div>
                  
                  {linkForm.purposes.map((p, idx) => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group">
                      <div className="flex gap-3">
                        <Input 
                          placeholder="Nome (Ex: Oferta)" 
                          value={p.name} 
                          onChange={e => {
                            const newP = [...linkForm.purposes];
                            newP[idx].name = e.target.value;
                            setLinkForm({...linkForm, purposes: newP});
                          }}
                          className="h-10 rounded-lg font-bold bg-white"
                        />
                        {linkForm.purposes.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removePurpose(p.id)} className="h-10 w-10 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></Button>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-2">
                          <Input 
                            type="number" 
                            placeholder="Valor Fixo" 
                            value={p.fixedAmount || ""} 
                            onChange={e => {
                              const newP = [...linkForm.purposes];
                              newP[idx].fixedAmount = e.target.value ? parseFloat(e.target.value) : undefined;
                              setLinkForm({...linkForm, purposes: newP});
                            }}
                            className="h-10 rounded-lg font-bold bg-white"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={p.allowFreeValue} 
                            onChange={e => {
                              const newP = [...linkForm.purposes];
                              newP[idx].allowFreeValue = e.target.checked;
                              setLinkForm({...linkForm, purposes: newP});
                            }}
                            className="w-4 h-4 accent-orange-600"
                          />
                          <span className="text-[10px] font-black uppercase text-slate-500">Valor Livre</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleCreateLink} className="w-full h-14 bg-slate-900 font-black rounded-2xl mt-4">Criar Link por Finalidade</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Tabs defaultValue="charges" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="charges" className="rounded-lg font-black uppercase text-[10px] tracking-widest px-6">Cobranças Ativas</TabsTrigger>
          <TabsTrigger value="links" className="rounded-lg font-black uppercase text-[10px] tracking-widest px-6">Links Recorrentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charges">
          <div className="bg-white rounded-[2rem] border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Cliente / Finalidade</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Valor</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Status</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-slate-400">Nenhuma cobrança encontrada</TableCell></TableRow>
                ) : (
                  [...charges].reverse().map(c => (
                    <TableRow key={c.id} className="group hover:bg-slate-50">
                      <TableCell className="px-6">
                        <div className="font-black text-slate-900">{c.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{c.purposeName || "Cobrança Direta"}</div>
                      </TableCell>
                      <TableCell className="px-6 font-black text-slate-700">R$ {c.amount.toFixed(2)}</TableCell>
                      <TableCell className="px-6">
                        <Badge className={`uppercase text-[9px] font-black tracking-tighter ${
                          c.status === 'aprovado' ? 'bg-green-100 text-green-700' : 
                          c.status === 'comprovante_enviado' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {(c.status === 'aguardando_pagamento' || c.status === 'comprovante_enviado') && (
                            <Button variant="ghost" size="sm" onClick={() => { updatePixStatus(c.id, 'cancelado'); setCharges(getPixCharges()); }} className="text-red-500 h-8 font-black uppercase text-[9px]">Cancelar</Button>
                          )}
                          {c.status === 'comprovante_enviado' && (
                            <Button variant="ghost" size="sm" onClick={() => { updatePixStatus(c.id, 'aprovado'); setCharges(getPixCharges()); }} className="text-green-600 h-8 font-black uppercase text-[9px]">Aprovar</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="links">
           <div className="bg-white rounded-[2rem] border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Título do Link</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Finalidades</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 font-bold text-slate-400">Nenhum link recorrente criado</TableCell></TableRow>
                ) : (
                  links.map(l => (
                    <TableRow key={l.id} className="group hover:bg-slate-50">
                      <TableCell className="px-6">
                        <div className="font-black text-slate-900">{l.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{l.id}</div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-1">
                          {l.purposes.map(p => <Badge key={p.id} variant="secondary" className="text-[9px] font-bold">{p.name}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/checkout/pix/${l.id}`);
                            toast.success("Link copiado!");
                          }}
                          className="h-8 font-black uppercase text-[9px]"
                        >
                          Copiar Link
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}