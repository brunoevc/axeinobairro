# Phase 12.0A: Security Audit & Initial Seed

Objective: Secure the backend, implement role-based access control (RBAC), and populate initial data to transform Axêi into a production-ready Beta portal.

## 1. Security Audit & RBAC
- **User Roles Table**: Create `public.user_roles` to manage `admin` and `master_admin` roles securely.
- **Profiles**: Restricted access. Public can only see minimal profile info (for verification if needed); users manage their own.
- **Content (News/Communities)**: Public read-access (SELECT). Write-access (INSERT/UPDATE/DELETE) restricted to `admin` and `master_admin` using a security-definer function `public.has_role()`.
- **Metrics**: Anonymous insertion for tracking; SELECT restricted to Admins.
- **Auth Trigger**: Update `handle_new_user` to automatically assign `master_admin` role to `brunoevc@gmail.com` on signup.

## 2. Storage Infrastructure
- **Buckets**: Create `community-images` and `news-images` for content management.
- **Policies**: Public SELECT for everyone; INSERT/UPDATE/DELETE restricted to Admins.

## 3. Initial Seed Data (via Migration)
- **News**: 10 real-world news items related to neighborhood life (events, utility, local news).
- **Communities**: 8 initial communities across different neighborhoods (Center, Praia Seca, Vila Nova, etc.).
- **Metrics**: 10 initial events (search, view, clicks) to demonstrate the Insights dashboard.

## 4. Admin User Setup
- **Master Admin**: The migration will include a trigger update to assign the `master_admin` role to `brunoevc@gmail.com` when the user signs up.

## 5. Technical Details
- **Migration**: A single comprehensive migration `20260608_security_and_seed.sql` for all schema and data changes.
- **Verification**: Check row counts and RLS behavior.

### Security Implementation Highlights
```sql
CREATE TABLE public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    unique (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$ LANGUAGE sql STABLE;

CREATE POLICY "Admins can manage news" ON public.news FOR ALL 
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'master_admin'));
```
