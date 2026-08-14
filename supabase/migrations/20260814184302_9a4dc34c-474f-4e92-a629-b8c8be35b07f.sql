-- 1. Revoke EXECUTE on security definer functions from public roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, authenticated, anon;

-- 2. Grant EXECUTE to service_role (standard practice)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 3. Ensure profiles table has a policy since RBAC roles are set there too
-- (Already has a basic public view policy, but good to double check)
-- GRANT SELECT ON public.user_roles TO authenticated; -- Already granted in previous migration
