# Plano de Migração Supabase - Axêi no Bairro

Este documento descreve a estratégia para migrar os dados atuais do `localStorage` e mock data para o Supabase.

## Estado Atual
Os dados estão distribuídos entre:
1. `src/data/merchants.ts`: Mock data inicial dos lojistas.
2. `localStorage`: Dados criados/editados pelo usuário (agendamentos, cobranças, notícias, campanhas).

## Arquitetura de Preparação (Phase 8.0.2)
Introduzimos uma camada de **Repositories** para isolar o acesso aos dados:
- `merchantsRepository.ts`
- `newsRepository.ts`
- `campaignsRepository.ts`
- `schedulingRepository.ts`
- `paymentsRepository.ts`

E uma camada de **Adapters** para converter modelos de domínio em registros de banco de dados (`src/types/database.ts`).

## Sugestão de Tabelas Supabase

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

### 2. `news`
- `id` (uuid, primary key)
- `merchant_id` (uuid, references merchants)
- `title` (text)
- `summary` (text)
- `content` (text)
- `category` (text)
- `image_url` (text)
- `exposure_level` (text)
- `is_active` (boolean)
- `views` (integer)
- `clicks` (integer)

### 3. `appointments`
- `id` (uuid, primary key)
- `merchant_id` (uuid, references merchants)
- `customer_name` (text)
- `customer_phone` (text)
- `date` (date)
- `start_time` (time)
- `end_time` (time)
- `status` (text)

## Riscos da Migração
1. **Conflito de IDs**: IDs atuais são strings aleatórias. Supabase prefere UUIDs.
2. **Perda de Dados Local**: Usuários com dados apenas no `localStorage` precisarão de um script de sincronização na primeira autenticação.
3. **Slugs Duplicados**: Garantir que a unicidade de slugs seja validada no banco (Unique Constraint).

## O que NÃO foi migrado ainda
- Autenticação real (Auth).
- Políticas de segurança (RLS).
- Armazenamento de imagens (Storage).
- Integração em tempo real.
