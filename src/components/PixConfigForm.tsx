import { useState } from "react";
import { PixConfig } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Save, Wallet } from "lucide-react";
import { toast } from "sonner";

interface PixConfigFormProps {
  initialConfig?: PixConfig;
  onSave: (config: PixConfig) => void;
  title?: string;
  description?: string;
}

export function PixConfigForm({ initialConfig, onSave, title = "Configuração Pix", description }: PixConfigFormProps) {
  const [config, setConfig] = useState<PixConfig>(initialConfig || {
    enabled: false,
    keyType: 'cpf',
    key: '',
    holderName: '',
    description: ''
  });

  const handleSave = () => {
    if (config.enabled && (!config.key || !config.holderName)) {
      toast.error("Preencha a chave Pix e o nome do titular.");
      return;
    }
    onSave(config);
    toast.success("Configuração Pix salva com sucesso!");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="pix-enabled" className="text-xs font-black uppercase text-slate-400">Ativar Pix</Label>
          <Switch 
            id="pix-enabled" 
            checked={config.enabled} 
            onCheckedChange={(val) => setConfig({ ...config, enabled: val })}
          />
        </div>
      </div>

      <div className={`space-y-4 transition-all duration-300 ${config.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Tipo de Chave</Label>
            <Select 
              value={config.keyType} 
              onValueChange={(val: any) => setConfig({ ...config, keyType: val })}
            >
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="random">Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Chave Pix</Label>
            <Input 
              placeholder="Digite sua chave" 
              value={config.key}
              onChange={(e) => setConfig({ ...config, key: e.target.value })}
              className="rounded-xl border-slate-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-500">Nome do Titular</Label>
          <Input 
            placeholder="Nome completo ou Razão Social" 
            value={config.holderName}
            onChange={(e) => setConfig({ ...config, holderName: e.target.value })}
            className="rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-500">Descrição (Opcional)</Label>
          <Input 
            placeholder="Ex: Dízimo, Doação, Pagamento de Pedido" 
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            className="rounded-xl border-slate-200"
          />
        </div>

        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
          <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-orange-800 leading-relaxed uppercase tracking-wider">
            O Axêi apenas exibe os dados para facilitar a transação direta. Nenhum pagamento é processado pela plataforma.
          </p>
        </div>
      </div>

      <Button 
        onClick={handleSave}
        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Salvar Configuração Pix
      </Button>
    </div>
  );
}
