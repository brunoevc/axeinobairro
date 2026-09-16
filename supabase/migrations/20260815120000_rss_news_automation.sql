-- RSS sources, synchronization history and imported-news metadata.
CREATE TABLE IF NOT EXISTS public.rss_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE CHECK (feed_url ~ '^https://'),
  default_category TEXT NOT NULL DEFAULT 'local',
  publication_mode TEXT NOT NULL DEFAULT 'moderated'
    CHECK (publication_mode IN ('automatic', 'moderated')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rss_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.rss_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'partial', 'error')),
  imported_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'published'
    CHECK (publication_status IN ('pending', 'published', 'rejected')),
  ADD COLUMN IF NOT EXISTS rss_source_id UUID REFERENCES public.rss_sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS news_rss_external_id_unique
  ON public.news (rss_source_id, external_id)
  WHERE rss_source_id IS NOT NULL AND external_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS news_source_url_unique
  ON public.news (source_url)
  WHERE source_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS news_publication_status_idx
  ON public.news (publication_status, published_at DESC);

CREATE INDEX IF NOT EXISTS rss_sync_runs_started_at_idx
  ON public.rss_sync_runs (started_at DESC);

ALTER TABLE public.rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_sync_runs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rss_sources TO authenticated;
GRANT SELECT ON public.rss_sync_runs TO authenticated;
GRANT ALL ON public.rss_sources, public.rss_sync_runs TO service_role;

CREATE POLICY "Admins can manage RSS sources" ON public.rss_sources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can view RSS history" ON public.rss_sync_runs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

DROP POLICY IF EXISTS "News are viewable by everyone" ON public.news;
CREATE POLICY "Published news are viewable by everyone" ON public.news
  FOR SELECT TO anon, authenticated
  USING (
    publication_status = 'published'
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'master_admin')
  );

CREATE TRIGGER update_rss_sources_updated_at
  BEFORE UPDATE ON public.rss_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
