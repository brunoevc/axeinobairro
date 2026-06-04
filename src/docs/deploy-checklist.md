# Checklist de Deploy Externo — Axêi no Bairro

Este guia detalha como publicar o projeto em uma infraestrutura independente (fora da Lovable).

## 1. Build de Produção
O projeto é um SPA (Single Page Application) estático.
- Comando: `npm run build`
- O resultado será gerado na pasta `dist/`.

## 2. Recomendação de Hospedagem
Recomendamos a **Vercel** ou **Cloudflare Pages** pela facilidade de configuração e custo inicial zero.

### Vercel (Recomendado)
1. Conecte seu repositório GitHub.
2. A Vercel detectará automaticamente as configurações de build do Vite.
3. Configure as variáveis de ambiente (veja abaixo).

## 3. Configurações Importantes (SPA Fallback)
Para evitar erro 404 ao atualizar páginas como `/loja/slug` ou `/servicos`:
- **Vercel:** Já configurado via `vercel.json`.
- **Netlify:** Já configurado via `public/_redirects`.
- **Outros:** Certifique-se de que todas as rotas apontem para `index.html`.

## 4. Variáveis de Ambiente
Configure estas chaves no painel da sua hospedagem:
- `VITE_SUPABASE_URL`: (Deixe vazio até a Phase 9.0)
- `VITE_SUPABASE_ANON_KEY`: (Deixe vazio até a Phase 9.0)
- `VITE_ADMIN_ENABLED`: Defina como `true` para acessar o painel administrativo ou `false` para esconder do público.

## 5. Domínio Próprio e HTTPS
1. No painel da hospedagem, adicione seu domínio (ex: `axeinobairro.com.br`).
2. Configure o DNS (CNAME ou Registro A) conforme as instruções da plataforma.
3. O SSL (HTTPS) é gerado automaticamente e é obrigatório para o funcionamento correto.

## 6. Checklist Pré-Publicação
- [ ] Rodar `npm run build` localmente e verificar erros.
- [ ] Validar se todos os links de WhatsApp estão corretos.
- [ ] Verificar se o Favicon está aparecendo.
- [ ] Testar a navegação mobile (320px, 375px).
- [ ] Garantir que o Admin está desativado (`VITE_ADMIN_ENABLED=false`) se não quiser acesso público.
- [ ] Testar o refresh da página em uma rota profunda (ex: `/negocios`).

## 7. Próximos Passos (Phase 9.0)
Após o deploy inicial, a próxima fase será a conexão com o banco de dados real via Supabase, substituindo o `localStorage`.
