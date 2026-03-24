# Banco TISIGE no Supabase

Este diretório contém o **esquema PostgreSQL** equivalente ao MySQL legado (`ControleLC`, `users`, etc.), adaptado ao **Supabase Auth** + **Row Level Security (RLS)**.

## O que foi criado

| Tabela | Função |
|--------|--------|
| `public.profiles` | Dados do app por usuário (`tipo` A/B, setor, nome). `id` = `auth.users.id`. |
| `public.controle_lc` | Ordens de serviço / LC (campos do `ControleLC.php`). |
| `public.pesquisas` | Termos de busca salvos no controle. |
| `public.registros_operacoes` | Log de edições/exclusões. |

- **Trigger** `on_auth_user_created`: ao criar usuário em **Authentication**, cria linha em `profiles`.
- **RLS**: usuários **B** só leem `controle_lc`; **A** pode inserir/editar/excluir. Cada um vê/edita só o próprio `profiles` (tipo **A** pode listar todos os perfis).

## Como aplicar

1. No [Supabase Dashboard](https://supabase.com/dashboard), crie um projeto.
2. Vá em **SQL Editor** → **New query**.
3. Cole o conteúdo de `migrations/20260324000000_initial_schema.sql` e execute (**Run**).
4. (Opcional) Execute `seed.sql` para inserir duas OS de exemplo.

## Primeiro usuário administrador (tipo A)

Depois de criar o usuário em **Authentication → Users** (e-mail/senha ou provedor):

1. Confirme que existe linha em `public.profiles` (criada pelo trigger).
2. No SQL Editor:

```sql
update public.profiles
set tipo = 'A', full_name = 'Administrador', setor = 'PCP Motor'
where id = 'COLE_AQUI_O_UUID_DO_USUARIO';
```

O UUID aparece na tela do usuário em Authentication ou em `auth.users` (SQL: `select id, email from auth.users;`).

### Metadados no signup (alternativa)

Ao registrar via API, envie `raw_user_meta_data` com `tipo`, `username`, `full_name` para o trigger preencher. Para o primeiro admin, o `update` acima é o mais simples.

## Variáveis no app (Expo)

No projeto `TISIGE-Mobile`, use:

- `EXPO_PUBLIC_SUPABASE_URL` — URL do projeto (Settings → API).
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — chave **anon** pública (com RLS).

Nunca commite a **service_role** no cliente.

Arquivo de exemplo: `TISIGE-Mobile/.env.example` (se existir na raiz do app).

## Migração a partir do MySQL

Exporte CSV do MySQL e importe via **Table Editor** ou `INSERT` gerado; renomeie colunas para `snake_case` conforme `controle_lc`.

## Referência de colunas (legado → novo)

| MySQL | Supabase `controle_lc` |
|-------|-------------------------|
| `dtContratual` | `dt_contratual` |
| `dtRecebimento` | `dt_recebimento` |
| `dtRetirada` | `dt_retirada` |
| `respRetirada` | `resp_retirada` |
| — | `data_limite_testes`, `gestao_finalizado` (app mobile) |
