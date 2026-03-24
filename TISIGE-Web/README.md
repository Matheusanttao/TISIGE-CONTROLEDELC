# TISIGE Web

Aplicação **React** (Vite + TypeScript + Tailwind CSS v4) para o fluxo de **Controle de LC**, com **Supabase Auth** e as mesmas regras do app mobile e do legado PHP/HTML (`TISIGE2`).

## Requisitos

- Node 20+
- Projeto Supabase com o esquema em `../supabase/` (migrations + `reset_database.sql` se necessário)

## Configuração

1. Copie `.env.example` para `.env` na raiz desta pasta.
2. Preencha com **Project URL** e **anon key** (Supabase → Settings → API).
3. `npm install` e `npm run dev` — abre em `http://localhost:5173`.

Variáveis:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts

| Comando       | Descrição        |
| ------------- | ---------------- |
| `npm run dev` | Desenvolvimento  |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |

## Relação com outros diretórios

- **`../supabase/`** — fonte de verdade do banco (PostgreSQL + RLS).
- **`../TISIGE-Mobile/`** — app Expo/React Native (pode coexistir; mesma API Supabase).
- **Legado** (`TISIGE2` em PHP/HTML) — referência de regras de negócio; esta web substitui a interface web antiga com stack moderna.

## Funcionalidades

- Login, cadastro, recuperação de senha (Supabase Auth).
- Controle de LC (lista, criar, editar, visualizar, excluir conforme perfil).
- Aprovação técnica, PCP fabricação, gestão LC final (+5/+15 dias), painel gerencial, admin de usuários, notificações locais (localStorage).
