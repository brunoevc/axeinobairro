import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const allowedCategories = new Set([
  "utilidade",
  "local",
  "eventos",
  "promocoes",
  "cidade",
  "seguranca",
  "transito",
  "saude",
  "educacao",
  "comunidade",
]);

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function field(xml: string, names: string[]) {
  for (const name of names) {
    const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
    if (match) return decodeXml(match[1]);
  }
  return "";
}

function link(xml: string) {
  const atom = xml.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  return atom || field(xml, ["link"]);
}

function image(xml: string) {
  return xml.match(/<(?:media:content|media:thumbnail|enclosure)[^>]+url=["']([^"']+)["']/i)?.[1] || null;
}

function parseFeed(xml: string) {
  const entries = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)
    || xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi)
    || [];

  return entries.slice(0, 50).map((entry) => {
    const sourceUrl = link(entry);
    return {
      title: field(entry, ["title"]),
      excerpt: field(entry, ["description", "summary"]).slice(0, 500),
      content: field(entry, ["content:encoded", "content", "description", "summary"]),
      sourceUrl,
      externalId: field(entry, ["guid", "id"]) || sourceUrl,
      publishedAt: field(entry, ["pubDate", "published", "updated"]),
      imageUrl: image(entry),
    };
  }).filter((item) => item.title && item.sourceUrl && item.externalId);
}

function isSafeFeedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:"
      && host !== "localhost"
      && host !== "0.0.0.0"
      && host !== "::1"
      && !host.endsWith(".local")
      && !/^127\./.test(host)
      && !/^10\./.test(host)
      && !/^192\.168\./.test(host)
      && !/^169\.254\./.test(host)
      && !/^172\.(1[6-9]|2\d|3[01])\./.test(host);
  } catch {
    return false;
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const { data: authData } = await supabase.auth.getUser(token);
  if (!authData.user) return new Response("Unauthorized", { status: 401 });

  const { data: authorized } = await supabase.rpc("has_role", {
    _user_id: authData.user.id,
    _role: "admin",
  });
  const { data: masterAuthorized } = await supabase.rpc("has_role", {
    _user_id: authData.user.id,
    _role: "master_admin",
  });
  if (!authorized && !masterAuthorized) return new Response("Forbidden", { status: 403 });

  const body = await request.json().catch(() => ({}));
  let query = supabase.from("rss_sources").select("*").eq("is_active", true);
  if (body.sourceId) query = query.eq("id", body.sourceId);
  const { data: sources, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const source of sources || []) {
    const { data: run } = await supabase.from("rss_sync_runs").insert({
      source_id: source.id,
      status: "running",
    }).select("id").single();

    let imported = 0;
    let skipped = 0;
    try {
      if (!isSafeFeedUrl(source.feed_url)) throw new Error("Endereço de feed não permitido");
      const response = await fetch(source.feed_url, {
        headers: { "User-Agent": "Axei-RSS/1.0" },
        signal: AbortSignal.timeout(15000),
        redirect: "error",
      });
      if (!response.ok) throw new Error(`Feed respondeu com status ${response.status}`);
      const xml = await response.text();
      if (xml.length > 5_000_000) throw new Error("Feed excede o tamanho permitido");

      for (const item of parseFeed(xml)) {
        const publishedAt = Number.isNaN(Date.parse(item.publishedAt))
          ? new Date().toISOString()
          : new Date(item.publishedAt).toISOString();
        const category = allowedCategories.has(source.default_category)
          ? source.default_category
          : "local";
        const { error: insertError } = await supabase.from("news").insert({
          title: item.title.slice(0, 300),
          excerpt: item.excerpt,
          content: item.content || item.excerpt || item.title,
          category,
          neighborhood: "Araruama",
          image_url: item.imageUrl,
          published_at: publishedAt,
          publication_status: source.publication_mode === "automatic" ? "published" : "pending",
          rss_source_id: source.id,
          source_name: source.name,
          source_url: item.sourceUrl,
          external_id: item.externalId,
        });
        if (insertError?.code === "23505") skipped += 1;
        else if (insertError) throw insertError;
        else imported += 1;
      }

      await supabase.from("rss_sources").update({
        last_synced_at: new Date().toISOString(),
        last_error: null,
      }).eq("id", source.id);
      await supabase.from("rss_sync_runs").update({
        status: "success",
        imported_count: imported,
        skipped_count: skipped,
        finished_at: new Date().toISOString(),
      }).eq("id", run?.id);
      results.push({ sourceId: source.id, imported, skipped, status: "success" });
    } catch (syncError) {
      const message = syncError instanceof Error ? syncError.message : "Erro desconhecido";
      await supabase.from("rss_sources").update({ last_error: message }).eq("id", source.id);
      await supabase.from("rss_sync_runs").update({
        status: imported ? "partial" : "error",
        imported_count: imported,
        skipped_count: skipped,
        error_message: message,
        finished_at: new Date().toISOString(),
      }).eq("id", run?.id);
      results.push({ sourceId: source.id, imported, skipped, status: "error", error: message });
    }
  }

  return Response.json({ results });
});
