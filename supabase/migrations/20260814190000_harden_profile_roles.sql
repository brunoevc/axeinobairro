-- Remove identity-based privilege assignment and keep administrative roles server-controlled.

-- RLS policies call this function while evaluating requests from authenticated users.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Users may edit their own profile fields, but never the role column.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  neighborhood,
  interests,
  favorite_categories,
  avatar_url,
  onboarding_completed,
  last_seen_at
) ON public.profiles TO authenticated;

-- Every new account starts without administrative privileges.
-- Elevated access must be granted through a controlled server-side operation by inserting
-- the appropriate role in public.user_roles and synchronizing public.profiles when needed.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, neighborhood, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'neighborhood', 'user');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
