import { useEffect, useState } from "react";
import { RefreshCw, Rss, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Source = {
  id: string;
  name: string;
  feed_url: string;
  default_category: string;
  publication_mode: "automatic" | "moderated";
  is_active: boolean;
  last_synced_at: string | null;
  last_error: string | null;
};

export function RssNewsManager() {
  const [sources, setSources] = useState<Source[]>([]);
  const [name, setName] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [syncing, setSyncing] = useState(false);
  const db = supabase as any;

  const load = async () => {
    const { data, error } = await db.from("rss_sources").select("*").order("name");
    if (error) {
      toast.error("Não foi possível carregar as fontes RSS");
      return;
    }
    setSources(data || []);
  };

  useEffect(() => { load(); }, []);

  const addSource = async () => {
    if (!name.trim() || !feedUrl.startsWith("https://")) {
      toast.error("Informe um nome e uma URL HTTPS válida");
      return;
    }
    const { error } = await db.from("rss_sources").insert({
      name: name.trim(),
      feed_url: feedUrl.trim(),
      publication_mode: "moderated",
      default_category: "local",
    });
    if (error) return toast.error(error.message);
    setName("");
    setFeedUrl("");
    toast.success("Fonte adicionada em modo moderado");
    load();
  };

  const updateSource = async (id: string, changes: Partial<Source>) => {
    const { error } = await db.from("rss_sources").update(changes).eq("id", id);
    if (error) return toast.error(error.message);
    setSources((current) => current.map((source) => source.id === id ? { ...source, ...changes } : source));
  };

  const removeSource = async (id: string) => {
    if (!confirm("Remover esta fonte RSS? As notícias já importadas serão preservadas.")) return;
    const { error } = await db.from("rss_sources").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSources((current) => current.filter((source) => source.id !== id));
  };

  const sync = async (sourceId?: string) => {
    setSyncing(true);
    const { error } = await supabase.functions.invoke("sync-rss-news", {
      body: sourceId ? { sourceId } : {},
    });
    setSyncing(false);
    if (error) return toast.error(`Falha na sincronização: ${error.message}`);
    toast.success("Sincronização concluída");
    load();
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><Rss className="h-5 w-5 text-orange-600" /><h2 className="text-xl font-black">Fontes RSS</h2></div>
          <p className="mt-1 text-sm text-slate-500">Importação moderada por padrão, com bloqueio de notícias duplicadas.</p>
        </div>
        <Button onClick={() => sync()} disabled={syncing || !sources.length} variant="outline" className="rounded-xl font-bold">
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sincronizar agora
        </Button>
      </div>

      <div className="mb-6 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_2fr_auto]">
        <div><Label>Nome da fonte</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prefeitura" /></div>
        <div><Label>Endereço RSS (HTTPS)</Label><Input value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https://exemplo.gov.br/feed.xml" /></div>
        <Button onClick={addSource} className="self-end bg-orange-600 hover:bg-orange-700"><Plus className="mr-2 h-4 w-4" />Adicionar</Button>
      </div>

      <div className="space-y-3">
        {sources.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Nenhuma fonte cadastrada.</p>}
        {sources.map((source) => (
          <div key={source.id} className="grid gap-4 rounded-xl border border-slate-100 p-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <div className="min-w-0">
              <p className="font-bold text-slate-900">{source.name}</p>
              <p className="truncate text-xs text-slate-500">{source.feed_url}</p>
              <p className={`mt-1 text-xs ${source.last_error ? "text-red-600" : "text-slate-400"}`}>
                {source.last_error || (source.last_synced_at ? `Última sincronização: ${new Date(source.last_synced_at).toLocaleString("pt-BR")}` : "Ainda não sincronizada")}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold"><Switch checked={source.is_active} onCheckedChange={(value) => updateSource(source.id, { is_active: value })} />Ativa</label>
            <Button variant="outline" size="sm" onClick={() => updateSource(source.id, { publication_mode: source.publication_mode === "automatic" ? "moderated" : "automatic" })}>
              {source.publication_mode === "automatic" ? "Automática" : "Moderada"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => sync(source.id)} disabled={syncing}><RefreshCw className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => removeSource(source.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
