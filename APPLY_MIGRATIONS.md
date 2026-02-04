# Aplicar Migrations no Supabase

## Projeto: zuzxdinvvsughwztxvuk

Você precisa aplicar 2 migrations no seu projeto Supabase:

### 1. Profiles & Stores Schema
**Arquivo:** `migrations/update_profile_store_schema.sql`

**Como aplicar:**
1. Acesse: https://supabase.com/dashboard/project/zuzxdinvvsughwztxvuk/sql/new
2. Copie TODO o conteúdo do arquivo `migrations/update_profile_store_schema.sql`
3. Cole no SQL Editor
4. Clique em **RUN**

### 2. Listings Table
**Arquivo:** `migrations/create_listings_table.sql`

**Como aplicar:**
1. Acesse: https://supabase.com/dashboard/project/zuzxdinvvsughwztxvuk/sql/new
2. Copie TODO o conteúdo do arquivo `migrations/create_listings_table.sql`
3. Cole no SQL Editor
4. Clique em **RUN**

## O que isso vai criar:

✅ Tabela `profiles` com campos: full_name, avatar_url, phone, username, website
✅ Tabela `stores` com campos: name, description, logo_url, cover_url, address, whatsapp, social_links
✅ Tabela `listings` para anúncios
✅ Buckets de storage: `avatars` e `store-assets`
✅ Políticas RLS para segurança

## Depois de aplicar:

- ✅ Configurações de usuário vão funcionar
- ✅ Configurações de loja vão funcionar  
- ✅ Upload de imagens vai funcionar
- ✅ Publicação de anúncios vai funcionar

## Verificar se funcionou:

Após aplicar, vá em:
https://supabase.com/dashboard/project/zuzxdinvvsughwztxvuk/editor

Você deve ver as tabelas: `profiles`, `stores`, `listings`
