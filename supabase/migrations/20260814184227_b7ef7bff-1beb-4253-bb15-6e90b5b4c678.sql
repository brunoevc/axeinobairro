-- 1. Create Role Type
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('master_admin', 'admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Grants
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 4. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Security Definer Function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 6. Update handle_new_user to assign master_admin to brunoevc@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_role public.app_role;
BEGIN
  -- Determine role based on email
  IF NEW.email = 'brunoevc@gmail.com' THEN
    initial_role := 'master_admin';
  ELSE
    initial_role := 'user';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, neighborhood, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'neighborhood', initial_role::text);

  -- Assign role in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, initial_role);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Update Policies with RBAC
-- News
DROP POLICY IF EXISTS "Authenticated users can create news" ON public.news;
DROP POLICY IF EXISTS "Authors can update own news" ON public.news;

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

-- Communities
DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
DROP POLICY IF EXISTS "Creators can update own communities" ON public.communities;

CREATE POLICY "Admins can manage communities" ON public.communities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

-- Metrics (Restrict SELECT)
DROP POLICY IF EXISTS "Admins can view metrics" ON public.metrics_events;
CREATE POLICY "Admins can view metrics" ON public.metrics_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

-- 8. Storage Policies
DROP POLICY IF EXISTS "Admins can manage news images" ON storage.objects;
CREATE POLICY "Admins can manage news images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'news-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin')));

DROP POLICY IF EXISTS "Anyone can view news images" ON storage.objects;
CREATE POLICY "Anyone can view news images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'news-images');

DROP POLICY IF EXISTS "Admins can manage community images" ON storage.objects;
CREATE POLICY "Admins can manage community images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'community-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin')));

DROP POLICY IF EXISTS "Anyone can view community images" ON storage.objects;
CREATE POLICY "Anyone can view community images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'community-images');

-- 9. Seed Data
-- Communities
INSERT INTO public.communities (name, slug, description, category, neighborhood, is_verified)
VALUES 
('Igreja Matriz de Araruama', 'igreja-matriz', 'Comunidade paroquial central com missas diárias e eventos sociais.', 'religiosa', 'Centro', true),
('Associação de Moradores da Vila Nova', 'associacao-vila-nova', 'Unindo moradores pelo desenvolvimento e melhorias do bairro Vila Nova.', 'social', 'Vila Nova', true),
('Ciclismo Araruama', 'ciclismo-araruama', 'Grupo de ciclistas que realizam trilhas e passeios noturnos pela região.', 'esportiva', 'Parque Hotel', true),
('Artesãos da Orla', 'artesaos-orla', 'Coletivo de artesãos locais que expõem seus trabalhos na orla do Centro.', 'cultural', 'Centro', true),
('Surfistas de Praia Seca', 'surfistas-praia-seca', 'Comunidade dedicada ao surf e preservação das praias de Araruama.', 'esportiva', 'Praia Seca', true),
('Protetores de Animais Local', 'protetores-animais', 'Grupo focado em resgate e adoção responsável de pets abandonados.', 'social', 'Centro', true),
('Centro Espírita Amor e Luz', 'amor-e-luz', 'Comunidade dedicada ao estudo e prática da caridade.', 'religiosa', 'Rio do Limão', true),
('Skatistas da Praça', 'skatistas-praca', 'Movimento jovem para ocupação positiva da nova pista de skate.', 'esportiva', 'Centro', true)
ON CONFLICT (slug) DO NOTHING;

-- News
INSERT INTO public.news (title, excerpt, content, category, neighborhood, is_featured)
VALUES 
('Festival de Verão 2026 Confirmado!', 'O maior evento da região dos lagos volta com atrações nacionais.', 'O Festival de Verão 2026 promete agitar Araruama com shows de grandes artistas...', 'eventos', 'Centro', true),
('Nova ciclovia na Orla do Centro', 'Prefeitura inicia obras para expansão da malha cicloviária.', 'A nova ciclovia conectará o Centro ao Parque Hotel, trazendo mais segurança...', 'local', 'Centro', false),
('Campanha de Vacinação em Praia Seca', 'Saúde itinerante chega ao bairro neste final de semana.', 'Moradores de Praia Seca poderão atualizar o cartão de vacinação na praça principal...', 'utilidade', 'Praia Seca', false),
('Workshop de Artesanato Local', 'Aprenda técnicas de cerâmica com mestres da região.', 'O coletivo de artesãos abre inscrições para o workshop gratuito de cerâmica...', 'cultural', 'Centro', false),
('Limpeza das Praias: Ação Comunitária', 'Voluntários se reúnem para mutirão em Massambaba.', 'No próximo domingo, diversos grupos se unem para a retirada de resíduos...', 'social', 'Massambaba', false),
('Campeonato de Surf em Praia Seca', 'Atletas de todo o estado disputam a Taça Araruama.', 'As ondas de Praia Seca serão palco de manobras radicais neste sábado...', 'eventos', 'Praia Seca', true),
('Novas lixeiras instaladas na Vila Nova', 'Melhoria na coleta seletiva e limpeza urbana do bairro.', 'A associação de moradores comemora a chegada de novos coletores...', 'utilidade', 'Vila Nova', false),
('Exposição Histórica no Casarão', 'Relíquias contam a história da fundação de Araruama.', 'Fotos inéditas e documentos do século XIX estarão em exibição...', 'cultural', 'Centro', false),
('Feira do Produtor Rural', 'Produtos frescos direto do campo na Praça do Blindex.', 'Todas as quartas-feiras, produtores locais trazem o melhor da agricultura...', 'local', 'Centro', false),
('Atualização do Transporte Municipal', 'Novos horários e linhas para atender a demanda noturna.', 'A secretaria de transportes anunciou ajustes para facilitar o deslocamento...', 'utilidade', 'Centro', false);

-- Metrics
INSERT INTO public.metrics_events (event_type, entity_type, neighborhood, metadata)
VALUES 
('search', null, 'Centro', '{"query": "eletricista"}'::jsonb),
('view', 'news', 'Centro', '{"title": "Festival de Verão"}'::jsonb),
('view', 'news', 'Praia Seca', '{"title": "Campeonato de Surf"}'::jsonb),
('click', 'merchant', 'Centro', '{"name": "Cantina da Nonna"}'::jsonb),
('search', null, 'Vila Nova', '{"query": "padaria"}'::jsonb),
('view', 'community', 'Parque Hotel', '{"name": "Ciclismo Araruama"}'::jsonb),
('click', 'whatsapp', 'Centro', '{"entity_id": "merchant-1"}'::jsonb),
('search', null, 'Praia Seca', '{"query": "pousada"}'::jsonb),
('view', 'news', 'Vila Nova', '{"title": "Novas lixeiras"}'::jsonb),
('click', 'instagram', 'Centro', '{"entity_id": "merchant-2"}'::jsonb);
