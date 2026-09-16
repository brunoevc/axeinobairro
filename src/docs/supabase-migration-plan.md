# Plano de Migração Supabase - Axêi no Bairro

**Diretriz Estratégica:** Todas as fases deste plano devem ser validadas contra a [Política de Evolução do Produto](./product-evolution-policy.md) antes da execução.

Este documento descreve a migração gradual dos dados mantidos em `localStorage` e arquivos estáticos para o Supabase.

## Estado Atual

A aplicação usa uma arquitetura híbrida:

1. Arquivos em `src/data`: catálogo inicial e dados de demonstração.
2. `localStorage`: dados locais de módulos como favoritos, histórico, agendamentos e funções administrativas ainda não migradas.
3. Supabase: autenticação, perfis, papéis de acesso, comunidades, notícias, métricas e armazenamento de imagens possuem integração ou estrutura de banco proposta nas migrações.

A existência das integrações e migrações no repositório não confirma, por si só, que todas elas estejam aplicadas ou configuradas no ambiente publicado.

## Arquitetura de Preparação

A camada de **Repositories** isola o acesso aos dados e permite substituir fontes locais por consultas remotas sem acoplar as telas ao mecanismo de persistência. Entre os repositórios existentes estão:

- `merchantsRepository.ts`
- `newsRepository.ts`
- `communitiesRepository.ts`
- `campaignsRepository.ts`
- `schedulingRepository.ts`
- `paymentsRepository.ts`

A camada de **Adapters** converte modelos de domínio em registros de banco de dados (`src/types/database.ts`).

## Estruturas já propostas no Supabase

As migrações do repositório incluem estruturas para:

- `profiles`: perfil e preferências do usuário.
- `user_roles`: papéis de acesso usados pelas políticas administrativas.
- `communities`: comunidades e associações locais.
- `news`: notícias e conteúdo comunitário.
- `metrics_events`: eventos de uso e métricas.
- buckets de imagens para notícias e comunidades.

As políticas RLS restringem operações administrativas de notícias, comunidades e métricas por papéis registrados em `user_roles`. A aplicação deve continuar tratando essas políticas como a fonte de autorização; verificações de interface servem apenas para navegação e experiência do usuário.

## Próximas entidades prioritárias

### 1. `merchants`

- `id` (uuid, primary key)
- `name` (text)
- `slug` (text, unique)
- `category` (text)
- `neighborhood` (text)
- `description` (text)
- `whatsapp` (text)
- `address` (text)
- `hours` (text)
- `instagram` (text)
- `image` (text)
- `promotion` (jsonb)
- `status` (text)
- `exposure_level` (text)
- `owner_id` (uuid, references auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 2. `appointments`

- `id` (uuid, primary key)
- `merchant_id` (uuid, references merchants)
- `customer_name` (text)
- `customer_phone` (text)
- `date` (date)
- `start_time` (time)
- `end_time` (time)
- `status` (text)

### 3. Demais módulos locais

Migrar gradualmente classificados, pagamentos, campanhas, avaliações, transporte, CRM e configurações dos painéis, preservando os contratos atuais dos repositórios.

## Riscos da Migração

1. **Conflito de IDs:** registros locais usam formatos variados e precisam de uma estratégia estável de conversão para UUID.
2. **Perda ou duplicação de dados:** a sincronização inicial deve ser idempotente e registrar quais itens locais já foram enviados.
3. **Slugs duplicados:** a unicidade deve ser garantida no banco e tratada de forma amigável na interface.
4. **Fallback silencioso:** dados de demonstração podem ocultar falhas de conexão; a interface deve diferenciar conteúdo real, vazio e indisponível.
5. **Autorização divergente:** papéis exibidos no perfil não devem substituir `user_roles` e as políticas RLS para operações privilegiadas.

## O que ainda não foi concluído

- Migração integral dos catálogos e módulos administrativos para o banco.
- Sincronização dos dados existentes no navegador após autenticação.
- Armazenamento de todas as imagens em infraestrutura controlada pelo projeto.
- Atualizações em tempo real para os módulos que necessitam delas.
- Monitoramento operacional da autenticação, políticas e falhas de integração.
- Processo administrativo controlado para conceder e revogar papéis elevados.

## Ordem recomendada

1. Aplicar e revisar as migrações de autenticação e RLS no ambiente correto.
2. Validar cadastro, login, recuperação de senha e leitura de papéis com contas sem privilégio.
3. Implementar um processo server-side auditável para concessão de papéis administrativos.
4. Migrar cadastro e gestão de negócios para o Supabase.
5. Migrar os demais repositórios por domínio, mantendo fallback apenas onde ele for explicitamente identificado ao usuário.
6. Adicionar observabilidade e testes de autorização antes de liberar os painéis administrativos.
