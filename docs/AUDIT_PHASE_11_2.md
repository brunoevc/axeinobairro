# PHASE 11.2 — Auditoria Executiva e Mapa de Decisão Axêi

**Data da Auditoria:** 08 de Junho de 2026
**Status do Projeto:** Portal Comunitário Funcional (Beta Ready)
**Versão do Código:** Phase 11.1 (Pós-Reconstrução da Home)

---

## 1. Visão Geral do Projeto

O **Axêi no Bairro** evoluiu de uma landing page comercial para um **Ecossistema de Conteúdo e Comércio Hiper-Local**. O sistema agora integra descoberta de negócios, contratação de serviços, acompanhamento de notícias comunitárias e engajamento em grupos locais.

### Propósito
Conectar moradores a tudo o que acontece e existe em seu bairro, promovendo a economia local e o senso de comunidade.

---

## 2. Mapa de Páginas e Rotas

O projeto utiliza **TanStack Router**, garantindo tipos seguros e navegação performática.

| Rota | Descrição | Status |
| :--- | :--- | :--- |
| `/` | Home Portal (Alta densidade) | ✅ Consolidada |
| `/busca` | Busca Universal com Histórico | ✅ Funcional |
| `/login` / `/cadastro` | Fluxo de Autenticação | 🟡 Funcional (Simulado) |
| `/painel` | Dashboard do Usuário (Multi-role) | ✅ Funcional |
| `/admin` | Gestão Global do Sistema | ✅ Funcional |
| `/admin/insights` | Business Intelligence (Métricas) | ✅ Funcional |
| `/negocios` / `/loja/$slug` | Diretório de Lojas e PDV | ✅ Consolidada |
| `/servicos` | Marketplace de Profissionais | ✅ Funcional |
| `/comunidades` | Rede de Grupos Locais | ✅ Funcional |
| `/noticias` | Feed de Notícias Comunitárias | ✅ Funcional |
| `/transporte` | Guia de Mobilidade e Caronas | 🟡 MVP |
| `/ofertas` | Central de Cupons e Descontos | 🟡 MVP |
| `/planos` / `/apoiadores` | Monetização e Parcerias | 🟡 MVP |
| `/checkout/pix/$id` | Fluxo de Pagamento Simulado | 🟡 MVP |

---

## 3. Inventário de Funcionalidades

### Implementadas (Reais/Persistentes)
* **Busca com Histórico**: Persiste termos buscados no `localStorage`.
* **Sistema de Favoritos**: Persiste lojas, serviços e notícias favoritos.
* **Seguimento de Comunidades**: Persiste grupos que o usuário acompanha.
* **Navegação Inteligente**: Filtros por categoria e bairro em tempo real.
* **Layout de Alta Densidade**: Home otimizada para Desktop (1440px) e Mobile (390px).
* **Persistência de Estado**: Hooks customizados (`useFavorites`, `useSearchHistory`) garantem que os dados não sumam no F5.

### Planejadas / Em Aberto
* **Feed Algorítmico**: Ordenação por relevância e proximidade real.
* **Chat Interno**: Comunicação direta morador-lojista.
* **Notificações Push**: Alertas de novas notícias ou ofertas.
* **Painel Financeiro Real**: Integração com gateways (Stripe/Paddle).

### Baseadas em Dados Simulados (mockData)
* **Todo o conteúdo**: Lojas, notícias, serviços e usuários vêm de `src/data/*.ts`.
* **Insights**: Gráficos e números no admin são gerados via lógica de mock no repositório.
* **Autenticação**: O login não valida credenciais em servidor; apenas altera estado local.

---

## 4. Auditoria Crítica por Módulo

### Módulo: Home (Portal)
* **Status**: Pronta para Produção (Visual/UX).
* **Evidência**: Layout testado em 1440px e 390px. Seções "Acontecendo Agora" e "Destaques do Bairro" integradas.
* **Problemas**: Dependência de imagens do Unsplash (podem quebrar ou demorar a carregar).
* **Impacto**: UX de alta qualidade, mas risco de performance por imagens externas.
* **Recomendação**: Implementar cache de imagens ou CDN próprio.
* **Prioridade**: 🟢 Baixa (Visualmente OK).

### Módulo: Busca Universal
* **Status**: Consolidada.
* **Evidência**: Arquivo `src/routes/busca.tsx` implementa filtros por aba e normalização de strings (acentos).
* **Problemas**: Busca é apenas client-side (não escala para >1000 itens).
* **Impacto**: Velocidade instantânea agora, mas gargalo futuro.
* **Recomendação**: Preparar backend com ElasticSearch ou Supabase Full-Text Search.
* **Prioridade**: 🟡 Média.

### Módulo: Painel Admin & Insights
* **Status**: Funcional.
* **Evidência**: Rotas `/admin/*` separadas por responsabilidade (Leads, Campanhas, Avaliações).
* **Problemas**: Acesso via simulação de Role. Não há segurança real.
* **Impacto**: Risco de segurança crítico em ambiente real.
* **Recomendação**: Implementar Middleware de Auth real com JWT e Roles no servidor.
* **Prioridade**: 🔴 Alta.

### Módulo: Persistência (Favorites/History)
* **Status**: Pronta para Produção.
* **Evidência**: `src/repositories/storage.ts` com tratamento de erro e fallback de chaves antigas.
* **Problemas**: `localStorage` tem limite de ~5MB.
* **Impacto**: Suficiente para MVP, insuficiente para histórico longo ou offline-first pesado.
* **Recomendação**: Migrar para IndexedDB (via Dexie.js) em fases futuras.
* **Prioridade**: 🟢 Baixa.

---

## 5. Scores de Maturidade (0-100)

| Categoria | Score | Justificativa | Complexidade para 100 |
| :--- | :--- | :--- | :--- |
| **Arquitetura** | 85 | TanStack + Repository Pattern é sólido. | Baixa (Refatorar mocks para fetch) |
| **UX/UI** | 90 | Design consistente, responsivo e moderno. | Baixa (Ajustes finos de animação) |
| **Conteúdo** | 40 | Dependente de mockData e placeholders. | Alta (Curadoria real necessária) |
| **Segurança** | 10 | Apenas simulação client-side. | Alta (Auth real + Permissões) |
| **Monetização** | 30 | Estrutura visual pronta, lógica real zero. | Média (Integrar Gateway) |
| **Escalabilidade** | 50 | Frontend aguenta, mas infra de dados não existe. | Alta (Infra Cloud) |

---

## 6. MAPA DE DECISÃO DO AXÊI

### O que NÃO deve ser alterado
* **Busca Universal**: A lógica de UI e UX está excelente.
* **Sistema de Persistência**: A forma como `useFavorites` e `useSearchHistory` funcionam é o padrão ideal para o produto.
* **Design System**: A paleta e densidade de informações na Home são o diferencial competitivo.

### O que deve ser melhorado
* **Abstração de Repositórios**: Unificar a forma como os repositórios buscam dados para facilitar a virada de chave para o backend.
* **UX de Checkout**: O fluxo de Pix `/checkout/pix` precisa de validação de tempo real (WebSockets).

### O que deve ser substituído
* **Mock Auth**: Deve ser trocado por Supabase Auth ou Firebase imediatamente.
* **Storage Local de Imagens**: Mudar de URLs estáticas para um CMS (Contentful/Sanity) ou Storage Real.

---

## 7. Top 10 Problemas Reais

1. **Inexistência de Backend**: Impede qualquer uso real com dados persistentes em nuvem. (Urgência: 🔴 Máxima)
2. **Auth Insegura**: Qualquer um pode acessar `/admin` mudando uma flag no código/console. (Urgência: 🔴 Máxima)
3. **Imagens Externas Voláteis**: Dependência de Unsplash gera visual genérico. (Urgência: 🟡 Média)
4. **Mock de Pagamentos**: Não há transação real. (Urgência: 🟡 Média)
5. **SEO Limitado**: Como as rotas são SPA, o SEO para notícias precisa de SSR. (Urgência: 🟡 Média)
6. **Falta de Analytics Real**: Não sabemos o que o usuário clica de verdade. (Urgência: 🟢 Baixa)
7. **UX de Cadastro de Negócio**: O fluxo para o lojista entrar no sistema é muito simplificado. (Urgência: 🟢 Baixa)
8. **Responsividade em Tabelas**: O Admin Insights em mobile ainda é denso demais. (Urgência: 🟢 Baixa)
9. **Performance de Busca em Lote**: Filtrar >500 itens no browser pode travar celulares antigos. (Urgência: 🟢 Baixa)
10. **Conteúdo Estático**: Notícias não atualizam sozinhas. (Urgência: 🟡 Média)

---

## 8. Diagnóstico Executivo

> "O Axêi hoje é um **Portal Comunitário Funcional** e está aproximadamente **65% pronto** para lançamento público em versão Beta."

**Justificativa:** O produto tem a "cara" e o "sentir" de um produto final. A experiência do usuário está mapeada e funcional. O que falta é a "inteligência de servidor" e a segurança, que são invisíveis para o usuário mas vitais para a operação.

---

## 9. Próximas 3 Fases Recomendadas

### Phase 12: O Coração Real (Backend)
* **Objetivo**: Substituir mocks por dados persistentes.
* **Entregas**: Integração com Supabase (Auth + DB), Migração de `repositories` para chamadas API.
* **Impacto**: Usuários reais podem se cadastrar e salvar dados na nuvem.
* **Complexidade**: 🔴 Alta.

### Phase 13: Operação Comercial (Monetização)
* **Objetivo**: Começar a gerar receita.
* **Entregas**: Integração com Stripe/Paddle, Painel do Lojista com métricas reais, Sistema de Destaque Pago.
* **Impacto**: Primeiro faturamento do projeto.
* **Complexidade**: 🟡 Média.

### Phase 14: Escala e Conteúdo (Expansão)
* **Objetivo**: Sair de um bairro para a cidade/região.
* **Entregas**: Filtro de Bairro/Cidade global, Ferramentas de Importação em Massa de Dados, SEO Avançado.
* **Impacto**: Crescimento exponencial de tráfego.
* **Complexidade**: 🟡 Média.

---

# Veredito Final

1. **O que já está pronto?** Toda a interface, fluxos de navegação, busca, favoritos e painéis visuais.
2. **O que depende de simulação?** Login, Gestão de Conteúdo e Pagamentos.
3. **O que impede o lançamento hoje?** Falta de banco de dados centralizado e segurança de rotas admin.
4. **Prioridade Absoluta:** Conectar o frontend ao Supabase (ou similar).

---
**Assinado:** Lovable AI Auditor
