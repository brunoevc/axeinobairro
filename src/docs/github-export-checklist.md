# Phase 9.4 — Checklist Operacional: Exportação Lovable para GitHub

Este documento detalha o processo para tornar o **Axêi no Bairro** independente da plataforma Lovable, migrando-o para GitHub + Vercel/Cloudflare, mantendo a persistência em `localStorage`.

## 1. Auditoria Técnica

### Scripts Disponíveis (`package.json`)
O projeto já conta com os scripts padrão necessários para rodar fora da Lovable:
- `npm run dev`: Servidor de desenvolvimento local (Vite).
- `npm run build`: Gera o bundle otimizado na pasta `/dist`.
- `npm run preview`: Testa o build de produção localmente.
- `npm run lint`: Validação de padronização de código.

### Arquivos de Deploy Identificados
Estes arquivos garantem o funcionamento do SPA em servidores externos:
- `vercel.json`: Gerencia redirecionamentos na Vercel.
- `public/_redirects`: Gerencia redirecionamentos no Cloudflare/Netlify.
- `.env.example`: Guia de variáveis de ambiente.
- `public/robots.txt`: Configurações de indexação SEO.

### Dependências Lovable para Remoção
Antes do push final para o GitHub, remova as dependências de infraestrutura da Lovable:
- `@lovable.dev/vite-tanstack-config` (presente no `package.json` e `package-lock.json`).

**Como remover:**
```bash
npm remove @lovable.dev/vite-tanstack-config
```

## 2. Passo a Passo para Exportação

### Etapa 1: GitHub (Repositório Oficial)
1. Exporte o projeto da Lovable (Botão "Download" ou conexão direta via GitHub).
2. Se exportar via ZIP:
   - Extraia em uma pasta local.
   - Execute `git init`.
   - Crie um repositório no GitHub.
   - `git remote add origin <url-do-repositorio>`.
   - `git add . && git commit -m "chore: initial export from Lovable"`.
   - `git push -u origin main`.

### Etapa 2: Deploy (Vercel ou Cloudflare Pages)
1. Conecte sua conta do GitHub ao provedor escolhido.
2. Importe o repositório `axei-no-bairro`.
3. **Configurações de Build:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Variáveis de Ambiente:** Copie as chaves do `.env.example` para as configurações de "Environment Variables" do provedor.

### Etapa 3: Configuração de Domínio
1. No painel do provedor, adicione seu domínio (ex: `axeinobairro.com.br`).
2. Siga as instruções para configurar os registros CNAME ou A no seu provedor de DNS (ex: Registro.br, Cloudflare).

## 3. Validação de SPA (Single Page Application)
Como o projeto utiliza `@tanstack/react-router`, é vital garantir que as rotas diretas funcionem:
- **Vercel:** O arquivo `vercel.json` já contém o rewrite para `index.html`.
- **Cloudflare Pages:** O arquivo `public/_redirects` garante que `/* /index.html 200` funcione.
- **Teste Real:** Acesse diretamente `seu-dominio.com/planos`. Se a página carregar sem erro 404, a configuração está correta.

## 4. Checklist Final (Antes do Supabase)
- [ ] O comando `npm run build` executa sem erros localmente.
- [ ] O diretório `/dist` contém o `index.html` e a pasta `assets`.
- [ ] O `localStorage` mantém os dados (Anúncios, Clientes, Agenda) após atualizar a página.
- [ ] O botão de WhatsApp nos anúncios redireciona corretamente.
- [ ] A página `/ecossistema` e o novo Footer estão visíveis.

---
**Governança:** Antes de realizar qualquer modificação pós-exportação, consulte a [Política de Evolução do Produto](./product-evolution-policy.md).
**Status:** Pronto para Independência.
*Nota: Nenhuma integração externa (Supabase/APIs) foi adicionada nesta fase.*
