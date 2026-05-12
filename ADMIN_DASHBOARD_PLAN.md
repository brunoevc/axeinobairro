# 📋 Plano Técnico: Dashboard Admin Axêi no Bairro

**Data**: Maio 2026  
**Status**: 📝 Planejamento (não implementado)  
**Objetivo**: Criar área administrativa simples para operar o marketplace sem backend/auth

---

## 1. ARQUIVOS NECESSÁRIOS

### Nova Estrutura de Pastas
```
src/
├── routes/
│   ├── admin.tsx                    (nova rota raiz /admin)
│   ├── admin/
│   │   ├── __root.tsx              (layout admin com navegação)
│   │   ├── index.tsx               (visão geral/dashboard)
│   │   ├── lojas.tsx               (gestão de lojas)
│   │   ├── lojas.$id.tsx           (editar loja individual)
│   │   ├── aprovacoes.tsx          (fila de aprovação)
│   │   └── planos.tsx              (distribuição de planos)
│
├── components/admin/               (novos componentes admin)
│   ├── AdminNav.tsx                (navegação sidebar/mobile)
│   ├── DashboardStats.tsx          (cards com totalizadores)
│   ├── MerchantsTable.tsx          (tabela de lojas)
│   ├── MerchantRow.tsx             (linha da tabela com ações)
│   ├── ApprovalQueue.tsx           (lista de aprovações)
│   ├── ApprovalCard.tsx            (card para cada aprovação)
│   ├── PlansDistribution.tsx       (visualização de planos)
│   ├── PlansChart.tsx              (gráfico simples de planos)
│   ├── MerchantEditForm.tsx        (formulário de edição)
│   └── AdminModal.tsx              (modal reutilizável)
│
├── data/
│   ├── merchants.ts                (adicionar campos: status, approved_at)
│   ├── admin-state.ts              (nova - simulação de estado admin)
│   └── admin-stats.ts              (nova - cálculos de estatísticas)
│
└── hooks/
    └── useAdminState.ts            (nova - gerenciamento de estado admin)
```

---

## 2. ESTRUTURA DE DADOS

### Extensão do Type Merchant
```typescript
// src/data/merchants.ts
export type Merchant = {
  // Existentes
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  whatsapp: string;
  plan: "free" | "assisted" | "local_featured" | "highlighted" | "premium_partner";
  featured?: boolean;
  isNew?: boolean;
  
  // NOVOS CAMPOS ADMIN
  status: "pending" | "active" | "inactive" | "rejected";
  approvedAt?: string; // ISO date
  rejectedAt?: string;
  rejectionReason?: string;
  approvedBy?: string; // nome do admin (agora será "Auto-Admin")
  planChangedAt?: string; // quando plano foi alterado
  planChangedBy?: string;
  notes?: string; // observações administrativas
  whatsappClicks?: number; // simulado
  lastContactDate?: string;
};
```

### Novo Tipo: AdminStats
```typescript
// src/data/admin-stats.ts
export type AdminStats = {
  totalMerchants: number;
  activeMerchants: number;
  pendingMerchants: number;
  rejectedMerchants: number;
  featuredMerchants: number;
  planDistribution: Record<Merchant["plan"], number>;
  totalWhatsappClicks: number;
  averageRating: number;
  avgWhatsappClicksPerMerchant: number;
  merchantsByNeighborhood: Record<string, number>;
};
```

### Novo Tipo: AdminAction (para simulação de auditoria)
```typescript
// src/data/admin-state.ts
export type AdminAction = {
  id: string;
  type: "approve" | "reject" | "plan_change" | "status_change" | "note_added";
  merchantId: string;
  adminName: string; // "Auto-Admin" por enquanto
  timestamp: string; // ISO date
  details: {
    oldValue?: string;
    newValue?: string;
    reason?: string;
  };
};
```

### Estado Mock do Admin (Persistência em localStorage)
```typescript
// src/data/admin-state.ts
export type AdminState = {
  merchants: Merchant[];
  actions: AdminAction[];
  lastUpdated: string;
};
```

---

## 3. COMPONENTES NECESSÁRIOS

### Nível 1: Componentes Base
| Componente | Responsabilidade | Complexidade |
|-----------|------------------|-------------|
| `AdminNav.tsx` | Menu lateral/mobile com links para seções | Baixa |
| `DashboardStats.tsx` | Cards com KPIs (4-6 cards) | Baixa |
| `AdminModal.tsx` | Modal reutilizável para confirmações | Baixa |

### Nível 2: Componentes de Listagem
| Componente | Responsabilidade | Complexidade |
|-----------|------------------|-------------|
| `MerchantsTable.tsx` | Tabela responsiva com filtros | Média |
| `MerchantRow.tsx` | Linha da tabela com ações (editar, ativar, etc) | Média |
| `ApprovalQueue.tsx` | Lista de lojas pendentes | Média |
| `ApprovalCard.tsx` | Card para cada aprovação com botões | Média |

### Nível 3: Componentes de Edição/Visualização
| Componente | Responsabilidade | Complexidade |
|-----------|------------------|-------------|
| `MerchantEditForm.tsx` | Formulário para editar loja | Média |
| `PlansDistribution.tsx` | Resumo de distribuição de planos | Média |
| `PlansChart.tsx` | Gráfico simples (barras/pizza) | Média |

### Nível 4: Hooks de Estado
| Hook | Responsabilidade |
|-----|------------------|
| `useAdminState()` | Gerenciar estado dos merchants, persist em localStorage |

---

## 4. ROTAS NECESSÁRIAS

### Estrutura de Routes (TanStack Router)
```
/admin                           (Rota proteção futura)
├── /                           (Dashboard - visão geral)
├── /lojas                       (Gestão de lojas)
├── /lojas/:id                   (Editar loja individual)
├── /aprovacoes                  (Fila de aprovações)
└── /planos                      (Distribuição de planos)
```

### Arquivo: `src/routes/admin/__root.tsx`
- Layout base com: Header Axêi + Navegação Lateral (desktop) ou hambúrguer (mobile)
- Outlet para renderizar subrotas
- Estilos mobile-first

### Arquivo: `src/routes/admin/index.tsx`
- Dashboard com DashboardStats
- Cards com: Total lojas, Ativas, Pendentes, Em destaque
- Gráfico simples de distribuição de planos
- Últimas ações (log simples)

### Arquivo: `src/routes/admin/lojas.tsx`
- MerchantsTable com:
  - Colunas: Nome, Categoria, Bairro, WhatsApp, Plano, Status
  - Filtros por status, plano, neighborhood
  - Ações: Editar, Ativar/Desativar, Mudar plano

### Arquivo: `src/routes/admin/lojas/$id.tsx`
- MerchantEditForm com:
  - Campos editáveis (name, category, neighborhood, whatsapp, plan)
  - Dropdown para alterar plano
  - Campo de observações
  - Botões: Salvar, Cancelar

### Arquivo: `src/routes/admin/aprovacoes.tsx`
- ApprovalQueue com:
  - Lista de merchants com status "pending"
  - Cards com: info loja + Botões (Aprovar, Rejeitar, Editar)
  - Campo de observação antes de publicar

### Arquivo: `src/routes/admin/planos.tsx`
- PlansDistribution com:
  - Cards: Total por plano (free, assisted, local_featured, etc)
  - PlansChart (gráfico simples)
  - Tabela: Plano, Quantidade, %, Receita simulada

---

## 5. ORDEM DE IMPLEMENTAÇÃO (SEGURA)

### Fase 1: Estrutura Base (2-3 commits)
1. **Criar `/src/data/admin-state.ts`**
   - Estender tipo Merchant
   - Definir AdminStats, AdminAction
   - Criar função de cálculo de stats

2. **Criar `/src/hooks/useAdminState.ts`**
   - Hook para leitura de merchants
   - Hook para simulação de ações (aprovar, rejeitar, etc)
   - Persistência em localStorage

3. **Criar `/src/routes/admin/__root.tsx`**
   - Layout base com navegação
   - Outlet

### Fase 2: Dashboard (1-2 commits)
4. **Criar componentes base:**
   - `AdminNav.tsx`
   - `DashboardStats.tsx`
   - `AdminModal.tsx`

5. **Criar `/src/routes/admin/index.tsx`**
   - Página de visão geral
   - Usar DashboardStats

### Fase 3: Gestão de Lojas (2-3 commits)
6. **Criar componentes tabela:**
   - `MerchantsTable.tsx`
   - `MerchantRow.tsx`
   - `AdminModal.tsx` para confirmações

7. **Criar `/src/routes/admin/lojas.tsx`**
   - Tabela com filtros
   - Ações integradas

8. **Criar `/src/routes/admin/lojas/$id.tsx`**
   - `MerchantEditForm.tsx`
   - Salvar alterações

### Fase 4: Aprovações (1-2 commits)
9. **Criar componentes aprovação:**
   - `ApprovalQueue.tsx`
   - `ApprovalCard.tsx`

10. **Criar `/src/routes/admin/aprovacoes.tsx`**
    - Fila de aprovações

### Fase 5: Planos (1 commit)
11. **Criar componentes planos:**
    - `PlansDistribution.tsx`
    - `PlansChart.tsx` (gráfico simples com SVG ou Tailwind)

12. **Criar `/src/routes/admin/planos.tsx`**
    - Visualização de distribuição

### Fase 6: Testes & Ajustes (1 commit)
13. **Build e validação**
14. **Commit final**

---

## 6. RISCOS TÉCNICOS

### 🔴 Riscos Altos
1. **Falta de Autenticação**
   - Qualquer pessoa com acesso à URL `/admin` entra
   - **Solução Futura**: Implementar auth básica (mesmo sem backend)
   - **Mitigação Agora**: Documentação clara que é apenas protótipo

2. **localStorage Limitado**
   - localStorage tem limite (~5-10MB), dados podem ser perdidos
   - **Solução Futura**: Conectar backend ou IndexedDB
   - **Mitigação Agora**: Dados iniciais pequenos (9 merchants)

3. **Dados Não Sincronizados**
   - Admin edita em localStorage, Home vê dados em memória
   - **Solução**: Usar Context API ou estado global para sincronizar

### 🟡 Riscos Médios
4. **Responsividade em Móvel**
   - Tabelas com muitas colunas não cabem em mobile
   - **Solução**: Cards empilhados no mobile, tabela no desktop

5. **Performance com Muitos Dados**
   - Se crescer muito além de 9 merchants, rendering pode ficar lento
   - **Solução**: Implementar paginação/virtualização

6. **Simulação de Cliques**
   - Clicar no WhatsApp na Home não atualiza contador de cliques
   - **Solução**: Usar evento global ou callback

### 🟢 Riscos Baixos
7. **Dependências Novas**
   - Não há dependências novas se usar SVG/Tailwind para gráficos
   - **Se usar chart lib**: Adicionar apenas chart.js (pequeno)

8. **Conflito de Rotas**
   - `/admin` não conflita com `/admin/:subrotas`
   - Estrutura TanStack Router suporta bem

---

## 7. CONSIDERAÇÕES ARQUITETURAIS

### Estado Compartilhado
```typescript
// Opção A: localStorage (simples, sem dependências)
const [merchants, setMerchants] = useAdminState("merchants");

// Opção B: Context API (futuro, se crescer)
<AdminStateProvider>
  <AdminDashboard />
</AdminStateProvider>
```

**Recomendação**: Começar com localStorage no hook, preparar migração para Context.

### Sincronização Home ↔ Admin
```typescript
// src/routes/index.tsx
// Usar useEffect para carregar merchants do localStorage se existir
useEffect(() => {
  const stored = localStorage.getItem("admin-merchants");
  if (stored) {
    setMerchants(JSON.parse(stored));
  }
}, []);
```

### Gráfico de Planos
- **Opção Simples**: Barras com Tailwind grid + numbers
- **Opção Média**: SVG manual
- **Opção Complexa**: Biblioteca (recharts, chart.js) — evitar agora

**Recomendação**: Começar com Tailwind, depois SVG se necessário.

---

## 8. CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Começar
- [ ] Revisar estrutura atual de Merchant type
- [ ] Definir como localStorage será persistido
- [ ] Validar compatibilidade com TanStack Router

### Durante Implementação
- [ ] Cada arquivo novo passar por build (`npm run build`)
- [ ] Testar navegação entre rotas `/admin/*`
- [ ] Validar localStorage em dev tools
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Verificar sem backend que dados não sumem

### Após Implementação
- [ ] Commit: "feat: add admin dashboard structure and overview"
- [ ] Commit: "feat: add merchant management interface"
- [ ] Commit: "feat: add approval queue for pending merchants"
- [ ] Commit: "feat: add plan distribution and analytics"
- [ ] Testar build final

---

## 9. WIREFRAME MOBILE SIMPLES

```
/admin (HOME)
┌──────────────────┐
│ ☰ ADMIN AXÊI    │
├──────────────────┤
│ 📊 Dashboard     │
│ [Total: 9]       │
│ [Ativos: 7]      │
│ [Pendentes: 2]   │
├──────────────────┤
│ 📋 Últimas Ações │
│ ✓ Loja Aprovada  │
│ ✏️ Plano Mudado  │
└──────────────────┘

/admin/lojas (MERCHANTS)
┌──────────────────┐
│ ☰ Lojas          │
├──────────────────┤
│ 🔍 [Search...]   │
│ 📍 [Bairro ▼]    │
├──────────────────┤
│ 🍝 Cantina       │
│ Restaurantes     │
│ Premium Partner  │
│ [✏️] [⬆️] [⬇️]    │
├──────────────────┤
│ 🛒 Mercadinho    │
│ Mercados         │
│ Local Featured   │
│ [✏️] [⬆️] [⬇️]    │
└──────────────────┘

/admin/aprovacoes (APPROVALS)
┌──────────────────┐
│ ☰ Aprovações     │
├──────────────────┤
│ ⏳ 2 Pendentes    │
├──────────────────┤
│ ✏️ Nova Loja A    │
│ Centro | Serviço │
│ [✓ Aprovar]      │
│ [✗ Rejeitar]     │
│ [📝 Editar]      │
├──────────────────┤
│ ✏️ Nova Loja B    │
│ Bairro | Pet     │
│ [✓ Aprovar]      │
│ [✗ Rejeitar]     │
│ [📝 Editar]      │
└──────────────────┘

/admin/planos (PLANS)
┌──────────────────┐
│ ☰ Planos         │
├──────────────────┤
│ Grátis: 2 (22%)  │
│ ▰▰░░░░░░░░░░░░  │
├──────────────────┤
│ R$27: 2 (22%)    │
│ ▰▰░░░░░░░░░░░░  │
├──────────────────┤
│ R$47: 2 (22%)    │
│ ▰▰░░░░░░░░░░░░  │
├──────────────────┤
│ R$97: 2 (22%)    │
│ ▰▰░░░░░░░░░░░░  │
├──────────────────┤
│ R$147: 1 (12%)   │
│ ▰░░░░░░░░░░░░░  │
└──────────────────┘
```

---

## 10. COMANDOS ÚTEIS PARA IMPLEMENTAÇÃO

```bash
# Verificar estrutura de rotas
npm run build

# Dev server com HMR
npm run dev

# Limpar localStorage no dev
# No console: localStorage.clear()

# Verificar tipo Merchant
grep -r "type Merchant" src/

# Validar sintaxe TypeScript
npx tsc --noEmit
```

---

## 11. RESTRIÇÕES MANTIDAS

✅ Sem backend  
✅ Sem autenticação (por enquanto)  
✅ Sem pagamento  
✅ Dados mockados apenas  
✅ Home não alterada  
✅ /planos não alterada  
✅ Mobile-first  
✅ Visual Axêi mantido  
✅ Sem dependências novas  

---

## 12. PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. Adicionar autenticação simples (token localStorage)
2. Conectar a um backend (Firebase ou API própria)
3. Implementar notificações em tempo real
4. Adicionar mais relatórios e analytics
5. Integrar sistema de pagamento real
6. Criar logs de auditoria persistentes

---

**Fim do Plano Técnico**

Próxima ação: Iniciar Fase 1 (Estrutura Base) quando validado.
