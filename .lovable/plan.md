## Fase 8.0: Professional Store URLs / Subdomínios de Loja

Esta fase implementa URLs amigáveis para as lojas, permitindo que cada estabelecimento tenha um endereço profissional (ex: `/loja/cantina-da-nonna`) em vez de apenas o ID numérico.

### 1. Development Phase e Step
Phase 8.0: Store Personalization
Step 1: Professional Slugs & Routing

### 2. Current vs Expected Behavior
**Current:**
- Lojas acessadas via `/negocios/$id` (Ex: `/negocios/1`).
- IDs são numéricos e não amigáveis para SEO ou compartilhamento.

**Expected:**
- Lojas acessadas via `/loja/$slug` (Ex: `/loja/cantina-da-nonna`).
- Admin pode gerar e editar o slug.
- Redirecionamento automático de links antigos para os novos.
- Interface para copiar a URL pública no admin.

### 3. Arquivos a alterar/criar
- **`src/lib/slugs.ts` (Novo):** Funções utilitárias para `generateSlug`, `isValidSlug` e `isSlugUnique`.
- **`src/data/merchants.ts`:**
  - Adicionar campo `slug?: string` ao tipo `Merchant`.
  - Adicionar slugs iniciais para os dados mockados.
- **`src/components/admin/MerchantEditForm.tsx`:**
  - Campo de edição para o slug.
  - Validação em tempo real (duplicados e caracteres).
  - Exibição da "URL Pública" com botão de cópia.
- **`src/routes/loja/$slug.tsx` (Novo):** Rota pública por slug. Reutilizará a lógica da página de detalhes atual.
- **`src/routes/negocios/$id.tsx`:** Adicionar lógica de redirecionamento (301-like client-side) para a nova rota de slug caso o merchant possua um.
- **`src/components/MerchantCard.tsx` e `src/routes/noticias.tsx`:** Atualizar links `<Link>` para priorizar a rota de slug.

### 4. Regra de Slug Único
- Slugs serão validados contra a lista global de `merchants` no `localStorage` (ou mock data).
- Ao salvar no admin, o sistema verificará se outro merchant (com ID diferente) já utiliza o mesmo slug.
- Caracteres permitidos: letras minúsculas, números e hifens (`a-z0-9-`).

### 5. Estratégia de Compatibilidade
- **Fallback:** Se uma loja não tiver slug, o link `/negocios/$id` continuará funcionando normalmente.
- **Auto-geração:** Lojas sem slug terão um gerado automaticamente no primeiro carregamento do admin ou na edição.
- **Redirecionamento:** A página `/negocios/$id` verificará se o `merchant` encontrado tem um `slug`. Se sim, usará `useNavigate` para mover o usuário para `/loja/$slug`.

### 6. Plano para Subdomínio Real (Fase Futura)
- A estrutura `/loja/$slug` é o passo 1.
- No futuro, o servidor (Vercel/Netlify/Cloudflare) poderá capturar `*.axeinobairro.com.br` e mapear o subdomínio para o parâmetro `$slug` da nossa aplicação.
- A arquitetura atual de roteamento via `TanStack Router` facilita essa transição por separar a lógica de busca do dado (slug) da exibição.

### 7. Checklist QA
- [ ] Criar novo estabelecimento e verificar geração automática do slug.
- [ ] Editar slug manualmente no admin (ex: mudar "loja-1" para "minha-loja").
- [ ] Tentar salvar slug duplicado e ver mensagem de erro.
- [ ] Tentar usar caracteres especiais ou espaços (deve ser limpo automaticamente ou bloqueado).
- [ ] Acessar via `/loja/nome-da-loja` e ver todos os dados (produtos, contato, mapa).
- [ ] Acessar via link antigo `/negocios/1` e ser redirecionado para `/loja/slug-da-loja`.
- [ ] Botão "Copiar Link" no admin gera o link completo corretamente.
- [ ] Verificar se links em Notícias e Patrocinadores estão usando a nova URL.
