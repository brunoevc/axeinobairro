-- 1. Create RLS policies for user_roles (missed in initial creation)
-- Granting SELECT is enough for standard use, but we need a policy for RLS
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));

-- 2. Audit Profiles Policies
-- Current: Public viewable, Users update own.
-- Let's refine for RBAC:
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- 3. Storage Policies for Private Buckets (Make them accessible to admins)
-- (They were defined in the first migration, but now that they are private, let's ensure SELECT is gaurded)
DROP POLICY IF EXISTS "Anyone can view news images" ON storage.objects;
CREATE POLICY "Anyone can view news images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'news-images');

DROP POLICY IF EXISTS "Anyone can view community images" ON storage.objects;
CREATE POLICY "Anyone can view community images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'community-images');
